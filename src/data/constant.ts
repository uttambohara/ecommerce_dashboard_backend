import { BoxIcon, ReceiptText, WalletMinimal } from "lucide-react";

export const DEBOUNCE_DELAY = 500;
export const SHIPPING_CHARGE = 100;
export const TAXES = 10;

export const invoiceStatus = [
  "All",
  "Paid",
  "Pending",
  "Overdue",
  "Overpaid",
  "Canceled",
];
export const status = ["All", "Pending", "Rejected", "Canceled", "Completed"];
export const navItemsVendor = [
  {
    title: "Management",
    list: [
      {
        id: 1,
        name: "Product",
        link: "/vendor/product",
        icon: BoxIcon,
        sub: [
          {
            id: 1,
            name: "Create",
            link: "/vendor/product/create",
          },
          {
            id: 2,
            name: "List",
            link: "/vendor/product/list",
          },
        ],
      },
      {
        id: 2,
        name: "Order",
        link: "/vendor/order",
        icon: WalletMinimal,
        sub: [],
      },
      {
        id: 3,
        name: "Invoice",
        link: "/vendor/invoice",
        icon: ReceiptText,
        sub: [],
      },
    ],
  },
];
