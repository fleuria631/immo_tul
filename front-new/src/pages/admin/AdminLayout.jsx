import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Home, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  if (!user) return <Navigate to="/admin/login" />;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-wider">IMMO ADMIN</h2>
          <p className="text-slate-400 text-sm mt-2">Bonjour, {user.name}</p>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive('/admin/dashboard') ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            Tableau de bord
          </Link>
          <Link
            to="/admin/properties"
            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive('/admin/properties') ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Home size={20} />
            Propriétés
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            {isActive('/admin/dashboard') ? 'Tableau de bord' : isActive('/admin/properties') ? 'Gestion des propriétés' : ''}
          </h1>
          <Link to="/" className="text-sm text-blue-600 hover:underline" target="_blank">Voir le site web &rarr;</Link>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
