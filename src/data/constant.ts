import { BoxIcon, ListFilter, ReceiptText, WalletMinimal } from "lucide-react";
export const DEBOUNCE_DELAY = 1000;
export const navItemsAdmin = [
  {
    title: "Management",
    list: [
      {
        id: 1,
        name: "Product",
        link: "/admin/product",
        icon: BoxIcon,
        sub: [
          {
            id: 1,
            name: "Create",
            link: "/admin/product/create",
          },
          {
            id: 2,
            name: "List",
            link: "/admin/product/list",
          },
        ],
      },
      {
        id: 2,
        name: "Category",
        link: "/admin/category",
        icon: ListFilter,
        sub: [],
      },
      {
        id: 3,
        name: "Order",
        link: "/admin/order",
        icon: WalletMinimal,
        sub: [],
      },
      {
        id: 4,
        name: "Invoice",
        link: "/admin/invoice",
        icon: ReceiptText,
        sub: [],
      },
    ],
  },
];
