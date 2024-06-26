"use client";

import CustomModal from "@/components/global/custom-modal";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrencyToNPR } from "@/lib/currency-formatter";
import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import { useModal } from "@/providers/modal-provider";
import { ProductsWithCategory } from "@/types";
import { Tables } from "@/types/supabase";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Clock, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type Payment = Tables<"product">;

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
          mainUrl="/vendor/product/list"
        />
      );
    },
    cell: ({ row }) => {
      const rowData = row.original as ProductsWithCategory;
      const img = rowData.productImgs as Record<string, string>[];
      const firstImg = img[0];
      return (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative h-12 w-12">
            <Image
              src={firstImg.image}
              alt={firstImg.name}
              fill
              priority
              className="rounded-full object-cover object-center"
            />
          </div>
          <div>
            <div className="mb-1 text-[0.9rem] font-bold">{rowData.name}</div>
            <p className="text-muted-foreground">in {rowData.category.name}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Quantity"
          mainUrl="/vendor/product/list"
        />
      );
    },
  },
  {
    accessorKey: "salesPrice",
    header: "Price",
    cell: ({ row }) => {
      if (!row.original.salesPrice) return null;
      return <div>{formatCurrencyToNPR(row.original.salesPrice)}</div>;
    },
  },
  {
    accessorKey: "publishDate",
    header: "Status",
    cell: ({ row }) => {
      const rowData = row.original;
      if (!rowData.publishDate) return null;
      return (
        <div>
          {new Date(rowData.publishDate) < new Date() ? (
            <Badge className="gap-2 bg-green-700">
              <span>
                <Check size={14} />
              </span>
              Published
            </Badge>
          ) : (
            <Badge className="gap-2 bg-transparent text-muted-foreground">
              <span>
                <Clock />
              </span>
              <span>Draft</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions rowData={rowData} />;
    },
  },
];

type CellActionsProps = {
  rowData: Tables<"product">;
};

const NameHeaderAction = () => {};

const CellActions = ({ rowData }: CellActionsProps) => {
  const { data, setOpen, setClose, isOpen } = useModal();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            setOpen(
              <CustomModal title={"Are you absolutely sure?"} subheading={""}>
                <p>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </p>
                <div className="flex">
                  <div className="ml-auto mt-3 flex items-center gap-3">
                    <Button variant={"outline"} onClick={() => setClose()}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-700"
                      onClick={async () => {
                        const supabase = supabaseBrowserClient();
                        const { error } = await supabase
                          .from("product")
                          .delete()
                          .eq("id", rowData.id);
                        if (error) toast.error(error.message);
                        setClose();
                        toast.success("Product deleted");
                        router.refresh();
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </CustomModal>,
            )
          }
        >
          <div className="flex items-center gap-1 text-red-600">Delete</div>
        </DropdownMenuItem>
        <Link href={`/vendor/product/edit/${rowData.id}`}>
          <DropdownMenuItem>Update</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
