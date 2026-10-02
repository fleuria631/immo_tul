import { useState, useEffect } from 'react';
import { getProperties, deleteProperty } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PropertyFormModal from './PropertyFormModal';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProps = async () => {
    setLoading(true);
    try {
      const data = await getProperties();
      setProperties(data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, []);

  const handleAdd = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prop) => {
    setEditingProperty(prop);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      try {
        await deleteProperty(id);
        fetchProps();
      } catch (err) {
        console.error(err);
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des propriétés</h2>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Ajouter une propriété
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Chargement des propriétés...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucune propriété trouvée.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-4 font-semibold text-slate-700">Titre</th>
                <th className="p-4 font-semibold text-slate-700">Type</th>
                <th className="p-4 font-semibold text-slate-700">Prix</th>
                <th className="p-4 font-semibold text-slate-700">Statut</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{prop.titre}</td>
                  <td className="p-4 text-slate-600">{prop.type}</td>
                  <td className="p-4 text-slate-600">{prop.prix}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prop.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {prop.status === 'available' ? 'Disponible' : prop.status === 'reserved' ? 'Réservé' : 'Vendu'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleEdit(prop)}
                      className="text-blue-600 hover:text-blue-800 mr-3" 
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(prop.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PropertyFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={editingProperty}
        onSave={fetchProps}
      />
    </div>
  );
};

export default Properties;
