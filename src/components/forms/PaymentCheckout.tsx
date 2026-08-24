"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";
import { RegistrationSuccess } from "./RegistrationSuccess";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string; prefill?: { email?: string };
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayHandlerResponse {
  razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string;
}
interface RazorpayInstance { open: () => void; on: (event: string, handler: (r: unknown) => void) => void; }

interface PaymentCheckoutProps {
  tournamentId: string; tournamentName: string; entryFee: number;
}

type FlowState = "idle" | "creating-order" | "paid" | "error";

export function PaymentCheckout({ tournamentId, tournamentName, entryFee }: PaymentCheckoutProps) {
  const router = useRouter();
  const supabase = createClient();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [state, setState] = useState<FlowState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push(`/login?next=/tournaments/${tournamentId}`); return; }
    if (!scriptLoaded || !window.Razorpay) { setError("Payment gateway is still loading — try again in a moment."); return; }

    setState("creating-order");
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start checkout");

      const rzp = new window.Razorpay({
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: "ProCEZ", description: data.tournamentName, order_id: data.razorpayOrderId,
        prefill: { email: data.userEmail }, theme: { color: "#4f46e5" },
        handler: () => { setOrderId(data.orderId); setState("paid"); },
        modal: { ondismiss: () => setState("idle") },
      });
      rzp.on("payment.failed", () => { setError("Payment failed or was declined. You can try again."); setState("error"); });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "paid" && orderId) {
    return <RegistrationSuccess orderId={orderId} tournamentName={tournamentName} />;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptLoaded(true)} />
      <NeonButton onClick={handleRegister} loading={state === "creating-order"} className="w-full">
        {entryFee > 0 ? `Register & Pay ₹${entryFee}` : "Register — Free Entry"}
      </NeonButton>
      {error && (
        <p className="text-red-600 text-sm neu-inset rounded-xl px-3 py-2 mt-3 bg-[#e0e5eb]">{error}</p>
      )}
    </>
  );
}
