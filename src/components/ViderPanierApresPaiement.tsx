"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ViderPanierApresPaiement() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const [verifie, setVerifie] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    // Vérifie auprès de Stripe que le paiement est bien confirmé avant de vider
    fetch(`/api/checkout/verifier?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.paye) {
          clearCart();
        }
        setVerifie(true);
      })
      .catch(() => setVerifie(true));
  }, [searchParams, clearCart]);

  return null;
}