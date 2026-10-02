import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyList from "@/components/PropertyList";
import { useSearchParams } from "react-router-dom";

function Recherche() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  return (
    <>
      <Navbar />
      <PropertyList
        title={`Résultats pour "${search}"`}
        description="Voici les biens correspondants à votre recherche."
      />
      <Footer />
    </>
  );
}

export default Recherche;
