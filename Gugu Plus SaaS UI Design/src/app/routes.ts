import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { ItemDetail } from "./components/ItemDetail";
import { NotificationSettings } from "./components/NotificationSettings";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "tracked-items", Component: Dashboard },
      { path: "item/:id", Component: ItemDetail },
      { path: "notifications", Component: NotificationSettings },
      { path: "settings", Component: NotificationSettings },
    ],
  },
]);