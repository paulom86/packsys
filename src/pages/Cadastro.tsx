import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Item, Commodity, BuyMake, InstructionFor, NacionalImportado, Packaging } from '../types';
import { getItems, saveItems, getProjects, getActiveProjectId, getFornecedores, getPackagings } from '../utils/storage';
import { calculateFields, determineStatus } from '../utils/calculations';
import { Save, AlertTriangle, ArrowLeft } from 'lucide-react';

const COMMODITIES: Commodity[] = ['CC', 'IP', 'BPFR', 'BPRR', 'SPOILER', 'TAILGATE'];

const emptyItem: Item = {
  id: '',
  partNumber: '', partName: '', projeto: '', cliente: '', commodity: 'CC',
  fornecedor: '', codFornecedor: '',
  buyMake: 'Buy', instructionFor: 'Production', nacionalImportado: 'Nacional',
  n1: false, n0: false, reposicao: false, consignacao: false, carryOver: false,
  comprimento: '', largura: '', altura: '', peso: '', pecasPorCarro: '',
  puCode: '', puDesc: '', puMaterial: '', puTipo: '',
  puMedC: '', puMedL: '', puMedA: '', puPeso: '', pecasPorPU: '', brutoPU: '',
  huMedC: '', huMedL: '', huMedA: '', huPeso: '', puPorCamada: '', camadas: '',
  empilhavel: false, retornavel: false,
  truckComprimento: '', truckLargura: '', freteViagem: '',
  imagemPart: '', imagemPU: '', imagemHU: '', imagemDunnage: '',
  status: 'Pendente',
};

export default function Cadastro() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('edit');

  const [form, setForm] = useState<Item>(emptyItem);
  const [saved, setSaved] = useState(false);
  const [packagings, setPackagings] = useState<Packaging[]>([]);

  useEffect(() => {
    setPackagings(getPackagings());
    if (editId) {
      const items = getItems();
      const found = items.find((i) => i.id === editId);
      if (found) setForm(found);
    } else {
      const activeId = getActiveProjectId();
      const projects = getProjects();
      const active = projects.find((p) => p.id === activeId);
      if (active) {
        setForm((f) => ({ ...f, projeto: active.projeto, cliente: active.cliente, commodity: active.commodity }));
      }
    }
  }, [editId]);

  const calc = calculateFields(form);

  const update = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImage = (field: 'imagemPart' | 'imagemPU' | 'imagemHU' | 'imagemDunnage', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => update(field, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePackagingSelect = (packagingId: string) => {
    const pkg = packagings.find((p) => p.id === packagingId);
    if (!pkg) return;
    setForm((f) => ({
      ...f,
      puCode: pkg.codSAP || pkg.codigo,
      puDesc: pkg.descricaoSAP || pkg.embalagem,
      puMaterial: pkg.material || pkg.materialQuality,
      puTipo: pkg.tipo,
      puMedC: pkg.lEx,
      puMedL: pkg.cEx,
      puMedA: pkg.aEx,
      puPeso: pkg.tara,
      retornavel: pkg.retornavel,
    }));
  };

  const handleSave = () => {
    const status = determineStatus(form);
    const item = { ...form, status };
    const items = getItems();

    if (editId) {
      const updated = items.map((i) => (i.id === editId ? item : i));
      saveItems(updated);
    } else {
      item.id = crypto.randomUUID();
      items.push(item);
      saveItems(items);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const projects = getProjects();
  const fornecedores = getFornecedores();
  const activePackagings = packagings.filter((p) => p.ativo);

  const inputCls = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none';
  const labelCls = 'block text-xs font-medium text-slate-600 mb-1';
  const sectionTitle = 'text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4';

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/items')} className="p-2 text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cadastro Completo</h1>
          <p className="text-sm text-slate-500 mt-0.5">{editId ? 'Editar Item / LPDS' : 'Novo Item / LPDS'}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Dados principais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>1. Dados Principais da Peça</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Part Number</label><input className={inputCls} value={form.partNumber} onChange={(e) => update('partNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Part Name</label><input className={inputCls} value={form.partName} onChange={(e) => update('partName', e.target.value)} /></div>
            <div>
              <label className={labelCls}>Projeto / Programa</label>
              <select className={inputCls} value={form.projeto} onChange={(e) => update('projeto', e.target.value)}>
                <option value="">Selecione</option>
                {projects.map((p) => <option key={p.id} value={p.projeto}>{p.projeto}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Cliente / OEM</label><input className={inputCls} value={form.cliente} onChange={(e) => update('cliente', e.target.value)} /></div>
            <div>
              <label className={labelCls}>Commodity</label>
              <select className={inputCls} value={form.commodity} onChange={(e) => update('commodity', e.target.value as Commodity)}>
                {COMMODITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Fornecedor</label>
              <select className={inputCls} value={form.fornecedor} onChange={(e) => update('fornecedor', e.target.value)}>
                <option value="">Selecione</option>
                {fornecedores.map((f) => <option key={f.id} value={f.nome}>{f.nome}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Código Fornecedor</label><input className={inputCls} value={form.codFornecedor} onChange={(e) => update('codFornecedor', e.target.value)} /></div>
          </div>
        </div>

        {/* 2. Dados comerciais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>2. Dados Comerciais / Processo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Buy / Make</label>
              <select className={inputCls} value={form.buyMake} onChange={(e) => update('buyMake', e.target.value as BuyMake)}>
                <option value="Buy">Buy</option>
                <option value="Make">Make</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Instruction For</label>
              <select className={inputCls} value={form.instructionFor} onChange={(e) => update('instructionFor', e.target.value as InstructionFor)}>
                <option value="Production">Production</option>
                <option value="Service">Service</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Nacional / Importado</label>
              <select className={inputCls} value={form.nacionalImportado} onChange={(e) => update('nacionalImportado', e.target.value as NacionalImportado)}>
                <option value="Nacional">Nacional</option>
                <option value="Importado">Importado</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            {([
              { key: 'n1', label: 'N1' },
              { key: 'n0', label: 'N0' },
              { key: 'reposicao', label: 'Reposição' },
              { key: 'consignacao', label: 'Consignação' },
              { key: 'carryOver', label: 'Carry Over' },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form[key] as boolean} onChange={(e) => update(key, e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* 3. Dados da peça */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>3. Dados da Peça</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div><label className={labelCls}>Comprimento (mm)</label><input type="number" className={inputCls} value={form.comprimento} onChange={(e) => update('comprimento', e.target.value)} /></div>
            <div><label className={labelCls}>Largura (mm)</label><input type="number" className={inputCls} value={form.largura} onChange={(e) => update('largura', e.target.value)} /></div>
            <div><label className={labelCls}>Altura (mm)</label><input type="number" className={inputCls} value={form.altura} onChange={(e) => update('altura', e.target.value)} /></div>
            <div><label className={labelCls}>Peso (g)</label><input type="number" className={inputCls} value={form.peso} onChange={(e) => update('peso', e.target.value)} /></div>
            <div><label className={labelCls}>Peças por Carro</label><input type="number" className={inputCls} value={form.pecasPorCarro} onChange={(e) => update('pecasPorCarro', e.target.value)} /></div>
          </div>
        </div>

        {/* 4. Packaging Unit */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>4. Packaging Unit - PU</h2>

          {activePackagings.length > 0 && (
            <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <label className="block text-xs font-medium text-cyan-700 mb-1">Selecionar Embalagem Padrão</label>
              <select
                className="w-full border border-cyan-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white"
                onChange={(e) => handlePackagingSelect(e.target.value)}
                defaultValue=""
              >
                <option value="">-- Selecionar embalagem cadastrada --</option>
                {activePackagings.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo || p.codSAP} - {p.descricaoSAP || p.embalagem} ({p.tipo})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-cyan-600 mt-1">Ao selecionar, os campos PU serão preenchidos automaticamente. Você ainda pode editar manualmente.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className={labelCls}>Código PU</label><input className={inputCls} value={form.puCode} onChange={(e) => update('puCode', e.target.value)} /></div>
            <div><label className={labelCls}>Descrição PU</label><input className={inputCls} value={form.puDesc} onChange={(e) => update('puDesc', e.target.value)} /></div>
            <div><label className={labelCls}>Material PU</label><input className={inputCls} value={form.puMaterial} onChange={(e) => update('puMaterial', e.target.value)} /></div>
            <div><label className={labelCls}>Tipo PU</label><input className={inputCls} value={form.puTipo} onChange={(e) => update('puTipo', e.target.value)} /></div>
            <div><label className={labelCls}>Comprimento (mm)</label><input type="number" className={inputCls} value={form.puMedC} onChange={(e) => update('puMedC', e.target.value)} /></div>
            <div><label className={labelCls}>Largura (mm)</label><input type="number" className={inputCls} value={form.puMedL} onChange={(e) => update('puMedL', e.target.value)} /></div>
            <div><label className={labelCls}>Altura (mm)</label><input type="number" className={inputCls} value={form.puMedA} onChange={(e) => update('puMedA', e.target.value)} /></div>
            <div><label className={labelCls}>Peso (g)</label><input type="number" className={inputCls} value={form.puPeso} onChange={(e) => update('puPeso', e.target.value)} /></div>
            <div><label className={labelCls}>Peças por PU</label><input type="number" className={inputCls} value={form.pecasPorPU} onChange={(e) => update('pecasPorPU', e.target.value)} /></div>
            <div><label className={labelCls}>Peso Bruto PU (g)</label><input type="number" className={inputCls} value={form.brutoPU} onChange={(e) => update('brutoPU', e.target.value)} /></div>
          </div>
        </div>

        {/* 5. Handling Unit */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>5. Handling Unit - HU</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className={labelCls}>Comprimento (mm)</label><input type="number" className={inputCls} value={form.huMedC} onChange={(e) => update('huMedC', e.target.value)} /></div>
            <div><label className={labelCls}>Largura (mm)</label><input type="number" className={inputCls} value={form.huMedL} onChange={(e) => update('huMedL', e.target.value)} /></div>
            <div><label className={labelCls}>Altura (mm)</label><input type="number" className={inputCls} value={form.huMedA} onChange={(e) => update('huMedA', e.target.value)} /></div>
            <div><label className={labelCls}>Peso (g)</label><input type="number" className={inputCls} value={form.huPeso} onChange={(e) => update('huPeso', e.target.value)} /></div>
            <div><label className={labelCls}>PU por Camada</label><input type="number" className={inputCls} value={form.puPorCamada} onChange={(e) => update('puPorCamada', e.target.value)} /></div>
            <div><label className={labelCls}>Número de Camadas</label><input type="number" className={inputCls} value={form.camadas} onChange={(e) => update('camadas', e.target.value)} /></div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.empilhavel} onChange={(e) => update('empilhavel', e.target.checked)} className="rounded border-gray-300 text-cyan-600" /> Empilhável</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.retornavel} onChange={(e) => update('retornavel', e.target.checked)} className="rounded border-gray-300 text-cyan-600" /> Retornável</label>
            </div>
          </div>

          {/* Calculated fields */}
          <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Cálculos Automáticos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
              <div><span className="text-slate-500">PU por HU:</span> <span className="font-semibold text-slate-800">{calc.puPorHU}</span></div>
              <div><span className="text-slate-500">Peso Total HU:</span> <span className="font-semibold text-slate-800">{calc.pesoTotalHU.toFixed(1)} g</span></div>
              <div><span className="text-slate-500">Altura Total:</span> <span className="font-semibold text-slate-800">{calc.alturaTotal.toFixed(1)} mm</span></div>
              <div><span className="text-slate-500">Peças/HU:</span> <span className="font-semibold text-slate-800">{calc.pecasPorHU}</span></div>
              <div><span className="text-slate-500">Peças/Caminhão:</span> <span className="font-semibold text-slate-800">{calc.pecasPorCaminhao}</span></div>
              <div><span className="text-slate-500">HU/Caminhão:</span> <span className="font-semibold text-slate-800">{calc.huPorCaminhao}</span></div>
              <div><span className="text-slate-500">Custo/Peça:</span> <span className="font-semibold text-slate-800">R$ {calc.custoPorPeca.toFixed(4)}</span></div>
            </div>
            {calc.alertas.length > 0 && (
              <div className="mt-3 space-y-1">
                {calc.alertas.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-amber-600 text-sm"><AlertTriangle className="w-4 h-4" /> {a}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Simulação de transporte */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>6. Simulação de Transporte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Comprimento Caminhão (mm)</label><input type="number" className={inputCls} value={form.truckComprimento} onChange={(e) => update('truckComprimento', e.target.value)} /></div>
            <div><label className={labelCls}>Largura Caminhão (mm)</label><input type="number" className={inputCls} value={form.truckLargura} onChange={(e) => update('truckLargura', e.target.value)} /></div>
            <div><label className={labelCls}>Frete por Viagem (R$)</label><input type="number" step="0.01" className={inputCls} value={form.freteViagem} onChange={(e) => update('freteViagem', e.target.value)} /></div>
          </div>
        </div>

        {/* 7. Imagens */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={sectionTitle}>7. Imagens da LPDS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['imagemPart', 'imagemPU', 'imagemHU', 'imagemDunnage'] as const).map((field) => (
              <div key={field}>
                <label className={labelCls}>{field.replace('imagem', '')}</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(field, e.target.files[0])} className="text-sm" />
                {form[field] && <img src={form[field]} alt="" className="mt-2 w-full h-32 object-contain rounded border border-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
          <Save className="w-4 h-4" /> Salvar
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">Salvo com sucesso!</span>}
      </div>
    </div>
  );
}
