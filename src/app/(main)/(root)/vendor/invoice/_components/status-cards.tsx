import { Card } from "@/components/ui/card";
import { invoiceStatus } from "@/data/constant";
import { formatCurrencyToNPR } from "@/lib/currency-formatter";
import { filterInvoicesByStatus } from "@/lib/payment-status-checker";
import { InvoiceWithOrderUsersAndPayment } from "@/types";
import clsx from "clsx";
import {
  AlertCircle,
  Check,
  Clock,
  MailWarningIcon,
  Paperclip,
  Slash,
} from "lucide-react";

interface StatusCardsProps {
  invoices: InvoiceWithOrderUsersAndPayment[];
}

function computeTotal(arr: InvoiceWithOrderUsersAndPayment[]) {
  const total = arr.reduce((acc, curr) => acc + curr.amount!, 0);
  return {
    number: arr.length,
    total,
  };
}

export default function StatusCards({ invoices }: StatusCardsProps) {
  const computation = invoiceStatus.map((status) => {
    return filterInvoicesByStatus(invoices, status.toUpperCase());
  });

  console.log(computation);
  const [_, paid, pending, overdue, overpaid, canceled] = computation;

  const totalPaid = { type: "paid", ...computeTotal(paid) };
  const totalPending = { type: "pending", ...computeTotal(pending) };
  const totalOverdue = { type: "overdue", ...computeTotal(overdue) };
  const totalOverpaid = { type: "overpaid", ...computeTotal(overpaid) };
  const totalCanceled = { type: "canceled", ...computeTotal(canceled) };

  const allCards = [
    totalPaid,
    totalPending,
    totalOverdue,
    totalOverpaid,
    totalCanceled,
  ];

  //   Total invoices and revenue excluding canceled invoices
  const totalInvoices = allCards.reduce((acc, card) => {
    if (card.type === "canceled") {
      return acc;
    } else {
      return acc + card.number;
    }
  }, 0);
  const totalRevenue = allCards.reduce((acc, card) => {
    if (card.type === "canceled") {
      return acc;
    } else {
      return acc + card.total;
    }
  }, 0);

  const showCards = [
    { type: "total", number: totalInvoices, total: totalRevenue }, // total
    totalPaid,
    totalPending,
  ];

  return (
    <section className="w-full">
      <div className="flex gap-4 overflow-x-auto p-4 md:px-0">
        {showCards.map((card, i) => (
          <Card
            key={i}
            className="w-[350px] flex-shrink-0 overflow-hidden rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={clsx("rounded-full p-3 shadow-md", {
                  "text-orange-600": card.type === "pending",
                  "text-red-600": card.type === "overdue",
                  "text-green-600": card.type === "paid",
                  "text-blue-600": card.type === "overpaid",
                  "bg-red-700 text-white": card.type === "canceled",
                })}
              >
                {card.type === "total" && <Paperclip />}
                {card.type === "pending" && <Clock />}
                {card.type === "overdue" && <AlertCircle />}
                {card.type === "paid" && <Check />}
                {card.type === "overpaid" && <MailWarningIcon />}
                {card.type === "canceled" && <Slash />}
              </div>
              <div>
                <div className="text-muted-foreground">
                  {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                </div>
                <div className="text-[1.2rem] font-semibold">
                  {formatCurrencyToNPR(card.total)}
                </div>
                <div className="text-sm text-muted-foreground">
                  from {card.number} {card.number > 1 ? "invoices" : "invoice"}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
