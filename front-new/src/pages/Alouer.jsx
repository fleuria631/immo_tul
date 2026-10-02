import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyList from "@/components/PropertyList";

function Alouer() {
  return (
    <>
      <Navbar />
      <PropertyList
        actionType="rent"
        title="Biens à louer"
        description="Trouvez votre location idéale parmi nos appartements, maisons et villas à Toliara"
      />
      <Footer />
    </>
  );
}

export default Alouer;
