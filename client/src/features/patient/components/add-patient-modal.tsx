'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
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
import { ChevronDownIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreatePatient, type PatientFormData } from '../hooks/use-patient-mutations';
import { toast } from 'sonner';
import { X, Plus, User, IdCard, Users } from 'lucide-react';
import TitleStatusStepper from '@/components/stepper/title-status';

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

interface AddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { title: 'Basic Info', description: 'Personal details', icon: User },
  { title: 'Identification', description: 'ID & location', icon: IdCard },
  { title: 'Companions', description: 'Optional', icon: Users },
];

export function AddPatientModal({ open, onOpenChange }: AddPatientModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const createPatientMutation = useCreatePatient();

  const form = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
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
    if (birthDate) {
      const year = birthDate.getFullYear();
      const month = String(birthDate.getMonth() + 1).padStart(2, '0');
      const day = String(birthDate.getDate()).padStart(2, '0');
      const numericDate = parseInt(`${year}${month}${day}`);
      form.setValue('birthdate', numericDate);
    }
  }, [birthDate, form]);

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger(['firstName', 'lastName', 'gender', 'birthdate']);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['identifier', 'country', 'ethnicity']);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createPatientMutation.mutateAsync(data as PatientFormData);
      toast.success('Patient added successfully');
      form.reset();
      setBirthDate(undefined);
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add patient');
    }
  };

  const handleClose = () => {
    form.reset();
    setBirthDate(undefined);
    setCurrentStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
          <TitleStatusStepper steps={STEPS} currentStep={currentStep} className='mb-6 ml-8'/>
        <DialogBody>
          <Form {...form}>
            <form id="patient-form" onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value as 'male' | 'female' | 'other')}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormControl>
                          <div className="flex flex-col gap-3">
                            <Label htmlFor="date" className="px-1">
                              Date of birth
                            </Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-48 justify-between font-normal"
                                >
                                  {birthDate ? birthDate.toLocaleDateString() : "Select date"}
                                  <ChevronDownIcon />
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identifier (Turkish ID or Passport)</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678901 or AB123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
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
                        <FormLabel>Ethnicity</FormLabel>
                        <FormControl>
                          <Input placeholder="Caucasian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Companion Information (Optional)</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: '', relation: '', contactNumber: '' })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Companion
                    </Button>
                  </div>

                  {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">No companions added. Click "Add Companion" to add one.</p>
                  )}

                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 p-4 border border-border rounded-md relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <FormField
                        control={form.control}
                        name={`companionInfo.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
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
                            <FormLabel>Relation</FormLabel>
                            <FormControl>
                              <Input placeholder="Spouse" {...field} />
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
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </form>
          </Form>
        </DialogBody>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createPatientMutation.isPending}
                >
                  {createPatientMutation.isPending ? 'Adding...' : 'Add Patient'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

