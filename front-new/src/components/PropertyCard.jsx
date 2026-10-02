import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/services/api";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const statusBadge = {
    available: { label: "Disponible", variant: "success" },
    reserved: { label: "Réservé", variant: "warning" },
    sold: { label: "Vendu", variant: "destructive" },
  };

  const status = statusBadge[property.status] || statusBadge.available;

  return (
    <Card
      className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={getImageUrl(property.image || property.Image)}
          alt={property.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.actionType === "rent" ? "accent" : "default"}>
            {property.actionType === "rent" ? "À louer" : "À vendre"}
          </Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Price */}
        <div className="text-xl font-bold text-primary mb-2">
          {property.prix}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.titre}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
          {property.beds && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{property.beds}</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{property.baths}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4" />
              <span>{property.area}</span>
            </div>
          )}
          <div className="ml-auto">
            <Badge variant="secondary">{property.type}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
