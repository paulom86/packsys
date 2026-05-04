import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ─────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────
const BLUE = '#1e3a5f';
const BORDER = '1px solid #000';
const FONT = 'Arial, Helvetica, sans-serif';

const PAGE: React.CSSProperties = {
  width: '297mm',
  height: '210mm',
  padding: '4mm',
  boxSizing: 'border-box',
  background: '#fff',
  overflow: 'hidden',
  fontFamily: FONT,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6mm',
};

const TABLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

const BASE_CELL: React.CSSProperties = {
  border: BORDER,
  padding: '0.4mm 1mm',
  fontSize: '6.8px',
  lineHeight: '1.1',
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

const LABEL: React.CSSProperties = {
  ...BASE_CELL,
  background: '#e6e6e6',
  fontWeight: 700,
  color: '#111',
};

const VALUE: React.CSSProperties = {
  ...BASE_CELL,
  background: '#fff',
  color: '#222',
};

const HDR_CELL: React.CSSProperties = {
  ...BASE_CELL,
  background: BLUE,
  color: '#fff',
  fontWeight: 700,
  textAlign: 'center',
  fontSize: '7px',
};

const SEC_TITLE: React.CSSProperties = {
  background: BLUE,
  color: '#fff',
  fontWeight: 700,
  fontSize: '7px',
  padding: '0.6mm 1.5mm',
  border: BORDER,
  height: '4mm',
  boxSizing: 'border-box',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
};

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
type CalcResult = ReturnType<typeof calculateFields> | null;

function v(val: unknown): string {
  if (val === null || val === undefined || val === '') return '-';
  return String(val);
}

function yn(val: unknown): string {
  return val ? 'Yes' : 'No';
}

// ─────────────────────────────────────────────
//  SHARED COMPONENTS
// ─────────────────────────────────────────────
function PageHeader({ title, page }: { title: string; page: string }) {
  return (
    <div style={{ flex: '0 0 8.5mm', display: 'flex' }}>
      <table style={{ ...TABLE, height: '8.5mm' }}>
        <tbody>
          <tr>
            <td style={{ ...HDR_CELL, width: '55mm', textAlign: 'left', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>
              ▪ FORVIA
            </td>
            <td style={{ ...HDR_CELL, fontSize: '8.5px', fontWeight: 800 }}>{title}</td>
            <td style={{ ...HDR_CELL, width: '28mm', textAlign: 'right', fontSize: '6.5px' }}>{page}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={SEC_TITLE}>{children}</div>;
}

function Footer() {
  return (
    <div style={{
      flex: '0 0 3.5mm',
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid #aaa',
      paddingTop: '0.4mm',
      fontSize: '5px',
      color: '#777',
      alignItems: 'flex-end',
    }}>
      <span>Property of Faurecia — Internal Documentation. Confidential.</span>
      <span>FAU-F-PSG-2027 — Issue 02 — 07/17</span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE 1 SECTIONS
//  Total: 8.5 + 0.6 + 23 + 0.6 + 9.5 + 0.6 + 75 + 0.6 + 40 + 0.6 + 15 + 0.6 + 20 + 0.6 + 3.5 = ~199mm ✓
// ─────────────────────────────────────────────

function PartDescription({ item }: { item: Item }) {
  return (
    <div style={{ flex: '0 0 23mm' }}>
      <SectionTitle>PART DESCRIPTION</SectionTitle>
      <table style={{ ...TABLE, height: '19mm' }}>
        <colgroup>
          <col style={{ width: '13%' }} /><col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '12%' }} />
          <col style={{ width: '15%' }} /><col style={{ width: '12%' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '10%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '4.75mm' }}>
            <td style={LABEL}>Part Number</td><td style={VALUE}>{v(item.partNumber)}</td>
            <td style={LABEL}>Part Name</td><td style={VALUE}>{v(item.partName)}</td>
            <td style={LABEL}>Project / Program</td><td style={VALUE}>{v(item.projeto)}</td>
            <td style={LABEL}>Customer / OEM</td><td style={VALUE}>{v(item.cliente)}</td>
          </tr>
          <tr style={{ height: '4.75mm' }}>
            <td style={LABEL}>Commodity</td><td style={VALUE}>{v(item.commodity)}</td>
            <td style={LABEL}>Pcs / Car</td><td style={VALUE}>{v(item.pecasPorCarro)}</td>
            <td style={LABEL}>Buy / Make</td><td style={VALUE}>{v(item.buyMake)}</td>
            <td style={LABEL}>Instruction For</td><td style={VALUE}>{v(item.instructionFor)}</td>
          </tr>
          <tr style={{ height: '4.75mm' }}>
            <td style={LABEL}>Nacional / Import.</td><td style={VALUE}>{v(item.nacionalImportado)}</td>
            <td style={LABEL}>N1</td><td style={VALUE}>{item.n1 ? 'X' : ''}</td>
            <td style={LABEL}>N0</td><td style={VALUE}>{item.n0 ? 'X' : ''}</td>
            <td style={LABEL}>Carry Over</td><td style={VALUE}>{item.carryOver ? 'X' : ''}</td>
          </tr>
          <tr style={{ height: '4.75mm' }}>
            <td style={LABEL}>Reposição</td><td style={VALUE}>{item.reposicao ? 'X' : ''}</td>
            <td style={LABEL}>Consignação</td><td style={VALUE}>{item.consignacao ? 'X' : ''}</td>
            <td style={LABEL}></td><td style={VALUE}></td>
            <td style={LABEL}></td><td style={VALUE}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SupplierRow({ item }: { item: Item }) {
  return (
    <div style={{ flex: '0 0 9.5mm' }}>
      <SectionTitle>SUPPLIER</SectionTitle>
      <table style={{ ...TABLE, height: '5.5mm' }}>
        <colgroup>
          <col style={{ width: '13%' }} /><col style={{ width: '37%' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '22%' }} />
          <col style={{ width: '7%' }} /><col style={{ width: '8%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={LABEL}>Supplier Name</td><td style={VALUE}>{v(item.fornecedor)}</td>
            <td style={LABEL}>Supplier Code</td><td style={VALUE}>{v(item.codFornecedor)}</td>
            <td style={LABEL}></td><td style={VALUE}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PackagingTable({ item, calc }: { item: Item; calc: CalcResult }) {
  const COLS = ['', 'Part', 'Packaging Unit (PU)', 'Handling Unit (HU)', 'Dunnage 1', 'Dunnage 2', 'Dunnage 3'];
  type Row = [string, unknown, unknown, unknown, unknown, unknown, unknown];
  const ROWS: Row[] = [
    ['Code',                item.partNumber,  item.puCode,      '-',                      '-', '-', '-'],
    ['Description',         item.partName,    item.puDesc,      '-',                      '-', '-', '-'],
    ['Material',            '-',              item.puMaterial,  '-',                      '-', '-', '-'],
    ['Type',                '-',              item.puTipo,      '-',                      '-', '-', '-'],
    ['Length (mm)',          item.comprimento, item.puMedC,     item.huMedC,              '-', '-', '-'],
    ['Width (mm)',           item.largura,     item.puMedL,     item.huMedL,              '-', '-', '-'],
    ['Height (mm)',          item.altura,      item.puMedA,     item.huMedA,              '-', '-', '-'],
    ['Weight (g)',           item.peso,        item.puPeso,     item.huPeso,              '-', '-', '-'],
    ['Pcs / PU',            '-',              item.pecasPorPU, '-',                      '-', '-', '-'],
    ['Gross Weight PU (g)', '-',              item.brutoPU,    '-',                      '-', '-', '-'],
    ['PU / Layer',          '-',              '-',             item.puPorCamada,         '-', '-', '-'],
    ['Layers',              '-',              '-',             item.camadas,             '-', '-', '-'],
    ['PU / HU',             '-',              '-',             calc?.puPorHU   ?? '-',   '-', '-', '-'],
    ['Pcs / HU',            '-',              '-',             calc?.pecasPorHU ?? '-',  '-', '-', '-'],
    ['Stackable',           '-',              '-',             yn(item.empilhavel),      '-', '-', '-'],
    ['Returnable',          '-',              '-',             yn(item.retornavel),      '-', '-', '-'],
  ];

  return (
    <div style={{ flex: '0 0 75mm' }}>
      <table style={TABLE}>
        <colgroup>
          <col style={{ width: '15%' }} />
          {COLS.slice(1).map((_, i) => <col key={i} style={{ width: `${85 / 6}%` }} />)}
        </colgroup>
        <thead>
          <tr style={{ height: '5mm' }}>
            {COLS.map((c, i) => <th key={i} style={HDR_CELL}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => (
            <tr key={ri} style={{ height: '4.375mm' }}>
              <td style={LABEL}>{row[0]}</td>
              {(row.slice(1) as unknown[]).map((c, ci) => (
                <td key={ci} style={VALUE}>{v(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PicturesRow({ item, title, imgHeight }: { item: Item; title: string; imgHeight: string }) {
  const imgs = [item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage, '', ''];
  const lbls = ['Part', 'PU', 'HU', 'Dunnage 1', 'Dunnage 2', 'Dunnage 3'];

  return (
    <div style={{ flex: `0 0 ${imgHeight}` }}>
      <SectionTitle>{title}</SectionTitle>
      <table style={{ ...TABLE, height: `calc(${imgHeight} - 4mm)` }}>
        <colgroup>
          <col style={{ width: '8%' }} />
          {lbls.map((_, i) => <col key={i} style={{ width: `${92 / 6}%` }} />)}
        </colgroup>
        <thead>
          <tr style={{ height: '4mm' }}>
            <th style={HDR_CELL}></th>
            {lbls.map((l, i) => <th key={i} style={HDR_CELL}>{l}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...LABEL, textAlign: 'center', fontSize: '6px' }}>Photos</td>
            {imgs.map((img, idx) => (
              <td key={idx} style={{ ...VALUE, textAlign: 'center', verticalAlign: 'middle', padding: '1mm' }}>
                {img ? (
                  <img
                    src={img}
                    alt=""
                    crossOrigin="anonymous"
                    style={{ maxHeight: `calc(${imgHeight} - 10mm)`, maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />
                ) : (
                  <span style={{ color: '#ccc', fontSize: '5.5px' }}>—</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RemarksBox({ title, height }: { title: string; height: string }) {
  return (
    <div style={{ flex: `0 0 ${height}` }}>
      <SectionTitle>{title}</SectionTitle>
      <div style={{ border: BORDER, borderTop: 'none', height: `calc(${height} - 4mm)`, background: '#fff' }} />
    </div>
  );
}

function SignaturesBox({ height }: { height: string }) {
  const cols = ['Supplier', 'ENG Packaging', 'Supply Chain'];
  return (
    <div style={{ flex: `0 0 ${height}` }}>
      <SectionTitle>SIGNATURES</SectionTitle>
      <table style={{ ...TABLE, height: `calc(${height} - 4mm)` }}>
        <colgroup>{cols.map((_, i) => <col key={i} style={{ width: `${100 / 3}%` }} />)}</colgroup>
        <tbody>
          <tr style={{ height: '5mm' }}>{cols.map(c => <td key={c} style={LABEL}>{c}</td>)}</tr>
          <tr>{cols.map(c => <td key={c} style={VALUE}></td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE ASSEMBLIES
// ─────────────────────────────────────────────
function PageOne({ item, calc }: { item: Item; calc: CalcResult }) {
  return (
    <div style={PAGE}>
      <PageHeader title="Packaging Data Sheet — Series" page="Page 1 / 2" />
      <PartDescription item={item} />
      <SupplierRow item={item} />
      <PackagingTable item={item} calc={calc} />
      <PicturesRow item={item} title="PICTURES" imgHeight="40mm" />
      <RemarksBox title="REMARKS" height="15mm" />
      <SignaturesBox height="20mm" />
      <Footer />
    </div>
  );
}

function BackupData({ item, calc }: { item: Item; calc: CalcResult }) {
  return (
    <div style={{ flex: '0 0 23mm' }}>
      <SectionTitle>BACK-UP PACKAGING DATA</SectionTitle>
      <table style={{ ...TABLE, height: '19mm' }}>
        <colgroup>
          <col style={{ width: '15%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} /><col style={{ width: '10%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '6.3mm' }}>
            <td style={LABEL}>Truck Length (mm)</td><td style={VALUE}>{v(item.truckComprimento)}</td>
            <td style={LABEL}>Truck Width (mm)</td><td style={VALUE}>{v(item.truckLargura)}</td>
            <td style={LABEL}>Freight / Trip (R$)</td><td style={VALUE}>{v(item.freteViagem)}</td>
            <td style={LABEL}>HU / Truck</td><td style={VALUE}>{v(calc?.huPorCaminhao)}</td>
          </tr>
          <tr style={{ height: '6.3mm' }}>
            <td style={LABEL}>Pcs / Truck</td><td style={VALUE}>{v(calc?.pecasPorCaminhao)}</td>
            <td style={LABEL}>Cost / Piece (R$)</td><td style={VALUE}>{calc ? calc.custoPorPeca.toFixed(4) : '-'}</td>
            <td style={LABEL}>Total Weight HU (g)</td><td style={VALUE}>{calc ? calc.pesoTotalHU.toFixed(1) : '-'}</td>
            <td style={LABEL}>Total Height (mm)</td><td style={VALUE}>{calc ? calc.alturaTotal.toFixed(1) : '-'}</td>
          </tr>
          <tr style={{ height: '6.3mm' }}>
            <td style={LABEL}>HU / Line</td><td style={VALUE}>{v(calc?.huPorLinha)}</td>
            <td style={LABEL}>HU / Length</td><td style={VALUE}>{v(calc?.huPorComprimento)}</td>
            <td style={LABEL}>PU / HU</td><td style={VALUE}>{v(calc?.puPorHU)}</td>
            <td style={LABEL}>Pcs / HU</td><td style={VALUE}>{v(calc?.pecasPorHU)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PageTwo({ item, calc }: { item: Item; calc: CalcResult }) {
  return (
    <div style={PAGE}>
      <PageHeader title="Packaging Data Sheet — Back Up" page="Page 2 / 2" />
      <BackupData item={item} calc={calc} />
      <PicturesRow item={item} title="BACK-UP PICTURES" imgHeight="68mm" />
      <RemarksBox title="BACK-UP REMARKS" height="50mm" />
      <SignaturesBox height="28mm" />
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────
//  PRINT STYLES
// ─────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  @page { size: A4 landscape; margin: 0; }
  body * { visibility: hidden !important; }
  #lpds-print-area, #lpds-print-area * { visibility: visible !important; }
  #lpds-print-area { position: fixed !important; top: 0; left: 0; background: #fff; gap: 0 !important; }
}
.lpds-pb { page-break-after: always; break-after: page; }
`;

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function LPDSPreview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const itemId = params.get('item');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string>(itemId || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const all = getItems();
    setItems(all);
    setProjects(getProjects());
    if (!itemId && all.length > 0) setSelectedId(all[0].id);
  }, [itemId]);

  const item = items.find((i) => i.id === selectedId);
  const calc = item ? calculateFields(item) : null;
  const activeProjectId = getActiveProjectId();
  const linkedProject = projects.find(
    (p) => p.projeto === item?.projeto || p.id === activeProjectId,
  );

  const handleDownloadPDF = async () => {
    if (!printRef.current || !item) return;
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `LPDS_${item.partNumber || 'documento'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 1123,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['css', 'legacy'], before: '.lpds-pb' },
        })
        .from(printRef.current)
        .save();
    } finally {
      setExporting(false);
    }
  };

  if (!item) {
    return (
      <div className="p-8">
        <button
          onClick={() => navigate('/items')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">LPDS Preview</h1>
        <p className="text-sm text-slate-400 mb-4">
          {items.length === 0
            ? 'Nenhum item cadastrado. Cadastre um item primeiro.'
            : 'Selecione um item para visualizar o LPDS.'}
        </p>
        {items.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">— selecione um item —</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.partNumber} — {i.partName}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <style>{PRINT_CSS}</style>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/items')}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LPDS Preview</h1>
            <p className="text-xs text-slate-500">
              {item.partNumber} — {item.partName}
              {linkedProject && (
                <span className="ml-2 text-slate-400">
                  | Projeto: {linkedProject.projeto}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-slate-700"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.partNumber} — {i.partName}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownloadPDF}
            disabled={exporting}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Gerando PDF…' : 'Baixar PDF'}
          </button>
        </div>
      </div>

      {/* Alertas */}
      {calc && calc.alertas.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg print:hidden">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            ⚠ Alertas de inconsistência
          </p>
          {calc.alertas.map((a, i) => (
            <p key={i} className="text-xs text-amber-700">• {a}</p>
          ))}
        </div>
      )}

      {/* Área de impressão */}
      <div
        ref={printRef}
        id="lpds-print-area"
        style={{
          fontFamily: FONT,
          background: '#e8e8e8',
          margin: '0 auto',
          width: '297mm',
          display: 'flex',
          flexDirection: 'column',
          gap: '5mm',
        }}
      >
        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <PageOne item={item} calc={calc} />
        </div>

        {/* divisor de página — html2pdf usa isso como page break */}
        <div className="lpds-pb" style={{ height: 0, overflow: 'hidden' }} />

        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <PageTwo item={item} calc={calc} />
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 print:hidden text-center">
        A4 landscape — cada bloco acima = 1 página do PDF
      </p>
    </div>
  );
}
