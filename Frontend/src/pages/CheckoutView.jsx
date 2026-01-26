import React, { useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });



function CheckoutView({
  cart = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  onCompleteOrder,

  // OPTIONAL (recommended): allow qty edits directly in checkout summary
  updateQuantity,
}) {
  // -----------------------------
  // Form state (minimal + solid)
  // -----------------------------
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState({
    street: "",
    country: "Nigeria",
    city: "",
    state: "",
    zip: "",
    differentBilling: false,
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "bank"
  const [coupon, setCoupon] = useState("");

  // If you later want coupon logic: apply discount here (server-validated)
  const discount = 0;

  const computedSubtotal = useMemo(() => Number(subtotal || 0), [subtotal]);
  const computedShipping = useMemo(() => Number(shipping || 0), [shipping]);
  const computedTotal = useMemo(() => {
    // prefer parent total if it’s correct; otherwise compute
    const t = Number(total || 0);
    const calc = computedSubtotal + computedShipping - discount;
    return t > 0 ? t : calc;
  }, [total, computedSubtotal, computedShipping, discount]);

  const handleApplyCoupon = () => {
    // UI only for now. Real coupon must be validated on backend.
    // You can toast here if you want, but keeping clean.
  };

  const handlePlaceOrder = () => {
    // Minimal validation
    if (!contact.firstName || !contact.lastName || !contact.phone || !contact.email) {
      return alert("Please fill your contact information.");
    }
    if (!address.street || !address.city || !address.state) {
      return alert("Please fill your shipping address.");
    }
    if (!cart.length) return alert("Your cart is empty.");

    // Send payload to parent (and later backend)
    onCompleteOrder?.({
      contact,
      address,
      paymentMethod,
      coupon,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-center mb-4">Check Out</h1>

          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span className="text-green-600">Shopping cart</span>
            </div>

            <div className="h-0.5 w-20 bg-green-500" />

            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-gray-700 flex items-center justify-center text-xs">
                2
              </span>
              <span className="text-green-500">Checkout details</span>
            </div>

            <div className="h-0.5 w-20 bg-gray-200" />

            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs">
                3
              </span>
              <span className="text-gray-500">Order complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">FIRST NAME</label>
                  <input
                    value={contact.firstName}
                    onChange={(e) => setContact((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">LAST NAME</label>
                  <input
                    value={contact.lastName}
                    onChange={(e) => setContact((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">PHONE NUMBER</label>
                  <input
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">EMAIL ADDRESS</label>
                  <input
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Your Email"
                    type="email"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">STREET ADDRESS</label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Street Address"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">COUNTRY</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm bg-white"
                  >
                    <option>Nigeria</option>
                    <option>United State</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">TOWN / CITY</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Town / City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">STATE</label>
                    <input
                      value={address.state}
                      onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ZIP CODE</label>
                    <input
                      value={address.zip}
                      onChange={(e) => setAddress((p) => ({ ...p, zip: e.target.value }))}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="Zip Code"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={address.differentBilling}
                    onChange={(e) =>
                      setAddress((p) => ({ ...p, differentBilling: e.target.checked }))
                    }
                  />
                  Use a different billing address (optional)
                </label>
              </div>
            </div>

            {/* Payment method */}
            
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Payment method</h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between gap-3 p-3 border rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span className="text-sm">Pay by Card (Credit)</span>
                  </div>
                  <span className="text-gray-400 text-xs">CARD</span>
                </label>

                <label className="flex items-center justify-between gap-3 p-3 border rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                    />
                    <span className="text-sm">Pay with Bank Transfer</span>
                  </div>
                  <span className="text-gray-400 text-xs">BANK</span>
                </label>
              </div>
            </div>
            

            {/* Place Order button (like screenshot bottom-left) */}
            <button
              onClick={handlePlaceOrder}
              disabled={!cart.length}
              className={`w-full py-3 rounded font-semibold ${
                !cart.length
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#FF8D28] text-white hover:bg-[#e67d1f]"
              }`}
            >
              Place Order
            </button>
          </div>

          {/* RIGHT: Order summary */}
          <div className="bg-white border rounded-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Order summary</h2>
              <span className="text-xs text-gray-500">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4 mb-4">
              {cart.map((item) => {
                const id = item._id || item.id;
                const img = item?.images?.[0]?.url || item?.image || "";
                const qty = Number(item.quantity || 1);

                return (
                  <div key={id} className="flex gap-3">
                    <div className="w-14 h-14 border rounded flex items-center justify-center bg-gray-50">
                      {img ? (
                        <img src={img} alt={item.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="text-[10px] text-gray-400">No image</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-4">{item.name}</p>

                      <div className="mt-2 inline-flex items-center border rounded overflow-hidden">
                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-gray-100"
                          onClick={() => updateQuantity?.(id, qty - 1)}
                          disabled={!updateQuantity}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-3 py-1 text-sm border-x">{qty}</span>

                        <button
                          type="button"
                          className="px-2 py-1 hover:bg-gray-100"
                          onClick={() => updateQuantity?.(id, qty + 1)}
                          disabled={!updateQuantity}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-semibold">
                      {formatMoney(Number(item.price || 0) * qty)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-4">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm"
                placeholder="Coupon code"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded bg-[#FF8D28] text-white text-sm font-semibold hover:bg-[#e67d1f]"
              >
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {computedShipping <= 0 ? "Free" : formatMoney(computedShipping)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatMoney(computedSubtotal)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold">{formatMoney(computedTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutView;
