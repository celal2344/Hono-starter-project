import { FilterFieldConfig } from '@/components/ui/filters';
import { Calendar, IdCard, MapPin, User } from 'lucide-react';

export const filterFields: FilterFieldConfig[] = [
    {
      key: 'name',
      label: 'Name',
      icon: <User className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search names...',
    },
    {
      key: 'surname',
      label: 'Surname',
      icon: <User className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search surnames...',
    },
    {
      key: 'identifier',
      label: 'Identifier',
      icon: <IdCard className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search identifier...',
    },
    {
      key: 'gender',
      label: 'Gender',
      icon: <User className="size-3.5" />,
      type: 'select',
      searchable: true,
      className: 'w-[140px]',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      key: 'country',
      label: 'Country',
      icon: <MapPin className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search country...',
    },
    {
      key: 'ethnicity',
      label: 'Ethnicity',
      icon: <User className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search ethnicity...',
    },
    {
      key: 'birthDate',
      label: 'Birth Date',
      icon: <Calendar className="size-3.5" />,
      type: 'date',
      className: 'w-36',
    },
  ];