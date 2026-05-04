import { useState, useEffect } from 'react';
import { Project, Commodity, ProjectStatus } from '../types';
import { getProjects, addProject, updateProject, deleteProject, getActiveProjectId, setActiveProjectId } from '../utils/storage';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';

const COMMODITIES: Commodity[] = ['CC', 'IP', 'BPFR', 'BPRR', 'SPOILER', 'TAILGATE'];
const STATUSES: ProjectStatus[] = ['Ativo', 'Pausado', 'Finalizado'];

const emptyProject: Omit<Project, 'id'> = {
  divisao: '', projeto: '', planta: '', cliente: '', commodity: 'CC',
  volumeProducaoDia: '', turnos: '', horasTrabalhadasDia: '', carrosHora: '',
  engEmbalagem: '', supplyChain: '', comentariosENGE: '', comentariosSC: '',
  dataInicio: '', mpt: '', sop: '', coeficiente: '',
  imagemProduto: '', imagemCliente: '', status: 'Ativo',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);

  useEffect(() => {
    setProjects(getProjects());
    setActiveId(getActiveProjectId());
  }, []);

  const handleSave = () => {
    if (editing) {
      const updated = { ...editing, ...form };
      const list = updateProject(updated);
      setProjects(list);
    } else {
      const newP: Project = { id: crypto.randomUUID(), ...form };
      const list = addProject(newP);
      setProjects(list);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyProject);
  };

  const handleEdit = (p: Project) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const list = deleteProject(id);
    setProjects(list);
    if (activeId === id) {
      setActiveProjectId(null);
      setActiveId(null);
    }
  };

  const handleSetActive = (id: string) => {
    setActiveProjectId(id);
    setActiveId(id);
  };

  const handleImage = (field: 'imagemProduto' | 'imagemCliente', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((f) => ({ ...f, [field]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const statusColor = (s: ProjectStatus) => {
    if (s === 'Ativo') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Pausado') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projetos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerenciamento de projetos industriais</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm(emptyProject); setShowForm(true); }}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Projeto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{editing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'divisao', label: 'Divisão' },
                { key: 'projeto', label: 'Projeto' },
                { key: 'planta', label: 'Planta' },
                { key: 'cliente', label: 'Cliente' },
                { key: 'volumeProducaoDia', label: 'Volume Produção/dia' },
                { key: 'turnos', label: 'Turnos' },
                { key: 'horasTrabalhadasDia', label: 'Horas Trabalhadas/Dia' },
                { key: 'carrosHora', label: 'Carros/Hora' },
                { key: 'engEmbalagem', label: 'ENG Embalagem' },
                { key: 'supplyChain', label: 'Supply Chain' },
                { key: 'dataInicio', label: 'Data Início', type: 'date' },
                { key: 'mpt', label: 'MPT' },
                { key: 'sop', label: 'SOP' },
                { key: 'coeficiente', label: 'Coeficiente %' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Commodity</label>
                <select
                  value={form.commodity}
                  onChange={(e) => setForm((prev) => ({ ...prev, commodity: e.target.value as Commodity }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                >
                  {COMMODITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">Comentários ENG Emb</label>
                <textarea
                  value={form.comentariosENGE}
                  onChange={(e) => setForm((prev) => ({ ...prev, comentariosENGE: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  rows={2}
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">Comentários Supply Chain</label>
                <textarea
                  value={form.comentariosSC}
                  onChange={(e) => setForm((prev) => ({ ...prev, comentariosSC: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Imagem do Produto</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage('imagemProduto', e.target.files[0])} className="text-sm" />
                {form.imagemProduto && <img src={form.imagemProduto} alt="" className="mt-2 w-16 h-16 rounded object-cover" />}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Imagem do Cliente</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage('imagemCliente', e.target.files[0])} className="text-sm" />
                {form.imagemCliente && <img src={form.imagemCliente} alt="" className="mt-2 w-16 h-16 rounded object-cover" />}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className={`bg-white rounded-lg shadow-sm border p-5 ${activeId === p.id ? 'border-cyan-400 ring-1 ring-cyan-400' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {p.imagemProduto && <img src={p.imagemProduto} alt="" className="w-10 h-10 rounded object-cover" />}
                {p.imagemCliente && <img src={p.imagemCliente} alt="" className="w-10 h-10 rounded object-cover" />}
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColor(p.status)}`}>{p.status}</span>
            </div>
            <h3 className="font-bold text-slate-800">{p.projeto}</h3>
            <p className="text-sm text-slate-500">{p.cliente} - {p.commodity}</p>
            <p className="text-xs text-slate-400 mt-1">{p.planta} | {p.divisao}</p>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => handleSetActive(p.id)} className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${activeId === p.id ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}>
                <Star className="w-3 h-3" /> Ativo
              </button>
              <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-cyan-600"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">Nenhum projeto cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo Projeto" para começar</p>
        </div>
      )}
    </div>
  );
}
