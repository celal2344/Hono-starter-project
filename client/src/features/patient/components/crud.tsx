'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardHeading } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { UserRoundPlus, User, IdCard, MapPin, Calendar, FunnelX } from 'lucide-react';
import type { Patient } from '@/lib/api-types';
import { useGetPatients } from '../hooks/use-get-patients';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AddPatientModal } from './add-patient-modal';
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters';
import { convertFiltersToMongo } from '../utils/filters-to-mongo';


export default function PatientsDataGrid() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filterFields: FilterFieldConfig[] = [
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

  const handleFiltersChange = useCallback((newFilters: Filter[]) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);
  
useEffect(() => {
  console.log(JSON.stringify(convertFiltersToMongo(filters)));
}, [filters]);

  const { data, isLoading } = useGetPatients({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id || 'name',
    order: sorting[0]?.desc ? 'DESC' : 'ASC',
    filters: JSON.stringify(convertFiltersToMongo(filters)),
  });

  const patients = data?.data || [];
  const totalRecords = data?.pagination.total || 0;
  const pageCount = data?.pagination.totalPages || 0;

  const columns = useMemo<ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Name" visibility={true} column={column} />,
        cell: ({ row }) => {
          const initials = `${row.original.name[0]}${row.original.surname[0]}`.toUpperCase();
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{row.original.name}</div>
                <div className="text-muted-foreground">{row.original.surname}</div>
              </div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,

      },
      {
        accessorKey: 'gender',
        id: 'gender',
        header: ({ column }) => <DataGridColumnHeader title="Gender" visibility={true} column={column} />,
        cell: ({ row }) => <div className="capitalize">{row.original.gender}</div>,
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'country',
        id: 'country',
        header: ({ column }) => <DataGridColumnHeader title="Country" visibility={true} column={column} />,
        cell: ({ row }) => row.original.country,
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'identifier',
        id: 'identifier',
        header: ({ column }) => <DataGridColumnHeader title="Identifier" visibility={true} column={column} />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.identifier}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'birthDate',
        id: 'birthDate',
        header: ({ column }) => <DataGridColumnHeader title="Birth Date" visibility={true} column={column} />,
        cell: ({ row }) => {
          const date = row.original.birthDate;
          if (!date) return '-';
          // Format YYYYMMDD to readable date
          const dateStr = date.toString();
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${year}-${month}-${day}`;
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'ethnicity',
        id: 'ethnicity',
        header: ({ column }) => <DataGridColumnHeader title="Ethnicity" visibility={true} column={column} />,
        cell: ({ row }) => row.original.ethnicity || '-',
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'companionInfo',
        id: 'companionInfo',
        header: ({ column }) => <DataGridColumnHeader title="Companions" visibility={true} column={column} />,
        cell: ({ row }) => {
          const companions = row.original.companionInfo;
          if (!companions || companions.length === 0) return '-';
          return (
            <div className="space-y-1">
              {companions.map((companion, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{companion.name}</span>
                  <span className="text-muted-foreground"> ({companion.relation})</span>
                </div>
              ))}
            </div>
          );
        },
        size: 200,
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns: columns,
    data: patients,
    pageCount,
    getRowId: (row: Patient) => row._id || '',
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <AddPatientModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <DataGrid table={table} recordCount={totalRecords} isLoading={isLoading}
        tableLayout={{
          headerSticky: true,
          columnsPinnable: true,
          columnsResizable: true,
        }}>
        <Card>
          <CardHeader className="py-4">
            <CardHeading className="flex items-start gap-2.5 flex-1">
              <div >
                <div className="flex-1">
                  <Filters
                    filters={filters}
                    fields={filterFields}
                    onChange={handleFiltersChange}
                    variant="outline"
                    size="sm"
                  />
                </div>
                {filters.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setFilters([])}>
                    <FunnelX className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardHeading>
            <CardHeading>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <UserRoundPlus />
                Add Patient
              </Button>
            </CardHeading>
          </CardHeader>
          <DataGridContainer>
            <ScrollArea className="max-h-128">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>
    </>
  );
}
