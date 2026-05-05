import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
type Calc = ReturnType<typeof calculateFields> | null;
const v = (x: unknown) => (x == null || x === '') ? '' : String(x);
const chk = (on: boolean) => on ? '☑' : '☐';

// ─────────────────────────────────────────────────────────────
// CSS — tudo em mm, travado para A4 landscape
// ─────────────────────────────────────────────────────────────
const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Arial');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @page { size: A4 landscape; margin: 0; }

  .lpds-root {
    width: 297mm;
    margin: 0 auto;
    background: #ccc;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 6mm;
    padding: 6mm;
  }

  .lpds-page {
    width: 297mm;
    height: 210mm;
    box-sizing: border-box;
    padding: 3mm 3.5mm;
    background: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 0.5mm;
    box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  }

  @media print {
    body * { visibility: hidden !important; }
    .lpds-root, .lpds-root * { visibility: visible !important; }
    .lpds-root {
      position: fixed; top: 0; left: 0;
      background: white; gap: 0; padding: 0;
    }
    .lpds-page {
      page-break-after: always;
      break-after: page;
      box-shadow: none;
    }
    .lpds-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .lpds-no-print { display: none !important; }
  }

  /* ── TABLE BASE ── */
  .lt { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .lt td, .lt th {
    border: 1px solid #000;
    padding: 0.2mm 0.8mm;
    font-size: 6.2px;
    line-height: 1.15;
    vertical-align: middle;
    overflow: hidden;
    white-space: nowrap;
    font-family: Arial, Helvetica, sans-serif;
  }

  /* ── CELL TYPES ── */
  .c-hd { background: #062a68; color: #fff; font-weight: 700; text-align: center; font-size: 6.8px; }
  .c-lb { background: #bfbfbf; font-weight: 700; text-align: right; }
  .c-vl { background: #fff; }
  .c-gr { background: #bfbfbf; }
  .c-bk { background: #000; color: #fff; font-weight: 700; text-align: center; font-size: 7px; }
  .c-wh { background: #fff; }

  /* ── HEADER ── */
  .hdr-logo {
    width: 22mm; border: 1px solid #000; background: #fff;
    text-align: left; padding-left: 3mm;
    display: flex; align-items: center;
  }
  .hdr-logo span {
    color: #24205f; font-size: 11px; font-weight: 900;
    letter-spacing: 3px;
  }
  .hdr-title {
    flex: 1; background: #062a68; color: #fff;
    font-size: 12px; font-weight: 900;
    text-align: center; display: flex; align-items: center; justify-content: center;
    border: 1px solid #000; border-left: none; border-right: none;
  }
  .hdr-meta {
    width: 55mm; border: 1px solid #000; background: #fff;
    display: flex; flex-direction: column;
  }
  .hdr-meta-row {
    flex: 1; display: flex; border-bottom: 1px solid #000;
  }
  .hdr-meta-row:last-child { border-bottom: none; }
  .hdr-meta-label {
    background: #bfbfbf; font-weight: 700; font-size: 6px;
    text-align: right; padding-right: 1.5mm;
    display: flex; align-items: center; justify-content: flex-end;
    width: 30mm; border-right: 1px solid #000;
  }
  .hdr-meta-value {
    flex: 1; font-size: 6.5px; font-weight: 700;
    display: flex; align-items: center; padding-left: 1mm;
  }

  /* ── SECTION TITLE ── */
  .sec { background: #000; color: #fff; font-weight: 800; text-align: center; font-size: 7px; }

  /* ── PICTURES ── */
  .pic-cell { background: #fff; text-align: center; vertical-align: middle; padding: 1mm !important; }
  .pic-cell img { max-height: 28mm; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; }
  .pic-cell-p2 img { max-height: 50mm; }

  /* ── SIGNATURES ── */
  .sig-label { background: #bfbfbf; font-weight: 700; text-align: right; font-size: 6px; }
  .sig-value { background: #fff; text-align: center; font-size: 6px; }
  .sig-value-tall { height: 8mm !important; }

  /* ── FOOTER ── */
  .lpds-footer {
    margin-top: auto;
    display: flex; justify-content: space-between;
    font-size: 5px; color: #555;
    border-top: 1px solid #aaa; padding-top: 0.3mm;
  }

  /* ── PACK DATA CHECKBOXES ── */
  .chk-yes-no th { background: #bfbfbf; font-size: 5.5px; text-align: center; }
  .chk-yes-no td { background: #fff; text-align: center; font-size: 9px; }

  /* ── BACKUP SPACE COL ── */
  .space-col { background: #bfbfbf !important; border-left: 2px solid #000 !important; border-right: 2px solid #000 !important; }
`;

// ─────────────────────────────────────────────────────────────
// PAGE 1
// ─────────────────────────────────────────────────────────────
function PageOne({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const pu = v(calc?.puPorHU);
  const now = new Date();
  const date = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="lpds-page">

      {/* HEADER */}
      <div style={{ display: 'flex', height: '12mm', flexShrink: 0 }}>
        <div className="hdr-logo">
          {logo
            ? <img src={logo} alt="" style={{ maxHeight: '10mm', maxWidth: '20mm', objectFit: 'contain' }} />
            : <span>·faurecia</span>}
        </div>
        <div className="hdr-title">Packaging Data Sheet - Series (page 1/2)</div>
        <div className="hdr-meta">
          <div className="hdr-meta-row">
            <div className="hdr-meta-label">Document version</div>
            <div className="hdr-meta-value">{v(item.documentVersion) || 'V1'}</div>
          </div>
          <div className="hdr-meta-row">
            <div className="hdr-meta-label">Date</div>
            <div className="hdr-meta-value">{date}</div>
          </div>
        </div>
      </div>

      {/* PART DESCRIPTION + SUPPLIER */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '14%' }} /><col style={{ width: '22%' }} />
          <col style={{ width: '9%'  }} /><col style={{ width: '8%'  }} />
          <col style={{ width: '9%'  }} /><col style={{ width: '9%'  }} />
          <col style={{ width: '13%' }} /><col style={{ width: '16%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={6} className="c-bk sec">Part Description</td><td colSpan={2} className="c-bk sec">Supplier</td></tr>
          <tr style={{ height: '3.8mm' }}>
            <td className="c-lb">Faurecia part number(s)</td><td className="c-vl" colSpan={3}>{v(item.partNumber)}</td>
            <td className="c-lb">Program</td><td className="c-vl">{v(item.projeto)}</td>
            <td className="c-lb">Supplier name</td><td className="c-vl">{v(item.fornecedor)}</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td className="c-lb">Description</td><td className="c-vl" colSpan={3}>{v(item.partName)}</td>
            <td className="c-lb">Commodity</td><td className="c-vl">{v(item.commodity)}</td>
            <td className="c-lb">Supplier code</td><td className="c-vl">{v(item.codFornecedor)}</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td className="c-lb">Program</td><td className="c-vl">{v(item.projeto)}</td>
            <td className="c-lb">Daily consumption</td><td className="c-vl">{v(item.dailyConsumption)}</td>
            <td className="c-lb">Part unit</td><td className="c-vl">{v(item.partUnit)||'Part'}</td>
            <td className="c-lb">Valid for Faurecia plant</td><td className="c-vl">{v(item.validForPlant)}</td>
          </tr>
          <tr style={{ height: '3.8mm' }}>
            <td className="c-lb">Commodity</td><td className="c-vl">{v(item.commodity)}</td>
            <td colSpan={4} className="c-vl"></td>
            <td className="c-lb">Start of use</td><td className="c-vl">{v(item.startOfUse)}</td>
          </tr>
        </tbody>
      </table>

      {/* PACKAGING DATA */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '8%'  }} /><col style={{ width: '6%'  }} />
          <col style={{ width: '10%' }} /><col style={{ width: '5%'  }} />
          <col style={{ width: '3%'  }} /><col style={{ width: '3%'  }} /><col style={{ width: '3%'  }} />
          <col style={{ width: '9%'  }} /><col style={{ width: '3%'  }} /><col style={{ width: '3%'  }} />
          <col style={{ width: '9%'  }} /><col style={{ width: '5%'  }} />
          <col style={{ width: '4%'  }} /><col style={{ width: '29%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={14} className="c-bk sec">Packaging data</td></tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Serial packaging</td><td className="c-vl">{v(item.serialPackaging)}</td>
            <td className="c-lb">Total packaging loop</td><td className="c-vl">{v(item.totalPackagingLoop)}</td>
            <td className="c-lb" style={{ fontSize: '5px' }}>days</td>
            <td className="c-lb" style={{ textAlign: 'center', fontSize: '5px' }}>yes</td>
            <td className="c-lb" style={{ textAlign: 'center', fontSize: '5px' }}>no</td>
            <td className="c-lb" style={{ textAlign: 'right' }}>Reusable packaging</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(item.reusablePackaging)}</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(!item.reusablePackaging)}</td>
            <td className="c-lb">- Delivery frequency</td><td className="c-vl">{v(item.deliveryFrequency)}</td>
            <td className="c-lb" style={{ fontSize: '5px' }}>per week</td><td className="c-vl"></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Back-up packaging</td><td className="c-vl"></td>
            <td className="c-lb">Packaging stock at supplier</td><td className="c-vl">{v(item.packagingStockSupplier)}</td>
            <td className="c-lb" style={{ fontSize: '5px' }}>days</td><td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-lb" style={{ textAlign: 'right' }}>Rented packaging</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(item.rentedPackaging)}</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(!item.rentedPackaging)}</td>
            <td className="c-lb">- Return frequency</td><td className="c-vl">{v(item.returnFrequency)}</td>
            <td className="c-lb" style={{ fontSize: '5px' }}>per week</td><td className="c-vl"></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Box label standard</td><td className="c-vl"></td>
            <td className="c-lb">Total number of PU</td><td className="c-vl">{v(item.totalPU)}</td>
            <td className="c-vl"></td>
            <td colSpan={2} className="c-lb" style={{ textAlign: 'center', fontSize: '5px' }}>If "yes", rental company</td>
            <td className="c-lb" style={{ textAlign: 'right' }}>Mixed pallet</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(item.mixedPallet)}</td>
            <td className="c-vl" style={{ textAlign: 'center', fontSize: '9px' }}>{chk(!item.mixedPallet)}</td>
            <td colSpan={4} className="c-vl">{v(item.rentalCompany)}</td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Box label qty / PU</td><td className="c-vl">{v(item.boxLabelQty)}</td>
            <td colSpan={2} className="c-lb">Calculation based on:</td>
            <td colSpan={3} className="c-lb">Minimum Order Quantity (in units)</td>
            <td className="c-vl">{v(item.moq)}</td>
            <td colSpan={6} className="c-vl"></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={4} className="c-vl"></td>
            <td colSpan={3} className="c-lb">Order Lot size (in units)</td>
            <td className="c-vl">{v(item.orderLotSize)}</td>
            <td colSpan={6} className="c-vl"></td>
          </tr>
        </tbody>
      </table>

      {/* MAIN TABLE */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '13%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '4%'  }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '23%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '4mm' }}>
            <td className="c-gr"></td>
            <td className="c-hd">Part</td>
            <td className="c-hd">Packaging Unit = PU</td>
            <td className="c-hd">Handling Unit = HU</td>
            <td className="c-gr" rowSpan={13} style={{ borderLeft: '2px solid #000', borderRight: '2px solid #000' }}></td>
            <td className="c-hd">Dunnage 1</td>
            <td className="c-hd">Dunnage 2</td>
            <td className="c-hd">Dunnage 3</td>
            <td className="c-gr" style={{ border: 'none' }}></td>
          </tr>
          {[
            ['Faurecia part number', '', v(item.puCode),   v(item.huMedC)?`TM${v(item.huMedC)}`:'', v(item.dun1Code), v(item.dun2Code), v(item.dun3Code), ''],
            ['Description',          '', v(item.puDesc),   v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'', v(item.dun1Desc), v(item.dun2Desc), v(item.dun3Desc), ''],
            ['Length (mm)',           v(item.comprimento), v(item.puMedC), v(item.huMedC), v(item.dun1MedC), v(item.dun2MedC), v(item.dun3MedC), ''],
            ['Width (mm)',            v(item.largura),     v(item.puMedL), v(item.huMedL), v(item.dun1MedL), v(item.dun2MedL), v(item.dun3MedL), ''],
            ['Height (mm)',           v(item.altura),      v(item.puMedA), v(item.huMedA), v(item.dun1MedA), v(item.dun2MedA), v(item.dun3MedA), ''],
            ['Tare Weight (kg)',      '', v(item.puPeso),  v(item.huPeso), '', '', '', ''],
            ['Gross Weight (kg)',     '', v(item.puPesoBruto||item.brutoPU), v(item.huPesoBruto), '', '', '', ''],
          ].map(([lbl, part, pu2, hu, d1, d2, d3, _], ri) => (
            <tr key={ri} style={{ height: '3.5mm' }}>
              <td className="c-lb">{lbl}</td>
              <td className={ri < 2 ? 'c-gr' : 'c-vl'}>{part}</td>
              <td className="c-vl">{pu2}</td>
              <td className="c-vl">{hu}</td>
              <td className="c-vl">{d1}</td>
              <td className="c-vl">{d2}</td>
              <td className="c-vl">{d3}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
          ))}
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Package Density (units)</td><td className="c-gr"></td>
            <td className="c-vl">{v(item.pecasPorPU)}</td><td className="c-vl">{pu}</td>
            <td className="c-vl"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Qty dunnages / PU</td><td className="c-gr"></td>
            <td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-vl">{v(item.dun1QtyPerPU)}</td>
            <td className="c-vl">{v(item.dun2QtyPerPU)}</td>
            <td className="c-vl">{v(item.dun3QtyPerPU)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">PU / layer of HU</td><td className="c-gr"></td>
            <td className="c-vl"></td><td className="c-vl">{v(item.puPorCamada)}</td>
            <td className="c-vl"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Qty dunnages / HU</td><td className="c-gr"></td>
            <td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-vl">{v(item.dun1QtyPerHU)}</td>
            <td className="c-vl">{v(item.dun2QtyPerHU)}</td>
            <td className="c-vl">{v(item.dun3QtyPerHU)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td className="c-lb">Quantity PU / HU</td><td className="c-gr"></td>
            <td className="c-vl"></td><td className="c-vl">{pu}</td>
            <td className="c-vl"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td style={{ border: 'none' }}></td>
          </tr>
          <tr style={{ height: '4mm' }}>
            <td className="c-lb" style={{ fontSize: '5.5px', whiteSpace: 'normal' }}>Stackability (qty of levels per stack)</td>
            <td className="c-gr"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-vl"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-gr" style={{ fontSize: '6px', whiteSpace: 'normal', border: '1px solid #000' }}>
              Static: {v(item.empilhavelStatic)}&nbsp; Dynamic: {v(item.empilhavelDynamic)}
            </td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={6} className="c-vl" style={{ border: 'none' }}></td>
            <td className="c-lb">Foldable ratio</td>
            <td className="c-vl" style={{ border: '1px solid #000' }}>{v(item.foldableRatio)}</td>
          </tr>
        </tbody>
      </table>

      {/* PICTURES */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '30mm' }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} className="pic-cell">
                {img && <img src={img} alt="" crossOrigin="anonymous" />}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} className="c-bk sec">Pictures</td></tr>
        </tbody>
      </table>

      {/* REMARKS */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <tbody>
          <tr><td className="c-bk sec">Remarks</td></tr>
          <tr style={{ height: '8mm' }}>
            <td className="c-vl" style={{ whiteSpace: 'normal', verticalAlign: 'top', fontSize: '6px', padding: '1mm' }}>
              {v(item.remarks)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SIGNATURES */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '12%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={8} className="c-bk sec">Signatures</td></tr>
          <tr style={{ height: '8mm' }}>
            <td className="sig-label">Supplier Logistics</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label">Faurecia plant Logistics</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label">Faurecia plant Quality</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label" style={{ whiteSpace: 'normal', fontSize: '5.5px' }}>Faurecia plant HSE<br />(for new packaging)</td>
            <td className="sig-value sig-value-tall"></td>
          </tr>
          {['Position', 'Name', 'Date'].map(l => (
            <tr key={l} style={{ height: '4mm' }}>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="lpds-footer">
        <span>Property of Faurecia — Internal Documentation.</span>
        <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 2
// ─────────────────────────────────────────────────────────────
function PageTwo({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const pu = v(calc?.puPorHU);
  const now = new Date();
  const date = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="lpds-page">

      {/* HEADER */}
      <div style={{ display: 'flex', height: '12mm', flexShrink: 0 }}>
        <div className="hdr-logo">
          {logo
            ? <img src={logo} alt="" style={{ maxHeight: '10mm', maxWidth: '20mm', objectFit: 'contain' }} />
            : <span>·faurecia</span>}
        </div>
        <div className="hdr-title">Packaging Data Sheet - Back up (page 2/2)</div>
        <div className="hdr-meta">
          <div className="hdr-meta-row">
            <div className="hdr-meta-label">Document version</div>
            <div className="hdr-meta-value">{v(item.documentVersion) || 'V1'}</div>
          </div>
          <div className="hdr-meta-row">
            <div className="hdr-meta-label">Date</div>
            <div className="hdr-meta-value">{date}</div>
          </div>
        </div>
      </div>

      {/* BACK-UP PACKAGING DATA */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '13%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '4%'  }} />
          <col style={{ width: '10%' }} /><col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} /><col style={{ width: '23%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={9} className="c-bk sec">Back-up packaging data</td></tr>
          <tr style={{ height: '4mm' }}>
            <td className="c-gr"></td>
            <td className="c-hd">Part</td>
            <td className="c-hd">Packaging Unit = PU</td>
            <td className="c-hd">Handling Unit = HU</td>
            <td className="c-gr" rowSpan={13} style={{ borderLeft: '2px solid #000', borderRight: '2px solid #000' }}></td>
            <td className="c-hd">Cover for HU</td>
            <td className="c-hd">Dunnage 1</td>
            <td className="c-hd">Dunnage 2</td>
            <td className="c-gr" style={{ border: 'none' }}></td>
          </tr>
          {[
            ['Faurecia part number', '', v(item.puCode), v(item.huMedC)?`TM${v(item.huMedC)}`:'', v(item.coverHUCode), v(item.dun1Code), v(item.dun2Code), ''],
            ['Description',          '', v(item.puDesc), v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'', v(item.coverHUDesc), v(item.dun1Desc), v(item.dun2Desc), ''],
            ['Length (mm)',           v(item.comprimento), v(item.puMedC), v(item.huMedC), v(item.coverHUMedC), v(item.dun1MedC), v(item.dun2MedC), ''],
            ['Width (mm)',            v(item.largura),     v(item.puMedL), v(item.huMedL), v(item.coverHUMedL), v(item.dun1MedL), v(item.dun2MedL), ''],
            ['Height (mm)',           v(item.altura),      v(item.puMedA), v(item.huMedA), v(item.coverHUMedA), v(item.dun1MedA), v(item.dun2MedA), ''],
            ['Tare Weight (kg)',      '', v(item.puPeso),  v(item.huPeso), v(item.coverHUPeso), '', '', ''],
            ['Gross Weight (kg)',     '', v(item.puPesoBruto||item.brutoPU), v(item.huPesoBruto), '', '', '', ''],
            ['Package Density (units)', '', v(item.pecasPorPU), pu, '', '', '', ''],
            ['Qty dunnages / PU',    '', '', '', v(item.dun1QtyPerPU), v(item.dun2QtyPerPU), '', ''],
            ['PU / layer of HU',     '', '', v(item.puPorCamada), '', '', '', ''],
            ['Qty dunnages / HU',    '', '', '', v(item.dun1QtyPerHU), v(item.dun2QtyPerHU), '', ''],
            ['Quantity PU / HU',     '', '', pu, '', '', '', ''],
          ].map(([lbl, part, pu2, hu, cv, d1, d2, _], ri) => (
            <tr key={ri} style={{ height: '3.5mm' }}>
              <td className="c-lb">{lbl}</td>
              <td className={ri < 2 ? 'c-gr' : 'c-vl'}>{part}</td>
              <td className="c-vl">{pu2}</td>
              <td className="c-vl">{hu}</td>
              <td className="c-vl">{cv}</td>
              <td className="c-vl">{d1}</td>
              <td className="c-vl">{d2}</td>
              <td style={{ border: 'none' }}></td>
            </tr>
          ))}
          <tr style={{ height: '4mm' }}>
            <td className="c-lb" style={{ fontSize: '5.5px', whiteSpace: 'normal' }}>Stackability (qty of levels per stack)</td>
            <td className="c-gr"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-vl"></td><td className="c-vl"></td><td className="c-vl"></td>
            <td className="c-gr" style={{ fontSize: '6px', whiteSpace: 'normal', border: '1px solid #000' }}>
              Static: {v(item.empilhavelStatic)}&nbsp; Dynamic: {v(item.empilhavelDynamic)}
            </td>
          </tr>
          <tr style={{ height: '3.5mm' }}>
            <td colSpan={5} className="c-vl" style={{ border: 'none' }}></td>
            <td className="c-lb">Foldable ratio</td>
            <td className="c-vl" style={{ border: '1px solid #000' }}>{v(item.foldableRatio)}</td>
            <td style={{ border: 'none' }}></td>
          </tr>
        </tbody>
      </table>

      {/* BACK-UP PICTURES */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
          <col style={{ width: '25%' }} /><col style={{ width: '25%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '50mm' }}>
            {[item.imagemPart, item.imagemPU, item.imagemHU, item.imagemDunnage].map((img, i) => (
              <td key={i} className="pic-cell">
                {img && <img src={img} alt="" crossOrigin="anonymous" style={{ maxHeight: '48mm' }} />}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} className="c-bk sec">Back-up pictures</td></tr>
        </tbody>
      </table>

      {/* BACK-UP REMARKS */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <tbody>
          <tr><td className="c-bk sec">Back-up remarks</td></tr>
          <tr style={{ height: '10mm' }}>
            <td className="c-vl" style={{ whiteSpace: 'normal', verticalAlign: 'top', fontSize: '6px', fontStyle: 'italic', color: '#444', padding: '1mm' }}>
              (wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)
              {v(item.backupRemarks) && <span style={{ color: '#000', fontStyle: 'normal' }}> {v(item.backupRemarks)}</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SIGNATURES P2 */}
      <table className="lt" style={{ flexShrink: 0 }}>
        <colgroup>
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '12%' }} />
        </colgroup>
        <tbody>
          <tr><td colSpan={8} className="c-bk sec">Signatures</td></tr>
          <tr style={{ height: '8mm' }}>
            <td className="sig-label">Supplier Logistics</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label">Faurecia plant Logistics</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label">Faurecia plant Quality</td><td className="sig-value sig-value-tall"></td>
            <td className="sig-label" style={{ whiteSpace: 'normal', fontSize: '5.5px' }}>Faurecia plant HSE<br />(for new packaging)</td>
            <td className="sig-value sig-value-tall"></td>
          </tr>
          {['Position', 'Name', 'Date'].map(l => (
            <tr key={l} style={{ height: '4mm' }}>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
              <td className="sig-label">{l}</td><td className="sig-value"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="lpds-footer">
        <span>Property of Faurecia — Internal Documentation.</span>
        <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function LPDSPreview() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const itemId    = params.get('item');
  const [items,   setItems]    = useState<Item[]>([]);
  const [selId,   setSelId]    = useState(itemId || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const all = getItems();
    setItems(all);
    setProjects(getProjects());
    if (!itemId && all.length > 0) setSelId(all[0].id);
  }, [itemId]);

  const item = items.find(i => i.id === selId);
  const calc = item ? calculateFields(item) : null;
  const proj = projects.find(p => p.projeto === item?.projeto || p.id === getActiveProjectId());
  const logo = proj?.logoEmpresa || '';

  // Exporta usando window.print() — respeita @media print e page-break-after
  const handlePrint = () => window.print();

  // Exporta via jsPDF capturando cada página individualmente
  const handleDownload = async () => {
    if (!rootRef.current || !item) return;
    setBusy(true);
    try {
      const pages = rootRef.current.querySelectorAll<HTMLElement>('.lpds-page');
      const [{ default: html2pdf }, { default: jsPDF }] = await Promise.all([
        import('html2pdf.js'),
        import('jspdf'),
      ]);
      const OPT = {
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg' as const, quality: 0.99 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 1122,   // 297mm @ 96dpi
          height: 794,   // 210mm @ 96dpi
          windowWidth: 1122,
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const },
      };
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
      for (let i = 0; i < pages.length; i++) {
        const img = await html2pdf().set(OPT).from(pages[i]).outputImg('dataurl');
        if (i > 0) doc.addPage();
        doc.addImage(img as string, 'JPEG', 0, 0, 297, 210);
      }
      doc.save(`LPDS_${item.partNumber || 'doc'}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  if (!item) {
    return (
      <div className="p-8">
        <button onClick={() => navigate('/items')} className="flex items-center gap-2 text-slate-500 mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">LPDS Preview</h1>
        <p className="text-sm text-slate-400 mb-4">
          {items.length === 0 ? 'Nenhum item cadastrado.' : 'Selecione um item para visualizar.'}
        </p>
        {items.length > 0 && (
          <select value={selId} onChange={e => setSelId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">— selecione —</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <style>{PRINT_CSS}</style>

      {/* TOOLBAR */}
      <div className="lpds-no-print flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/items')} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LPDS Preview</h1>
            <p className="text-xs text-slate-500">{item.partNumber} — {item.partName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={selId} onChange={e => setSelId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {items.map(i => <option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
          </select>
          <button onClick={handlePrint}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50">
            🖨️ Imprimir
          </button>
          <button onClick={handleDownload} disabled={busy}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <Download className="w-4 h-4" />
            {busy ? 'Gerando…' : 'Baixar PDF'}
          </button>
        </div>
      </div>

      {/* PRINT AREA — 2 páginas A4 landscape separadas */}
      <div ref={rootRef} className="lpds-root">
        <PageOne item={item} calc={calc} logo={logo} />
        <PageTwo item={item} calc={calc} logo={logo} />
      </div>

      <p className="lpds-no-print text-xs text-slate-400 mt-2 text-center">
        A4 landscape — cada bloco = 1 página
      </p>
    </div>
  );
}
