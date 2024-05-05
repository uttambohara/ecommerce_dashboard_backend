import { InvoiceWithOrderUsersAndPayment } from "@/types";

// Function to filter invoices based on search parameter

export function filterInvoicesByStatus(
  invoice: InvoiceWithOrderUsersAndPayment[],
  status: string,
) {
  return invoice.filter(
    (invoice) => calculatePaymentStatus(invoice) === status.toLowerCase(),
  );
}

export function calculatePaymentStatus(
  invoice: InvoiceWithOrderUsersAndPayment,
) {
  const totalPaid = invoice.payment.reduce((sum, payment) => {
    if (payment?.status !== "CANCELED") {
      return sum + payment?.amount!;
    }
    return sum; // Exclude canceled payments from total
  }, 0);

  if (invoice.payment.some((payment) => payment?.status === "CANCELED")) {
    return "canceled";
  } else if (totalPaid > invoice.amount!) {
    return "overpaid";
  } else if (totalPaid === invoice.amount) {
    return "paid";
  } else if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
    return "overdue";
  } else {
    return "pending";
  }
}
