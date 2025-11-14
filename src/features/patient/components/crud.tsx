import { useState } from 'react';
import { Card, CardFooter, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { Patient } from '@/lib/api-types';
import { usePatientColumns } from '../constants/table-columns';
import { useGetPatients } from '../hooks/use-get-patients';

export default function DataGridDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);
  const [columnOrder, setColumnOrder] = useState<string[]>(usePatientColumns().map((column) => column.id as string));

  const { data, isLoading } = useGetPatients({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id,
    order: sorting[0]?.desc ? 'DESC' : 'ASC',
  });

  const table = useReactTable({
    columns: usePatientColumns(),
    data: data?.data || [],
    pageCount: data?.pagination.totalPages || -1,
    getRowId: (row: Patient) => row._id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    manualPagination: true,
    manualSorting: true,
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={data?.pagination.total || 0}
      isLoading={isLoading}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
