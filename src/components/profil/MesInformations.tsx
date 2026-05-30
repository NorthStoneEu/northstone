"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getProfile, upsertProfile } from "@/lib/profile";
import PhoneInput from "./PhoneInput";

export default function MesInformations() {
  const { user, isLoaded } = useUser();
  const [civility, setCivility] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const clerkUserId = user?.id || "";

  useEffect(() => {
    if (!isLoaded || !clerkUserId) return;
    let mounted = true;
    (async () => {
      try {
        const p = await getProfile(clerkUserId);
        if (mounted && p) {
          setCivility(p.civility || "");
          setPhone(p.phone || "");
          setBirthday(p.birthday || "");
          setNewsletter(p.newsletter_opted_in || false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoaded, clerkUserId]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await upsertProfile({
        clerk_user_id: clerkUserId,
        civility: civility || null,
        phone: phone || null,
        birthday: birthday || null,
        newsletter_opted_in: newsletter,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Erreur lors de la sauvegarde.");
    }
    setSaving(false);
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6B6B6B",
    marginBottom: "6px",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(26,35,50,0.18)",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "14px",
    color: "#1A2332",
    outline: "none",
    backgroundColor: "#fff",
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#6B6B6B" }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "520px" }}>
      <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1A2332", marginBottom: "4px" }}>
        Mes informations
      </h1>
      <p style={{ fontSize: "13px", color: "#6B6B6B", marginBottom: "28px" }}>
        Complétez votre profil personnel.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Civilité */}
        <div>
          <label style={labelStyle}>Civilité</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {["Madame", "Monsieur", "Autre"].map((c) => (
              <button
                key={c}
                onClick={() => setCivility(c)}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: civility === c ? "1px solid #B8985A" : "1px solid rgba(26,35,50,0.18)",
                  backgroundColor: civility === c ? "rgba(184,152,90,0.1)" : "#fff",
                  color: civility === c ? "#1A2332" : "#6B6B6B",
                  fontWeight: civility === c ? 600 : 400,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Téléphone international */}
        <div>
          <label style={labelStyle}>Téléphone</label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            placeholder="6 12 34 56 78"
          />
        </div>

        {/* Date de naissance */}
        <div>
          <label style={labelStyle}>Date de naissance</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            style={inputStyle}
          />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginTop: "6px", fontStyle: "italic" }}>
            Pour vous offrir une attention le jour J
          </p>
        </div>

        {/* Newsletter */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "#B8985A", marginTop: "2px" }}
          />
          <span style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.5 }}>
            Recevoir les actualités et drops Northstone en avant-première
          </span>
        </label>
      </div>

      <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "12px 28px",
            backgroundColor: "#1A2332",
            color: "#B8985A",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            border: "none",
            borderRadius: "6px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        {saved && (
          <span style={{ fontSize: "13px", color: "#B8985A", fontWeight: 500 }}>✓ Enregistré</span>
        )}
      </div>
    </div>
  );
}