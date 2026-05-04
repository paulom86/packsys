import { useState, useEffect } from 'react';
import { Fornecedor } from '../types';
import { getFornecedores, addFornecedor, updateFornecedor, deleteFornecedor } from '../utils/storage';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const emptyFornecedor: Omit<Fornecedor, 'id'> = {
  nome: '', codigo: '', contato: '', email: '', telefone: '', endereco: '',
};

export default function Fornecedores() {
  const [list, setList] = useState<Fornecedor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | null>(null);
  const [form, setForm] = useState(emptyFornecedor);

  useEffect(() => {
    setList(getFornecedores());
  }, []);

  const handleSave = () => {
    if (editing) {
      const updated = { ...editing, ...form };
      setList(updateFornecedor(updated));
    } else {
      const newF: Fornecedor = { id: crypto.randomUUID(), ...form };
      setList(addFornecedor(newF));
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyFornecedor);
  };

  const handleEdit = (f: Fornecedor) => {
    setEditing(f);
    setForm(f);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setList(deleteFornecedor(id));
  };

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none';
  const labelCls = 'block text-xs font-medium text-slate-600 mb-1';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastro de fornecedores de embalagem</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm(emptyFornecedor); setShowForm(true); }}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Fornecedor
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>Nome</label><input className={inputCls} value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} /></div>
              <div><label className={labelCls}>Código</label><input className={inputCls} value={form.codigo} onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))} /></div>
              <div><label className={labelCls}>Contato</label><input className={inputCls} value={form.contato} onChange={(e) => setForm((f) => ({ ...f, contato: e.target.value }))} /></div>
              <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
              <div><label className={labelCls}>Telefone</label><input className={inputCls} value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} /></div>
              <div><label className={labelCls}>Endereço</label><input className={inputCls} value={form.endereco} onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Contato</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Telefone</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-slate-800">{f.nome}</td>
                <td className="px-4 py-2 text-slate-600">{f.codigo}</td>
                <td className="px-4 py-2 text-slate-600">{f.contato}</td>
                <td className="px-4 py-2 text-slate-600">{f.email}</td>
                <td className="px-4 py-2 text-slate-600">{f.telefone}</td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => handleEdit(f)} className="p-1 text-slate-400 hover:text-cyan-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>Nenhum fornecedor cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
