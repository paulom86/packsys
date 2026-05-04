import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Item } from '../types';
import { getItems } from '../utils/storage';
import { calculateFields } from '../utils/calculations';
import { Download, ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PTRPreview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const itemId = params.get('item');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string>(itemId || '');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = getItems();
    setItems(all);
    if (!itemId && all.length > 0) setSelectedId(all[0].id);
  }, [itemId]);

  const item = items.find((i) => i.id === selectedId);
  const calc = item ? calculateFields(item) : null;

  const handleDownloadPDF = async () => {
    if (!printRef.current || !item) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: [5, 5, 5, 5],
      filename: `PTR_${item.partNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(printRef.current).save();
  };

  const headerCls = 'bg-slate-800 text-white text-[10px] font-bold px-1.5 py-1.5 border border-black';
  const labelCls = 'bg-slate-100 text-[10px] font-semibold px-1.5 py-1 border border-black';
  const valueCls = 'text-[10px] px-1.5 py-1 border border-black';

  if (!item) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800">PTR Preview</h1>
        <p className="text-sm text-slate-400 mt-4">Nenhum item selecionado.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/items')} className="p-2 text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">PTR Preview</h1>
            <p className="text-sm text-slate-500">{item.partNumber} - {item.partName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.partNumber} - {i.partName}</option>
            ))}
          </select>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700">
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="bg-white shadow-lg border border-gray-300 max-w-[210mm] mx-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="p-4">
          <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">Packaging Transport Report - PTR</span>
            </div>
          </div>

          <table className="w-full border-collapse mb-3">
            <thead><tr><th colSpan={6} className={headerCls}>PART IDENTIFICATION</th></tr></thead>
            <tbody>
              <tr>
                <td className={labelCls} style={{ width: '16%' }}>Part Number</td>
                <td className={valueCls} style={{ width: '17%' }}>{item.partNumber}</td>
                <td className={labelCls} style={{ width: '16%' }}>Part Name</td>
                <td className={valueCls} style={{ width: '17%' }}>{item.partName}</td>
                <td className={labelCls} style={{ width: '16%' }}>Project</td>
                <td className={valueCls}>{item.projeto}</td>
              </tr>
              <tr>
                <td className={labelCls}>Customer</td>
                <td className={valueCls}>{item.cliente}</td>
                <td className={labelCls}>Commodity</td>
                <td className={valueCls}>{item.commodity}</td>
                <td className={labelCls}>Supplier</td>
                <td className={valueCls}>{item.fornecedor}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse mb-3">
            <thead><tr><th colSpan={4} className={headerCls}>TRANSPORT SIMULATION</th></tr></thead>
            <tbody>
              <tr>
                <td className={labelCls} style={{ width: '25%' }}>Truck Length (mm)</td>
                <td className={valueCls} style={{ width: '25%' }}>{item.truckComprimento}</td>
                <td className={labelCls} style={{ width: '25%' }}>Truck Width (mm)</td>
                <td className={valueCls}>{item.truckLargura}</td>
              </tr>
              <tr>
                <td className={labelCls}>HU / Line</td>
                <td className={valueCls}>{calc?.huPorLinha}</td>
                <td className={labelCls}>HU / Length</td>
                <td className={valueCls}>{calc?.huPorComprimento}</td>
              </tr>
              <tr>
                <td className={labelCls}>HU / Truck</td>
                <td className={valueCls}>{calc?.huPorCaminhao}</td>
                <td className={labelCls}>Pcs / Truck</td>
                <td className={valueCls}>{calc?.pecasPorCaminhao}</td>
              </tr>
              <tr>
                <td className={labelCls}>Freight/Trip (R$)</td>
                <td className={valueCls}>{item.freteViagem}</td>
                <td className={labelCls}>Cost/Piece (R$)</td>
                <td className={valueCls}>{calc?.custoPorPeca.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse mb-3">
            <thead><tr><th colSpan={4} className={headerCls}>HANDLING UNIT DETAILS</th></tr></thead>
            <tbody>
              <tr>
                <td className={labelCls} style={{ width: '25%' }}>HU Length (mm)</td>
                <td className={valueCls} style={{ width: '25%' }}>{item.huMedC}</td>
                <td className={labelCls} style={{ width: '25%' }}>HU Width (mm)</td>
                <td className={valueCls}>{item.huMedL}</td>
              </tr>
              <tr>
                <td className={labelCls}>HU Height (mm)</td>
                <td className={valueCls}>{item.huMedA}</td>
                <td className={labelCls}>Total Height (mm)</td>
                <td className={valueCls}>{calc?.alturaTotal.toFixed(1)}</td>
              </tr>
              <tr>
                <td className={labelCls}>HU Weight (g)</td>
                <td className={valueCls}>{item.huPeso}</td>
                <td className={labelCls}>Total Weight HU (g)</td>
                <td className={valueCls}>{calc?.pesoTotalHU.toFixed(1)}</td>
              </tr>
              <tr>
                <td className={labelCls}>PU / Layer</td>
                <td className={valueCls}>{item.puPorCamada}</td>
                <td className={labelCls}>Layers</td>
                <td className={valueCls}>{item.camadas}</td>
              </tr>
              <tr>
                <td className={labelCls}>PU / HU</td>
                <td className={valueCls}>{calc?.puPorHU}</td>
                <td className={labelCls}>Pcs / HU</td>
                <td className={valueCls}>{calc?.pecasPorHU}</td>
              </tr>
            </tbody>
          </table>

          {calc && calc.alertas.length > 0 && (
            <table className="w-full border-collapse mb-3">
              <thead><tr><th className={headerCls}>ALERTS</th></tr></thead>
              <tbody>
                {calc.alertas.map((a, i) => (
                  <tr key={i}><td className="border border-black px-1.5 py-1 text-[10px] text-red-600 font-semibold">{a}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          <table className="w-full border-collapse">
            <thead><tr><th colSpan={3} className={headerCls}>SIGNATURES</th></tr></thead>
            <tbody>
              <tr>
                <td className={labelCls} style={{ width: '33%' }}>Logistics</td>
                <td className={labelCls} style={{ width: '33%' }}>Quality</td>
                <td className={labelCls} style={{ width: '33%' }}>Production</td>
              </tr>
              <tr>
                <td className={valueCls} style={{ height: '40px' }}></td>
                <td className={valueCls}></td>
                <td className={valueCls}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
