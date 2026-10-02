import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyList from "@/components/PropertyList";

function Avendre() {
  return (
    <>
      <Navbar />
      <PropertyList
        actionType="sale"
        title="Biens à vendre"
        description="Découvrez notre sélection de maisons, villas et terrains à vendre à Toliara et ses environs"
      />
      <Footer />
    </>
  );
}

export default Avendre;
