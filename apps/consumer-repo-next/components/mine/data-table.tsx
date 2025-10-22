import React from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Row } from "@tanstack/react-table";

import {
  Table,
  TableCaption,
  TableHeader as Thead,
  TableBody as Tbody,
  TableRow as Tr,
  TableCell as Td,
  TableHead as Th,
} from "@/components/shadcn/ui/table";
import { SortableList, SortableListItemWrapper } from "./dnd-kit";


type BaseDataItem = { id: string; };

export function UiDataTable<TDataItem extends BaseDataItem>({
  data,
  columns,
  onReorder,
  captionText,
}: {
  data: TDataItem[],
  columns: ColumnDef<TDataItem>[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  captionText?: string;
}) {

  const tableApi = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: dataItem => dataItem.id, //required when usig row dnd, because row indexes will change
    // state: {
    //   sorting,
    //   columnVisibility,
    //   rowSelection,
    //   columnFilters,
    //   pagination,
    // },
    // getRowId: (row) => row.id.toString(),
    // enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    // onColumnVisibilityChange: setColumnVisibility,
    // onPaginationChange: setPagination,
    // getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const rowsApi = tableApi.getRowModel().rows;
  const rowsOriginal = rowsApi.map(row => row.original);
  const sortableRows = rowsOriginal;
  // const sortableRowsIds = rowsOriginal.map(row => row.id);

  return (
    <div className="rounded-md border overflow-hidden">

      <SortableList
        items={sortableRows}
        onSwapItems={onReorder}
      // renderOverlayItem={(item) => (
      //   <Table>
      //     <Tbody className="bg-muted">
      //       <UiTBodyRow rowApi={tableApi.getRow(item.id)} />
      //     </Tbody>
      //   </Table>
      // )}
      >
        <Table classNameWrapper="h-[400px]">
          {captionText && (
            <TableCaption>{captionText}</TableCaption>
          )}
          <Thead>
            {tableApi.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                  // style={{ minWidth: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          {!rowsApi.length ? (
            <Tbody>
              <Tr>
                <Td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </Td>
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {rowsApi.map(rowApi => (
                <UiTBodyRowSortableMemo
                  key={rowApi.id}
                  rowApi={rowApi}
                />
              ))}
            </Tbody>
          )}
        </Table>

      </SortableList>

      <div className="py-2 text-center text-muted-foreground text-xs">
        {tableApi.getFilteredSelectedRowModel().rows.length} of{" "}
        {tableApi.getFilteredRowModel().rows.length} row(s) selected.
      </div>

    </div>
  );
}

const UiTBodyRowMemo = React.memo(
  function UiTBodyRow<TDataItem extends BaseDataItem>({ rowApi, ...props }: { rowApi: Row<TDataItem>; } & React.ComponentProps<"tr">) {
    return (
      <Tr
        {...props}
        data-state={rowApi.getIsSelected() && "selected"}
      >
        {rowApi.getVisibleCells().map((cell) => (
          <Td
            key={cell.id}
          // style={{ minWidth: cell.column.getSize() }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        ))}
      </Tr>
    );
  }
);


const UiTBodyRowSortableMemo = React.memo(
  function UiTBodyRowSortable<TDataItem extends BaseDataItem>({ rowApi, ...props }: { rowApi: Row<TDataItem>; } & React.ComponentProps<"tr">) {
    return (
      <SortableListItemWrapper
        key={rowApi.id}
        sortableId={rowApi.original.id}
        asChild
      >
        <UiTBodyRowMemo rowApi={rowApi} {...props} />
      </SortableListItemWrapper>
    );
  }
);