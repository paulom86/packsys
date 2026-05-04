import { useMemo, useState } from 'react';
import { getItems, getProjects, getFornecedores } from '../utils/storage';
import { FileText, CheckCircle, Clock, Filter } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, YAxis as YAxis2,
  PieChart, Pie, Cell,
} from 'recharts';
import type { Commodity } from '../types';

const COMMODITIES: Commodity[] = ['CC', 'IP', 'BPFR', 'BPRR', 'SPOILER', 'TAILGATE'];
const GREEN  = '#22c55e';
const YELLOW = '#eab308';
const RED    = '#ef4444';
const BLUE   = '#3b82f6';
const NAVY   = '#1e3a8a';

export default function Dashboard() {
  const items       = useMemo(() => getItems(), []);
  const fornecedores = useMemo(() => getFornecedores(), []);

  const [activeCommodity, setActiveCommodity] = useState<Commodity | null>(null);
  const [showFin, setShowFin]   = useState(true);
  const [showProc, setShowProc] = useState(true);
  const [showPend, setShowPend] = useState(true);

  // ── métricas gerais ──────────────────────────────────
  const total      = items.length;
  const finalizadas = items.filter(i => i.status === 'Aprovado').length;
  const pendentes  = items.filter(i => i.status === 'Pendente').length;
  const acuracidade = total > 0 ? Math.round((finalizadas / total) * 100) : 0;

  // ── por commodity ────────────────────────────────────
  const porCommodity = COMMODITIES.map(c => {
    const cItems = items.filter(i => i.commodity === c);
    const fin  = cItems.filter(i => i.status === 'Aprovado').length;
    const proc = cItems.filter(i => i.status === 'Pendente').length;
    const pend = cItems.filter(i => i.status === 'Sem embalagem completa').length;
    return { commodity: c, Finalizadas: fin, 'Em Processo': proc, Pendente: pend, total: cItems.length };
  });

  // ── filtro ────────────────────────────────────────────
  const filtered = activeCommodity
    ? porCommodity.filter(c => c.commodity === activeCommodity)
    : porCommodity;

  // ── acuracidade por commodity ─────────────────────────
  const acuracidadePorComm = COMMODITIES.map(c => {
    const cItems = items.filter(i => i.commodity === c);
    return { commodity: c, total: cItems.length };
  });

  // ── evolução semanal (simulada com dados reais base) ──
  const semanas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'];
  const evolucao = semanas.map((s, idx) => {
    const base = Math.max(1, total);
    const fin  = Math.round((finalizadas / 5) * (idx + 1));
    const proc = Math.round((pendentes   / 5) * (idx + 1));
    const pend = Math.max(0, Math.round(base / 5) - fin - proc);
    const acu  = fin + proc + pend > 0 ? Math.round((fin / (fin + proc + pend)) * 100) : 0;
    return { semana: s, Finalizadas: fin, 'Em Processo': proc, Pendentes: pend, 'Acuracidade (%)': acu };
  });

  // ── fornecedores ──────────────────────────────────────
  const fornData = fornecedores.slice(0, 6).map(f => {
    const fItems = items.filter(i => i.fornecedor === f.nome);
    const fFin   = fItems.filter(i => i.status === 'Aprovado').length;
    const pctAss = fItems.length > 0 ? Math.round((fFin / fItems.length) * 100) : 0;
    const pendAss = fItems.filter(i => i.status !== 'Aprovado').length;
    return { nome: f.nome, total: fItems.length, pendente: pendAss, pct: pctAss };
  });

  // ── atividades recentes (baseadas nos itens) ──────────
  const atividades = items.slice(-5).reverse().map(i => ({
    hora: '—',
    texto: `${i.fornecedor || 'Fornecedor'} - ${i.partNumber} ${i.status}`,
  }));

  // ── donut chart ───────────────────────────────────────
  const donutData = [
    { name: 'Finalizadas', value: acuracidade },
    { name: 'Restante',    value: 100 - acuracidade },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-5">Visão geral do sistema PackSys Industrial</p>

      {/* ── CARDS SUPERIORES ── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {/* LPDS Cadastradas */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">LPDS Cadastradas</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">{total}</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-xl">
            <FileText className="w-7 h-7 text-white" />
          </div>
        </div>
        {/* LPDS Finalizadas */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">LPDS Finalizadas</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">{finalizadas}</p>
          </div>
          <div className="bg-emerald-500 p-3 rounded-xl">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>
        {/* LPDS Pendentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">LPDS Pendentes</p>
            <p className="text-4xl font-bold text-slate-800 mt-1">{pendentes}</p>
          </div>
          <div className="bg-amber-500 p-3 rounded-xl">
            <Clock className="w-7 h-7 text-white" />
          </div>
        </div>
        {/* Acuracidade Geral - donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Acuracidade Geral</p>
          <div className="flex items-center justify-center gap-3">
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <PieChart width={90} height={90}>
                <Pie data={donutData} cx={40} cy={40} innerRadius={28} outerRadius={40} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill={NAVY} />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <p className="text-sm font-bold text-slate-800 leading-none">{acuracidade}%</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Target: 100%</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">Acuracidade<br/>Geral: {acuracidade}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LINHA 2: barras + acuracidade por commodity ── */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* LPDS por Commodity */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-slate-700">📊 LPDS por Commodity</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filtered} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="commodity" tick={{ fontSize: 11 }} width={55} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              {showFin  && <Bar dataKey="Finalizadas"  stackId="a" fill={GREEN}  barSize={14} />}
              {showProc && <Bar dataKey="Em Processo"  stackId="a" fill={YELLOW} barSize={14} />}
              {showPend && <Bar dataKey="Pendente"     stackId="a" fill={RED}    barSize={14} label={{ position: 'right', fontSize: 10 }} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Acuracidade Geral por commodity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Acuracidade Geral</span>
          </div>
          <div className="space-y-1">
            {acuracidadePorComm.map(c => (
              <div key={c.commodity} className="flex justify-between text-sm text-slate-600">
                <span>Total LPDs ({c.commodity})</span>
                <span className="font-semibold">{c.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LINHA 3: evolução semanal + status por commodity ── */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Evolução Semanal */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">📈 Evolução Semanal das LPDS</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={evolucao} margin={{ right: 30 }}>
              <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" unit="%" domain={[0,100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="Finalizadas"   stroke={GREEN}  strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="Em Processo"   stroke={YELLOW} strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="Pendentes"     stroke={RED}    strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="Acuracidade (%)" stroke={BLUE} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status por Commodity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">〜 Status por Commodity</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-gray-100">
                <th className="text-left py-1">Commodity</th>
                <th className="text-center">Finalizadas</th>
                <th className="text-center">Em Processo</th>
                <th className="text-center">Pendente (Falta)</th>
                <th className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {porCommodity.map(c => (
                <tr key={c.commodity} className="border-b border-gray-50">
                  <td className="py-1 font-medium text-slate-700">{c.commodity}</td>
                  <td className="text-center"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">{c.Finalizadas}</span></td>
                  <td className="text-center"><span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-semibold">{c['Em Processo']}</span></td>
                  <td className="text-center"><span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">{c.Pendente}</span></td>
                  <td className="text-center font-semibold text-slate-700">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-5">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Filtro rápido por commodity */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">Filtro Rápido por Commodity</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {COMMODITIES.map(c => (
                <button key={c}
                  onClick={() => setActiveCommodity(activeCommodity === c ? null : c)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    activeCommodity === c
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-gray-300 hover:border-emerald-400'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Filtros de status */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs font-semibold text-slate-600">≡ Filtros</span>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={showFin} onChange={e => setShowFin(e.target.checked)} className="accent-emerald-500" />
                <span className="text-slate-600">Finalizadas</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={showProc} onChange={e => setShowProc(e.target.checked)} className="accent-yellow-500" />
                <span className="text-slate-600">Em Processo</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={showPend} onChange={e => setShowPend(e.target.checked)} className="accent-red-500" />
                <span className="text-slate-600">Pendente</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── FORNECEDORES + ATIVIDADES ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Gestão de Fornecedores */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">⊞ Gestão de Fornecedores</p>
          {fornData.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhum fornecedor cadastrado ainda.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-gray-100">
                  <th className="text-left py-1">Fornecedor</th>
                  <th className="text-center">Total LPDs (Filtrado)</th>
                  <th className="text-center">Pendente Assinatura (Filtrado)</th>
                  <th className="text-center">% Assinatura Individual</th>
                </tr>
              </thead>
              <tbody>
                {fornData.map(f => (
                  <tr key={f.nome} className="border-b border-gray-50">
                    <td className="py-1.5 font-medium text-slate-700">{f.nome}</td>
                    <td className="text-center text-slate-600">{f.total}</td>
                    <td className="text-center">
                      {f.pendente > 0
                        ? <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">{f.pendente}</span>
                        : <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">0</span>
                      }
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div style={{ position: 'relative', width: 36, height: 36 }}>
                          <PieChart width={36} height={36}>
                            <Pie data={[{ value: f.pct },{ value: 100 - f.pct }]} cx={14} cy={14}
                              innerRadius={10} outerRadius={16} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                              <Cell fill={NAVY} />
                              <Cell fill="#e2e8f0" />
                            </Pie>
                          </PieChart>
                          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-52%)', fontSize: 7, fontWeight: 700, color: '#1e293b' }}>
                            {f.pct}%
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">Atividades Recentes de Fornecedores</p>
          {atividades.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhuma atividade ainda.</p>
          ) : (
            <div className="space-y-2.5">
              {atividades.map((a, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                  <p className="text-xs text-slate-600 leading-tight">{a.hora} - {a.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
