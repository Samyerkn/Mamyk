import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import HelpRequestFeed from "./pages/HelpRequestFeed";
import HelpRequestForm from "./pages/HelpRequestForm";
import RequestDetail from "./pages/RequestDetail";
import MyHelpRequests from "./pages/MyHelpRequests";
import SponsorHistory from "./pages/SponsorHistory";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* Авторизация */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Профиль */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Каталог */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />

        {/* Заказы */}
        <Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  }
/>

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Помощь детям */}
        <Route path="/requests" element={<HelpRequestFeed />} />

        <Route
          path="/requests/new"
          element={
            <ProtectedRoute>
              <HelpRequestForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests/me"
          element={
            <ProtectedRoute>
              <MyHelpRequests />
            </ProtectedRoute>
          }
        />

        <Route path="/requests/:id" element={<RequestDetail />} />

        <Route
          path="/donations/history"
          element={
            <ProtectedRoute>
              <SponsorHistory />
            </ProtectedRoute>
          }
        />

        {/* Все остальные страницы */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;