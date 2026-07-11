import {BrowserRouter, Routes, Route } from "react-router-dom";
import Catalog from "../pages/Catalog";
import Product from "../pages/Product";
import Checkout from "../pages/Checkout";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;