import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.jsx";
import NavbarContainer from "./components/navbar block/NavbarContainer.jsx";
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router}>
      <NavbarContainer />
      <App />
    </RouterProvider>
  </AuthProvider>
);
