import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import type { Patient } from '@/lib/api-types'

export const usePatientColumns = (): ColumnDef<Patient>[] => {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Hasta Bilgileri"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const patient = row.original
          const initials =
            `${patient.name.charAt(0)}${patient.surname.charAt(0)}`.toUpperCase()

          return (
            <Link
              to={`${patient._id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={`/media/avatars/${patient._id}.jpg`}
                  alt={`${patient.name} ${patient.surname}`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{`${patient.name} ${patient.surname}`}</div>
                <div className="text-muted-foreground">
                  {patient.identifier}
                </div>
              </div>
            </Link>
          )
        },
        meta: {
          skeleton: (
            <div className="flex items-center gap-3 h-[41px]">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ),
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
        filterFn: 'includesStringSensitive',
      },
      {
        accessorKey: 'gender',
        header: ({ column }) => (
          <DataGridColumnHeader title="Cinsiyet" column={column} />
        ),
        cell: (info) => {
          const gender = info.getValue() as string
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                gender === 'male'
                  ? 'bg-blue-100 text-blue-800'
                  : gender === 'female'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </span>
          )
        },
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'equalsString',
        size: 100,
      },
      {
        accessorKey: 'birthDate',
        header: ({ column }) => (
          <DataGridColumnHeader title="Doğum Tarihi" column={column} />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorKey: 'identifier',
        header: ({ column }) => (
          <DataGridColumnHeader title="TC / Pasaport No" column={column} />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorKey: 'country',
        header: ({ column }) => (
          <DataGridColumnHeader title="Ülke" column={column} />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorKey: 'ethnicity',
        header: ({ column }) => (
          <DataGridColumnHeader title="Uyruk" column={column} />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorFn: (row) => row.companionInfo?.length || 0,
        id: 'companionsCount',
        header: ({ column }) => (
          <DataGridColumnHeader title="Refakatçi Sayısı" column={column} />
        ),
        cell: (info) => {
          const count = info.getValue() as number
          return count > 0 ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {count} refakatçi{count > 1 ? 'ler' : ''}
            </span>
          ) : (
            <span className="text-gray-500 text-xs">Yok</span>
          )
        },
        meta: {
          headerClassName: '',
          cellClassName: 'text-left',
          skeleton: <Skeleton className="w-28 h-7" />,
        },
        filterFn: 'equalsString',
        size: 100,
      },
    ],
    [],
  )
}
