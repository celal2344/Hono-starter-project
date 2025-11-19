'use client';
"use no memo" 

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardHeading } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UserRoundPlus, FunnelX, Maximize, Minimize } from 'lucide-react';
import type { Patient } from '@/lib/api-types';
import { useGetPatients } from '../hooks/use-get-patients';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AddPatientModal } from './add-patient-modal';
import { Filters, type Filter } from '@/components/ui/filters';
import { convertFiltersToMongo } from '../utils/filters-to-mongo';
import { columns } from '../table-columns';
import { filterFields } from '../utils/filter-fields';
import { useDatatableStore } from '@/stores/datatable-store';


export default function PatientsDataGrid() {
  const {
    pagination,
    sorting,
    columnSizing,
    columnPinning,
    filters,
    setPagination,
    setSorting,
    setColumnSizing,
    setColumnPinning,
    setFilters,
  } = useDatatableStore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  

  const handleFiltersChange = useCallback((newFilters: Filter[]) => {
    setFilters(newFilters);
  }, [setFilters]);
  

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


  const table = useReactTable({
    columns: columns,
    data: patients,
    pageCount,
    getRowId: (row: Patient) => row._id || '',
    state: {
      pagination,
      sorting,
      columnSizing,
      columnPinning,
    },
    defaultColumn: {
      size: 200, 
      minSize: 50,
      maxSize: 500,
    },
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    onColumnPinningChange: setColumnPinning,
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
          columnsVisibility: true,
        }}>
        <Card className={isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none h-screen flex flex-col' : ''}>
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
            <CardHeading className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <UserRoundPlus />
                Add Patient
              </Button>
            </CardHeading>
          </CardHeader>
          <DataGridContainer className={isFullscreen ? 'flex-1 min-h-0' : ''}>
            <ScrollArea className={isFullscreen ? 'h-full' : 'max-h-128'}>
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
