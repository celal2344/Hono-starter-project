import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Patient } from '@/lib/api-types'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import {
  DataGridTableRowSelectAll,
  DataGridTableRowSelect
} from '@/components/ui/data-grid-table';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const usePatientColumns = (): ColumnDef<Patient>[] => {
  return useMemo<ColumnDef<Patient>[]>(
      () => [
        {
          accessorKey: '_id',
          id: '_id',
          header: () => <DataGridTableRowSelectAll />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
          enableSorting: false,
          size: 35,
          enableResizing: false,
        },
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
        },
        {
          accessorKey: 'gender',
          id: 'gender',
          header: ({ column }) => <DataGridColumnHeader title="Gender" visibility={true} column={column} />,
          cell: ({ row }) => <div className="capitalize">{row.original.gender}</div>,
          size: 100,
          enableSorting: true,
        },
        {
          accessorKey: 'country',
          id: 'country',
          header: ({ column }) => <DataGridColumnHeader title="Country" visibility={true} column={column} />,
          cell: ({ row }) => row.original.country,
          size: 150,
          enableSorting: true,
        },
        {
          accessorKey: 'identifier',
          id: 'identifier',
          header: ({ column }) => <DataGridColumnHeader title="Identifier" visibility={true} column={column} />,
          cell: ({ row }) => <span className="font-mono text-sm">{row.original.identifier}</span>,
          size: 150,
          enableSorting: true,
        },
        {
          accessorKey: 'isCanceled',
          id: 'isCanceled',
          header: ({ column }) => <DataGridColumnHeader title="Status" visibility={true} column={column} />,
          cell: ({ row }) => {
            return row.original.documentState.isCanceled ? (
              <Badge variant="destructive" appearance="outline">
                Canceled
              </Badge>
            ) : (
              <Badge variant="primary" appearance="outline">
                Active
              </Badge>
            );
          },
          size: 100,
          enableSorting: true,
        },
        {
          id: 'actions',
          header: '',
          cell: () => {
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="size-7" mode="icon" variant="ghost">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>View Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => {}}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
          size: 60,
          enableSorting: false,
        },
      ],
      [],
    );
}
