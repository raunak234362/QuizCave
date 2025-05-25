import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/routes.ts";
// import { ThemeProvider } from "@material-tailwind/react";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ThemeProvider> */}
      <RouterProvider router={router} />
    {/* </ThemeProvider> */}
  </StrictMode>
);
