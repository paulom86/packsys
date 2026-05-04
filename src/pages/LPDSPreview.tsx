import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ─────────────────────────────────────────────────────
//  DESIGN TOKENS
// ─────────────────────────────────────────────────────
const BLUE   = '#1a3a6b';
const BORDER = '1px solid #000';
const FONT   = 'Arial, Helvetica, sans-serif';

const PAGE: React.CSSProperties = {
  width: '297mm',
  height: '210mm',
  padding: '2.5mm 3mm',
  boxSizing: 'border-box',
  background: '#fff',
  overflow: 'hidden',
  fontFamily: FONT,
  display: 'flex',
  flexDirection: 'column',
  gap: '0mm',
};

// Tabela base — sem gap entre seções
const T: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

// ── células ──────────────────────────────────────────
const base = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  border: BORDER,
  padding: '0.3mm 0.7mm',
  fontSize: '6px',
  lineHeight: '1.2',
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ...extra,
});

const LB = base({ background: '#c8c8c8', fontWeight: 700 });
const VL = base({ background: '#fff' });
const HD = base({ background: BLUE, color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '6.2px' });
const SEC = base({ background: '#000', color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '6.8px' });

// ─────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────
type Calc = ReturnType<typeof calculateFields> | null;
const v = (x: unknown) => (x === null || x === undefined || x === '') ? '' : String(x);

function Chk({ val }: { val: boolean }) {
  return <span style={{ fontSize: '9px', lineHeight: 1, fontFamily: 'Arial' }}>{val ? '☑' : '☐'}</span>;
}

function Footer() {
  return (
    <div style={{
      marginTop: 'auto',
      borderTop: '1px solid #999',
      paddingTop: '0.3mm',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '5px',
      color: '#666',
    }}>
      <span>Property of Faurecia — Internal Documentation.</span>
      <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  CABEÇALHO
// ─────────────────────────────────────────────────────
function Header({ title, version, date, logo }: {
  title: string; version: string; date: string; logo: string;
}) {
  return (
    <table style={{ ...T, marginBottom: '0.4mm' }}>
      <colgroup>
        <col style={{ width: '25mm' }} />
        <col />
        <col style={{ width: '50mm' }} />
      </colgroup>
      <tbody>
        <tr style={{ height: '9mm' }}>
          {/* Logo */}
          <td style={{ ...base({ background: '#fff', textAlign: 'center', padding: '0.5mm' }), border: BORDER }}>
            {logo
              ? <img src={logo} alt="logo" style={{ maxHeight: '8mm', maxWidth: '23mm', objectFit: 'contain' }} />
              : <span style={{ fontWeight: 900, fontSize: '9px', color: BLUE }}>·faurecia</span>
            }
          </td>
          {/* Título */}
          <td style={{ ...HD, fontSize: '10px', fontWeight: 900 }}>{title}</td>
          {/* Versão / Data */}
          <td style={{ border: BORDER, padding: 0 }}>
            <table style={{ ...T, height: '9mm' }}>
              <tbody>
                <tr style={{ height: '4.5mm' }}>
                  <td style={{ ...LB, width: '55%' }}>Document version</td>
                  <td style={VL}>{version}</td>
                </tr>
                <tr style={{ height: '4.5mm' }}>
                  <td style={LB}>Date</td>
                  <td style={VL}>{date}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────────────
//  PÁGINA 1
// ─────────────────────────────────────────────────────
function PageOne({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const puPorHU = calc?.puPorHU ?? '';

  return (
    <div style={PAGE}>
      <Header
        title="Packaging Data Sheet - Series (page 1/2)"
        version={v(item.documentVersion) || 'v1'}
        date={v(item.startOfUse) || '—'}
        logo={logo}
      />

      {/* ══ PART DESCRIPTION + SUPPLIER ══════════════════ */}
      <table style={{ ...T, marginBottom: '0.4mm' }}>
        <colgroup>
          {/* Part Description: 6 cols */}
          <col style={{ width: '12%' }} /><col style={{ width: '16%' }} />
          <col style={{ width: '8%' }}  /><col style={{ width: '10%' }} />
          <col style={{ width: '8%' }}  /><col style={{ width: '10%' }} />
          {/* Supplier: 2 cols */}
          <col style={{ width: '10%' }} /><col style={{ width: '26%' }} />
        </colgroup>
        <tbody>
          {/* títulos de seção */}
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={6} style={SEC}>Part Description</td>
            <td colSpan={2} style={SEC}>Supplier</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Faurecia part number(s)</td>
            <td style={VL} colSpan={3}>{v(item.partNumber)}</td>
            <td style={LB}>Program</td>
            <td style={VL}>{v(item.projeto)}</td>
            <td style={LB}>Supplier name</td>
            <td style={VL}>{v(item.fornecedor)}</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Description</td>
            <td style={VL} colSpan={3}>{v(item.partName)}</td>
            <td style={LB}>Commodity</td>
            <td style={VL}>{v(item.commodity)}</td>
            <td style={LB}>Supplier code</td>
            <td style={VL}>{v(item.codFornecedor)}</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Daily consumption</td>
            <td style={VL}>{v(item.dailyConsumption)}</td>
            <td style={LB}>Part unit</td>
            <td style={VL}>{v(item.partUnit) || 'Part'}</td>
            <td style={LB}>Start of use</td>
            <td style={VL}>{v(item.startOfUse)}</td>
            <td style={LB}>Valid for Faurecia plant</td>
            <td style={VL}>{v(item.validForPlant)}</td>
          </tr>
        </tbody>
      </table>

      {/* ══ PACKAGING DATA ═══════════════════════════════ */}
      <table style={{ ...T, marginBottom: '0.4mm' }}>
        <colgroup>
          <col style={{ width: '10%' }} /><col style={{ width: '7%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '6%' }} />
          <col style={{ width: '4%' }} />
          <col style={{ width: '3.5%' }} /><col style={{ width: '3.5%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '3.5%' }} /><col style={{ width: '3.5%' }} />
          <col style={{ width: '11%' }} /><col style={{ width: '8%' }} />
          <col style={{ width: '5%' }} /><col style={{ width: '9%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={14} style={SEC}>Packaging data</td>
          </tr>
          {/* linha 1 */}
          <tr style={{ height: '3.5mm' }}>
            <td style={LB}>Serial packaging</td>
            <td style={VL}>{v(item.serialPackaging)}</td>
            <td style={LB}>Total packaging loop</td>
            <td style={VL}>{v(item.totalPackagingLoop)}</td>
            <td style={LB}>days</td>
            <td style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>yes</td>
            <td style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>no</td>
            <td style={{ ...LB, textAlign: 'right' }}>Reusable packaging</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.reusablePackaging} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.reusablePackaging} /></td>
            <td style={LB}>- Delivery frequency</td>
            <td style={VL}>{v(item.deliveryFrequency)}</td>
            <td style={{ ...LB, fontSize: '5px' }}>per week</td>
            <td style={VL}></td>
          </tr>
          {/* linha 2 */}
          <tr style={{ height: '3.5mm' }}>
            <td style={LB}>Back-up packaging</td>
            <td style={VL}></td>
            <td style={LB}>Packaging stock at supplier</td>
            <td style={VL}>{v(item.packagingStockSupplier)}</td>
            <td style={LB}>days</td>
            <td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, textAlign: 'right' }}>Rented packaging</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.rentedPackaging} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.rentedPackaging} /></td>
            <td style={LB}>- Return frequency</td>
            <td style={VL}>{v(item.returnFrequency)}</td>
            <td style={{ ...LB, fontSize: '5px' }}>per week</td>
            <td style={VL}></td>
          </tr>
          {/* linha 3 */}
          <tr style={{ height: '3.5mm' }}>
            <td style={LB}>Box label standard</td>
            <td style={VL}></td>
            <td style={LB}>Total number of PU</td>
            <td style={VL}>{v(item.totalPU)}</td>
            <td style={VL}></td>
            <td colSpan={2} style={{ ...LB, textAlign: 'center', fontSize: '5.5px' }}>If "yes", rental company</td>
            <td style={{ ...LB, textAlign: 'right' }}>Mixed pallet</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.mixedPallet} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.mixedPallet} /></td>
            <td colSpan={4} style={VL}>{v(item.rentalCompany)}</td>
          </tr>
          {/* linha 4 */}
          <tr style={{ height: '3.5mm' }}>
            <td style={LB}>Box label qty / PU</td>
            <td style={VL}>{v(item.boxLabelQty)}</td>
            <td colSpan={2} style={LB}>Calculation based on:</td>
            <td colSpan={3} style={LB}>Minimum Order Quantity (in units)</td>
            <td style={VL}>{v(item.moq)}</td>
            <td colSpan={2} style={VL}></td>
            <td colSpan={2} style={VL}></td>
            <td colSpan={2} style={VL}></td>
          </tr>
          {/* linha 5 */}
          <tr style={{ height: '3.5mm' }}>
            <td style={VL} colSpan={2}></td>
            <td style={VL} colSpan={2}></td>
            <td colSpan={3} style={LB}>Order Lot size (in units)</td>
            <td style={VL}>{v(item.orderLotSize)}</td>
            <td colSpan={6} style={VL}></td>
          </tr>
        </tbody>
      </table>

      {/* ══ TABELA PRINCIPAL — UMA ÚNICA TABELA CONTÍNUA ═ */}
      <table style={{ ...T, marginBottom: '0.4mm' }}>
        <colgroup>
          <col style={{ width: '12%' }} />   {/* label */}
          <col style={{ width: '11%' }} />   {/* Part */}
          <col style={{ width: '11%' }} />   {/* PU */}
          <col style={{ width: '11%' }} />   {/* HU */}
          <col style={{ width: '11%' }} />   {/* Dunnage 1 */}
          <col style={{ width: '11%' }} />   {/* Dunnage 2 */}
          <col style={{ width: '11%' }} />   {/* Dunnage 3 */}
          <col style={{ width: '22%' }} />   {/* extras / stackability */}
        </colgroup>
        <tbody>
          {/* cabeçalho */}
          <tr style={{ height: '4mm' }}>
            <td style={HD}></td>
            <td style={HD}>Part</td>
            <td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td>
            <td style={HD}>Dunnage 1</td>
            <td style={HD}>Dunnage 2</td>
            <td style={HD}>Dunnage 3</td>
            <td style={{ ...HD, background: '#fff', border: 'none' }}></td>
          </tr>
          {/* Faurecia part number */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Faurecia part number</td>
            <td style={VL}>{v(item.partNumber)}</td>
            <td style={VL}>{v(item.puCode)}</td>
            <td style={VL}>{v(item.huMedC) && v(item.huMedL) && v(item.huMedA) ? `TM${v(item.huMedC)}` : ''}</td>
            <td style={VL}>{v(item.dun1Code)}</td>
            <td style={VL}>{v(item.dun2Code)}</td>
            <td style={VL}>{v(item.dun3Code)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Description */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Description</td>
            <td style={VL}>{v(item.partName)}</td>
            <td style={VL}>{v(item.puDesc)}</td>
            <td style={VL}>{v(item.huMedC) && v(item.huMedL) && v(item.huMedA) ? `${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}` : ''}</td>
            <td style={VL}>{v(item.dun1Desc)}</td>
            <td style={VL}>{v(item.dun2Desc)}</td>
            <td style={VL}>{v(item.dun3Desc)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Length */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Length (mm)</td>
            <td style={VL}>{v(item.comprimento)}</td>
            <td style={VL}>{v(item.puMedC)}</td>
            <td style={VL}>{v(item.huMedC)}</td>
            <td style={VL}>{v(item.dun1MedC)}</td>
            <td style={VL}>{v(item.dun2MedC)}</td>
            <td style={VL}>{v(item.dun3MedC)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Width */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Width (mm)</td>
            <td style={VL}>{v(item.largura)}</td>
            <td style={VL}>{v(item.puMedL)}</td>
            <td style={VL}>{v(item.huMedL)}</td>
            <td style={VL}>{v(item.dun1MedL)}</td>
            <td style={VL}>{v(item.dun2MedL)}</td>
            <td style={VL}>{v(item.dun3MedL)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Height */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Height (mm)</td>
            <td style={VL}>{v(item.altura)}</td>
            <td style={VL}>{v(item.puMedA)}</td>
            <td style={VL}>{v(item.huMedA)}</td>
            <td style={VL}>{v(item.dun1MedA)}</td>
            <td style={VL}>{v(item.dun2MedA)}</td>
            <td style={VL}>{v(item.dun3MedA)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Tare Weight */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Tare Weight (kg)</td>
            <td style={VL}>{v(item.peso)}</td>
            <td style={VL}>{v(item.puPeso)}</td>
            <td style={VL}>{v(item.huPeso)}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Gross Weight */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Gross Weight (kg)</td>
            <td style={VL}>{v(item.brutoPU)}</td>
            <td style={VL}>{v(item.puPesoBruto)}</td>
            <td style={VL}>{v(item.huPesoBruto)}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Package Density + Qty dunnages/PU */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Package Density (units)</td>
            <td style={VL}></td>
            <td style={VL}>{v(item.pecasPorPU)}</td>
            <td style={VL}>{calc?.puPorHU ? String(calc.puPorHU) : ''}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BORDER, whiteSpace: 'normal', fontSize: '5.5px' }}>Qty dunnages / PU</td>
          </tr>
          {/* PU/layer + Qty dunnages/HU */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>PU / layer of HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td>
            <td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BORDER, whiteSpace: 'normal', fontSize: '5.5px' }}>Qty dunnages / HU</td>
          </tr>
          {/* Quantity PU/HU */}
          <tr style={{ height: '3.8mm' }}>
            <td style={LB}>Quantity PU / HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td>
            <td style={VL}></td>
            <td style={VL}>{v(puPorHU)}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Stackability */}
          <tr style={{ height: '4mm' }}>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: '5.5px' }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: BORDER, padding: '0.3mm', fontSize: '5.5px', background: '#fff' }}>
              <div>Static: {v(item.empilhavelStatic)}</div>
              <div>Dynamic: {v(item.empilhavelDynamic)}</div>
            </td>
          </tr>
          {/* Foldable ratio */}
          <tr style={{ height: '3.5mm' }}>
            <td style={VL} colSpan={6}></td>
            <td style={{ ...LB, fontSize: '5.5px' }}>Foldable ratio</td>
            <td style={{ ...VL, border: BORDER }}>{v(item.foldableRatio)}</td>
          </tr>
        </tbody>
      </table>

      {/* ══ PICTURES — 4 colunas ══════════════════════════ */}
      <table style={{ ...T, marginBottom: '0.3mm' }}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '3.8mm' }}>
            <td style={HD}>Part</td>
            <td style={HD}>PU with parts (+ show label location)</td>
            <td style={HD}>Complete HU with cover (+ show label location)</td>
            <td style={HD}>Dunnage</td>
          </tr>
          <tr style={{ height: '33mm' }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: '1mm' }}>
                {img && <img src={img} alt="" crossOrigin="anonymous"
                  style={{ maxHeight: '31mm', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />}
              </td>
            ))}
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={4} style={SEC}>Pictures</td>
          </tr>
        </tbody>
      </table>

      {/* ══ REMARKS ══════════════════════════════════════ */}
      <table style={{ ...T, marginBottom: '0.3mm' }}>
        <tbody>
          <tr style={{ height: '3.5mm' }}><td style={SEC}>Remarks</td></tr>
          <tr style={{ height: '8mm' }}>
            <td style={{ ...VL, whiteSpace: 'normal', fontSize: '5.8px', verticalAlign: 'top', padding: '0.5mm 1mm' }}>
              {v(item.remarks)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ SIGNATURES — 4 colunas ═══════════════════════ */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={4} style={SEC}>Signatures</td>
          </tr>
          <tr style={{ height: '4mm' }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: '5.5px' }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td></tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td></tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td></tr>
        </tbody>
      </table>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  PÁGINA 2
// ─────────────────────────────────────────────────────
function PageTwo({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const puPorHU = calc?.puPorHU ?? '';

  return (
    <div style={PAGE}>
      <Header
        title="Packaging Data Sheet - Back up (page 2/2)"
        version={v(item.documentVersion) || 'v1'}
        date={v(item.startOfUse) || '—'}
        logo={logo}
      />

      {/* ══ BACK-UP PACKAGING DATA ══════════════════════ */}
      <table style={{ ...T, marginBottom: '0.4mm' }}>
        <colgroup>
          <col style={{ width: '12%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />   {/* Cover HU */}
          <col style={{ width: '10%' }} />   {/* Dunnage 1 */}
          <col style={{ width: '10%' }} />   {/* Dunnage 2 */}
          <col style={{ width: '18%' }} />   {/* extras */}
        </colgroup>
        <tbody>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={8} style={SEC}>Back-up packaging data</td>
          </tr>
          <tr style={{ height: '4mm' }}>
            <td style={HD}></td>
            <td style={HD}>Part</td>
            <td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td>
            <td style={HD}>Cover for HU</td>
            <td style={HD}>Dunnage 1</td>
            <td style={HD}>Dunnage 2</td>
            <td style={{ ...HD, background: '#fff', border: 'none' }}></td>
          </tr>
          {[
            ['Faurecia part number', v(item.partNumber), v(item.puCode), v(item.huMedC) ? `TM${v(item.huMedC)}` : '', v(item.coverHUCode), v(item.dun1Code), v(item.dun2Code)],
            ['Description',         v(item.partName),   v(item.puDesc), v(item.huMedC) ? `${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}` : '', v(item.coverHUDesc), v(item.dun1Desc), v(item.dun2Desc)],
            ['Length (mm)',          v(item.comprimento),v(item.puMedC), v(item.huMedC), v(item.coverHUMedC), v(item.dun1MedC), v(item.dun2MedC)],
            ['Width (mm)',           v(item.largura),    v(item.puMedL), v(item.huMedL), v(item.coverHUMedL), v(item.dun1MedL), v(item.dun2MedL)],
            ['Height (mm)',          v(item.altura),     v(item.puMedA), v(item.huMedA), v(item.coverHUMedA), v(item.dun1MedA), v(item.dun2MedA)],
            ['Tare Weight (kg)',     v(item.peso),       v(item.puPeso), v(item.huPeso), v(item.coverHUPeso), '', ''],
            ['Gross Weight (kg)',    v(item.brutoPU),    v(item.puPesoBruto), v(item.huPesoBruto), '', '', ''],
            ['Package Density (units)', '',             v(item.pecasPorPU), String(puPorHU), '', '', ''],
            ['PU / layer of HU',    v(item.puPorCamada),'', '', '', '', ''],
            ['Quantity PU / HU',    v(item.puPorCamada),'', String(puPorHU), '', '', ''],
          ].map(([label, ...vals], ri) => (
            <tr key={ri} style={{ height: '3.8mm' }}>
              <td style={LB}>{label}</td>
              {vals.map((val, ci) => <td key={ci} style={VL}>{val}</td>)}
              <td style={{ border: ri === 7 ? BORDER : 'none', ...LB, whiteSpace: 'normal', fontSize: '5.5px' }}>
                {ri === 7 ? 'Qty dunnages / PU' : ri === 8 ? 'Qty dunnages / HU' : ''}
              </td>
            </tr>
          ))}
          {/* Stackability */}
          <tr style={{ height: '4mm' }}>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: '5.5px' }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: BORDER, padding: '0.3mm', fontSize: '5.5px', background: '#fff' }}>
              <div>Static: {v(item.empilhavelStatic)}</div>
              <div>Dynamic: {v(item.empilhavelDynamic)}</div>
            </td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td style={VL} colSpan={5}></td>
            <td style={{ ...LB, fontSize: '5.5px' }}>Foldable ratio</td>
            <td style={VL}>{v(item.foldableRatio)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
        </tbody>
      </table>

      {/* ══ BACK-UP PICTURES — 4 colunas ════════════════ */}
      <table style={{ ...T, marginBottom: '0.3mm' }}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '3.8mm' }}>
            <td style={HD}>Part</td>
            <td style={HD}>PU with parts (+ show label location)</td>
            <td style={HD}>Complete HU with cover (+ show label location)</td>
            <td style={HD}>Dunnage</td>
          </tr>
          <tr style={{ height: '55mm' }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: '1mm' }}>
                {img && <img src={img} alt="" crossOrigin="anonymous"
                  style={{ maxHeight: '53mm', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />}
              </td>
            ))}
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={4} style={SEC}>Back-up pictures</td>
          </tr>
        </tbody>
      </table>

      {/* ══ BACK-UP REMARKS ══════════════════════════════ */}
      <table style={{ ...T, marginBottom: '0.3mm' }}>
        <tbody>
          <tr style={{ height: '3.5mm' }}><td style={SEC}>Back-up remarks</td></tr>
          <tr style={{ height: '10mm' }}>
            <td style={{ ...VL, whiteSpace: 'normal', fontSize: '5.8px', verticalAlign: 'top', padding: '0.5mm 1mm', color: '#555', fontStyle: 'italic' }}>
              (wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)
              {v(item.backupRemarks) && <span style={{ color: '#000', fontStyle: 'normal' }}> {v(item.backupRemarks)}</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ SIGNATURES — 4 colunas ═══════════════════════ */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={4} style={SEC}>Signatures</td>
          </tr>
          <tr style={{ height: '4mm' }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: '5.5px' }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td><td style={{ ...VL, fontSize: '5px' }}>Position</td></tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td><td style={{ ...VL, fontSize: '5px' }}>Name</td></tr>
          <tr style={{ height: '4mm' }}><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td><td style={{ ...VL, fontSize: '5px' }}>Date</td></tr>
        </tbody>
      </table>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  PRINT CSS
// ─────────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  @page { size: A4 landscape; margin: 0; }
  body * { visibility: hidden !important; }
  #lpds-p1, #lpds-p1 *, #lpds-p2, #lpds-p2 * { visibility: visible !important; }
  #lpds-p1 { position: fixed !important; top: 0; left: 0; }
}
`;

// ─────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────
export default function LPDSPreview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const itemId = params.get('item');
  const [items, setItems]   = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string>(itemId || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
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
    if (!page1Ref.current || !page2Ref.current || !item) return;
    setExporting(true);
    try {
      const [{ default: html2pdf }, { default: jsPDF }] = await Promise.all([
        import('html2pdf.js'),
        import('jspdf'),
      ]);

      const OPT = {
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 1123 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const },
      };

      const img1 = await html2pdf().set(OPT).from(page1Ref.current).outputImg('dataurl');
      const img2 = await html2pdf().set(OPT).from(page2Ref.current).outputImg('dataurl');

      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
      doc.addImage(img1 as string, 'JPEG', 0, 0, 297, 210);
      doc.addPage();
      doc.addImage(img2 as string, 'JPEG', 0, 0, 297, 210);
      doc.save(`LPDS_${item.partNumber || 'documento'}.pdf`);
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

      {/* Preview area */}
      <div style={{ fontFamily: FONT, background: '#c8c8c8', margin: '0 auto', width: '297mm', display: 'flex', flexDirection: 'column', gap: '5mm' }}>
        <div id="lpds-p1" ref={page1Ref} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
          <PageOne item={item} calc={calc} logo={logo} />
        </div>
        <div id="lpds-p2" ref={page2Ref} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
          <PageTwo item={item} calc={calc} logo={logo} />
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 print:hidden text-center">
        A4 landscape — cada bloco = 1 página do PDF
      </p>
    </div>
  );
}
