import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Product from "../pages/Product";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";

import HelpRequestFeed from "../pages/HelpRequestFeed";
import HelpRequestForm from "../pages/HelpRequestForm";
import RequestDetail from "../pages/RequestDetail";
import MyHelpRequests from "../pages/MyHelpRequests";
import SponsorHistory from "../pages/SponsorHistory";

import NewsFeed from "../pages/NewsFeed";
import NewsDetail from "../pages/NewsDetail";
function AppRouter() {
    return (
        <BrowserRouter>
<Routes>
  <Route path="/" element={<Home />} />

  <Route path="/catalog" element={<Catalog />} />
  <Route path="/product/:id" element={<Product />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<MyOrders />} />

  <Route path="/requests" element={<HelpRequestFeed />} />
  <Route path="/requests/new" element={<HelpRequestForm />} />
  <Route path="/requests/me" element={<MyHelpRequests />} />
  <Route path="/requests/:id" element={<RequestDetail />} />

  <Route path="/donations/history" element={<SponsorHistory />} />

  <Route path="/news" element={<NewsFeed />} />
  <Route path="/news/:id" element={<NewsDetail />} />
</Routes>
        </BrowserRouter>
    );
}

export default AppRouter;