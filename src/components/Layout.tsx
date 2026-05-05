import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, List, FilePlus, FileText,
  ClipboardCheck, Package, Truck,
} from 'lucide-react';
import { getProjects, getActiveProjectId } from '../utils/storage';
import { useState, useEffect } from 'react';

const navItems = [
  { to: '/',             label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/items',        label: 'Lista de Itens',    icon: List },
  { to: '/cadastro',     label: 'Cadastro Completo', icon: FilePlus },
  { to: '/lpds-preview', label: 'LPDS Preview',      icon: FileText },
  { to: '/ptr-preview',  label: 'PTR Preview',       icon: ClipboardCheck },
  { to: '/embalagens',   label: 'Embalagens',        icon: Package },
  { to: '/fornecedores', label: 'Fornecedores',      icon: Truck },
];

export default function Layout() {
  const [activeProject, setActiveProject] = useState<{
    projeto: string; cliente: string; commodity: string;
    imagemProduto: string; imagemCliente: string;
  } | null>(null);

  useEffect(() => {
    const id = getActiveProjectId();
    if (id) {
      const found = getProjects().find((p) => p.id === id);
      if (found) setActiveProject(found);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Package className="w-7 h-7 text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">PackSys</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Industrial / LPDS</p>
            </div>
          </div>
        </div>

        {/* Projeto ativo */}
        {activeProject && (
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Projeto Ativo</p>
            <div className="flex items-center gap-2">
              {activeProject.imagemProduto && (
                <img src={activeProject.imagemProduto} alt="" className="w-8 h-8 rounded object-cover" />
              )}
              {activeProject.imagemCliente && (
                <img src={activeProject.imagemCliente} alt="" className="w-8 h-8 rounded object-cover" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{activeProject.projeto}</p>
                <p className="text-xs text-slate-400 truncate">{activeProject.cliente} - {activeProject.commodity}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-400 border-r-2 border-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Rodapé */}
        <div className="p-3 border-t border-slate-700">
          <p className="text-[10px] text-slate-500 text-center">PackSys Industrial v1.0</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
