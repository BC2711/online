import { Route, Routes } from "react-router-dom";
import Navigation from "../web/layout/Navigation";
import HomePage from "../web/Home";
import NewArrivals from "../web/NewArrivals";
import ProductListPage from "../web/ProductListPage";
import ShoppingCart from "../web/ShoppingCart";
import CheckoutPage from "../web/CheckOutPage";
import { Footer } from "../web/Footer";

const PublicRoutes = () => {
    return (
        <>
            <Navigation />
            <div className="mt-10 pt-14">
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="newarrivals" element={<NewArrivals />} />
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="cart" element={<ShoppingCart />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default PublicRoutes;