import type { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  {
    title: "Popular",
    path: "/popular?sort=popular",
  },
  {
    title: "Shop",
    path: "/shop",
  },

  {
    title: "Pages",
    submenu: [
      {
        title: "Shop without sidebar",
        path: "/shop-without-sidebar",
      },
      {
        title: "Checkout",
        path: "/checkout",
      },
      {
        title: "Cart",
        path: "/cart",
      },
      {
        title: "Wishlist",
        path: "/wishlist",
      },
      {
        title: "Sign in",
        path: "/signin",
      },
      {
        title: "Sign up",
        path: "/signup",
      },
      {
        title: "Error",
        path: "/error",
      },
      {
        title: "Mail Success",
        path: "/mail-success",
      },
      {
        title:"Privacy Policy",
        path:"/privacy-policy"
      },
      {
        title:"Terms & Conditions",
        path:"/terms-conditions"
      }
    ],
  },
  {
    title: "Blog",
    submenu: [
      {
        title: "Blog Grid with Sidebar",
        path: "/blogs/blog-grid-with-sidebar",
      },
      {
        title: "Blog Grid",
        path: "/blogs/blog-grid",
      },
      {
        title: "Blog details with sidebar",
        path: "/blogs/blog-details-with-sidebar",
      },
      {
        title: "Blog Details",
        path: "/blogs/blog-details",
      },
    ],
  },
  {
    title: "Contact",
    path: "/contact",
  },
];
