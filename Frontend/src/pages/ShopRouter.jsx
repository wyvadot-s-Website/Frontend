// src/pages/ShopRouter.jsx
import React from "react";
import GuestShop from "./GuestShop";
import UserShop from "./user/UserShop";

export default function ShopRouter() {
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return isLoggedIn ? <UserShop /> : <GuestShop />;
}
