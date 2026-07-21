import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Home />} />

        {/* Авторизация */}
        <Route path="/login" element={<Login />} />

        {/* Регистрация */}
        <Route path="/register" element={<Register />} />

        {/* Личный кабинет — только для авторизованных */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Все неизвестные страницы */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
