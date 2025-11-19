import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ColumnDef } from '@tanstack/react-table';
import { Patient } from '@/lib/api-types';
import { Link } from '@tanstack/react-router';

export const columns: ColumnDef<Patient>[] = [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Name" visibility={true} column={column} />,
        cell: ({ row }) => {
          const initials = `${row.original.name[0]}${row.original.surname[0]}`.toUpperCase();
          return (
            <Link
              to="/patients/$patientId"
              params={{ patientId: row.original._id || '' }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{row.original.name}</div>
                <div className="text-muted-foreground">{row.original.surname}</div>
              </div>
            </Link>
          );
        },
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        minSize: 100,
        maxSize: 400,
      },
      {
        accessorKey: 'gender',
        id: 'gender',
        header: ({ column }) => <DataGridColumnHeader title="Gender" visibility={true} column={column} />,
        cell: ({ row }) => <div className="capitalize">{row.original.gender}</div>,
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'country',
        id: 'country',
        header: ({ column }) => <DataGridColumnHeader title="Country" visibility={true} column={column} />,
        cell: ({ row }) => row.original.country,
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'identifier',
        id: 'identifier',
        header: ({ column }) => <DataGridColumnHeader title="Identifier" visibility={true} column={column} />,
        cell: ({ row }) => <span className="font-mono text-sm">{row.original.identifier}</span>,
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
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
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'ethnicity',
        id: 'ethnicity',
        header: ({ column }) => <DataGridColumnHeader title="Ethnicity" visibility={true} column={column} />,
        cell: ({ row }) => row.original.ethnicity || '-',
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
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
        meta: {
          headerClassName: "",
          cellClassName: "truncate",
          skeleton: <div className="animate-pulse bg-muted rounded-md h-10 w-full"></div>,
        },
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
      },
    ];