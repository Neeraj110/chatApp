import { lazy, Suspense } from "react";
import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));
const Chat = lazy(() => import("./pages/Chat"));
const Landing = lazy(() => import("./pages/Landing"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user } = useSelector((state: RootState) => state.user);


  // const GoogleWrapper = () => {
  //   return (
  //     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  //       <LoginPage />
  //     </GoogleOAuthProvider>
  //   );
  // };

  return (

    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/chat" /> : <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <LoginPage />
            </GoogleOAuthProvider>}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/chat" /> : <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <RegisterPage />
            </GoogleOAuthProvider>}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense >
    </BrowserRouter >

  );
}

export default App;


const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
  </div>
);