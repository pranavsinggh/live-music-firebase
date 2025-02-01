import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import NavbarContainer from "./components/navbar block/NavbarContainer.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import router from "./routes/Routes.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
      <RouterProvider router={router}>
        <NavbarContainer />
        <App />
      </RouterProvider>
  </AuthProvider>
);
