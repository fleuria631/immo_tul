import { useState, useEffect } from 'react';
import { createProperty, updateProperty, uploadImages } from '../../services/api';
import { X } from 'lucide-react';

const PropertyFormModal = ({ isOpen, onClose, property, onSave }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    priceNumeric: 0,
    type: 'Maison',
    location: '',
    beds: '',
    baths: '',
    area: '',
    status: 'available',
    actionType: 'sale',
    featuresText: '',
    detailsText: '',
  });
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (property) {
      const safeParse = (data, fallback) => {
        if (typeof data === 'string') {
          try { return JSON.parse(data); } catch (e) { return fallback; }
        }
        return data || fallback;
      };
      const feats = safeParse(property.features, []);
      const dets = safeParse(property.details, {});
      const detsText = Object.entries(dets).map(([k,v]) => `${k}: ${v}`).join(', ');

      setFormData({
        titre: property.titre || '',
        description: property.description || '',
        prix: property.prix || '',
        priceNumeric: property.priceNumeric || 0,
        type: property.type || 'Maison',
        location: property.location || '',
        beds: property.beds || '',
        baths: property.baths || '',
        area: property.area || '',
        status: property.status || 'available',
        actionType: property.actionType || 'sale',
        featuresText: feats.join(', '),
        detailsText: detsText,
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        prix: '',
        priceNumeric: 0,
        type: 'Maison',
        location: '',
        beds: '',
        baths: '',
        area: '',
        status: 'available',
        actionType: 'sale',
        featuresText: '',
        detailsText: '',
      });
    }
    setFiles(null);
    setError(null);
  }, [property, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priceNumeric' || name === 'beds' || name === 'baths' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let finalData = { ...formData };
      
      // Parse features and details
      finalData.features = finalData.featuresText 
        ? finalData.featuresText.split(',').map(s => s.trim()).filter(s => s) 
        : [];
      
      finalData.details = {};
      if (finalData.detailsText) {
        finalData.detailsText.split(',').forEach(pair => {
          const [k, v] = pair.split(':');
          if (k && v) {
            finalData.details[k.trim()] = v.trim();
          }
        });
      }

      delete finalData.featuresText;
      delete finalData.detailsText;

      // Handle image upload if files are selected
      if (files && files.length > 0) {
        const uploadResult = await uploadImages(files);
        if (uploadResult.files && uploadResult.files.length > 0) {
          finalData.image = uploadResult.files[0];
          finalData.images = uploadResult.files;
        }
      } else if (property) {
        // Keep existing images if not modified
        finalData.image = property.image || "";
        finalData.images = typeof property.images === 'string' ? JSON.parse(property.images) : (property.images || []);
      }

      if (property) {
        await updateProperty(property.id, finalData);
      } else {
        await createProperty(finalData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {property ? 'Modifier la propriété' : 'Ajouter une propriété'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Images (Max 5)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
              />
              {property && property.images && property.images !== "[]" && (
                <p className="text-xs text-slate-500 mt-1">
                  Des images sont déjà associées à ce bien. Si vous sélectionnez de nouvelles images, les anciennes seront remplacées.
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
              <input type="text" name="titre" value={formData.titre} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Caractéristiques (séparées par des virgules)</label>
              <textarea name="featuresText" value={formData.featuresText} onChange={handleChange} rows={2} placeholder="ex: Jardin, Piscine, Garage" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Détails (Clé: Valeur, séparés par des virgules)</label>
              <textarea name="detailsText" value={formData.detailsText} onChange={handleChange} rows={2} placeholder="ex: Surface terrain: 300m2, Année: 2020" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prix (Texte affiché)</label>
              <input type="text" name="prix" value={formData.prix} onChange={handleChange} required placeholder="ex: 1 200 000 Ar" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prix Numérique (pour le tri)</label>
              <input type="number" name="priceNumeric" value={formData.priceNumeric} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de bien</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Maison">Maison</option>
                <option value="Villa">Villa</option>
                <option value="Appartement">Appartement</option>
                <option value="Terrain">Terrain</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chambres</label>
              <input type="number" name="beds" value={formData.beds} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salles de bain</label>
              <input type="number" name="baths" value={formData.baths} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Surface (ex: 120m²)</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
              <select name="actionType" value={formData.actionType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sale">À vendre</option>
                <option value="rent">À louer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="available">Disponible</option>
                <option value="reserved">Réservé</option>
                <option value="sold">Vendu / Loué</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Enregistrement et upload...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
