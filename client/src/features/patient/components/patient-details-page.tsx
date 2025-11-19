'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon, ArrowLeft, Edit2, Save, X, Trash2, Plus, User, Calendar as CalendarIcon, Globe, Users, Phone, UserCircle, Hash } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGetPatient } from '../hooks/use-get-patient';
import { useUpdatePatient, useCancelPatient, type PatientFormData } from '../hooks/use-patient-mutations';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  birthdate: z.number().int().positive(),
});

const step2Schema = z.object({
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .refine(
      (val) => {
        const turkishIdRegex = /^\d{11}$/;
        const passportRegex = /^[A-Z0-9]{6,9}$/i;
        return turkishIdRegex.test(val) || passportRegex.test(val);
      },
      {
        message: 'Must be a valid Turkish ID (11 digits) or Passport number (6-9 alphanumeric characters)',
      }
    ),
  country: z.string().min(1, 'Country is required'),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
});

const companionSchema = z.object({
  name: z.string().min(2),
  relation: z.string().min(2),
  contactNumber: z.string().min(5),
});

const step3Schema = z.object({
  companionInfo: z.array(companionSchema).optional(),
});

const fullFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type FormData = z.infer<typeof fullFormSchema>;

interface PatientDetailsPageProps {
  patientId: string;
}

export default function PatientDetailsPage({ patientId }: PatientDetailsPageProps) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPatient(patientId);
  const { data: session } = authClient.useSession();
  const updatePatientMutation = useUpdatePatient();
  const cancelPatientMutation = useCancelPatient();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

  const patient = data?.data;
  
  // Check if user is a doctor
  // @ts-expect-error - role exists on user
  const isDoctor = session?.user?.role === 'doctor';

  const form = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      birthdate: 0,
      identifier: '',
      country: '',
      ethnicity: '',
      companionInfo: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'companionInfo',
  });

  React.useEffect(() => {
    if (patient && !isEditing) {
      const birthDateStr = patient.birthDate?.toString() || '';
      let date: Date | undefined = undefined;
      if (birthDateStr && birthDateStr.length === 8) {
        const year = parseInt(birthDateStr.substring(0, 4));
        const month = parseInt(birthDateStr.substring(4, 6)) - 1;
        const day = parseInt(birthDateStr.substring(6, 8));
        date = new Date(year, month, day);
      }

      form.reset({
        firstName: patient.name || '',
        lastName: patient.surname || '',
        gender: patient.gender || 'male',
        birthdate: patient.birthDate || 0,
        identifier: patient.identifier || '',
        country: patient.country || '',
        ethnicity: patient.ethnicity || '',
        companionInfo: patient.companionInfo || [],
      });
      setBirthDate(date);
    }
  }, [patient, form, isEditing]);

  React.useEffect(() => {
    if (birthDate) {
      const year = birthDate.getFullYear();
      const month = String(birthDate.getMonth() + 1).padStart(2, '0');
      const day = String(birthDate.getDate()).padStart(2, '0');
      const numericDate = parseInt(`${year}${month}${day}`);
      form.setValue('birthdate', numericDate, { shouldValidate: true });
    } else {
      form.setValue('birthdate', 0, { shouldValidate: true });
    }
  }, [birthDate, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (patient) {
      const birthDateStr = patient.birthDate?.toString() || '';
      let date: Date | undefined = undefined;
      if (birthDateStr && birthDateStr.length === 8) {
        const year = parseInt(birthDateStr.substring(0, 4));
        const month = parseInt(birthDateStr.substring(4, 6)) - 1;
        const day = parseInt(birthDateStr.substring(6, 8));
        date = new Date(year, month, day);
      }

      form.reset({
        firstName: patient.name || '',
        lastName: patient.surname || '',
        gender: patient.gender || 'male',
        birthdate: patient.birthDate || 0,
        identifier: patient.identifier || '',
        country: patient.country || '',
        ethnicity: patient.ethnicity || '',
        companionInfo: patient.companionInfo || [],
      });
      setBirthDate(date);
    }
    setIsEditing(false);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await updatePatientMutation.mutateAsync({
        patientId,
        patientData: data as Partial<PatientFormData>,
      });
      toast.success('Patient updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update patient');
    }
  };

  const handleCancelPatient = async () => {
    try {
      await cancelPatientMutation.mutateAsync(patientId);
      toast.success('Patient cancelled successfully');
      setCancelDialogOpen(false);
      navigate({ to: '/' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel patient');
    }
  };

  const formatDate = (dateNum: number | undefined) => {
    if (!dateNum) return '-';
    const dateStr = dateNum.toString();
    if (dateStr.length !== 8) return '-';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              {error instanceof Error ? error.message : 'Patient not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = `${patient.name[0] || ''}${patient.surname[0] || ''}`.toUpperCase();
  const isCancelled = patient.documentState?.isCanceled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader className='pb-4 flex flex-row  justify-between gap-6'>
              <div className="flex items-start gap-6 pt-4">
                <div className="relative">
                  <Avatar className="size-24">
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <CardHeading className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      {patient.name} {patient.surname}
                    </CardHeading>
                  </div>
                  <CardDescription className="text-base text-slate-600">
                    Patient Profile & Information
                  </CardDescription>
                </div>
              </div>
              {isDoctor && (
                <div className="flex gap-3 flex-shrink-0 pt-4">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleEdit}
                        disabled={isCancelled}
                        className="shadow-sm border-2 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {!isCancelled && (
                        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              className="shadow-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel Patient
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently cancel this patient
                                and remove their data from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleCancelPatient}
                                disabled={cancelPatientMutation.isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {cancelPatientMutation.isPending ? 'Cancelling...' : 'Cancel Patient'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updatePatientMutation.isPending}
                        className="shadow-sm border-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={updatePatientMutation.isPending}
                        className="shadow-sm bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updatePatientMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-8 pb-8">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <UserCircle className="h-4 w-4" />
                    <h3 className="text-base font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">First Name</Label>
                        </div>
                        <p className="text-sm font-medium">{patient.name}</p>
                      </CardContent>
                    </Card>
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Last Name</Label>
                        </div>
                        <p className="text-sm font-medium">{patient.surname}</p>
                      </CardContent>
                    </Card>
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Gender</Label>
                        </div>
                        <p className="text-sm font-medium capitalize">{patient.gender}</p>
                      </CardContent>
                    </Card>
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Birth Date</Label>
                        </div>
                        <p className="text-sm font-medium">{formatDate(patient.birthDate)}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Identification Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Hash className="h-4 w-4 " />
                    <h3 className="text-base font-semibold">Identification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Card className="border md:col-span-1">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Identifier</Label>
                        </div>
                        <p className="text-sm font-medium font-mono bg-muted/30 px-2 py-1 rounded">
                          {patient.identifier}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Country</Label>
                        </div>
                        <p className="text-sm font-medium">{patient.country}</p>
                      </CardContent>
                    </Card>
                    <Card className="border md:col-span-2 lg:col-span-1">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <Label className="text-xs text-muted-foreground">Ethnicity</Label>
                        </div>
                        <p className="text-sm font-medium">{patient.ethnicity || '-'}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Companions Section */}
                {patient.companionInfo && patient.companionInfo.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4" />
                        <h3 className="text-base font-semibold">
                          Companions
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({patient.companionInfo.length})
                          </span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {patient.companionInfo.map((companion, index) => (
                          <Card key={index} className="border">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <div className="size-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm mb-0.5 truncate">{companion.name}</p>
                                  <p className="text-xs text-muted-foreground mb-2">{companion.relation}</p>
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{companion.contactNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Form {...form}>
                <form id="patient-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg ">
                          <UserCircle className="h-5 w-5" />
                        </div>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Gender</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => field.onChange(value as 'male' | 'female' | 'other')}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="birthdate"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Date of Birth</FormLabel>
                              <FormControl>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between font-normal h-11"
                                    >
                                      {birthDate ? birthDate.toLocaleDateString() : "Select date"}
                                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={birthDate}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        setBirthDate(date);
                                        setCalendarOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                          <Hash className="h-5 w-5" />
                        </div>
                        Identification
                      </h3>
                      <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Identifier (Turkish ID or Passport)</FormLabel>
                            <FormControl>
                              <Input placeholder="12345678901 or AB123456" {...field} className="h-11 font-mono" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Country</FormLabel>
                              <FormControl>
                                <Input placeholder="USA" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ethnicity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold">Ethnicity</FormLabel>
                              <FormControl>
                                <Input placeholder="Caucasian" {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                          <div className="p-2 rounded-lg">
                            <Users className="h-5 w-5" />
                          </div>
                          Companion Information
                          <span className="text-base font-normal text-muted-foreground">(Optional)</span>
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ name: '', relation: '', contactNumber: '' })}
                          className="shadow-sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Companion
                        </Button>
                      </div>
                      <div className="flex flex-col gap-4  overflow-y-auto max-h-[300px]">
                        {fields.length === 0 && (
                          <Card className="border-2 border-dashed">
                            <CardContent className="p-8 text-center">
                              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                              <p className="text-sm text-muted-foreground">No companions added. Click "Add Companion" to add one.</p>
                            </CardContent>
                          </Card>
                        )}

                        {fields.map((field, index) => (
                          <Card key={field.id} className="border-2 relative bg-gradient-to-br from-white to-slate-50/50">
                            <CardContent className="p-6">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-12">
                                <FormField
                                  control={form.control}
                                  name={`companionInfo.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-semibold">Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Jane Doe" {...field} className="h-11" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`companionInfo.${index}.relation`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-semibold">Relation</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Spouse" {...field} className="h-11" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`companionInfo.${index}.contactNumber`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-semibold">Contact Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="+1234567890" {...field} className="h-11" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


