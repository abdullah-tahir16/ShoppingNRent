import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/components/layout/AppLayout";
import { AdminPage } from "../pages/AdminPage";
import { JourneyPage } from "../pages/JourneyPage";
import { MarketplacePage } from "../pages/MarketplacePage";
import { OrdersPage } from "../pages/OrdersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SellerStudioPage } from "../pages/SellerStudioPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <JourneyPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "studio", element: <SellerStudioPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
