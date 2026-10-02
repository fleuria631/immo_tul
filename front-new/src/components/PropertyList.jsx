import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, Home } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicProperties } from "@/services/api";

const PropertyList = ({ actionType, title, description }) => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    priceMin: "",
    priceMax: "",
    location: "",
    beds: "",
    area: "",
  });

  useEffect(() => {
    getPublicProperties({ actionType, search }).then(data => {
      const fetched = data.properties || [];
      setProperties(fetched);
      setFilteredProperties(fetched);
    }).catch(console.error);
  }, [actionType, search]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (f) => {
    let filtered = properties.filter((property) => {
      if (f.type && property.type !== f.type) return false;
      if (f.priceMin && property.priceNumeric < parseInt(f.priceMin)) return false;
      if (f.priceMax && property.priceNumeric > parseInt(f.priceMax)) return false;
      if (f.location && !property.location.includes(f.location)) return false;
      if (f.beds && property.beds && parseInt(property.beds) < parseInt(f.beds)) return false;
      if (f.area && parseInt(property.area) < parseInt(f.area)) return false;
      return true;
    });
    setFilteredProperties(filtered);
  };

  const clearFilters = () => {
    const empty = { type: "", priceMin: "", priceMax: "", location: "", beds: "", area: "" };
    setFilters(empty);
    setFilteredProperties(properties);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sorted = [...filteredProperties];
    switch (sortType) {
      case "price-asc":
        sorted.sort((a, b) => a.priceNumeric - b.priceNumeric);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.priceNumeric - a.priceNumeric);
        break;
      case "area-desc":
        sorted.sort((a, b) => parseInt(b.area) - parseInt(a.area));
        break;
      case "newest":
        sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }
    setFilteredProperties(sorted);
  };

  const locations = [...new Set(properties.map((p) => p.location.split(",")[0].trim()))];
  const types = [...new Set(properties.map((p) => p.type))];

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Toggle + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </Button>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              {filteredProperties.length} bien(s)
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-ring outline-none"
              >
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="area-desc">Surface décroissante</option>
                <option value="newest">Plus récent</option>
              </select>
            </div>

            <div className="hidden sm:flex border rounded-lg overflow-hidden">
              <button
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "hover:bg-secondary"}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "hover:bg-secondary"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="bg-secondary/50 rounded-xl p-6 mb-8 border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type de bien</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="">Tous</option>
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Prix min {actionType === "rent" ? "(Ar/mois)" : "(Ar)"}
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prix max</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Localisation</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="">Toutes</option>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Chambres min.</label>
                <select
                  value={filters.beds}
                  onChange={(e) => handleFilterChange("beds", e.target.value)}
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-background"
                >
                  <option value="">Indifférent</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} className="w-full">
                  Effacer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun bien trouvé</h3>
            <p className="text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
