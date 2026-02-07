"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowRight, ShoppingCart, ShieldCheck, Loader2 } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/actions/checkout"; 
import { getCustomerProfile } from "@/app/actions/customer"; 
import CustomerOnboardingModal from "../components/CustomerOnboardingModal"; 

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useCart(); 
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- FIX: CALCULATE SUBTOTAL LOCALLY (Safer) ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
  const tax = subtotal * 0.18; 
  const total = subtotal + tax;

  // --- HANDLE CHECKOUT LOGIC ---
  const handleCheckoutClick = async () => {
    if (!user || cart.length === 0) return;
    
    setIsCheckingOut(true);

    try {
      // 1. Get the Full Profile
      const profile = await getCustomerProfile(user.id);

      // 2. CASE: No Profile -> Show Registration
      if (!profile) {
        setIsCheckingOut(false);
        setShowOnboarding(true); 
        return;
      }

      // 3. CASE: Pending Approval
      if (profile.status === "PENDING") {
        setIsCheckingOut(false);
        alert("⚠️ Account Verification Pending\n\nYour registration has been submitted and is awaiting Admin approval.");
        return;
      }

      // 4. CASE: Rejected
      if (profile.status === "REJECTED") {
        setIsCheckingOut(false);
        alert("❌ Account Rejected\n\nPlease contact support.");
        return;
      }

      // 5. CASE: Approved -> ALLOW CHECKOUT
      if (profile.status === "APPROVED") {
        await proceedToOrder(profile);
      } else {
         setIsCheckingOut(false);
         alert(`Account Status: ${profile.status}\nPlease contact support.`);
      }

    } catch (error) {
      console.error("Profile check error:", error);
      setIsCheckingOut(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const proceedToOrder = async (profile: any) => {
     if (!user) return;
     
     try {
      // B. Prepare Cart Items
      const cartItemsForBackend = cart.map(item => ({
        productId: item.id,
        vendorId: item.vendorId || "",
        quantity: item.cartQuantity,
        price: item.price,
        // ✅ ADDED: Pass the snapshot details
        productName: item.name, 
        image: item.image || "" 
      }));

      // C. Construct REAL Address Object
      const addressData = {
        name: profile.fullName || user.fullName || "Valued Customer",
        street: profile.address,      
        city: profile.city,           
        state: profile.state,         
        postalCode: profile.postalCode,
        phone: profile.phone
      };

      // D. Place Order
      const result = await placeOrder(
        user.id, 
        cartItemsForBackend, 
        total, 
        addressData
      );

      if (result.success) {
        clearCart();
        router.push("/orders"); 
      } else {
        alert("Checkout Failed: " + result.error);
      }
    } catch (error) {
       console.error("Order placement error:", error);
       alert("Failed to place order.");
    } finally {
       setIsCheckingOut(false);
    }
  };

  const handleOnboardingSuccess = () => {
    setShowOnboarding(false);
    setIsCheckingOut(false);
    alert("✅ Registration Submitted Successfully!\n\nYour account is now pending Admin approval.");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
          <ShoppingCart size={64} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added any industrial supplies yet. Browse our catalog to find what you need.
        </p>
        <Link 
          href="/" 
          className="bg-[#00529b] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <CustomerOnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        onSuccess={handleOnboardingSuccess}
      />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingCart className="text-[#00529b]" /> Shopping Cart 
          <span className="text-lg font-normal text-gray-500">({cart.length} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT: CART ITEMS --- */}
          <div className="flex-1 flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
                
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={item.image || "https://placehold.co/200?text=No+Image"}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>

                {/* Details */}
                <div className="flex-1 w-full text-center md:text-left">
                  <Link href={`/product/${item.slug}`} className="font-bold text-lg text-gray-800 hover:text-[#00529b] hover:underline line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Vendor ID: {item.vendorId ? item.vendorId.slice(0, 8) : "N/A"}...</p>
                  <p className="font-bold text-[#00529b] mt-2">₹{item.price.toLocaleString("en-IN")}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => addToCart(item, -1)} 
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                      disabled={item.cartQuantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.cartQuantity}</span>
                    <button 
                      onClick={() => addToCart(item, 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded-md transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- RIGHT: ORDER SUMMARY --- */}
          <div className="w-full lg:w-96 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#00529b]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {isSignedIn ? (
                <button 
                  className="w-full bg-[#ffc20e] text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleCheckoutClick}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Processing...
                    </>
                  ) : (
                    <>
                      Place Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-md">
                    Sign in to Checkout
                  </button>
                </SignInButton>
              )}

              <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                <ShieldCheck className="text-green-600 flex-shrink-0" size={20} />
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Secure Checkout:</strong> Your payment information is processed securely. We do not store credit card details.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}