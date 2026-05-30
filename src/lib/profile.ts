import { supabase } from "./supabase";

export type UserProfile = {
  id?: string;
  clerk_user_id: string;
  civility: string | null;
  phone: string | null;
  birthday: string | null;
  newsletter_opted_in: boolean;
};

export type UserAddress = {
  id?: string;
  clerk_user_id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  postal_code: string;
  city: string;
  country: string;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
};

// === PROFIL ===

export async function getProfile(clerkUserId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    console.error("getProfile error:", error);
    return null;
  }
  return data as UserProfile | null;
}

export async function upsertProfile(profile: UserProfile) {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        clerk_user_id: profile.clerk_user_id,
        civility: profile.civility,
        phone: profile.phone,
        birthday: profile.birthday || null,
        newsletter_opted_in: profile.newsletter_opted_in,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("upsertProfile error:", error);
    throw error;
  }
  return data;
}

// === ADRESSES ===

export async function getAddresses(clerkUserId: string) {
  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAddresses error:", error);
    return [];
  }
  return (data || []) as UserAddress[];
}

export async function addAddress(address: UserAddress) {
  const { data, error } = await supabase
    .from("user_addresses")
    .insert([address])
    .select()
    .single();

  if (error) {
    console.error("addAddress error:", error);
    throw error;
  }
  return data;
}

export async function updateAddress(id: string, address: Partial<UserAddress>) {
  const { data, error } = await supabase
    .from("user_addresses")
    .update(address)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateAddress error:", error);
    throw error;
  }
  return data;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteAddress error:", error);
    throw error;
  }
}