import { useState, useEffect } from 'react';
import { Packaging, NacionalImportado } from '../types';
import { getPackagings, addPackaging, updatePackaging, deletePackaging } from '../utils/storage';
import { Plus, Pencil, Trash2, X, Package } from 'lucide-react';

const emptyPackaging: Omit<Packaging, 'id'> = {
  definicao: '', padrao: '', codSAP: '', descricaoSAP: '',
  embalagem: '', tipo: '', modelo: '', materialQuality: '',
  codigo: '', nacionalImportado: 'Nacional', gramaturaDensidade: '',
  parede: '', ondas: '', espessura: '', coluna: '',
  material: '', partic: '', retornavel: false,
  lEx: '', cEx: '', aEx: '', alturaEncaixe: '',
  lIn: '', cIn: '', aIn: '',
  tara: '', capacidadeCarga: '', volumeCarga: '',
  ativo: true, imagem: '',
};

export default function Embalagens() {
  const [list, setList] = useState<Packaging[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Packaging | null>(null);
  const [form, setForm] = useState(emptyPackaging);

  useEffect(() => {
    setList(getPackagings());
  }, []);

  const handleSave = () => {
    if (editing) {
      const updated = { ...editing, ...form };
      setList(updatePackaging(updated));
    } else {
      const newP: Packaging = { id: crypto.randomUUID(), ...form };
      setList(addPackaging(newP));
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyPackaging);
  };

  const handleEdit = (p: Packaging) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setList(deletePackaging(id));
  };

  const toggleAtivo = (p: Packaging) => {
    const updated = { ...p, ativo: !p.ativo };
    setList(updatePackaging(updated));
  };

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm((f) => ({ ...f, imagem: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const update = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none';
  const labelCls = 'block text-xs font-medium text-slate-600 mb-1';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Embalagens</h1>
          <p className="text-sm text-slate-500 mt-1">Cadastro de embalagens padrão</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm(emptyPackaging); setShowForm(true); }}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Embalagem
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{editing ? 'Editar Embalagem' : 'Nova Embalagem'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className={labelCls}>Definição Embalagem</label><input className={inputCls} value={form.definicao} onChange={(e) => update('definicao', e.target.value)} /></div>
              <div><label className={labelCls}>Padrão</label><input className={inputCls} value={form.padrao} onChange={(e) => update('padrao', e.target.value)} /></div>
              <div><label className={labelCls}>Cod_SAP</label><input className={inputCls} value={form.codSAP} onChange={(e) => update('codSAP', e.target.value)} /></div>
              <div><label className={labelCls}>Descrição SAP</label><input className={inputCls} value={form.descricaoSAP} onChange={(e) => update('descricaoSAP', e.target.value)} /></div>
              <div><label className={labelCls}>Embalagem</label><input className={inputCls} value={form.embalagem} onChange={(e) => update('embalagem', e.target.value)} /></div>
              <div><label className={labelCls}>Tipo</label><input className={inputCls} value={form.tipo} onChange={(e) => update('tipo', e.target.value)} /></div>
              <div><label className={labelCls}>Modelo</label><input className={inputCls} value={form.modelo} onChange={(e) => update('modelo', e.target.value)} /></div>
              <div><label className={labelCls}>Material_Quality</label><input className={inputCls} value={form.materialQuality} onChange={(e) => update('materialQuality', e.target.value)} /></div>
              <div><label className={labelCls}>Código</label><input className={inputCls} value={form.codigo} onChange={(e) => update('codigo', e.target.value)} /></div>
              <div>
                <label className={labelCls}>Nacional / Importado</label>
                <select className={inputCls} value={form.nacionalImportado} onChange={(e) => update('nacionalImportado', e.target.value as NacionalImportado)}>
                  <option value="Nacional">Nacional</option>
                  <option value="Importado">Importado</option>
                </select>
              </div>
              <div><label className={labelCls}>Gramatura/Densidade</label><input className={inputCls} value={form.gramaturaDensidade} onChange={(e) => update('gramaturaDensidade', e.target.value)} /></div>
              <div><label className={labelCls}>Parede</label><input className={inputCls} value={form.parede} onChange={(e) => update('parede', e.target.value)} /></div>
              <div><label className={labelCls}>Ondas</label><input className={inputCls} value={form.ondas} onChange={(e) => update('ondas', e.target.value)} /></div>
              <div><label className={labelCls}>Espessura (mm)</label><input type="number" step="0.01" className={inputCls} value={form.espessura} onChange={(e) => update('espessura', e.target.value)} /></div>
              <div><label className={labelCls}>Coluna</label><input className={inputCls} value={form.coluna} onChange={(e) => update('coluna', e.target.value)} /></div>
              <div><label className={labelCls}>Material</label><input className={inputCls} value={form.material} onChange={(e) => update('material', e.target.value)} /></div>
              <div><label className={labelCls}>Partic.</label><input className={inputCls} value={form.partic} onChange={(e) => update('partic', e.target.value)} /></div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.retornavel} onChange={(e) => update('retornavel', e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  Retornável
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Dimensões Externas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className={labelCls}>L EX (mm)</label><input type="number" className={inputCls} value={form.lEx} onChange={(e) => update('lEx', e.target.value)} /></div>
                <div><label className={labelCls}>C EX (mm)</label><input type="number" className={inputCls} value={form.cEx} onChange={(e) => update('cEx', e.target.value)} /></div>
                <div><label className={labelCls}>A EX (mm)</label><input type="number" className={inputCls} value={form.aEx} onChange={(e) => update('aEx', e.target.value)} /></div>
                <div><label className={labelCls}>Altura Encaixe (mm)</label><input type="number" className={inputCls} value={form.alturaEncaixe} onChange={(e) => update('alturaEncaixe', e.target.value)} /></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Dimensões Internas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className={labelCls}>L IN (mm)</label><input type="number" className={inputCls} value={form.lIn} onChange={(e) => update('lIn', e.target.value)} /></div>
                <div><label className={labelCls}>C IN (mm)</label><input type="number" className={inputCls} value={form.cIn} onChange={(e) => update('cIn', e.target.value)} /></div>
                <div><label className={labelCls}>A IN (mm)</label><input type="number" className={inputCls} value={form.aIn} onChange={(e) => update('aIn', e.target.value)} /></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Capacidade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className={labelCls}>Tara (kg)</label><input type="number" step="0.01" className={inputCls} value={form.tara} onChange={(e) => update('tara', e.target.value)} /></div>
                <div><label className={labelCls}>Capacidade Carga (kg)</label><input type="number" step="0.01" className={inputCls} value={form.capacidadeCarga} onChange={(e) => update('capacidadeCarga', e.target.value)} /></div>
                <div><label className={labelCls}>Volume Carga (L)</label><input type="number" step="0.01" className={inputCls} value={form.volumeCarga} onChange={(e) => update('volumeCarga', e.target.value)} /></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Imagem</h3>
              <div className="flex items-start gap-4">
                <div>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} className="text-sm" />
                  {form.imagem && <img src={form.imagem} alt="" className="mt-2 w-20 h-20 rounded object-cover border border-gray-200" />}
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.ativo} onChange={(e) => update('ativo', e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-sm text-slate-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Imagem</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Código</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Cod_SAP</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Descrição SAP</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Embalagem</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Modelo</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Material</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Dim. Externa</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Dim. Interna</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tara</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Retornável</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Ativo</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">
                  {p.imagem ? <img src={p.imagem} alt="" className="w-10 h-10 rounded object-cover" /> : <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                </td>
                <td className="px-3 py-2 font-medium text-slate-800">{p.codigo}</td>
                <td className="px-3 py-2 text-slate-600">{p.codSAP}</td>
                <td className="px-3 py-2 text-slate-600">{p.descricaoSAP}</td>
                <td className="px-3 py-2 text-slate-600">{p.embalagem}</td>
                <td className="px-3 py-2 text-slate-600">{p.tipo}</td>
                <td className="px-3 py-2 text-slate-600">{p.modelo}</td>
                <td className="px-3 py-2 text-slate-600">{p.material}</td>
                <td className="px-3 py-2 text-slate-600 text-xs">{p.lEx}x{p.cEx}x{p.aEx}</td>
                <td className="px-3 py-2 text-slate-600 text-xs">{p.lIn}x{p.cIn}x{p.aIn}</td>
                <td className="px-3 py-2 text-slate-600">{p.tara}</td>
                <td className="px-3 py-2 text-center">{p.retornavel ? <span className="text-emerald-600 font-semibold text-xs">Sim</span> : <span className="text-slate-400 text-xs">Não</span>}</td>
                <td className="px-3 py-2 text-center">
                  <button onClick={() => toggleAtivo(p)} className={`text-xs font-semibold px-2 py-0.5 rounded ${p.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleEdit(p)} className="p-1 text-slate-400 hover:text-cyan-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>Nenhuma embalagem cadastrada</p>
            <p className="text-sm mt-1">Clique em "Nova Embalagem" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
