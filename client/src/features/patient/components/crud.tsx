'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardHeading, CardTable, CardToolbar } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import { Input } from '@/components/ui/input';
import {
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {  Search, UserRoundPlus, X } from 'lucide-react';
import type { Patient } from '@/lib/api-types';
import { useGetPatients } from '../hooks/use-get-patients';
import { usePatientColumns } from '../table-columns';



export default function PatientsDataGrid() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [searchQuery, setSearchQuery] = useState('');
  const columns = usePatientColumns();
  const { data, isLoading } = useGetPatients({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id || 'name',
    order: sorting[0]?.desc ? 'DESC' : 'ASC',
    filters: searchQuery,
  });

  const patients = data?.data || [];
  const totalRecords = data?.pagination.total || 0;
  const pageCount = data?.pagination.totalPages || 0;

 

  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const tableData = useMemo(() => patients, [patients]);

  const table = useReactTable({
    columns,
    data: tableData,
    pageCount,
    getRowId: (row: Patient) => row._id || '',
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <DataGrid table={table} recordCount={totalRecords} isLoading={isLoading}>
      <Card>
        <CardHeader className="py-4">
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPagination({ ...pagination, pageIndex: 0 });
                  }}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>
          <CardToolbar>
            <Button>
              <UserRoundPlus />
              Add Patient
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <DataGridTable />
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
