import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Hero from "@/components/Hero";
import Reassurance from "@/components/Reassurance";
import Universes from "@/components/Universes";
import Nouveautes from "@/components/Nouveautes";
import TriangulationTeaser from "@/components/TriangulationTeaser";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <AnnouncementBar />
      <Hero />
      <Reassurance />
      <Universes />
      <Nouveautes />
      <TriangulationTeaser />
      <Footer />
    </>
  );
}