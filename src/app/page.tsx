import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import DropHero from "@/components/DropHero";
import Hero from "@/components/Hero";
import Reassurance from "@/components/Reassurance";
import Universes from "@/components/Universes";
import Nouveautes from "@/components/Nouveautes";
import TriangulationTeaser from "@/components/TriangulationTeaser";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getDropAccueil() {
  // Le drop doit être actif ET visible sur l'accueil
  const { data } = await supabase
    .from("drops")
    .select("*")
    .eq("is_active", true)
    .eq("visible_accueil", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export default async function HomePage() {
  const drop = await getDropAccueil();

  return (
    <>
      <Header />
      <AnnouncementBar />
      {drop && (
        <DropHero
          sousTitre={drop.sous_titre || undefined}
          titrePrincipal={drop.titre_principal || undefined}
          description={drop.description || undefined}
          dateOuverture={drop.release_date || undefined}
          nbPieces={drop.total_pieces || undefined}
          imageUrl={drop.image_url || undefined}
          nomCourt={drop.name || undefined}
        />
      )}
      <Hero />
      <Reassurance />
      <Universes />
      <Nouveautes />
      <TriangulationTeaser />
      <Footer />
    </>
  );
}