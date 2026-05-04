import { useMemo } from 'react';
import { getItems, getProjects } from '../utils/storage';
import { Package, CheckCircle, Clock, AlertTriangle, BarChart3, FileText, TrendingUp } from 'lucide-react';
import type { Commodity } from '../types';

const COMMODITIES: Commodity[] = ['CC', 'IP', 'BPFR', 'BPRR', 'SPOILER', 'TAILGATE'];

export default function Dashboard() {
  const items = useMemo(() => getItems(), []);
  const projects = useMemo(() => getProjects(), []);

  const total = items.length;
  const aprovados = items.filter((i) => i.status === 'Aprovado').length;
  const pendentes = items.filter((i) => i.status === 'Pendente').length;
  const semEmbalagem = items.filter((i) => i.status === 'Sem embalagem completa').length;

  const lpdsPorCommodity = COMMODITIES.map((c) => ({
    commodity: c,
    total: items.filter((i) => i.commodity === c).length,
    finalizadas: items.filter((i) => i.commodity === c && i.status === 'Aprovado').length,
    emProcesso: items.filter((i) => i.commodity === c && i.status !== 'Aprovado').length,
  }));

  const cards = [
    { label: 'Itens Cadastrados', value: total, icon: Package, color: 'bg-slate-700' },
    { label: 'Itens Aprovados', value: aprovados, icon: CheckCircle, color: 'bg-emerald-600' },
    { label: 'Pendentes', value: pendentes, icon: Clock, color: 'bg-amber-600' },
    { label: 'Sem Embalagem Completa', value: semEmbalagem, icon: AlertTriangle, color: 'bg-red-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Visão geral do sistema PackSys Industrial</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">LPDS por Commodity</h2>
          </div>
          <div className="space-y-3">
            {lpdsPorCommodity.map((c) => (
              <div key={c.commodity} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-slate-600">{c.commodity}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${total > 0 ? (c.total / total) * 100 : 0}%`, minWidth: c.total > 0 ? '2rem' : 0 }}
                  >
                    <span className="text-xs text-white font-semibold">{c.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Status por Commodity</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-slate-500 font-medium">Commodity</th>
                <th className="text-center py-2 text-slate-500 font-medium">Finalizadas</th>
                <th className="text-center py-2 text-slate-500 font-medium">Em Processo</th>
                <th className="text-center py-2 text-slate-500 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {lpdsPorCommodity.map((c) => (
                <tr key={c.commodity} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-slate-700">{c.commodity}</td>
                  <td className="text-center py-2">
                    <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {c.finalizadas}
                    </span>
                  </td>
                  <td className="text-center py-2">
                    <span className="inline-block bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {c.emProcesso}
                    </span>
                  </td>
                  <td className="text-center py-2 font-semibold text-slate-700">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Projetos Ativos</h2>
          </div>
          {projects.filter((p) => p.status === 'Ativo').length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum projeto ativo</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects
                .filter((p) => p.status === 'Ativo')
                .map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {p.imagemProduto && <img src={p.imagemProduto} alt="" className="w-10 h-10 rounded object-cover" />}
                      {p.imagemCliente && <img src={p.imagemCliente} alt="" className="w-10 h-10 rounded object-cover" />}
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{p.projeto}</p>
                    <p className="text-xs text-slate-500">{p.cliente} - {p.commodity}</p>
                    <p className="text-xs text-slate-400 mt-1">{p.planta}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
