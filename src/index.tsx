import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import path from "path";
import Login from "./compoonents/Login";
import Signup from "./compoonents/Signup";
import Redirecter from "./compoonents/Redirecter";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Redirecter />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/user/:email",
    element: <App />,
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
