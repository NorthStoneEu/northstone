"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AddressAutocomplete from "./AddressAutocomplete";
import PhoneInput from "./PhoneInput";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  type UserAddress,
} from "@/lib/profile";

const emptyAddress = (clerkUserId: string): UserAddress => ({
  clerk_user_id: clerkUserId,
  label: "",
  first_name: "",
  last_name: "",
  address_line1: "",
  address_line2: "",
  postal_code: "",
  city: "",
  country: "France",
  phone: "",
  is_default_shipping: false,
  is_default_billing: false,
});

export default function MesAdresses() {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [editing, setEditing] = useState<UserAddress | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const clerkUserId = user?.id || "";

  useEffect(() => {
    if (!isLoaded || !clerkUserId) return;
    let mounted = true;
    (async () => {
      try {
        const a = await getAddresses(clerkUserId);
        if (mounted) setAddresses(a);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isLoaded, clerkUserId]);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) await updateAddress(editing.id, editing);
      else await addAddress(editing);
      setAddresses(await getAddresses(clerkUserId));
      setShowForm(false);
      setEditing(null);
    } catch {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette adresse ?")) return;
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
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
    boxSizing: "border-box",
  };
  const primaryBtn: React.CSSProperties = {
    padding: "12px 28px",
    backgroundColor: "#1A2332",
    color: "#B8985A",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 600,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };
  const secondaryBtn: React.CSSProperties = {
    padding: "12px 28px",
    backgroundColor: "transparent",
    color: "#1A2332",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 600,
    border: "1px solid rgba(26,35,50,0.2)",
    borderRadius: "6px",
    cursor: "pointer",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1A2332" }}>Mes adresses</h1>
        {!showForm && (
          <button
            onClick={() => { setEditing(emptyAddress(clerkUserId)); setShowForm(true); }}
            style={{ background: "none", border: "none", color: "#B8985A", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}
          >
            + Ajouter
          </button>
        )}
      </div>
      <p style={{ fontSize: "13px", color: "#6B6B6B", marginBottom: "28px" }}>
        Vos adresses de livraison et de facturation.
      </p>

      {!showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {addresses.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed rgba(26,35,50,0.18)", borderRadius: "6px" }}>
              <p style={{ fontSize: "13px", color: "#9B9B9B", fontStyle: "italic" }}>Aucune adresse enregistrée.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} style={{ border: "1px solid rgba(26,35,50,0.15)", borderRadius: "6px", padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                  <div>
                    {addr.label && (
                      <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8985A", marginBottom: "6px", fontWeight: 600 }}>{addr.label}</p>
                    )}
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A2332" }}>{addr.first_name} {addr.last_name}</p>
                    <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "4px", lineHeight: 1.5 }}>
                      {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}<br />
                      {addr.postal_code} {addr.city}, {addr.country}
                    </p>
                    {addr.phone && <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "2px" }}>{addr.phone}</p>}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                      {addr.is_default_shipping && <span style={{ fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase", backgroundColor: "rgba(184,152,90,0.1)", color: "#B8985A", padding: "3px 8px", borderRadius: "4px" }}>Livraison</span>}
                      {addr.is_default_billing && <span style={{ fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase", backgroundColor: "rgba(26,35,50,0.08)", color: "#1A2332", padding: "3px 8px", borderRadius: "4px" }}>Facturation</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "right", flexShrink: 0 }}>
                    <button onClick={() => { setEditing(addr); setShowForm(true); }} style={{ background: "none", border: "none", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6B6B", cursor: "pointer" }}>Modifier</button>
                    <button onClick={() => addr.id && handleDelete(addr.id)} style={{ background: "none", border: "none", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B6B6B", cursor: "pointer" }}>Supprimer</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#B8985A", fontWeight: 600 }}>
            {editing.id ? "Modifier l'adresse" : "Nouvelle adresse"}
          </p>

          <div>
            <label style={labelStyle}>Libellé</label>
            <input type="text" value={editing.label || ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="Domicile, Bureau..." style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={labelStyle}>Prénom *</label><input type="text" value={editing.first_name} onChange={(e) => setEditing({ ...editing, first_name: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Nom *</label><input type="text" value={editing.last_name} onChange={(e) => setEditing({ ...editing, last_name: e.target.value })} style={inputStyle} /></div>
          </div>

          <div>
            <label style={labelStyle}>Adresse *</label>
            <AddressAutocomplete
              value={editing.address_line1}
              onChange={(v) => setEditing({ ...editing, address_line1: v })}
              onSelect={({ line1, postal_code, city }) =>
                setEditing({
                  ...editing,
                  address_line1: line1,
                  postal_code,
                  city,
                  country: "France",
                })
              }
              placeholder="Commencez à taper votre adresse..."
              style={inputStyle}
            />
          </div>
          <div><label style={labelStyle}>Complément</label><input type="text" value={editing.address_line2 || ""} onChange={(e) => setEditing({ ...editing, address_line2: e.target.value })} placeholder="Appartement, étage..." style={inputStyle} /></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={labelStyle}>Code postal *</label><input type="text" value={editing.postal_code} onChange={(e) => setEditing({ ...editing, postal_code: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>Ville *</label><input type="text" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} style={inputStyle} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={labelStyle}>Pays</label><input type="text" value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} style={inputStyle} /></div>
            <div>
                      <label style={labelStyle}>Téléphone</label>
                      <PhoneInput
                        value={editing.phone || ""}
                        onChange={(v) => setEditing({ ...editing, phone: v })}
                        placeholder="6 12 34 56 78"
                      />
                    </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={editing.is_default_shipping} onChange={(e) => setEditing({ ...editing, is_default_shipping: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "#B8985A" }} />
              <span style={{ fontSize: "13px", color: "#6B6B6B" }}>Adresse de livraison par défaut</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={editing.is_default_billing} onChange={(e) => setEditing({ ...editing, is_default_billing: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "#B8985A" }} />
              <span style={{ fontSize: "13px", color: "#6B6B6B" }}>Adresse de facturation par défaut</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button onClick={handleSave} style={primaryBtn}>Enregistrer</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} style={secondaryBtn}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}