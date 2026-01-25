// src/pages/CartRouter.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CartView from "./CartView";
import CheckoutView from "./CheckoutView";

import {
  createPublicOrder,
  createUserOrder,
  initPaystack,
  initPaystackGuest,
} from "../services/orderService";

import { toast } from "sonner";

const getId = (i) => i?._id || i?.id || i?.__cartId;

function CartRouter() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [view, setView] = useState("cart"); // "cart" | "checkout" | "completed"
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const read = () => {
      const saved = localStorage.getItem("wyvadot_cart");
      if (!saved) return setCart([]);
      try {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        localStorage.removeItem("wyvadot_cart");
        setCart([]);
      }
    };

    read();
    const onUpdated = () => read();
    window.addEventListener("wyvadot_cart_updated", onUpdated);

    const onStorage = (e) => {
      if (e.key === "wyvadot_cart") read();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("wyvadot_cart_updated", onUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persistCart = (next) => {
    setCart(next);
    localStorage.setItem("wyvadot_cart", JSON.stringify(next));
    window.dispatchEvent(new Event("wyvadot_cart_updated"));
  };

  const updateQuantity = (id, newQty) => {
    const desired = Number(newQty || 0);
    if (desired < 1) return;

    const next = cart.map((item) => {
      const itemId = getId(item);
      if (itemId !== id) return item;

      const stockQty = Number(item?.stockQuantity ?? 0);
      if (stockQty && desired > stockQty) {
        toast.error(`Only ${stockQty} left in stock`);
        return { ...item, quantity: stockQty };
      }

      return { ...item, quantity: desired };
    });

    persistCart(next);
  };

  const removeFromCart = (id) => {
    const next = cart.filter((item) => getId(item) !== id);
    persistCart(next);
    toast.success("Removed from cart");
  };

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [cart],
  );

  const shipping = 2000;
  const total = subtotal + shipping;

  const handleCompleteOrder = async ({ contact, address, paymentMethod }) => {
    try {
      const payload = {
        customer: {
          fullName: `${contact.firstName} ${contact.lastName}`.trim(),
          email: contact.email,
          phone: contact.phone,
        },
        shippingAddress: {
          street: address.street,
          country: address.country,
          city: address.city,
          state: address.state,
          zip: address.zip,
        },
        items: cart.map((i) => ({
          productId: i._id || i.id || i.__cartId,
          name: i.name,
          price: Number(i.price || 0),
          quantity: Number(i.quantity || 1),
          image: i.image || i?.images?.[0]?.url || "",
          category: i.category || "Uncategorized",
        })),
        totals: { subtotal, shipping, total, currency: "NGN" },
        paymentMethod, // "card" | "bank"
      };

      // 1) Create order
      const orderRes = isLoggedIn
        ? await createUserOrder(payload, token)
        : await createPublicOrder(payload);

      const createdOrder = orderRes.data || orderRes;
      const orderId = createdOrder.orderId;

      if (!orderId) throw new Error("Order created but orderId missing");

      // 2) Init Paystack (guest must send email)
      const initRes = isLoggedIn
        ? await initPaystack({ orderId, paymentMethod }, token)
        : await initPaystackGuest({
            orderId,
            paymentMethod,
            email: contact.email,
          });

      const url = initRes.authorization_url;
      if (!url) throw new Error("Paystack authorization_url missing");

      // 3) Redirect to Paystack
      window.location.href = url;
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    }
  };

  if (view === "cart") {
    return (
      <CartView
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onProceedToCheckout={() => setView("checkout")}
      />
    );
  }

  if (view === "checkout") {
    return (
      <CheckoutView
        cart={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        updateQuantity={updateQuantity}
        onCompleteOrder={handleCompleteOrder}
      />
    );
  }


  return null;
}

export default CartRouter;
