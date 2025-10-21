'use client';

import type { ColumnDef } from "@tanstack/react-table";
import { useBoolean, useInterval } from "react-use";
import { GripHorizontalIcon } from "lucide-react";

import type { DataItem } from "../../shared";
import { DEMO_CONFIG } from "../../demo-config";
import { TableProvider, useGetTableStore } from "../state";

import { DevDebugJson } from "@/components/mine/dev-debug-json";
import { UiBadge } from "@/components/mine/badge";
import { UiCombobox } from "@/components/mine/combobox";
import { UiDataTable } from "@/components/mine/data-table";
import { SortableListItemDragHandler } from "@/components/mine/dnd-kit";
import { UiInputDebounced } from "@/components/mine/input-debounced";
import { Checkbox } from "@/components/shadcn/ui/checkbox";


export function Table_Zustand_Plain() {
  return (
    <TableProvider>
      <div>
        <TableAutoBehavior />
        <Table />
        <DebugTable />
      </div>
    </TableProvider>
  );
}



function DebugTable() {
  const useTableStore = useGetTableStore();
  const items = useTableStore(store => store.state.raw.items);

  return (
    <DevDebugJson
      label="debug"
      json={items}
    />
  );
}

// auto behavior

function TableAutoBehavior() {
  const useTableStore = useGetTableStore();
  const itemsCount = useTableStore(store => store.state.derived.itemsCount);
  const actions = useTableStore(store => store.actions);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      if (itemsCount < DEMO_CONFIG.autobehavior.createToReachCount) actions.addItem();
      else toggleIsRunning();
    },
    isRunning ? 5 : null,
  );
  return null;
}


function Table() {
  const useTableStore = useGetTableStore();
  const items = useTableStore(store => store.state.raw.items);
  const actions = useTableStore(store => store.actions);

  return (
    <UiDataTable
      data={items}
      columns={columns}
      onReorder={(oldIndex, newIndex) => actions.moveItem(oldIndex, newIndex)}
    />
  );
}

const columns: ColumnDef<DataItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => (
      <SortableListItemDragHandler sortableId={row.original.id}>
        <GripHorizontalIcon className="ml-2 size-4 text-muted-foreground" />
      </SortableListItemDragHandler>
    ),
    size: 50,
    minSize: 50,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={newChecked => table.toggleAllPageRowsSelected(Boolean(newChecked))}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          aria-label="Select all"
          checked={row.getIsSelected()}
          onCheckedChange={newChecked => row.toggleSelected(Boolean(newChecked))}
        />
      </div>
    ),
    size: 40,
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    cell: function Cell({ row }) {
      return (
        <span className="text-xs text-muted-foreground">
          {row.original.id}
        </span>
      );
    }
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: function Cell({ row }) {
      const useTableStore = useGetTableStore();
      const actions = useTableStore(store => store.actions);

      return (
        <UiInputDebounced
          initialValue={row.original.name}
          onChange={newValue => actions.updateItem(row.original.id, { name: newValue })}
        />
      );
    }
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: function Cell({ row }) {
      const useTableStore = useGetTableStore();
      const actions = useTableStore(store => store.actions);

      return (
        <UiCombobox
          value={row.original.status}
          onChangeOption={newOption => {
            if (!newOption) return;
            actions.updateItem(row.original.id, { status: newOption.value });
          }}
          options={[
            {
              label: <UiBadge className="bg-red-400 text-red-50">Todo</UiBadge>,
              value: 'todo' satisfies typeof row.original.status,
            },
            {
              label: <UiBadge className="bg-yellow-400 text-black">In Progress</UiBadge>,
              value: 'in_progress' satisfies typeof row.original.status,
            },
            {
              label: <UiBadge className="bg-green-400 text-green-900">Done</UiBadge>,
              value: 'done' satisfies typeof row.original.status,
            },
          ] as const}
        />
      );
    }
  },

  // {
  //   accessorKey: "header",
  //   header: "Header",
  //   cell: ({ row }) => {
  //     return <TableCellViewer item={row.original} />
  //   },
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "type",
  //   header: "Section Type",
  //   cell: ({ row }) => (
  //     <div className="w-32">
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.type}
  //       </Badge>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <Badge variant="outline" className="text-muted-foreground px-1.5">
  //       {row.original.status === "Done" ? (
  //         <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
  //       ) : (
  //         <IconLoader />
  //       )}
  //       {row.original.status}
  //     </Badge>
  //   ),
  // },
  // {
  //   accessorKey: "target",
  //   header: () => <div className="w-full text-right">Target</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-target`} className="sr-only">
  //         Target
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.target}
  //         id={`${row.original.id}-target`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "limit",
  //   header: () => <div className="w-full text-right">Limit</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.header}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
  //         Limit
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.limit}
  //         id={`${row.original.id}-limit`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "reviewer",
  //   header: "Reviewer",
  //   cell: ({ row }) => {
  //     const isAssigned = row.original.reviewer !== "Assign reviewer"
  //     if (isAssigned) {
  //       return row.original.reviewer
  //     }
  //     return (
  //       <>
  //         <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
  //           Reviewer
  //         </Label>
  //         <Select>
  //           <SelectTrigger
  //             className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
  //             size="sm"
  //             id={`${row.original.id}-reviewer`}
  //           >
  //             <SelectValue placeholder="Assign reviewer" />
  //           </SelectTrigger>
  //           <SelectContent align="end">
  //             <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
  //             <SelectItem value="Jamik Tashpulatov">
  //               Jamik Tashpulatov
  //             </SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </>
  //     )
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: () => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
  //           size="icon"
  //         >
  //           <IconDotsVertical />
  //           <span className="sr-only">Open menu</span>
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end" className="w-32">
  //         <DropdownMenuItem>Edit</DropdownMenuItem>
  //         <DropdownMenuItem>Make a copy</DropdownMenuItem>
  //         <DropdownMenuItem>Favorite</DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  // },
];
