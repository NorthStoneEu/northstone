import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import DropHero from "@/components/DropHero";
import Hero from "@/components/Hero";
import Reassurance from "@/components/Reassurance";
import Universes from "@/components/Universes";
import Nouveautes from "@/components/Nouveautes";
import TriangulationTeaser from "@/components/TriangulationTeaser";
import Footer from "@/components/Footer";

// ⚠️ INTERRUPTEUR DROP : passe à `true` quand un drop est annoncé, `false` sinon
const DROP_ACTIF = true;

export default function HomePage() {
  return (
    <>
      <Header />
      <AnnouncementBar />
      {DROP_ACTIF && <DropHero />}
      <Hero />
      <Reassurance />
      <Universes />
      <Nouveautes />
      <TriangulationTeaser />
      <Footer />
    </>
  );
}