import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PaginationState, SortingState, ColumnSizingState, ColumnPinningState } from '@tanstack/react-table';
import type { Filter } from '@/components/ui/filters';

interface DatatableStore {
  pagination: PaginationState;
  sorting: SortingState;
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  filters: Filter[];
  setPagination: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
  setColumnSizing: (columnSizing: ColumnSizingState | ((prev: ColumnSizingState) => ColumnSizingState)) => void;
  setColumnPinning: (columnPinning: ColumnPinningState | ((prev: ColumnPinningState) => ColumnPinningState)) => void;
  setFilters: (filters: Filter[]) => void;
}


const initialState: DatatableStore = {
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [{ id: 'name', desc: false }],
  columnSizing: {},
  columnPinning: {
    left: [],
    right: [],
  },
  filters: [],
  setPagination: () => {},
  setSorting: () => {},
  setColumnSizing: () => {},
  setColumnPinning: () => {},
  setFilters: () => {},
};

export const useDatatableStore = create<DatatableStore>()(
  persist(
    (set) => ({
      ...initialState,
      setPagination: (pagination) =>
        set((state) => ({
          pagination: typeof pagination === 'function' ? pagination(state.pagination) : pagination,
        })),
      setSorting: (sorting) =>
        set((state) => ({
          sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
        })),
      setColumnSizing: (columnSizing) =>
        set((state) => ({
          columnSizing: typeof columnSizing === 'function' ? columnSizing(state.columnSizing) : columnSizing,
        })),
      setColumnPinning: (columnPinning) =>
        set((state) => ({
          columnPinning: typeof columnPinning === 'function' ? columnPinning(state.columnPinning) : columnPinning,
        })),
      setFilters: (filters) =>
        set((state) => {
          return {
            filters,
            pagination: {
              ...state.pagination,
              pageIndex: 0,
            },
          };
        }),
    }),
    {
      name: 'datatable-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

