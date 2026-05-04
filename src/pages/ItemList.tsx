import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types';
import { getItems, saveItems, clearItems } from '../utils/storage';
import { calculateFields } from '../utils/calculations';
import { exportItemsCSV, generateCSVTemplate, parseCSVItems, downloadFile } from '../utils/csv';
import { Pencil, Eye, Download, Trash2, Upload, FileDown, CheckSquare, Square } from 'lucide-react';

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getItems());
  }, []);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const handleDelete = (id: string) => {
    const list = items.filter((i) => i.id !== id);
    saveItems(list);
    setItems(list);
    selected.delete(id);
    setSelected(new Set(selected));
  };

  const handleClearAll = () => {
    if (!confirm('Limpar todos os itens? Projetos não serão afetados.')) return;
    clearItems();
    setItems([]);
    setSelected(new Set());
  };

  const handleDownloadCSV = () => {
    downloadFile(generateCSVTemplate(), 'lpds_template.csv', 'text/csv');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSVItems(text);
      const existing = getItems();
      const merged = [...existing, ...parsed as Item[]];
      saveItems(merged);
      setItems(merged);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadItemPDF = (item: Item) => {
    navigate(`/lpds-preview?item=${item.id}`);
  };

  const handleDownloadSelected = () => {
    const selectedItems = items.filter((i) => selected.has(i.id));
    const csv = exportItemsCSV(selectedItems);
    downloadFile(csv, 'lpds_selected.csv', 'text/csv');
  };

  const statusColor = (s: string) => {
    if (s === 'Aprovado') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Pendente') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lista de Itens</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} itens cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownloadCSV} className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-slate-600">
            <FileDown className="w-4 h-4" /> Modelo CSV
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-slate-600">
            <Upload className="w-4 h-4" /> Importar CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          {selected.size > 0 && (
            <button onClick={handleDownloadSelected} className="flex items-center gap-1 px-3 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
              <Download className="w-4 h-4" /> Baixar {selected.size} CSV
            </button>
          )}
          <button onClick={handleClearAll} className="flex items-center gap-1 px-3 py-2 text-sm border border-red-200 text-red-600 rounded-md hover:bg-red-50">
            <Trash2 className="w-4 h-4" /> Limpar Itens
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left">
                <button onClick={toggleAll}>{selected.size === items.length && items.length > 0 ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-slate-400" />}</button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Part Number</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Descrição</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">PU</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Projeto</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Commodity</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Peças/HU</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">HU/Caminhão</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Custo/Peça</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const calc = calculateFields(item);
              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <button onClick={() => toggleSelect(item.id)}>
                      {selected.has(item.id) ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </button>
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-800">{item.partNumber}</td>
                  <td className="px-3 py-2 text-slate-600">{item.partName}</td>
                  <td className="px-3 py-2 text-slate-600">{item.puCode}</td>
                  <td className="px-3 py-2 text-slate-600">{item.projeto}</td>
                  <td className="px-3 py-2 text-slate-600">{item.commodity}</td>
                  <td className="px-3 py-2"><span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColor(item.status)}`}>{item.status}</span></td>
                  <td className="px-3 py-2 text-center text-slate-700">{calc.pecasPorHU}</td>
                  <td className="px-3 py-2 text-center text-slate-700">{calc.huPorCaminhao}</td>
                  <td className="px-3 py-2 text-center text-slate-700">R$ {calc.custoPorPeca.toFixed(4)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/lpds-preview?item=${item.id}`)} className="p-1 text-slate-400 hover:text-cyan-600" title="Ver LPDS"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => navigate(`/cadastro?edit=${item.id}`)} className="p-1 text-slate-400 hover:text-cyan-600" title="Editar"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDownloadItemPDF(item)} className="p-1 text-slate-400 hover:text-cyan-600" title="Baixar LPDS"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p>Nenhum item cadastrado</p>
            <p className="text-sm mt-1">Use Cadastro Completo ou importe um CSV</p>
          </div>
        )}
      </div>
    </div>
  );
}
