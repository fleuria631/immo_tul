import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, BedDouble, Bath, Maximize, Phone, Mail,
  ChevronLeft, Check, ArrowLeft, Home
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPropertyById, getImageUrl, submitContact } from "@/services/api";

const PropertyDetails = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle');

  useEffect(() => {
    getPropertyById(id).then(data => {
      setProperty(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      await submitContact({
        ...contactData,
        propertyId: property.id,
        subject: `Intéressé par: ${property.titre}`
      });
      setContactStatus('success');
    } catch(err) {
      setContactStatus('error');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          Chargement...
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Home className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Propriété non trouvée</h1>
            <p className="text-muted-foreground mb-8">
              La propriété que vous recherchez n'existe pas.
            </p>
            <Link to="/">
              <Button variant="accent" size="lg">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const statusMap = {
    available: { label: "Disponible", variant: "success" },
    reserved: { label: "Réservé", variant: "warning" },
    sold: { label: "Vendu", variant: "destructive" },
  };
  const status = statusMap[property.status] || statusMap.available;

  const safeParse = (data, fallback) => {
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch (e) { return fallback; }
    }
    return data || fallback;
  };
  property.images = safeParse(property.images, []);
  property.features = safeParse(property.features, []);
  
  const parsedDetails = safeParse(property.details, {});
  if (property.area) parsedDetails["Surface"] = property.area;
  if (property.beds) parsedDetails["Chambres"] = property.beds;
  if (property.baths) parsedDetails["Salles de bain"] = property.baths;
  property.details = parsedDetails;

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-secondary/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            to={property.actionType === "rent" ? "/Alouer" : "/Avendre"}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour aux résultats</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={property.actionType === "rent" ? "accent" : "default"}>
                  {property.actionType === "rent" ? "À louer" : "À vendre"}
                </Badge>
                <Badge variant={status.variant}>{status.label}</Badge>
                <Badge variant="secondary">{property.type}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {property.titre}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary">
              {property.prix}
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-10">
            <div className="rounded-2xl overflow-hidden mb-3">
              <img
                src={getImageUrl(property.images[activeImage])}
                alt={property.titre}
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
            </div>
            <div className="flex gap-3">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? "border-primary shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${property.titre} ${index + 1}`}
                    className="w-24 h-18 md:w-32 md:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Specs */}
              <div className="grid grid-cols-3 gap-4">
                {property.beds && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 text-center">
                      <BedDouble className="w-7 h-7 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{property.beds}</div>
                      <div className="text-xs text-muted-foreground">Chambres</div>
                    </CardContent>
                  </Card>
                )}
                {property.baths && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 text-center">
                      <Bath className="w-7 h-7 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{property.baths}</div>
                      <div className="text-xs text-muted-foreground">Salles de bain</div>
                    </CardContent>
                  </Card>
                )}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5 text-center">
                    <Maximize className="w-7 h-7 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{property.area}</div>
                    <div className="text-xs text-muted-foreground">Surface</div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Details Table */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">Détails</h2>
                  <div className="divide-y">
                    {Object.entries(property.details).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3"
                      >
                        <span className="text-muted-foreground text-sm capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm sticky top-28">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Contactez-nous</h3>

                  <div className="space-y-4 mb-8">
                    <a
                      href="tel:+261320260043"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">+261 32 02 600 43</div>
                        <div className="text-xs text-muted-foreground">Ligne principale</div>
                      </div>
                    </a>
                    <a
                      href="tel:+261320511222"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">+261 32 05 112 22</div>
                        <div className="text-xs text-muted-foreground">Ligne secondaire</div>
                      </div>
                    </a>
                    <a
                      href="mailto:info@immotulear.mg"
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">info@immotulear.mg</div>
                        <div className="text-xs text-muted-foreground">Email</div>
                      </div>
                    </a>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Centre Ville</div>
                        <div className="text-xs text-muted-foreground">
                          Angle Rue du marché, Bd Galliéni
                        </div>
                      </div>
                    </div>
                  </div>

                  {!showContactForm ? (
<Button variant="accent" size="lg" className="w-full" onClick={() => setShowContactForm(true)}>
{property.actionType === "rent" ? "Demander une visite" : "Je suis int�ress�(e)"}
</Button>
) : contactStatus === 'success' ? (
<div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm text-center border border-green-200">Votre message a �t� envoy� avec succ�s. Nous vous recontacterons bient�t !</div>
) : (
<form onSubmit={handleContactSubmit} className="space-y-3 mt-6 border-t pt-6"><h4 className="font-semibold text-sm mb-3">Envoyer un message</h4>{contactStatus === 'error' && <div className="text-red-500 text-xs">Erreur lors de l'envoi.</div>}<input required type="text" placeholder="Votre nom" className="w-full text-sm border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} /><input required type="email" placeholder="Votre email" className="w-full text-sm border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} /><input type="tel" placeholder="Votre t�l�phone" className="w-full text-sm border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary" value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} /><textarea required placeholder="Votre message..." rows={3} className="w-full text-sm border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary" value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} /><div className="flex gap-2 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setShowContactForm(false)}>Annuler</Button><Button type="submit" variant="accent" className="flex-1" disabled={contactStatus === 'loading'}>{contactStatus === 'loading' ? 'Envoi...' : 'Envoyer'}</Button></div></form>
)}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PropertyDetails;

