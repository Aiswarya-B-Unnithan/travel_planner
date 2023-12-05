import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import { useSelector } from "react-redux";


function Layout() {
  const user = useSelector((state) => state.user);
  console.log("user", user.user.token);
  const location = useLocation();
  return user?.user.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:id?" element={<ProfilePage />} />
        </Route>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
