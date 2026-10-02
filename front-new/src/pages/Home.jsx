import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import HomeServices from "@/components/HomeServices";
import HomeStats from "@/components/HomeStats";
import HomeTestimonials from "@/components/HomeTestimonials";
import Footer from "@/components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero
        image="image/Vclaire.jpg"
        title="Votre agence immobilière à Toliara"
        subtitle="Vente, location et gestion de biens immobiliers d'exception dans le Sud-Ouest de Madagascar"
      />
      <FeaturedProperties />
      <HomeServices />
      <HomeStats />
      <HomeTestimonials />
      <Footer />
    </>
  );
}

export default Home;
