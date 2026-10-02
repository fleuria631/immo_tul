import { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/api';
import { Users, Eye, MessageSquare, Home, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ views: 0, inquiries: 0, properties: 0, newContacts: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        if (data.overview) {
          setStats({
            views: data.overview.totalViews || 0,
            inquiries: data.overview.totalContacts || 0,
            properties: data.overview.totalProperties || 0,
            newContacts: data.overview.newContacts || 0
          });
        }
        if (data.recentProperties) {
          setRecent(data.recentProperties);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Vues Totales', value: stats.views, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Demandes Contact', value: stats.inquiries, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100', badge: stats.newContacts > 0 ? `${stats.newContacts} nouv.` : null },
    { title: 'Propriétés', value: stats.properties, icon: Home, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                </div>
              </div>
              {stat.badge && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {stat.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-slate-500" />
          Dernières propriétés ajoutées
        </h3>
        {recent.length === 0 ? (
          <p className="text-slate-500">Aucune activité récente pour le moment.</p>
        ) : (
          <div className="divide-y">
            {recent.map((prop) => (
              <div key={prop.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-800">{prop.titre}</p>
                  <p className="text-sm text-slate-500">{prop.type} • {prop.actionType === 'sale' ? 'À vendre' : 'À louer'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(prop.priceNumeric || 0)}</p>
                  <p className="text-xs text-slate-400">
                    {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(prop.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
