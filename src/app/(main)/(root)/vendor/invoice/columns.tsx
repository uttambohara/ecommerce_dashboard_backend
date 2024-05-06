"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SHIPPING_CHARGE, TAXES } from "@/data/constant";
import { formatCurrencyToNPR } from "@/lib/currency-formatter";
import { calculatePaymentStatus } from "@/lib/payment-status-checker";
import { InvoiceWithOrderUsersAndPayment } from "@/types";
import { Tables } from "@/types/supabase";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { format } from "date-fns";
import {
  AlertCircle,
  Check,
  Clock,
  MailWarningIcon,
  Slash,
} from "lucide-react";
import Image from "next/image";

export type Payment = InvoiceWithOrderUsersAndPayment;

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const data = row.original;
      const customer = data.customer;
      return (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src={customer?.users?.avatar_url as string}
                alt={customer?.users?.full_name as string}
                fill
                priority
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <div className="font-bold">{customer?.users?.full_name}</div>
              <div className="text-muted-foreground">{data.invoice_id}</div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Create"
          mainUrl="/vendor/invoice"
        />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          <div>{format(data.created_at!, "yyyy MMM dd")}</div>
          <div className="text-muted-foreground">
            {format(data.created_at!, "hh:MM aaaa")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Due"
          mainUrl="/vendor/invoice"
        />
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          <div>{format(data.dueDate!, "yyyy MMM dd")}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          {formatCurrencyToNPR(
            data.payment.reduce((sum, payment) => {
              if (payment?.status !== "CANCELED") {
                return sum + payment?.amount!;
              }
              return sum;
            }, 0),
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const data = row.original;
      return <div>{formatCurrencyToNPR(data.amount!)}</div>;
    },
  },
  {
    accessorKey: "due",
    header: "Due",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          {formatCurrencyToNPR(
            data.amount! -
              data.payment.reduce((sum, payment) => {
                if (payment?.status !== "CANCELED") {
                  return sum + payment?.amount!;
                }
                return sum;
              }, 0),
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const data = row.original;
      const status = calculatePaymentStatus(data);
      return (
        <Badge
          className={clsx(
            "flex items-center gap-2 bg-white hover:bg-slate-200",
            {
              "text-orange-600": status === "pending",
              "text-red-600": status === "overdue",
              "text-green-600": status === "paid",
              "text-blue-600": status === "overpaid",
              "bg-red-700 text-white": status === "canceled",
            },
          )}
        >
          {status === "pending" && <Clock />}
          {status === "overdue" && <AlertCircle />}
          {status === "paid" && <Check />}
          {status === "overpaid" && <MailWarningIcon />}
          {status === "canceled" && <Slash />}

          {status}
        </Badge>
      );
    },
  },
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const invoice = row.original;
      const revenueTotal = invoice.order?.product.reduce(
        (acc, product) =>
          acc +
          (product?.salesPrice! -
            (Number(product?.discount) / 100) * Number(product?.salesPrice)),
        0,
      );
      const dueAmount =
        invoice.amount! -
        invoice.payment.reduce((sum, payment) => {
          if (payment?.status !== "CANCELED") {
            return sum + payment?.amount!;
          }
          return sum;
        }, 0);
      const shippingCharge = SHIPPING_CHARGE;
      const globalDiscount = 0;
      const taxableAmount = revenueTotal;
      const tax = Number(((TAXES / 100) * taxableAmount!).toFixed(2));
      const totalAmount = revenueTotal! + shippingCharge - globalDiscount + tax;

      return (
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">View Invoice</Button>
            </SheetTrigger>
            <SheetContent className="h-full w-[600px] space-y-4 overflow-auto">
              <SheetHeader>
                <SheetTitle className="text-3xl">
                  Invoice {invoice.invoice_id}
                </SheetTitle>
                <SheetDescription className="text-md">
                  Issued on {format(invoice.created_at!, "yyyy MMM dd")} <br />
                  {format(invoice.created_at!, "hh:MM aaaa")}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 space-y-6 p-4 md:p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-2xl font-semibold">Vendor</h3>
                    <div className="grid gap-2 border-r text-sm">
                      <div>{invoice.users?.full_name}</div>
                      <div>{invoice.users?.address}</div>
                      <div>+977 {invoice.users?.phone_number}</div>
                      <div>{invoice.users?.email}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl font-semibold">Client</h3>
                    <div className="grid gap-2 text-sm">
                      <div>{invoice.customer?.users?.full_name}</div>
                      <div>{invoice.customer?.users?.address}</div>
                      <div>+977 {invoice.customer?.users?.phone_number}</div>
                      <div>{invoice.customer?.users?.email}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.order?.product?.map(
                        (item: Tables<"product"> | null) => {
                          const imageArr: any = item?.productImgs;
                          const imageUrl = imageArr[0].image;
                          const productCount = invoice.order?.product.filter(
                            (product) => product?.id === item?.id,
                          ).length;

                          const totalAmountAfterDiscount =
                            Number(productCount) * Number(item?.salesPrice) -
                            Number(productCount) *
                              Number(item?.salesPrice) *
                              (Number(item?.discount) / 100);
                          return (
                            <TableRow key={item?.id}>
                              <TableCell className="font-medium">
                                <div className="grid grid-cols-2 items-center">
                                  <div className="relative h-12 w-12">
                                    <Image
                                      src={imageUrl}
                                      alt={item?.name as string}
                                      fill
                                      priority
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="mb-1 text-[0.9rem] font-bold">
                                    {item?.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{productCount}</TableCell>
                              <TableCell>
                                {productCount! * Number(item?.salesPrice)}
                              </TableCell>
                              <TableCell>{item?.discount}%</TableCell>
                              <TableCell className="text-right">
                                {formatCurrencyToNPR(totalAmountAfterDiscount)}
                              </TableCell>
                            </TableRow>
                          );
                        },
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div />
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Subtotal</div>
                      <div> {formatCurrencyToNPR(revenueTotal!)}</div>
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
                      <div>{formatCurrencyToNPR(Number(totalAmount))}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={clsx(
                  "text-right text-sm underline underline-offset-8",
                )}
              >
                {dueAmount > 0 ? (
                  <div>
                    {formatCurrencyToNPR(dueAmount)}, due on{" "}
                    {format(invoice.dueDate!, "yyyy MMM dd")}
                  </div>
                ) : (
                  <div>
                    <div>Fully paid, print the receipt</div>
                  </div>
                )}
              </div>
              <SheetFooter className="flex justify-end gap-2">
                <Button variant="outline">Print</Button>
                {dueAmount > 0 && <Button>Pay Now</Button>}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      );
    },
  },
];
