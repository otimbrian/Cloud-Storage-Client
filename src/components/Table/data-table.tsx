import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Actions from "./actions";
import { FileOrFolderType } from "@/hooks/useTableData";
import { useState } from "react";
import RenameDialog from "../Dialog/RenameDialog";
import DeleteDialog from "../Dialog/DeleteDialog";
import { FileType } from "@/index";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export type DialogStateProps = {
  type: "file" | "folder";
  name: string;
  id: string;
  open: boolean;
};

export type DeleteDialogType = DialogStateProps;
export type RenameDialogType = DialogStateProps;

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogType>({
    id: "",
    type: "file",
    name:"file",
    open: false,
  });
  const [renameDialog, setRenameDialog] = useState<RenameDialogType>({
    id: "",
    type: "file",
    name: "file",
    open: false,
  });
  function openRenameDialog(
    id: string,
    name: string,
    type: DialogStateProps["type"]
  ) {
    setRenameDialog((prevState) => ({
      ...prevState,
      id,
      name,
      type,
      open: true,
    }));
    console.log("in function",renameDialog);
  }
  console.log(renameDialog);
  function openDeleteDialog(id: string,name:string, type: DialogStateProps["type"]) {
    setDeleteDialog((prevState) => ({
      ...prevState,
      id,
      type,
      name,
      open: true,
    }));
  }
  return (
    <>
      <RenameDialog {...renameDialog} setDialogState={setRenameDialog} />
      <DeleteDialog {...deleteDialog} setDialogState={setDeleteDialog} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell key={(row.original as FileOrFolderType).id}>
                    <Actions
                      id={(row.original as FileOrFolderType).id}
                      name={(row.original as FileOrFolderType).name}
                      openDeleteDialog={openDeleteDialog}
                      openRenameDialog={openRenameDialog}
                      type={
                        (row.original as FileOrFolderType).type === "folder"
                          ? "folder"
                          : "file"
                      }
                      downloadUrl={(row.original as FileType)?.downloadUrl ?? undefined}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-semibold text-xl"
                >
                  No Files or Folders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
