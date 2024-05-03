import { BoxIcon, ListFilter, ReceiptText, WalletMinimal } from "lucide-react";
export const DEBOUNCE_DELAY = 1000;
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
        name: "Category",
        link: "/vendor/category",
        icon: ListFilter,
        sub: [],
      },
      {
        id: 3,
        name: "Order",
        link: "/vendor/order",
        icon: WalletMinimal,
        sub: [],
      },
      {
        id: 4,
        name: "Invoice",
        link: "/vendor/invoice",
        icon: ReceiptText,
        sub: [],
      },
    ],
  },
];
