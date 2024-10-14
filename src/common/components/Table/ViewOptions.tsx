import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { SlidersHorizontalIcon } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface TableButton<TData> {
  id: string
  name: string
  icon: ReactNode
  triggerFunction: (selectedRows: TData[]) => void
}

const ViewOptions = <TData,>({
  table,
  tableButton,
}: {
  table: Table<TData>
  tableButton?: TableButton<TData>[]
}) => {
  return (
    <>
      {tableButton?.map((item) => {
        return (
          <div key={item.id}>
            <Button
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
              onClick={() =>
                item.triggerFunction(table.getSelectedRowModel().rows.map((r) => r.original))
              }
              disabled={table.getSelectedRowModel().rows.map((r) => r.original).length === 0}
            >
              {item.icon}

              {item.name}
            </Button>
          </div>
        )
      })}

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto hidden lg:flex">
              <SlidersHorizontalIcon className="mr-2 size-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.accessorFn !== undefined && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="uppercase"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {/* @ts-expect-error Show header which is string */}
                    {column.columnDef.header}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

export default ViewOptions
