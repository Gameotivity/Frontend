import { Button } from '@/common/components/ui/button'
import type { ColumnFilter, SortingState, ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { Input } from '@/common/components/ui/input'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table'
import Pagination from './Pagination'
import type { TableButton } from './ViewOptions'
import ViewOptions from './ViewOptions'
import { useState, useMemo, useEffect } from 'react'

export interface PaginationConfig {
  pageIndex: number
  pageSize: number
}

export interface TableData<TData> {
  rows: TData[]
  pageCount?: number
}

export interface TableOptions {
  sort: boolean
  pagination: boolean
}

interface TableProps<TData, TValue> {
  data: TableData<TData>
  columns: ColumnDef<TData, TValue>[]
  paginationConfig?: PaginationConfig
  handlePagination: (pagination: PaginationConfig) => void
  options: TableOptions
  tableButton: TableButton<TData>[]
}

const Table = <TData, TValue>({
  columns,
  data,
  paginationConfig,
  handlePagination,
  options,
  tableButton,
}: TableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])
  const [filtering, setFiltering] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const [{ pageIndex, pageSize }, setPagination] = useState(
    paginationConfig ?? {
      pageIndex: 0,
      pageSize: 20,
    },
  )

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  useEffect(() => {
    handlePagination(pagination)
  }, [handlePagination, pagination])

  const table = useReactTable({
    data: data.rows,
    columns,
    pageCount: data.pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    manualPagination: true,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setFiltering,
    // enableRowSelection: row => row.original.age > 18,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection: rowSelection,
      globalFilter: filtering,
    },
  })

  return (
    <div>
      <div className="flex justify-between">
        <div>
          {Object.keys(rowSelection).length > 0 && (
            <div className=" mt-5 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
        </div>
        <div className="flex flex-row-reverse gap-3 py-4">
          <ViewOptions table={table} tableButton={tableButton} />
          <div>
            <Input
              placeholder="Search"
              type="search"
              value={filtering}
              onChange={(event) => setFiltering(event.target.value)}
              className="h-9 max-w-sm focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
      <div className="rounded-md shadow-md">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={`${options.sort} ? 'pl-2' : 'pl-6'`}>
                      {options.sort ? (
                        <Button
                          variant="transparent"
                          className="flex uppercase text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <svg
                              className="ms-1.5 size-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          )}
                        </Button>
                      ) : (
                        <>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={`${options.sort} ? 'pl-2' : 'pl-6'`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>
      {options.pagination ? <Pagination table={table} /> : ''}
    </div>
  )
}

export default Table
