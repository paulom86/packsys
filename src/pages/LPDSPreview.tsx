import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ═══════════════════════════════════════════════════════
//  TOKENS
// ═══════════════════════════════════════════════════════
const BLUE   = '#1a3a6b';
const BORDER = '1px solid #000';
const FONT   = 'Arial, Helvetica, sans-serif';
const FS     = '6.4px';

const PAGE: React.CSSProperties = {
  width: '297mm', height: '210mm',
  padding: '2.5mm 3mm',
  boxSizing: 'border-box',
  background: '#fff',
  overflow: 'hidden',
  fontFamily: FONT,
  display: 'flex', flexDirection: 'column', gap: '0.4mm',
};

const T: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' };

// células base
const C = (extra?: React.CSSProperties): React.CSSProperties => ({
  border: BORDER, padding: '0.25mm 0.8mm',
  fontSize: FS, lineHeight: '1.2',
  verticalAlign: 'middle', overflow: 'hidden',
  ...extra,
});

const LB = C({ background: '#c8c8c8', fontWeight: 700, whiteSpace: 'nowrap' });
const VL = C({ background: '#fff' });
const HD = C({ background: BLUE, color: '#fff', fontWeight: 700, textAlign: 'center' });
const SEC_ROW = C({ background: '#000', color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '7px', height: '4mm' });

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
type Calc = ReturnType<typeof calculateFields> | null;
const v = (x: unknown) => (x === null || x === undefined || x === '') ? '' : String(x);
const chk = (val: boolean) => (
  <span style={{ fontSize: '8px', lineHeight: 1 }}>{val ? '☑' : '☐'}</span>
);

function SecRow({ label, cols = 8 }: { label: string; cols?: number }) {
  return (
    <tr>
      <td colSpan={cols} style={SEC_ROW}>{label}</td>
    </tr>
  );
}

function Footer() {
  return (
    <div style={{ flex: '0 0 3mm', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #aaa', paddingTop: '0.3mm', fontSize: '5px', color: '#666', alignItems: 'flex-end' }}>
      <span>Property of Faurecia — Internal Documentation.</span>
      <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CABEÇALHO — logo + título + versão/data (mesclado)
// ═══════════════════════════════════════════════════════
function PageHeader({ title, version, date, logo }: { title: string; version: string; date: string; logo: string }) {
  return (
    <table style={{ ...T, flex: '0 0 9mm', height: '9mm' }}>
      <tbody>
        <tr>
          {/* Logo */}
          <td style={{ ...C({ background: '#fff', width: '28mm', textAlign: 'center', padding: '0.5mm' }), border: BORDER }}>
            {logo
              ? <img src={logo} alt="logo" style={{ maxHeight: '7.5mm', maxWidth: '26mm', objectFit: 'contain' }} />
              : <span style={{ fontWeight: 900, fontSize: '9px', color: BLUE }}>·faurecia</span>
            }
          </td>
          {/* Título */}
          <td style={{ ...HD, fontSize: '9.5px', fontWeight: 900, textAlign: 'center' }}>{title}</td>
          {/* Versão/Data */}
          <td style={{ ...C({ background: '#fff', width: '48mm' }), border: BORDER }}>
            <table style={{ ...T, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ ...C({ background: '#c8c8c8', width: '50%', fontWeight: 700 }), border: BORDER }}>Document version</td>
                  <td style={{ ...C({ background: '#fff' }), border: BORDER }}>{version}</td>
                </tr>
                <tr>
                  <td style={{ ...C({ background: '#c8c8c8', fontWeight: 700 }), border: BORDER }}>Date</td>
                  <td style={{ ...C({ background: '#fff' }), border: BORDER }}>{date}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ═══════════════════════════════════════════════════════
//  PÁGINA 1
// ═══════════════════════════════════════════════════════
function PageOne({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  return (
    <div style={PAGE}>
      <PageHeader
        title="Packaging Data Sheet - Series (page 1/2)"
        version={v(item.documentVersion) || 'v1'}
        date={v(item.startOfUse) || '—'}
        logo={logo}
      />

      {/* ── PART DESCRIPTION + SUPPLIER ── */}
      <div style={{ flex: '0 0 19mm', display: 'flex', gap: '0' }}>
        {/* Part Description */}
        <table style={{ ...T, flex: 3, borderRight: 'none' }}>
          <tbody>
            <SecRow label="Part Description" cols={6} />
            <tr style={{ height: '3.8mm' }}>
              <td style={{ ...LB, width: '18%' }}>Faurecia part number(s)</td>
              <td style={{ ...VL, width: '32%' }} colSpan={3}>{v(item.partNumber)}</td>
              <td style={{ ...LB, width: '12%' }}>Program</td>
              <td style={{ ...VL, width: '20%' }}>{v(item.projeto)}</td>
            </tr>
            <tr style={{ height: '3.8mm' }}>
              <td style={LB}>Description</td>
              <td style={VL} colSpan={3}>{v(item.partName)}</td>
              <td style={LB}>Commodity</td>
              <td style={VL}>{v(item.commodity)}</td>
            </tr>
            <tr style={{ height: '3.8mm' }}>
              <td style={LB}>Daily consumption</td>
              <td style={VL}>{v(item.dailyConsumption)}</td>
              <td style={{ ...LB, width: '12%' }}>Part unit</td>
              <td style={{ ...VL, width: '12%' }}>{v(item.partUnit) || 'Part'}</td>
              <td style={LB}>Start of use</td>
              <td style={VL}>{v(item.startOfUse)}</td>
            </tr>
          </tbody>
        </table>
        {/* Supplier */}
        <table style={{ ...T, flex: 1 }}>
          <tbody>
            <SecRow label="Supplier" cols={2} />
            <tr style={{ height: '3.8mm' }}>
              <td style={{ ...LB, width: '45%' }}>Supplier name</td>
              <td style={VL}>{v(item.fornecedor)}</td>
            </tr>
            <tr style={{ height: '3.8mm' }}>
              <td style={LB}>Supplier code</td>
              <td style={VL}>{v(item.codFornecedor)}</td>
            </tr>
            <tr style={{ height: '3.8mm' }}>
              <td style={LB}>Valid for Faurecia plant</td>
              <td style={VL}>{v(item.validForPlant)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PACKAGING DATA ── */}
      <div style={{ flex: '0 0 19mm' }}>
        <table style={T}>
          <tbody>
            <SecRow label="Packaging data" cols={10} />
            <tr style={{ height: '3.5mm' }}>
              <td style={{ ...LB, width: '12%' }}>Serial packaging</td>
              <td style={{ ...VL, width: '8%' }}>{v(item.serialPackaging)}</td>
              <td style={{ ...LB, width: '14%' }}>Total packaging loop</td>
              <td style={{ ...VL, width: '6%' }}>{v(item.totalPackagingLoop)}</td>
              <td style={{ ...LB, width: '5%' }}>days</td>
              <td style={{ ...C({ background: '#fff', width: '4%', textAlign: 'center' }) }}></td>
              <td style={{ ...C({ background: '#fff', width: '4%', textAlign: 'center' }) }}></td>
              <td style={{ ...LB, width: '14%', textAlign: 'right' }}>Reusable packaging</td>
              <td style={{ ...VL, width: '5%', textAlign: 'center' }}>{chk(item.reusablePackaging)}</td>
              <td style={{ ...VL, width: '5%', textAlign: 'center' }}>{chk(!item.reusablePackaging)}</td>
            </tr>
            <tr style={{ height: '3.5mm' }}>
              <td style={LB}>Back-up packaging</td>
              <td style={VL}></td>
              <td style={LB}>Packaging stock at supplier</td>
              <td style={VL}>{v(item.packagingStockSupplier)}</td>
              <td style={LB}>days</td>
              <td style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>yes</td>
              <td style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>no</td>
              <td style={{ ...LB, textAlign: 'right' }}>Rented packaging</td>
              <td style={{ ...VL, textAlign: 'center' }}>{chk(item.rentedPackaging)}</td>
              <td style={{ ...VL, textAlign: 'center' }}>{chk(!item.rentedPackaging)}</td>
            </tr>
            <tr style={{ height: '3.5mm' }}>
              <td style={LB}>Box label standard</td>
              <td style={VL}></td>
              <td style={LB}>Total number of PU</td>
              <td style={VL}>{v(item.totalPU)}</td>
              <td style={VL}></td>
              <td colSpan={2} style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>If "yes", rental company</td>
              <td style={{ ...LB, textAlign: 'right' }}>Mixed pallet</td>
              <td style={{ ...VL, textAlign: 'center' }}>{chk(item.mixedPallet)}</td>
              <td style={{ ...VL, textAlign: 'center' }}>{chk(!item.mixedPallet)}</td>
            </tr>
            <tr style={{ height: '3.5mm' }}>
              <td style={LB}>Box label qty / PU</td>
              <td style={VL}>{v(item.boxLabelQty)}</td>
              <td colSpan={2} style={LB}>Calculation based on:</td>
              <td style={{ ...LB, width: '18%' }}>Minimum Order Quantity (in units)</td>
              <td style={{ ...VL, width: '5%' }} colSpan={2}>{v(item.moq)}</td>
              <td style={{ ...LB, width: '12%' }}>- Delivery frequency</td>
              <td style={VL}>{v(item.deliveryFrequency)}</td>
              <td style={{ ...LB, fontSize: '5.5px' }}>per week</td>
            </tr>
            <tr style={{ height: '3.5mm' }}>
              <td style={VL} colSpan={2}></td>
              <td style={VL} colSpan={2}></td>
              <td style={LB}>Order Lot size (in units)</td>
              <td style={VL} colSpan={2}>{v(item.orderLotSize)}</td>
              <td style={LB}>- Return frequency</td>
              <td style={VL}>{v(item.returnFrequency)}</td>
              <td style={{ ...LB, fontSize: '5.5px' }}>per week</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── TABELA PRINCIPAL Part / PU / HU / Dunnage 1-3 ── */}
      <div style={{ flex: '0 0 54mm' }}>
        <table style={T}>
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '11%' }} />
          </colgroup>
          <thead>
            <tr style={{ height: '4mm' }}>
              <th style={HD}></th>
              <th style={HD}>Part</th>
              <th style={HD}>Packaging Unit = PU</th>
              <th style={HD}>Handling Unit = HU</th>
              <th style={{ ...HD, background: '#fff', border: 'none' }}></th>
              <th style={HD}>Dunnage 1</th>
              <th style={HD}>Dunnage 2</th>
              <th style={HD}>Dunnage 3</th>
              <th style={{ ...HD, background: '#fff', border: 'none' }}></th>
            </tr>
          </thead>
          <tbody>
            {/* Faurecia part number */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Faurecia part number</td>
              <td style={VL}>{v(item.partNumber)}</td>
              <td style={VL}>{v(item.puCode)}</td>
              <td style={VL}>{v(item.huMedC) ? `TM${v(item.huMedC)}` : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.dun1Code)}</td>
              <td style={VL}>{v(item.dun2Code)}</td>
              <td style={VL}>{v(item.dun3Code)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Description */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Description</td>
              <td style={VL}>{v(item.partName)}</td>
              <td style={VL}>{v(item.puDesc)}</td>
              <td style={VL}>{v(item.huMedC) ? `${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}` : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.dun1Desc)}</td>
              <td style={VL}>{v(item.dun2Desc)}</td>
              <td style={VL}>{v(item.dun3Desc)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Length */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Length (mm)</td>
              <td style={VL}>{v(item.comprimento)}</td>
              <td style={VL}>{v(item.puMedC)}</td>
              <td style={VL}>{v(item.huMedC)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.dun1MedC)}</td>
              <td style={VL}>{v(item.dun2MedC)}</td>
              <td style={VL}>{v(item.dun3MedC)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Width */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Width (mm)</td>
              <td style={VL}>{v(item.largura)}</td>
              <td style={VL}>{v(item.puMedL)}</td>
              <td style={VL}>{v(item.huMedL)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.dun1MedL)}</td>
              <td style={VL}>{v(item.dun2MedL)}</td>
              <td style={VL}>{v(item.dun3MedL)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Height */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Height (mm)</td>
              <td style={VL}>{v(item.altura)}</td>
              <td style={VL}>{v(item.puMedA)}</td>
              <td style={VL}>{v(item.huMedA)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.dun1MedA)}</td>
              <td style={VL}>{v(item.dun2MedA)}</td>
              <td style={VL}>{v(item.dun3MedA)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Tare Weight */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Tare Weight (kg)</td>
              <td style={VL}>{v(item.peso)}</td>
              <td style={VL}>{v(item.puPeso)}</td>
              <td style={VL}>{v(item.huPeso)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td><td style={VL}></td><td style={VL}></td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Gross Weight */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Gross Weight (kg)</td>
              <td style={VL}>{v(item.brutoPU)}</td>
              <td style={VL}>{v(item.puPesoBruto)}</td>
              <td style={VL}>{v(item.huPesoBruto)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td><td style={VL}></td><td style={VL}></td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Package Density + Qty dunnages/PU */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Package Density (units)</td>
              <td style={VL}></td>
              <td style={VL}>{v(item.pecasPorPU)}</td>
              <td style={VL}>{v(item.puPorCamada) && v(item.camadas) ? String(Number(item.puPorCamada) * Number(item.camadas)) : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Qty dunnages / PU</td>
              <td style={VL}>{v(item.dun1QtyPerPU)}</td>
              <td style={VL}>{v(item.dun2QtyPerPU)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* PU/layer + Qty dunnages/HU */}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>PU / layer of HU</td>
              <td style={VL}>{v(item.puPorCamada)}</td>
              <td style={VL}></td>
              <td style={VL}></td>
              <td style={{ border: 'none' }}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Qty dunnages / HU</td>
              <td style={VL}>{v(item.dun1QtyPerHU)}</td>
              <td style={VL}>{v(item.dun2QtyPerHU)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Quantity PU/HU + Stackability */}
            <tr style={{ height: '5mm' }}>
              <td style={LB}>Quantity PU / HU</td>
              <td style={VL}>{v(item.puPorCamada)}</td>
              <td style={VL}></td>
              <td style={VL}>{v(calc?.puPorHU)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>
                Stackability<br />(qty of levels per stack)
              </td>
              <td style={{ ...VL, fontSize: '5.5px' }}>
                Static {v(item.empilhavelStatic)}
              </td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Foldable ratio</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {/* Dynamic */}
            <tr style={{ height: '3.5mm' }}>
              <td style={VL} colSpan={4}></td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td>
              <td style={{ ...VL, fontSize: '5.5px' }}>Dynamic {v(item.empilhavelDynamic)}</td>
              <td style={VL}>{v(item.foldableRatio)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PICTURES ── 4 colunas */}
      <div style={{ flex: '0 0 38mm' }}>
        <table style={{ ...T, height: '38mm' }}>
          <colgroup>
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr style={{ height: '4mm' }}>
              <th style={HD}>Part</th>
              <th style={HD}>PU with parts (+ show label location)</th>
              <th style={HD}>Complete HU with cover (+ show label location)</th>
              <th style={HD}>Dunnage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
                <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: '1mm', height: '32mm' }}>
                  {img
                    ? <img src={img} alt="" crossOrigin="anonymous" style={{ maxHeight: '30mm', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div style={{ ...C({ background: '#000', color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '7px', height: '3.8mm' }), border: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Pictures
        </div>
      </div>

      {/* ── REMARKS ── */}
      <div style={{ flex: '0 0 12mm' }}>
        <div style={{ ...SEC_ROW, height: '3.8mm', display: 'flex', alignItems: 'center', justifyContent: 'center', border: BORDER }}>Remarks</div>
        <div style={{ border: BORDER, borderTop: 'none', height: '8.2mm', padding: '0.5mm 1mm', fontSize: FS, background: '#fff', overflow: 'hidden' }}>
          {v(item.remarks)}
        </div>
      </div>

      {/* ── SIGNATURES ── 4 colunas */}
      <div style={{ flex: '0 0 21mm' }}>
        <div style={{ ...SEC_ROW, height: '3.8mm', display: 'flex', alignItems: 'center', justifyContent: 'center', border: BORDER }}>Signatures</div>
        <table style={{ ...T, height: '17.2mm' }}>
          <colgroup>
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr style={{ height: '4.3mm' }}>
              <td style={LB}>Supplier Logistics</td>
              <td style={LB}>Faurecia plant Logistics</td>
              <td style={LB}>Faurecia plant Quality</td>
              <td style={LB}>Faurecia plant HSE{'\n'}(for new packaging)</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PÁGINA 2
// ═══════════════════════════════════════════════════════
function PageTwo({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  return (
    <div style={PAGE}>
      <PageHeader
        title="Packaging Data Sheet - Back up (page 2/2)"
        version={v(item.documentVersion) || 'v1'}
        date={v(item.startOfUse) || '—'}
        logo={logo}
      />

      {/* ── BACK-UP PACKAGING DATA ── */}
      <div style={{ flex: '0 0 54mm' }}>
        <table style={T}>
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '11%' }} /><col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} /><col style={{ width: '4%' }} />
            <col style={{ width: '11%' }} /><col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} /><col style={{ width: '17%' }} />
          </colgroup>
          <thead>
            <tr>
              <td colSpan={9} style={SEC_ROW}>Back-up packaging data</td>
            </tr>
            <tr style={{ height: '4mm' }}>
              <th style={HD}></th>
              <th style={HD}>Part</th>
              <th style={HD}>Packaging Unit = PU</th>
              <th style={HD}>Handling Unit = HU</th>
              <th style={{ ...HD, background: '#fff', border: 'none' }}></th>
              <th style={HD}>Cover for HU</th>
              <th style={HD}>Dunnage 1</th>
              <th style={HD}>Dunnage 2</th>
              <th style={{ ...HD, background: '#fff', border: 'none' }}></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Faurecia part number</td>
              <td style={VL}>{v(item.partNumber)}</td>
              <td style={VL}>{v(item.puCode)}</td>
              <td style={VL}>{v(item.huMedC) ? `TM${v(item.huMedC)}` : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.coverHUCode)}</td>
              <td style={VL}>{v(item.dun1Code)}</td>
              <td style={VL}>{v(item.dun2Code)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Description</td>
              <td style={VL}>{v(item.partName)}</td>
              <td style={VL}>{v(item.puDesc)}</td>
              <td style={VL}>{v(item.huMedC) ? `${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}` : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}>{v(item.coverHUDesc)}</td>
              <td style={VL}>{v(item.dun1Desc)}</td>
              <td style={VL}>{v(item.dun2Desc)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            {[
              ['Length (mm)', v(item.comprimento), v(item.puMedC), v(item.huMedC), v(item.coverHUMedC), v(item.dun1MedC), v(item.dun2MedC)],
              ['Width (mm)',  v(item.largura),     v(item.puMedL), v(item.huMedL), v(item.coverHUMedL), v(item.dun1MedL), v(item.dun2MedL)],
              ['Height (mm)', v(item.altura),      v(item.puMedA), v(item.huMedA), v(item.coverHUMedA), v(item.dun1MedA), v(item.dun2MedA)],
              ['Tare Weight (kg)', v(item.peso),   v(item.puPeso), v(item.huPeso), v(item.coverHUPeso), '', ''],
              ['Gross Weight (kg)', v(item.brutoPU), v(item.puPesoBruto), v(item.huPesoBruto), '', '', ''],
            ].map(([label, ...vals], ri) => (
              <tr key={ri} style={{ height: '4mm' }}>
                <td style={LB}>{label}</td>
                {vals.map((val, ci) => <td key={ci} style={VL}>{val}</td>)}
                <td style={{ border: 'none' }}></td>
                <td style={{ border: 'none' }}></td>
              </tr>
            ))}
            <tr style={{ height: '4mm' }}>
              <td style={LB}>Package Density (units)</td>
              <td style={VL}></td>
              <td style={VL}>{v(item.pecasPorPU)}</td>
              <td style={VL}>{v(item.puPorCamada) && v(item.camadas) ? String(Number(item.puPorCamada) * Number(item.camadas)) : ''}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Qty dunnages / PU</td>
              <td style={VL}>{v(item.dun1QtyPerPU)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            <tr style={{ height: '4mm' }}>
              <td style={LB}>PU / layer of HU</td>
              <td style={VL}>{v(item.puPorCamada)}</td>
              <td style={VL}></td><td style={VL}></td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Qty dunnages / HU</td>
              <td style={VL}>{v(item.dun1QtyPerHU)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            <tr style={{ height: '5mm' }}>
              <td style={LB}>Quantity PU / HU</td>
              <td style={VL}>{v(item.puPorCamada)}</td>
              <td style={VL}></td>
              <td style={VL}>{v(calc?.puPorHU)}</td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Stackability<br />(qty of levels per stack)</td>
              <td style={{ ...VL, fontSize: '5.5px' }}>Static {v(item.empilhavelStatic)}<br />Dynamic {v(item.empilhavelDynamic)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
            <tr style={{ height: '3.5mm' }}>
              <td style={VL} colSpan={4}></td>
              <td style={{ border: 'none' }}></td>
              <td style={VL}></td>
              <td style={{ ...LB, fontSize: '5.5px' }}>Foldable ratio</td>
              <td style={VL}>{v(item.foldableRatio)}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── BACK-UP PICTURES ── 4 colunas */}
      <div style={{ flex: '0 0 62mm' }}>
        <table style={{ ...T, height: '57mm' }}>
          <colgroup>
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr style={{ height: '4mm' }}>
              <th style={HD}>Part</th>
              <th style={HD}>PU with parts (+ show label location)</th>
              <th style={HD}>Complete HU with cover (+ show label location)</th>
              <th style={HD}>Dunnage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
                <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: '1mm', height: '51mm' }}>
                  {img
                    ? <img src={img} alt="" crossOrigin="anonymous" style={{ maxHeight: '49mm', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div style={{ ...C({ background: '#000', color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '7px', height: '3.8mm' }), border: BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Back-up pictures
        </div>
      </div>

      {/* ── BACK-UP REMARKS ── */}
      <div style={{ flex: '0 0 16mm' }}>
        <div style={{ ...SEC_ROW, height: '3.8mm', display: 'flex', alignItems: 'center', justifyContent: 'center', border: BORDER }}>Back-up remarks</div>
        <div style={{ border: BORDER, borderTop: 'none', height: '12.2mm', padding: '0.5mm 1mm', fontSize: FS, background: '#fff', overflow: 'hidden' }}>
          <span style={{ color: '#888', fontStyle: 'italic' }}>(wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)</span>
          {v(item.backupRemarks) && <span> {v(item.backupRemarks)}</span>}
        </div>
      </div>

      {/* ── SIGNATURES ── 4 colunas */}
      <div style={{ flex: '0 0 21mm' }}>
        <div style={{ ...SEC_ROW, height: '3.8mm', display: 'flex', alignItems: 'center', justifyContent: 'center', border: BORDER }}>Signatures</div>
        <table style={{ ...T, height: '17.2mm' }}>
          <colgroup>
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr style={{ height: '4.3mm' }}>
              <td style={LB}>Supplier Logistics</td>
              <td style={LB}>Faurecia plant Logistics</td>
              <td style={LB}>Faurecia plant Quality</td>
              <td style={LB}>Faurecia plant HSE{'\n'}(for new packaging)</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
              <td style={{ ...VL, fontSize: '5px' }}>Position</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
              <td style={{ ...VL, fontSize: '5px' }}>Name</td>
            </tr>
            <tr style={{ height: '4.3mm' }}>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
              <td style={{ ...VL, fontSize: '5px' }}>Date</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PRINT CSS
// ═══════════════════════════════════════════════════════
const PRINT_CSS = `
@media print {
  @page { size: A4 landscape; margin: 0; }
  body * { visibility: hidden !important; }
  #lpds-print-area, #lpds-print-area * { visibility: visible !important; }
  #lpds-print-area { position: fixed !important; top: 0; left: 0; gap: 0 !important; background: #fff; }
}
.lpds-pb { page-break-after: always; break-after: page; }
`;

// ═══════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════
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
  const linkedProject = projects.find((p) => p.projeto === item?.projeto || p.id === activeProjectId);
  const logo = linkedProject?.logoEmpresa || '';

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
          html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 1123 },
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
        <button onClick={() => navigate('/items')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">LPDS Preview</h1>
        <p className="text-sm text-slate-400 mb-4">
          {items.length === 0 ? 'Nenhum item cadastrado.' : 'Selecione um item para visualizar.'}
        </p>
        {items.length > 0 && (
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">— selecione —</option>
            {items.map((i) => <option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
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
          <button onClick={() => navigate('/items')} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LPDS Preview</h1>
            <p className="text-xs text-slate-500">{item.partNumber} — {item.partName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm text-slate-700">
            {items.map((i) => <option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
          </select>
          <button onClick={handleDownloadPDF} disabled={exporting}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <Download className="w-4 h-4" />
            {exporting ? 'Gerando PDF…' : 'Baixar PDF'}
          </button>
        </div>
      </div>

      {/* Print area */}
      <div ref={printRef} id="lpds-print-area"
        style={{ fontFamily: FONT, background: '#d0d0d0', margin: '0 auto', width: '297mm', display: 'flex', flexDirection: 'column', gap: '5mm' }}>
        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <PageOne item={item} calc={calc} logo={logo} />
        </div>
        <div className="lpds-pb" style={{ height: 0, overflow: 'hidden' }} />
        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <PageTwo item={item} calc={calc} logo={logo} />
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 print:hidden text-center">
        A4 landscape — cada bloco = 1 página do PDF
      </p>
    </div>
  );
}
