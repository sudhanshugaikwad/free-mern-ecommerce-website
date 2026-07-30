import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { Button, Input } from "@base-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const {
    cart,
    addresses = [],
    selectedAddress,
  } = useSelector((store) => store.product || {});

  const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handeleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.5).toFixed(2));
  const total = subtotal + shipping + tax;

  // console.log(cart);

const handelePayment = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
      {
        products: cart?.items?.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR",
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!data.success) return toast.error("Something went wrong..!");

    console.log("Razorpay Data >> ", data);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ← MUST be Test Key (starts with rzp_test_)
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,
      name: "eKart",
      description: "Order Payment",
      image: "https://your-logo-url.com/logo.png", // optional

      // ========== THIS IS THE KEY PART FOR DUMMY PAYMENTS ==========
      handler: async function (response) {
        try {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            response,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (verifyRes.data.success) {
            toast.success("Payment Successful..!");
            dispatch(setCart({ items: [], totalPrice: 0 }));
            navigate("/order-success");
          } else {
            toast.error("Payment verification failed..!");
          }
        } catch (error) {
          toast.error("Error Verifying payment..!");
        }
      },

      // Force preferred methods (UPI on top)
      config: {
        display: {
          blocks: {
            banks: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi",
                },
              ],
            },
          },
          sequence: ["block.banks"], // UPI first
          preferences: {
            show_default_blocks: true, // still show Card, Netbanking, Wallet etc.
          },
        },
      },

      // Prefill
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },

      // Theme
      theme: {
        color: "#030712",
      },

      // Modal close handling (your existing logic)
      modal: {
        ondismiss: async function () {
          await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          toast.error("Payment Cancelled or Failed..!");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // Payment failed event (your existing logic)
    rzp.on("payment.failed", async function (response) {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
        {
          razorpay_order_id: data.order.id,
          paymentFailed: true,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.error("Payment Failed please try again..!");
    });

    rzp.open();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while processing payment..!");
  }
};



  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 sm:px-8 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Address
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your delivery details below
              </p>
            </div>

            {/* Main Content - stacks on mobile, side-by-side on lg+ */}
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Form / Saved Addresses */}
              <div className="flex-1 p-5 sm:p-8">
                {showForm ? (
                  <div className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="fullName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="Sudhanshu Gaikwad"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                      />
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          required
                          placeholder="1234567890"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          required
                          placeholder="sudhanshug@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-700"
                      >
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        placeholder="House No. 1313, Street Name"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                      />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="city"
                          className="text-sm font-medium text-gray-700"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          placeholder="Pune, Mumbai"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="state"
                          className="text-sm font-medium text-gray-700"
                        >
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          placeholder="Maharashtra"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Zip + Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="zip"
                          className="text-sm font-medium text-gray-700"
                        >
                          Zip / Pin Code
                        </Label>
                        <Input
                          id="zip"
                          name="zip"
                          required
                          placeholder="411001"
                          value={formData.zip}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium text-gray-700"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          required
                          placeholder="India"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full h-11 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        onClick={handeleSave}
                        className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded transition-colors"
                      >
                        Save & Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Saved Addresses
                    </h2>

                    <div className="space-y-3">
                      {addresses.map((addr, index) => (
                        <div
                          key={index}
                          onClick={() => dispatch(setSelectedAddress(index))}
                          className={`relative p-4 rounded-md border-2 cursor-pointer transition-all ${
                            selectedAddress === index
                              ? "border-gray-900 bg-gray-100"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="pr-16">
                            <p className="font-medium text-gray-900">
                              {addr.fullName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.email}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.address}, {addr.city}, {addr.state},{" "}
                              {addr.zip}, {addr.country}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteAddress(index));
                            }}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      ))}

                      <hr className="my-4" />

                      <Button
                        variant="outline"
                        className="w-full cursor-pointer rounded"
                        onClick={() => setShowForm(true)}
                      >
                        + Add New Address
                      </Button>

                      <Button
                        disabled={selectedAddress === null}
                        onClick={handelePayment}
                        className="mt-2 w-full rounded bg-black hover:bg-gray-950 p-2 text-white cursor-pointer"
                      >
                        Proceed To Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Order Summary */}
              <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-100 ">
                <div className="p-6 sm:p-7">
                  <Card className="border-0 shadow-none bg-transparent p-5">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        Order Summary
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-0 space-y-4">
                      {/* Subtotal */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal ({cart.items.length} items)</span>
                        <span className="font-medium text-gray-900">
                          ₹ {subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Shipping */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="font-medium text-gray-900">
                          ₹ {shipping}
                        </span>
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span className="font-medium text-gray-900">
                          ₹ {tax}
                        </span>
                      </div>

                      <Separator className="my-1" />

                      {/* Total */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹ {total.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Notes */}
                      <div className="pt-4 space-y-1.5 border-t border-gray-200/70 mt-4">
                        <p className="text-xs text-gray-500">
                          * Free shipping on orders over ₹299
                        </p>
                        <p className="text-xs text-gray-500">
                          * 30-days return policy
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressForm;
