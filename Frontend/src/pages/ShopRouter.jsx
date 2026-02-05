// src/pages/ShopRouter.jsx
// ✅ UPDATED: Detects route and passes prop to child components

import React from "react";
import { useLocation } from "react-router-dom";
import GuestShop from "./GuestShop";
import UserShop from "./user/UserShop";

export default function ShopRouter() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const location = useLocation();
  
  // ✅ Determine which view based on route
  // /shop → listing
  // /product/:id → product detail
  const isProductDetailRoute = location.pathname.startsWith("/product/");
  
  return isLoggedIn ? (
    <UserShop isProductDetailRoute={isProductDetailRoute} />
  ) : (
    <GuestShop isProductDetailRoute={isProductDetailRoute} />
  );
}