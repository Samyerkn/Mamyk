import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalog from "../pages/Catalog";
import Product from "../pages/Product";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import HelpRequestFeed from "../pages/HelpRequestFeed";
import HelpRequestForm from "../pages/HelpRequestForm";
import RequestDetail from "../pages/RequestDetail";
import MyHelpRequests from "../pages/MyHelpRequests";
import SponsorHistory from "../pages/SponsorHistory";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/requests" element={<HelpRequestFeed />} />
                <Route path="/requests/new" element={<HelpRequestForm />} />
                <Route path="/requests/me" element={<MyHelpRequests />} />
                <Route path="/requests/:id" element={<RequestDetail />} />
                <Route path="/donations/history" element={<SponsorHistory />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;