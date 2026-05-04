import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Item, Project } from '../types';
import { getItems, getProjects, getActiveProjectId } from '../utils/storage';
import { calculateFields } from '../utils/calculations';

// ─────────────────────────────────────────────────────
// A4 landscape @96dpi = 1122 × 794px
// ─────────────────────────────────────────────────────
const PW   = 1122;
const PH   = 794;
const PAD  = 8;
const BLUE = '#1a3a6b';
const LG   = '#c8c8c8';  // light gray
const BK   = '#000';
const WH   = '#fff';
const FONT = 'Arial, Helvetica, sans-serif';
const BDR  = `1px solid ${BK}`;

const PAGE: React.CSSProperties = {
  width: PW, height: PH, padding: PAD,
  boxSizing: 'border-box', background: WH,
  overflow: 'hidden', fontFamily: FONT,
  display: 'flex', flexDirection: 'column', gap: 2,
};

const T: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' };

// ── cell factories ──────────────────────────────────
const c = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  border: BDR, padding: '1px 3px', fontSize: 7,
  lineHeight: '1.15', verticalAlign: 'middle',
  overflow: 'hidden', whiteSpace: 'nowrap',
  background: bg, ...extra,
});

const LB = c(LG, { fontWeight: 700 });
const VL = c(WH);
const HD = c(BLUE, { color: WH, fontWeight: 700, textAlign: 'center', fontSize: 7.5 });
const SEC = c(BK, { color: WH, fontWeight: 700, textAlign: 'center', fontSize: 8 });

// ─────────────────────────────────────────────────────
type Calc = ReturnType<typeof calculateFields> | null;
const v = (x: unknown) => (x == null || x === '') ? '' : String(x);

function Chk({ on }: { on: boolean }) {
  return <span style={{ fontSize: 11, lineHeight: 1 }}>{on ? '☑' : '☐'}</span>;
}

function Footer() {
  return (
    <div style={{ borderTop: BDR, paddingTop: 1, marginTop: 'auto',
      display: 'flex', justifyContent: 'space-between', fontSize: 6, color: '#555' }}>
      <span>Property of Faurecia — Internal Documentation.</span>
      <span>FAU-F-PSG-2027 — issue 02 — 07/17</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────
function Header({ title, ver, date, logo }: { title: string; ver: string; date: string; logo: string }) {
  return (
    <table style={{ ...T, height: 50, marginBottom: 2 }}>
      <colgroup>
        <col style={{ width: 88 }} /><col /><col style={{ width: 175 }} />
      </colgroup>
      <tbody>
        <tr style={{ height: 50 }}>
          <td style={{ ...c(WH, { textAlign: 'center', padding: 3 }), border: BDR }}>
            {logo
              ? <img src={logo} alt="" style={{ maxHeight: 44, maxWidth: 82, objectFit: 'contain' }} />
              : <span style={{ fontWeight: 900, fontSize: 11, color: BLUE }}>·faurecia</span>}
          </td>
          <td style={{ ...HD, fontSize: 14, fontWeight: 900 }}>{title}</td>
          <td style={{ border: BDR, padding: 0, verticalAlign: 'top' }}>
            <table style={{ ...T, height: 50 }}>
              <tbody>
                <tr style={{ height: 25 }}>
                  <td style={{ ...LB, width: '55%' }}>Document version</td><td style={VL}>{ver}</td>
                </tr>
                <tr style={{ height: 25 }}>
                  <td style={LB}>Date</td><td style={VL}>{date}</td>
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
// PAGE 1
// ─────────────────────────────────────────────────────
function PageOne({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const pu = v(calc?.puPorHU);
  const RH = 17; // row height px

  return (
    <div style={PAGE}>
      <Header title="Packaging Data Sheet - Series (page 1/2)"
        ver={v(item.documentVersion)||'v1'} date={v(item.startOfUse)||'—'} logo={logo} />

      {/* PART DESCRIPTION + SUPPLIER */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '13%' }}/><col style={{ width: '16%' }}/>
          <col style={{ width: '7%'  }}/><col style={{ width: '9%'  }}/>
          <col style={{ width: '7%'  }}/><col style={{ width: '10%' }}/>
          <col style={{ width: '11%' }}/><col style={{ width: '27%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height: 14 }}>
            <td colSpan={6} style={{ ...SEC, fontSize: 8 }}>Part Description</td>
            <td colSpan={2} style={{ ...SEC, fontSize: 8 }}>Supplier</td>
          </tr>
          <tr style={{ height: RH }}>
            <td style={LB}>Faurecia part number(s)</td><td style={VL} colSpan={3}>{v(item.partNumber)}</td>
            <td style={LB}>Program</td><td style={VL}>{v(item.projeto)}</td>
            <td style={LB}>Supplier name</td><td style={VL}>{v(item.fornecedor)}</td>
          </tr>
          <tr style={{ height: RH }}>
            <td style={LB}>Description</td><td style={VL} colSpan={3}>{v(item.partName)}</td>
            <td style={LB}>Commodity</td><td style={VL}>{v(item.commodity)}</td>
            <td style={LB}>Supplier code</td><td style={VL}>{v(item.codFornecedor)}</td>
          </tr>
          <tr style={{ height: RH }}>
            <td style={LB}>Daily consumption</td><td style={VL}>{v(item.dailyConsumption)}</td>
            <td style={LB}>Part unit</td><td style={VL}>{v(item.partUnit)||'Part'}</td>
            <td style={LB}>Start of use</td><td style={VL}>{v(item.startOfUse)}</td>
            <td style={LB}>Valid for Faurecia plant</td><td style={VL}>{v(item.validForPlant)}</td>
          </tr>
        </tbody>
      </table>

      {/* PACKAGING DATA */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '9%'  }}/><col style={{ width: '6%'  }}/>
          <col style={{ width: '10%' }}/><col style={{ width: '5%'  }}/>
          <col style={{ width: '3.5%'}}/><col style={{ width: '2.5%'}}/><col style={{ width: '2.5%'}}/>
          <col style={{ width: '9%'  }}/><col style={{ width: '2.5%'}}/><col style={{ width: '2.5%'}}/>
          <col style={{ width: '10%' }}/><col style={{ width: '6%'  }}/>
          <col style={{ width: '4.5%'}}/><col style={{ width: '17%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height: 14 }}><td colSpan={14} style={SEC}>Packaging data</td></tr>
          {/* linha 1 */}
          <tr style={{ height: RH }}>
            <td style={LB}>Serial packaging</td><td style={VL}>{v(item.serialPackaging)}</td>
            <td style={LB}>Total packaging loop</td><td style={VL}>{v(item.totalPackagingLoop)}</td>
            <td style={LB}>days</td>
            <td style={{ ...LB, textAlign:'center', fontSize:6 }}>yes</td>
            <td style={{ ...LB, textAlign:'center', fontSize:6 }}>no</td>
            <td style={{ ...LB, textAlign:'right' }}>Reusable packaging</td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={item.reusablePackaging}/></td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={!item.reusablePackaging}/></td>
            <td style={LB}>- Delivery frequency</td><td style={VL}>{v(item.deliveryFrequency)}</td>
            <td style={{ ...LB, fontSize:6 }}>per week</td><td style={VL}></td>
          </tr>
          {/* linha 2 */}
          <tr style={{ height: RH }}>
            <td style={LB}>Back-up packaging</td><td style={VL}></td>
            <td style={LB}>Packaging stock at supplier</td><td style={VL}>{v(item.packagingStockSupplier)}</td>
            <td style={LB}>days</td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, textAlign:'right' }}>Rented packaging</td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={item.rentedPackaging}/></td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={!item.rentedPackaging}/></td>
            <td style={LB}>- Return frequency</td><td style={VL}>{v(item.returnFrequency)}</td>
            <td style={{ ...LB, fontSize:6 }}>per week</td><td style={VL}></td>
          </tr>
          {/* linha 3 */}
          <tr style={{ height: RH }}>
            <td style={LB}>Box label standard</td><td style={VL}></td>
            <td style={LB}>Total number of PU</td><td style={VL}>{v(item.totalPU)}</td>
            <td style={VL}></td>
            <td colSpan={2} style={{ ...LB, textAlign:'center', fontSize:6 }}>If "yes", rental company</td>
            <td style={{ ...LB, textAlign:'right' }}>Mixed pallet</td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={item.mixedPallet}/></td>
            <td style={{ ...VL, textAlign:'center' }}><Chk on={!item.mixedPallet}/></td>
            <td colSpan={4} style={VL}>{v(item.rentalCompany)}</td>
          </tr>
          {/* linha 4 */}
          <tr style={{ height: RH }}>
            <td style={LB}>Box label qty / PU</td><td style={VL}>{v(item.boxLabelQty)}</td>
            <td colSpan={2} style={LB}>Calculation based on:</td>
            <td colSpan={3} style={LB}>Minimum Order Quantity (in units)</td>
            <td style={VL}>{v(item.moq)}</td>
            <td colSpan={6} style={VL}></td>
          </tr>
          <tr style={{ height: RH }}>
            <td colSpan={2} style={VL}></td><td colSpan={2} style={VL}></td>
            <td colSpan={3} style={LB}>Order Lot size (in units)</td>
            <td style={VL}>{v(item.orderLotSize)}</td>
            <td colSpan={6} style={VL}></td>
          </tr>
        </tbody>
      </table>

      {/* TABELA PRINCIPAL — 8 colunas contínuas */}
      {/* Col 8 (extras) fica junto: 
          linhas 0-6: vazia
          linha 7 (Pkg Density): "Qty dunnages / PU"
          linha 8 (PU/layer):    "Qty dunnages / HU"
          linha 9 (Qty PU/HU):   vazia
          linha 10 (Stackability): Static/Dynamic
          linha 11 (Foldable):   label+value */}
      <table style={T}>
        <colgroup>
          <col style={{ width: '13%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '10.5%' }}/>
          <col style={{ width: '24%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height: 20 }}>
            <td style={HD}></td>
            <td style={HD}>Part</td>
            <td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td>
            <td style={HD}>Dunnage 1</td>
            <td style={HD}>Dunnage 2</td>
            <td style={HD}>Dunnage 3</td>
            <td style={{ ...HD, background: WH, border: 'none' }}></td>
          </tr>
          {/* rows 0-6: dados + col 8 vazia */}
          {([
            ['Faurecia part number', v(item.partNumber), v(item.puCode),
              v(item.huMedC)?`TM${v(item.huMedC)}`:'',
              v(item.dun1Code), v(item.dun2Code), v(item.dun3Code)],
            ['Description', v(item.partName), v(item.puDesc),
              v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'',
              v(item.dun1Desc), v(item.dun2Desc), v(item.dun3Desc)],
            ['Length (mm)',  v(item.comprimento), v(item.puMedC), v(item.huMedC), v(item.dun1MedC), v(item.dun2MedC), v(item.dun3MedC)],
            ['Width (mm)',   v(item.largura),     v(item.puMedL), v(item.huMedL), v(item.dun1MedL), v(item.dun2MedL), v(item.dun3MedL)],
            ['Height (mm)',  v(item.altura),      v(item.puMedA), v(item.huMedA), v(item.dun1MedA), v(item.dun2MedA), v(item.dun3MedA)],
            ['Tare Weight (kg)',   v(item.peso),    v(item.puPeso),      v(item.huPeso),      '', '', ''],
            ['Gross Weight (kg)',  v(item.brutoPU), v(item.puPesoBruto), v(item.huPesoBruto), '', '', ''],
          ] as string[][]).map((row, ri) => (
            <tr key={ri} style={{ height: RH }}>
              <td style={LB}>{row[0]}</td>
              {row.slice(1).map((val,ci)=><td key={ci} style={VL}>{val}</td>)}
              <td style={{ border:'none' }}></td>
            </tr>
          ))}
          {/* Package Density */}
          <tr style={{ height: RH }}>
            <td style={LB}>Package Density (units)</td>
            <td style={VL}></td><td style={VL}>{v(item.pecasPorPU)}</td><td style={VL}>{pu}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BDR, whiteSpace:'normal' }}>Qty dunnages / PU</td>
          </tr>
          {/* PU/layer */}
          <tr style={{ height: RH }}>
            <td style={LB}>PU / layer of HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...LB, border: BDR, whiteSpace:'normal' }}>Qty dunnages / HU</td>
          </tr>
          {/* Quantity PU/HU */}
          <tr style={{ height: RH }}>
            <td style={LB}>Quantity PU / HU</td>
            <td style={VL}>{v(item.puPorCamada)}</td><td style={VL}></td><td style={VL}>{pu}</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ border:'none' }}></td>
          </tr>
          {/* Stackability */}
          <tr style={{ height: RH + 2 }}>
            <td style={{ ...LB, whiteSpace:'normal', fontSize:6 }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...c(WH), border: BDR, fontSize:6.5, whiteSpace:'normal' }}>
              Static: {v(item.empilhavelStatic)}&nbsp;&nbsp;Dynamic: {v(item.empilhavelDynamic)}
            </td>
          </tr>
          {/* Foldable */}
          <tr style={{ height: RH }}>
            <td style={VL} colSpan={6}></td>
            <td style={LB}>Foldable ratio</td>
            <td style={{ ...VL, border: BDR }}>{v(item.foldableRatio)}</td>
          </tr>
        </tbody>
      </table>

      {/* PICTURES */}
      <table style={T}>
        <colgroup>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height: 120 }}>
            {[item.imagemPart,item.imagemPU,item.imagemHU,item.imagemDunnage].map((img,i)=>(
              <td key={i} style={{ ...VL, textAlign:'center', verticalAlign:'middle', padding:3 }}>
                {img&&<img src={img} alt="" crossOrigin="anonymous"
                  style={{ maxHeight:114, maxWidth:'100%', objectFit:'contain', display:'block', margin:'0 auto' }}/>}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} style={SEC}>Pictures</td></tr>
        </tbody>
      </table>

      {/* REMARKS */}
      <table style={T}>
        <tbody>
          <tr><td style={SEC}>Remarks</td></tr>
          <tr style={{ height:28 }}>
            <td style={{ ...VL, whiteSpace:'normal', verticalAlign:'top', padding:'2px 4px' }}>{v(item.remarks)}</td>
          </tr>
        </tbody>
      </table>

      {/* SIGNATURES */}
      <table style={T}>
        <colgroup>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
        </colgroup>
        <tbody>
          <tr><td colSpan={4} style={SEC}>Signatures</td></tr>
          <tr style={{ height:16 }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace:'normal', fontSize:6 }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          {['Position','Name','Date'].map(l=>(
            <tr key={l} style={{ height:16 }}>
              {[0,1,2,3].map(i=><td key={i} style={{ ...VL, fontSize:6.5 }}>{l}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <Footer/>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// PAGE 2
// ─────────────────────────────────────────────────────
function PageTwo({ item, calc, logo }: { item: Item; calc: Calc; logo: string }) {
  const pu = v(calc?.puPorHU);
  const RH = 17;

  return (
    <div style={PAGE}>
      <Header title="Packaging Data Sheet - Back up (page 2/2)"
        ver={v(item.documentVersion)||'v1'} date={v(item.startOfUse)||'—'} logo={logo} />

      {/* BACK-UP PACKAGING DATA */}
      <table style={T}>
        <colgroup>
          <col style={{ width:'13%' }}/>
          <col style={{ width:'10%' }}/><col style={{ width:'10%' }}/>
          <col style={{ width:'10%' }}/><col style={{ width:'10%' }}/>
          <col style={{ width:'10%' }}/><col style={{ width:'10%' }}/>
          <col style={{ width:'17%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height:14 }}><td colSpan={8} style={SEC}>Back-up packaging data</td></tr>
          <tr style={{ height:20 }}>
            <td style={HD}></td>
            <td style={HD}>Part</td><td style={HD}>Packaging Unit = PU</td>
            <td style={HD}>Handling Unit = HU</td><td style={HD}>Cover for HU</td>
            <td style={HD}>Dunnage 1</td><td style={HD}>Dunnage 2</td>
            <td style={{ ...HD, background:WH, border:'none' }}></td>
          </tr>
          {([
            ['Faurecia part number', v(item.partNumber), v(item.puCode),
              v(item.huMedC)?`TM${v(item.huMedC)}`:'',
              v(item.coverHUCode), v(item.dun1Code), v(item.dun2Code)],
            ['Description', v(item.partName), v(item.puDesc),
              v(item.huMedC)&&v(item.huMedL)&&v(item.huMedA)?`${v(item.huMedC)}x${v(item.huMedL)}x${v(item.huMedA)}`:'',
              v(item.coverHUDesc), v(item.dun1Desc), v(item.dun2Desc)],
            ['Length (mm)',  v(item.comprimento), v(item.puMedC), v(item.huMedC), v(item.coverHUMedC), v(item.dun1MedC), v(item.dun2MedC)],
            ['Width (mm)',   v(item.largura),     v(item.puMedL), v(item.huMedL), v(item.coverHUMedL), v(item.dun1MedL), v(item.dun2MedL)],
            ['Height (mm)',  v(item.altura),      v(item.puMedA), v(item.huMedA), v(item.coverHUMedA), v(item.dun1MedA), v(item.dun2MedA)],
            ['Tare Weight (kg)',   v(item.peso),    v(item.puPeso),      v(item.huPeso),      v(item.coverHUPeso), '', ''],
            ['Gross Weight (kg)',  v(item.brutoPU), v(item.puPesoBruto), v(item.huPesoBruto), '', '', ''],
            ['Package Density (units)', '', v(item.pecasPorPU), pu, '', '', ''],
            ['PU / layer of HU',  v(item.puPorCamada), '', '', '', '', ''],
            ['Quantity PU / HU',  v(item.puPorCamada), '', pu, '', '', ''],
          ] as string[][]).map((row,ri)=>(
            <tr key={ri} style={{ height:RH }}>
              <td style={LB}>{row[0]}</td>
              {row.slice(1).map((val,ci)=><td key={ci} style={VL}>{val}</td>)}
              <td style={{ border: ri===7||ri===8 ? BDR:'none',
                ...LB, whiteSpace:'normal', fontSize:6.5 }}>
                {ri===7?'Qty dunnages / PU':ri===8?'Qty dunnages / HU':''}
              </td>
            </tr>
          ))}
          <tr style={{ height:RH+2 }}>
            <td style={{ ...LB, whiteSpace:'normal', fontSize:6 }}>Stackability (qty of levels per stack)</td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={VL}></td><td style={VL}></td><td style={VL}></td>
            <td style={{ ...c(WH), border:BDR, fontSize:6.5, whiteSpace:'normal' }}>
              Static: {v(item.empilhavelStatic)}&nbsp;&nbsp;Dynamic: {v(item.empilhavelDynamic)}
            </td>
          </tr>
          <tr style={{ height:RH }}>
            <td colSpan={5} style={VL}></td>
            <td style={LB}>Foldable ratio</td>
            <td style={VL}>{v(item.foldableRatio)}</td>
            <td style={{ border:'none' }}></td>
          </tr>
        </tbody>
      </table>

      {/* BACK-UP PICTURES */}
      <table style={T}>
        <colgroup>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
        </colgroup>
        <tbody>
          <tr style={{ height:220 }}>
            {[item.imagemPart,item.imagemPU,item.imagemHU,item.imagemDunnage].map((img,i)=>(
              <td key={i} style={{ ...VL, textAlign:'center', verticalAlign:'middle', padding:4 }}>
                {img&&<img src={img} alt="" crossOrigin="anonymous"
                  style={{ maxHeight:214, maxWidth:'100%', objectFit:'contain', display:'block', margin:'0 auto' }}/>}
              </td>
            ))}
          </tr>
          <tr><td colSpan={4} style={SEC}>Back-up pictures</td></tr>
        </tbody>
      </table>

      {/* BACK-UP REMARKS */}
      <table style={T}>
        <tbody>
          <tr><td style={SEC}>Back-up remarks</td></tr>
          <tr style={{ height:34 }}>
            <td style={{ ...VL, whiteSpace:'normal', verticalAlign:'top', padding:'2px 4px',
              fontSize:6.5, fontStyle:'italic', color:'#555' }}>
              (wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)
              {v(item.backupRemarks)&&
                <span style={{ color:BK, fontStyle:'normal' }}> {v(item.backupRemarks)}</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SIGNATURES */}
      <table style={T}>
        <colgroup>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
          <col style={{ width:'25%' }}/><col style={{ width:'25%' }}/>
        </colgroup>
        <tbody>
          <tr><td colSpan={4} style={SEC}>Signatures</td></tr>
          <tr style={{ height:16 }}>
            <td style={LB}>Supplier Logistics</td>
            <td style={LB}>Faurecia plant Logistics</td>
            <td style={LB}>Faurecia plant Quality</td>
            <td style={{ ...LB, whiteSpace:'normal', fontSize:6 }}>Faurecia plant HSE (for new packaging)</td>
          </tr>
          {['Position','Name','Date'].map(l=>(
            <tr key={l} style={{ height:16 }}>
              {[0,1,2,3].map(i=><td key={i} style={{ ...VL, fontSize:6.5 }}>{l}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <Footer/>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────
export default function LPDSPreview() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const itemId    = params.get('item');
  const [items,   setItems]     = useState<Item[]>([]);
  const [selId,   setSelId]     = useState(itemId||'');
  const [projects,setProjects]  = useState<Project[]>([]);
  const p1 = useRef<HTMLDivElement>(null);
  const p2 = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(()=>{
    const all = getItems();
    setItems(all);
    setProjects(getProjects());
    if(!itemId && all.length>0) setSelId(all[0].id);
  },[itemId]);

  const item = items.find(i=>i.id===selId);
  const calc = item ? calculateFields(item) : null;
  const proj = projects.find(p=>p.projeto===item?.projeto||p.id===getActiveProjectId());
  const logo = proj?.logoEmpresa||'';

  const download = async ()=>{
    if(!p1.current||!p2.current||!item) return;
    setBusy(true);
    try{
      const [{default:h2p},{default:jsPDF}] = await Promise.all([
        import('html2pdf.js'), import('jspdf'),
      ]);
      const OPT = {
        margin:[0,0,0,0],
        image:{ type:'jpeg' as const, quality:0.98 },
        html2canvas:{ scale:2, useCORS:true, backgroundColor:'#ffffff', logging:false },
        jsPDF:{ unit:'mm' as const, format:'a4' as const, orientation:'landscape' as const },
      };
      const i1 = await h2p().set(OPT).from(p1.current).outputImg('dataurl');
      const i2 = await h2p().set(OPT).from(p2.current).outputImg('dataurl');
      const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'landscape' });
      doc.addImage(i1 as string,'JPEG',0,0,297,210);
      doc.addPage();
      doc.addImage(i2 as string,'JPEG',0,0,297,210);
      doc.save(`LPDS_${item.partNumber||'doc'}.pdf`);
    }finally{ setBusy(false); }
  };

  if(!item) return (
    <div className="p-8">
      <button onClick={()=>navigate('/items')} className="flex items-center gap-2 text-slate-500 mb-6">
        <ArrowLeft className="w-4 h-4"/> Voltar
      </button>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">LPDS Preview</h1>
      <p className="text-sm text-slate-400 mb-4">
        {items.length===0?'Nenhum item cadastrado.':'Selecione um item para visualizar.'}
      </p>
      {items.length>0&&(
        <select value={selId} onChange={e=>setSelId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">— selecione —</option>
          {items.map(i=><option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
        </select>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={()=>navigate('/items')} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LPDS Preview</h1>
            <p className="text-xs text-slate-500">{item.partNumber} — {item.partName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selId} onChange={e=>setSelId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {items.map(i=><option key={i.id} value={i.id}>{i.partNumber} — {i.partName}</option>)}
          </select>
          <button onClick={download} disabled={busy}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <Download className="w-4 h-4"/>
            {busy?'Gerando PDF…':'Baixar PDF'}
          </button>
        </div>
      </div>

      {/* preview */}
      <div style={{ overflowX:'auto', background:'#aaa', padding:12, borderRadius:8 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12, width:PW }}>
          <div ref={p1} style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.35)' }}>
            <PageOne item={item} calc={calc} logo={logo}/>
          </div>
          <div ref={p2} style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.35)' }}>
            <PageTwo item={item} calc={calc} logo={logo}/>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">A4 landscape — cada bloco = 1 página do PDF</p>
    </div>
  );
}
