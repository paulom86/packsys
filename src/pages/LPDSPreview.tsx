import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ─────────────────────────────────────────────────────
//  A4 landscape @ 96dpi: 297mm = 1122px, 210mm = 794px
//  Usamos px fixo para garantir layout correto
// ─────────────────────────────────────────────────────
const PW = 1122; // page width px
const PH = 794;  // page height px
const PAD = 10;  // padding px

const BLUE   = '#1a3a6b';
const LGRAY  = '#c8c8c8';
const BLACK  = '#000';
const BORDER = `1px solid ${BLACK}`;
const FONT   = 'Arial, Helvetica, sans-serif';
const FS     = 8;   // base font size px
const FS_SM  = 7;
const FS_XS  = 6;

// ─────────────────────────────────────────────────────
//  ESTILO DA PÁGINA
// ─────────────────────────────────────────────────────
const PAGE: React.CSSProperties = {
  width: PW,
  height: PH,
  padding: PAD,
  boxSizing: 'border-box',
  background: '#fff',
  overflow: 'hidden',
  fontFamily: FONT,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const T: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};

// células
const cell = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  border: BORDER,
  padding: '1px 3px',
  fontSize: FS_XS,
  lineHeight: '1.2',
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ...extra,
});

const LB = cell({ background: LGRAY, fontWeight: 700 });
const VL = cell({ background: '#fff' });
const HD = cell({ background: BLUE, color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: FS_SM });
const SEC = cell({ background: BLACK, color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: FS_SM });

// ─────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────
type Calc = ReturnType<typeof calculateFields> | null;
const v = (x: unknown) => (x === null || x === undefined || x === '') ? '' : String(x);

function Chk({ val }: { val: boolean }) {
  return <span style={{ fontSize: 10 }}>{val ? '☑' : '☐'}</span>;
}

function Footer() {
  return (
    <div style={{ borderTop: BORDER, paddingTop: 1, display: 'flex', justifyContent: 'space-between', fontSize: 6, color: '#666', marginTop: 'auto' }}>
      <span>Property of Faurecia — Internal Documentation.</span>
      <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
//  CABEÇALHO
// ─────────────────────────────────────────────────────
function Header({ title, version, date, logo }: { title: string; version: string; date: string; logo: string }) {
  return (
    <table style={{ ...T, height: 52 }}>
      <colgroup>
        <col style={{ width: 90 }} />
        <col />
        <col style={{ width: 180 }} />
      </colgroup>
      <tbody>
        <tr style={{ height: 52 }}>
          <td style={{ ...cell({ background: '#fff', textAlign: 'center', padding: 3 }), border: BORDER }}>
            {logo
              ? <img src={logo} alt="logo" style={{ maxHeight: 46, maxWidth: 84, objectFit: 'contain' }} />
              : <span style={{ fontWeight: 900, fontSize: 11, color: BLUE }}>·faurecia</span>
            }
          </td>
          <td style={{ ...HD, fontSize: 13, fontWeight: 900 }}>{title}</td>
          <td style={{ border: BORDER, padding: 0, verticalAlign: 'top' }}>
            <table style={{ ...T, height: 52 }}>
              <tbody>
                <tr style={{ height: 26 }}>
                  <td style={{ ...LB, width: '55%' }}>Document version</td>
                  <td style={VL}>{version}</td>
                </tr>
                <tr style={{ height: 26 }}>
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
  const puPorHU = v(calc?.puPorHU);
  const ROW_H = 18;

  return (
    <div style={PAGE}>
      <Header title="Packaging Data Sheet - Series (page 1/2)" version={v(item.documentVersion)||'v1'} date={v(item.startOfUse)||'—'} logo={logo} />

      {/* ── PART DESCRIPTION + SUPPLIER ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '13%' }} /><col style={{ width: '17%' }} />
          <col style={{ width: '7%'  }} /><col style={{ width: '9%'  }} />
          <col style={{ width: '7%'  }} /><col style={{ width: '10%' }} />
          <col style={{ width: '11%' }} /><col style={{ width: '26%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={6} style={SEC}>Part Description</td><td colSpan={2} style={SEC}>Supplier</td></tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Faurecia part number(s)</td><td style={VL} colSpan={3}>{v(item.partNumber)}</td>
            <td style={LB}>Program</td><td style={VL}>{v(item.projeto)}</td>
            <td style={LB}>Supplier name</td><td style={VL}>{v(item.fornecedor)}</td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Description</td><td style={VL} colSpan={3}>{v(item.partName)}</td>
            <td style={LB}>Commodity</td><td style={VL}>{v(item.commodity)}</td>
            <td style={LB}>Supplier code</td><td style={VL}>{v(item.codFornecedor)}</td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Daily consumption</td><td style={VL}>{v(item.dailyConsumption)}</td>
            <td style={LB}>Part unit</td><td style={VL}>{v(item.partUnit)||'Part'}</td>
            <td style={LB}>Start of use</td><td style={VL}>{v(item.startOfUse)}</td>
            <td style={LB}>Valid for Faurecia plant</td><td style={VL}>{v(item.validForPlant)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── PACKAGING DATA ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '9%' }}  /><col style={{ width: '6%' }}  />
          <col style={{ width: '11%' }} /><col style={{ width: '5%' }}  />
          <col style={{ width: '4%' }}  /><col style={{ width: '3%' }}  /><col style={{ width: '3%' }}  />
          <col style={{ width: '10%' }} /><col style={{ width: '3%' }}  /><col style={{ width: '3%' }}  />
          <col style={{ width: '10%' }} /><col style={{ width: '7%' }}  />
          <col style={{ width: '5%' }}  /><col style={{ width: '21%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={14} style={SEC}>Packaging data</td></tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Serial packaging</td><td style={VL}>{v(item.serialPackaging)}</td>
            <td style={LB}>Total packaging loop</td><td style={VL}>{v(item.totalPackagingLoop)}</td>
            <td style={LB}>days</td>
            <td style={{ ...LB, textAlign: 'center', fontSize: FS_XS }}>yes</td>
            <td style={{ ...LB, textAlign: 'center', fontSize: FS_XS }}>no</td>
            <td style={{ ...LB, textAlign: 'right' }}>Reusable packaging</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.reusablePackaging} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.reusablePackaging} /></td>
            <td style={LB}>- Delivery frequency</td>
            <td style={VL}>{v(item.deliveryFrequency)}</td>
            <td style={{ ...LB, fontSize: FS_XS }}>per week</td>
            <td style={VL}></td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Back-up packaging</td><td style={VL}></td>
            <td style={LB}>Packaging stock at supplier</td><td style={VL}>{v(item.packagingStockSupplier)}</td>
            <td style={LB}>days</td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, textAlign: 'right' }}>Rented packaging</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.rentedPackaging} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.rentedPackaging} /></td>
            <td style={LB}>- Return frequency</td>
            <td style={VL}>{v(item.returnFrequency)}</td>
            <td style={{ ...LB, fontSize: FS_XS }}>per week</td>
            <td style={VL}></td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Box label standard</td><td style={VL}></td>
            <td style={LB}>Total number of PU</td><td style={VL}>{v(item.totalPU)}</td>
            <td style={VL}></td>
            <td colSpan={2} style={{ ...LB, textAlign: 'center', fontSize: FS_XS }}>If "yes", rental company</td>
            <td style={{ ...LB, textAlign: 'right' }}>Mixed pallet</td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={item.mixedPallet} /></td>
            <td style={{ ...VL, textAlign: 'center' }}><Chk val={!item.mixedPallet} /></td>
            <td colSpan={4} style={VL}>{v(item.rentalCompany)}</td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Box label qty / PU</td><td style={VL}>{v(item.boxLabelQty)}</td>
            <td colSpan={2} style={LB}>Calculation based on:</td>
            <td colSpan={3} style={LB}>Minimum Order Quantity (in units)</td>
            <td style={VL}>{v(item.moq)}</td>
            <td colSpan={6} style={VL}></td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td colSpan={2} style={VL}></td><td colSpan={2} style={VL}></td>
            <td colSpan={3} style={LB}>Order Lot size (in units)</td>
            <td style={VL}>{v(item.orderLotSize)}</td>
            <td colSpan={6} style={VL}></td>
          </tr>
        </tbody>
      </table>

      {/* ── TABELA PRINCIPAL — ÚNICA TABELA CONTÍNUA ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '13%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '21%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: 22 }}>
            <td style={HD}></td>
            <td style={HD}>Part</td>
            <td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td>
            <td style={HD}>Dunnage 1</td>
            <td style={HD}>Dunnage 2</td>
            <td style={HD}>Dunnage 3</td>
            <td style={{ ...HD, background: '#fff', border: 'none' }}></td>
          </tr>
          {[
            ['Faurecia part number', v(item.partNumber), v(item.puCode), v(item.huMedC)?`TM${v(item.huMedC)}`:'', v(item.dun1Code), v(item.dun2Code), v(item.dun3Code), ''],
            ['Description',          v(item.partName),   v(item.puDesc), v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'', v(item.dun1Desc), v(item.dun2Desc), v(item.dun3Desc), ''],
            ['Length (mm)',           v(item.comprimento),v(item.puMedC), v(item.huMedC), v(item.dun1MedC), v(item.dun2MedC), v(item.dun3MedC), ''],
            ['Width (mm)',            v(item.largura),    v(item.puMedL), v(item.huMedL), v(item.dun1MedL), v(item.dun2MedL), v(item.dun3MedL), ''],
            ['Height (mm)',           v(item.altura),     v(item.puMedA), v(item.huMedA), v(item.dun1MedA), v(item.dun2MedA), v(item.dun3MedA), ''],
            ['Tare Weight (kg)',      v(item.peso),       v(item.puPeso), v(item.huPeso), '',               '',               '',               ''],
            ['Gross Weight (kg)',     v(item.brutoPU),    v(item.puPesoBruto), v(item.huPesoBruto), '',     '',               '',               ''],
          ].map(([label, ...vals], ri) => (
            <tr key={ri} style={{ height: ROW_H }}>
              <td style={LB}>{label}</td>
              {vals.map((val, ci) => (
                <td key={ci} style={ci === 6 ? { border: 'none' } : VL}>{val}</td>
              ))}
            </tr>
          ))}
          {/* Package Density + Qty dunnages/PU */}
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Package Density (units)</td>
            <td style={VL}></td><td style={VL}>{v(item.pecasPorPU)}</td><td style={VL}>{puPorHU}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BORDER, whiteSpace: 'normal' }}>Qty dunnages / PU</td>
          </tr>
          {/* PU/layer + Qty dunnages/HU */}
          <tr style={{ height: ROW_H }}>
            <td style={LB}>PU / layer of HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BORDER, whiteSpace: 'normal' }}>Qty dunnages / HU</td>
          </tr>
          {/* Quantity PU/HU */}
          <tr style={{ height: ROW_H }}>
            <td style={LB}>Quantity PU / HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td><td style={VL}></td><td style={VL}>{puPorHU}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          {/* Stackability */}
          <tr style={{ height: ROW_H }}>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: FS_XS }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: BORDER, padding: 2, fontSize: FS_XS, background: '#fff' }}>
              <div>Static: {v(item.empilhavelStatic)}</div>
              <div>Dynamic: {v(item.empilhavelDynamic)}</div>
            </td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td style={VL} colSpan={6}></td>
            <td style={LB}>Foldable ratio</td>
            <td style={{ ...VL, border: BORDER }}>{v(item.foldableRatio)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── PICTURES ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: 130 }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: 3 }}>
                {img && <img src={img} alt="" crossOrigin="anonymous" style={{ maxHeight: 124, maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} style={SEC}>Pictures</td></tr>
        </tbody>
      </table>

      {/* ── REMARKS ── */}
      <table style={T}>
        <tbody>
          <tr><td style={SEC}>Remarks</td></tr>
          <tr style={{ height: 28 }}>
            <td style={{ ...VL, whiteSpace: 'normal', verticalAlign: 'top', padding: '2px 4px' }}>{v(item.remarks)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── SIGNATURES ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={4} style={SEC}>Signatures</td></tr>
          <tr style={{ height: 16 }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: FS_XS }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          {['Position', 'Name', 'Date'].map(lbl => (
            <tr key={lbl} style={{ height: 14 }}>
              {[0,1,2,3].map(i => <td key={i} style={{ ...VL, fontSize: FS_XS }}>{lbl}</td>)}
            </tr>
          ))}
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
  const puPorHU = v(calc?.puPorHU);
  const ROW_H = 18;

  return (
    <div style={PAGE}>
      <Header title="Packaging Data Sheet - Back up (page 2/2)" version={v(item.documentVersion)||'v1'} date={v(item.startOfUse)||'—'} logo={logo} />

      {/* ── BACK-UP PACKAGING DATA ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '13%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '17%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={8} style={SEC}>Back-up packaging data</td></tr>
          <tr style={{ height: 22 }}>
            <td style={HD}></td>
            <td style={HD}>Part</td><td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td><td style={HD}>Cover for HU</td>
            <td style={HD}>Dunnage 1</td><td style={HD}>Dunnage 2</td>
            <td style={{ ...HD, background: '#fff', border: 'none' }}></td>
          </tr>
          {[
            ['Faurecia part number', v(item.partNumber), v(item.puCode), v(item.huMedC)?`TM${v(item.huMedC)}`:'', v(item.coverHUCode), v(item.dun1Code), v(item.dun2Code)],
            ['Description',         v(item.partName),   v(item.puDesc), v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'', v(item.coverHUDesc), v(item.dun1Desc), v(item.dun2Desc)],
            ['Length (mm)',          v(item.comprimento),v(item.puMedC), v(item.huMedC), v(item.coverHUMedC), v(item.dun1MedC), v(item.dun2MedC)],
            ['Width (mm)',           v(item.largura),    v(item.puMedL), v(item.huMedL), v(item.coverHUMedL), v(item.dun1MedL), v(item.dun2MedL)],
            ['Height (mm)',          v(item.altura),     v(item.puMedA), v(item.huMedA), v(item.coverHUMedA), v(item.dun1MedA), v(item.dun2MedA)],
            ['Tare Weight (kg)',     v(item.peso),       v(item.puPeso), v(item.huPeso), v(item.coverHUPeso), '', ''],
            ['Gross Weight (kg)',    v(item.brutoPU),    v(item.puPesoBruto), v(item.huPesoBruto), '', '', ''],
            ['Package Density (units)', '',              v(item.pecasPorPU), puPorHU, '', '', ''],
            ['PU / layer of HU',    v(item.puPorCamada),'', '', '', '', ''],
            ['Quantity PU / HU',    v(item.puPorCamada),'', puPorHU, '', '', ''],
          ].map(([label, ...vals], ri) => (
            <tr key={ri} style={{ height: ROW_H }}>
              <td style={LB}>{label}</td>
              {vals.map((val, ci) => <td key={ci} style={VL}>{val}</td>)}
              <td style={{ border: ri === 7 || ri === 8 ? BORDER : 'none', ...LB, whiteSpace: 'normal', fontSize: FS_XS }}>
                {ri === 7 ? 'Qty dunnages / PU' : ri === 8 ? 'Qty dunnages / HU' : ''}
              </td>
            </tr>
          ))}
          <tr style={{ height: ROW_H }}>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: FS_XS }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border: BORDER, padding: 2, fontSize: FS_XS, background: '#fff' }}>
              <div>Static: {v(item.empilhavelStatic)}</div>
              <div>Dynamic: {v(item.empilhavelDynamic)}</div>
            </td>
          </tr>
          <tr style={{ height: ROW_H }}>
            <td colSpan={5} style={VL}></td>
            <td style={LB}>Foldable ratio</td>
            <td style={VL}>{v(item.foldableRatio)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
        </tbody>
      </table>

      {/* ── BACK-UP PICTURES ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: 200 }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} style={{ ...VL, textAlign: 'center', verticalAlign: 'middle', padding: 3 }}>
                {img && <img src={img} alt="" crossOrigin="anonymous" style={{ maxHeight: 194, maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} style={SEC}>Back-up pictures</td></tr>
        </tbody>
      </table>

      {/* ── BACK-UP REMARKS ── */}
      <table style={T}>
        <tbody>
          <tr><td style={SEC}>Back-up remarks</td></tr>
          <tr style={{ height: 36 }}>
            <td style={{ ...VL, whiteSpace: 'normal', verticalAlign: 'top', padding: '2px 4px', fontSize: FS_XS, fontStyle: 'italic', color: '#555' }}>
              (wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)
              {v(item.backupRemarks) && <span style={{ color: '#000', fontStyle: 'normal' }}> {v(item.backupRemarks)}</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── SIGNATURES ── */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={4} style={SEC}>Signatures</td></tr>
          <tr style={{ height: 16 }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace: 'normal', fontSize: FS_XS }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          {['Position', 'Name', 'Date'].map(lbl => (
            <tr key={lbl} style={{ height: 14 }}>
              {[0,1,2,3].map(i => <td key={i} style={{ ...VL, fontSize: FS_XS }}>{lbl}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </div>
  );
}

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
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false },
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
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
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

      {/* Preview — scroll horizontal se necessário */}
      <div style={{ overflowX: 'auto', background: '#c0c0c0', padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: PW }}>
          <div ref={page1Ref} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            <PageOne item={item} calc={calc} logo={logo} />
          </div>
          <div ref={page2Ref} style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            <PageTwo item={item} calc={calc} logo={logo} />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        A4 landscape — cada bloco = 1 página do PDF
      </p>
    </div>
  );
}
