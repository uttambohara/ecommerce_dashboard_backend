"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SHIPPING_CHARGE, TAXES, status } from "@/data/constant";
import { formatCurrencyToNPR } from "@/lib/currency-formatter";
import supabaseBrowserClient from "@/lib/supabase/supabase-client";
import { OrderWithCustomer } from "@/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  CircleX,
  Clock,
  EyeIcon,
  Loader2,
  Slash,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type Order = OrderWithCustomer;

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const data = row.original;
      const customer = data.customer;
      if (!customer) return <div>Customer Not found!</div>;
      return (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative h-12 w-12">
            <Image
              src={customer.users?.avatar_url as string}
              alt={customer.users?.full_name as string}
              fill
              priority
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold">{customer.users?.full_name}</div>
            <div className="text-muted-foreground">{customer.users?.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "order_date",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Date"
          mainUrl="/vendor/order"
        />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          <div>{format(data.order_date!, "yyyy MMM dd")}</div>
          <div className="text-muted-foreground">
            {format(data.order_date!, "hh:MM aaaa")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const order = row.original;
      const order_product = order.order_product;
      const totalOrderedQuantity = order_product.reduce(
        (acc, product) => acc + product.quantity!,
        0,
      );
      return <div>{totalOrderedQuantity}</div>;
    },
  },
  {
    accessorKey: "total",
    header: "Total revenue",
    cell: ({ row }) => {
      const order = row.original;
      const order_product = order.order_product;
      const totalRevenue = order_product.reduce((acc, item) => {
        const totalPrice =
          item.quantity! * item.product.salesPrice -
          (item.product.discount / 100) *
            (item.quantity * item.product.salesPrice);
        return acc + totalPrice;
      }, 0);

      return <div>{formatCurrencyToNPR(totalRevenue)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const data = row.original;
      switch (data.status) {
        case "PENDING":
          return (
            <Badge className="gap-2 bg-orange-600">
              <Clock size={16} />
              Pending
            </Badge>
          );
        case "COMPLETED":
          return (
            <Badge className="gap-2 bg-green-600">
              <Check size={16} />
              Completed
            </Badge>
          );
        case "CANCELED":
          return (
            <Badge className="gap-2 bg-red-600">
              <CircleX size={16} />
              Canceled
            </Badge>
          );
        case "REJECTED":
          return (
            <Badge className="gap-2 bg-white text-red-700">
              <Slash size={16} color="red" />
              Rejected
            </Badge>
          );
        default:
          return null;
      }
    },
  },
  {
    id: "actions",
    header: "Change Status",
    cell: ({ row }) => {
      const order = row.original;
      return <ChangeStatusAction order={order} />;
    },
  },
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const order = row.original;
      console.log(order);
      const customer = order.customer;

      // TODO
      const revenueTotal = order.order_product.reduce((acc, item) => {
        const totalPrice =
          item.quantity! * item.product.salesPrice -
          (item.product.discount / 100) *
            (item.quantity! * item.product.salesPrice);
        return acc + totalPrice;
      }, 0);
      const shippingCharge = SHIPPING_CHARGE;
      const globalDiscount = 0;
      const taxableAmount = revenueTotal;
      const tax = Number(((TAXES / 100) * taxableAmount).toFixed(2));
      const totalAmount = revenueTotal + shippingCharge - globalDiscount + tax;
      return (
        <Sheet>
          <SheetTrigger>
            <EyeIcon />
          </SheetTrigger>
          <SheetContent className="!w-[550px]">
            <SheetHeader>
              <SheetTitle>Details</SheetTitle>
              {/* First group */}
              <div>
                <div className="flex items-center justify-between py-2">
                  <div>Customer</div>
                  <div className="text-sm text-muted-foreground">
                    {customer?.users?.full_name}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>Address</div>
                  <div className="text-sm text-muted-foreground">
                    {customer?.address}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>Status</div>
                  <div
                    className={clsx(
                      "flex items-center gap-2 rounded-full p-1 text-xs font-bold text-white ",
                      {
                        "bg-orange-600": order.status === "PENDING",
                        "bg-red-600": order.status === "REJECTED",
                        "bg-red-700": order.status === "CANCELED",
                        "bg-green-600": order.status === "COMPLETED",
                      },
                    )}
                  >
                    {order.status === "PENDING" && <Clock size={16} />}
                    {order.status === "REJECTED" && <Slash size={16} />}
                    {order.status === "CANCELED" && <XCircle size={16} />}
                    {order.status === "COMPLETED" && <Check size={16} />}
                    {order.status}
                  </div>
                </div>
              </div>
              {/* Table */}
              <div>
                <SheetTitle>Line items</SheetTitle>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_product?.map((item) => {
                      const imageArr: any = item?.product.productImgs;
                      const imageUrl = imageArr[0].image;

                      const totalAmountAfterDiscount =
                        Number(item.quantity) *
                          Number(item?.product.salesPrice) -
                        Number(item.quantity) *
                          Number(item?.product.salesPrice) *
                          (Number(item?.product.discount) / 100);

                      return (
                        <TableRow key={item.product_id}>
                          <TableCell className="font-medium">
                            <div className="grid grid-cols-1 items-center">
                              <div className="relative h-12 w-12">
                                <Image
                                  src={imageUrl}
                                  alt={item.product.name as string}
                                  fill
                                  priority
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div className="mb-1 text-[0.9rem] font-bold">
                                {item.product.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {Number(item.product.salesPrice)}
                          </TableCell>
                          <TableCell>{item?.product.discount}%</TableCell>
                          <TableCell className="text-right">
                            {formatCurrencyToNPR(totalAmountAfterDiscount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}></TableCell>
                      {/* TODO */}
                      <TableCell className="text-right">
                        <div>
                          <div />
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-4">
                              <div>Subtotal</div>
                              <div> {formatCurrencyToNPR(revenueTotal)}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Shipping</div>
                              <div>{shippingCharge}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Discount</div>
                              <div>-{globalDiscount}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Taxes (10%)</div>
                              <div>{tax}</div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between font-semibold">
                              <div>Total</div>
                              <div>
                                {formatCurrencyToNPR(Number(totalAmount))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
    },
  },
];

function ChangeStatusAction({ order }: { order: OrderWithCustomer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function handleClick(role: string) {
    startTransition(async () => {
      const supabase = supabaseBrowserClient();
      const response = await supabase
        .from("order")
        .update({ status: role })
        .eq("id", order.id)
        .select();

      router.refresh();
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-12 w-12" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change role</DropdownMenuLabel>
        {status.map((role) => {
          if (role.toLowerCase() === "all") return;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleClick(role.toUpperCase())}
            >
              {role}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
