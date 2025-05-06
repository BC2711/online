import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../admin/layout/Sidebar";
import { DashboardPage } from "../admin/layout/DashboardPage";
import HomePageAdmin from "../admin/pages/HomePage";
import AnalyticsPage from "../admin/pages/AnalyticsPage";
import CategoriesPage from "../admin/pages/CategoriesPage";
import AllProducts from "../admin/pages/products/AllProducts";
import InventoryPage from "../admin/pages/products/InventoryPage";
import ProductReviewPage from "../admin/pages/products/ProductReviewPage";
import LowStockAlertPage from "../admin/pages/products/LowStockAlertPage";
import AllOrdersPage from "../admin/pages/orders/AllOrdersPage";
import PendingOrdersPage from "../admin/pages/orders/PendingOrdersPage";
import CompletedOrdersPage from "../admin/pages/orders/CompletedOrdersPage";
import CancelledOrdersPage from "../admin/pages/orders/CancelledOrdersPage";
import ReturnsAndRefundsPage from "../admin/pages/orders/ReturnsAndRefundsPage";
import CustomerList from "../admin/pages/customers/CustomerList";
import CustomerGroups from "../admin/pages/customers/CustomerGroups";
import LoyaltyProgram from "../admin/pages/customers/LoyaltyProgram";
import CustomerFeedback from "../admin/pages/customers/CustomerFeedback";
import Promotions from "../admin/pages/marketing/Promotions";
import StaffAccounts from "../admin/pages/settings/StaffAccounts";
import TaxSettings from "../admin/pages/settings/TaxSettings";
import ShippingOptions from "../admin/pages/settings/ShippingOptions";
import PaymentMethods from "../admin/pages/settings/PaymentMethods";
import StoreSettings from "../admin/pages/settings/StoreSettings";
import TaxReports from "../admin/pages/reports/TaxReports";
import ChannelPayments from "../admin/pages/reports/ChannelPayments";
import InventoryReports from "../admin/pages/reports/InventoryReports";
import CustomerReports from "../admin/pages/reports/CustomerReports";
import SalesReports from "../admin/pages/reports/SalesReports";
import AffiliateProgram from "../admin/pages/marketing/AffiliateProgram";
import SocialMedia from "../admin/pages/marketing/SocialMedia";
import EmailCampaigns from "../admin/pages/marketing/EmailCampaigns";
import DiscountCoupons from "../admin/pages/marketing/DiscountCoupons";
import { useAuth } from "../../context/AuthContext";

const AdminRoutes = () => {
    const { authToken } = useAuth();
    if (!authToken) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <Sidebar>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route index element={<DashboardPage />} />
                        <Route path="home" element={<HomePageAdmin />} />
                        <Route path="analytics" element={<AnalyticsPage />} />

                        {/* Categories */}
                        <Route path="category/all-categories" element={<CategoriesPage />} />

                        {/* Products */}
                        <Route path="products/all-products" element={<AllProducts />} />
                        <Route path="products/inventory" element={<InventoryPage />} />
                        <Route path="products/review" element={<ProductReviewPage />} />
                        <Route path="products/low-stock-alert" element={<LowStockAlertPage />} />

                        {/* Orders */}
                        <Route path="orders/all-orders" element={<AllOrdersPage />} />
                        <Route path="orders/pending" element={<PendingOrdersPage />} />
                        <Route path="orders/completed" element={<CompletedOrdersPage />} />
                        <Route path="orders/cancelled" element={<CancelledOrdersPage />} />
                        <Route path="orders/returns-and-refunds" element={<ReturnsAndRefundsPage />} />

                        {/* Customers */}
                        <Route path="customers" element={<CustomerList />} />
                        <Route path="customers/customer-groups" element={<CustomerGroups />} />
                        <Route path="customers/loyalty-program" element={<LoyaltyProgram />} />
                        <Route path="customers/customer-feedback" element={<CustomerFeedback />} />

                        {/* Marketing */}
                        <Route path="marketing/promotions" element={<Promotions />} />
                        <Route path="marketing/discount-coupons" element={<DiscountCoupons />} />
                        <Route path="marketing/email-campaigns" element={<EmailCampaigns />} />
                        <Route path="marketing/social-media" element={<SocialMedia />} />
                        <Route path="marketing/affiliate-program" element={<AffiliateProgram />} />

                        {/* Reports */}
                        <Route path="reports/sales-reports" element={<SalesReports />} />
                        <Route path="reports/customer-reports" element={<CustomerReports />} />
                        <Route path="reports/inventory-reports" element={<InventoryReports />} />
                        <Route path="reports/channelpayment-reports" element={<ChannelPayments />} />
                        <Route path="reports/tax-reports" element={<TaxReports />} />

                        {/* Settings */}
                        <Route path="settings/store" element={<StoreSettings />} />
                        <Route path="settings/payment-method" element={<PaymentMethods />} />
                        <Route path="settings/shipping-options" element={<ShippingOptions />} />
                        <Route path="settings/tax" element={<TaxSettings />} />
                        <Route path="settings/staff" element={<StaffAccounts />} />
                    </Routes>
                </div>
            </main>
        </Sidebar>
    );
};

export default AdminRoutes;