import React from "react";

export default function LPDSPreview() {
  return (
    <>
      <style>{`
*{box-sizing:border-box}
    body{margin:0;padding:18px;background:#e9e9e9;font-family:Arial,Helvetica,sans-serif;color:#000}
    .sheet{width:1388px;margin:0 auto;background:#fff;border:3px solid #000;overflow:hidden}
    table{border-collapse:collapse;table-layout:fixed;width:100%}
    td,th{border:1px solid #000;padding:0 4px;vertical-align:middle;line-height:1.05;font-size:11px}
    .blue{background:#062a68;color:#fff;font-size:28px;font-weight:800;text-align:center;height:40px;letter-spacing:.2px}
    .logo{width:198px;height:40px;text-align:left;padding-left:20px;background:#fff;border-left:0;border-top:0}
    .logo span{display:inline-block;color:#24205f;font-size:28px;font-weight:700;letter-spacing:6px;transform:scaleX(1.15);transform-origin:left center}
    .gray{background:#bfbfbf}
    .black{background:#000;color:#fff;text-align:center;font-weight:800;font-size:16px;height:20px}
    .meta td{height:22px}.meta-l{width:198px;text-align:right;font-weight:700;background:#d9d9d9}.meta-v{width:520px;text-align:center;font-weight:700;font-size:14px}.gap{width:142px;border-left:0;border-right:0;background:#fff}.date-l{width:151px;text-align:right;font-weight:700;background:#d9d9d9}.date-v{width:371px;font-size:14px;text-align:left}
    .info-area{display:grid;grid-template-columns:718px 142px 522px;height:94px}.left-info{width:718px}.mid-gap{width:142px;background:#fff;border-left:1px solid #000;border-right:1px solid #000}.right-info{width:522px}.info-table{height:94px}.info-table td,.info-table th{height:18px}.lbl-l{width:198px;text-align:right;font-weight:700;font-size:10px;background:#bfbfbf}.v-a{width:172px}.v-b{width:180px}.v-c{width:168px}.lbl-r{width:180px;text-align:right;font-weight:700;font-size:10px;background:#bfbfbf}.val{background:#fff;font-size:12px;white-space:nowrap;overflow:hidden}.right{text-align:right}.supplier .black{height:18px}

    /* ETAPA 2 */
    .pack{margin-top:0;border-top:3px solid #000;background:#bfbfbf}
    .pack-title{height:20px;background:#000;color:#fff;text-align:center;font-size:17px;font-weight:800;border-left:0;border-right:0}
    .pack-body{height:164px;background:#bfbfbf;display:grid;grid-template-columns:370px 350px 140px 185px 175px 168px;overflow:hidden}
    .p-left,.p-mid,.p-unit,.p-check-labels,.p-check-table,.p-end{height:164px;background:#bfbfbf}
    .p-left table,.p-mid table,.p-unit table{height:164px}
    .p-left td,.p-mid td,.p-unit td{height:27.333px;font-size:12px}
    .p-label{background:#bfbfbf;text-align:right;font-weight:700;width:200px}.p-input{background:#fff;text-align:center;font-size:16px!important}.p-input.left{text-align:left;font-size:15px!important}.p-mid .p-label{width:180px}.p-unit td{border-left:0;border-right:0;background:#bfbfbf;text-align:left;font-weight:700;font-size:12px}.p-check-labels{padding-top:48px}.p-check-labels table{height:108px}.p-check-labels td{border:0;background:#bfbfbf;text-align:right;font-weight:700;font-size:12px;height:27px}.p-check-table{padding-top:26px}.p-check-table table{width:175px;height:112px}.p-check-table th{height:26px;background:#bfbfbf;font-size:10px;border-top:0}.p-check-table td{height:27px;background:#fff;text-align:center;font-size:15px}.p-end{border:0}

    /* ETAPA 3 CORRIGIDA */
    .main-table-wrap{border-top:3px solid #000;background:#bfbfbf;overflow:hidden}
    .main-table{width:100%;height:302px;background:#bfbfbf}
    .main-table th,.main-table td{height:27px;font-size:12px}
    .main-table .w-label{width:195px;background:#bfbfbf;text-align:right;font-weight:700}
    .main-table .w-part{width:170px;text-align:center;background:#fff}
    .main-table .w-pu{width:180px;text-align:center;background:#fff}
    .main-table .w-hu{width:170px;text-align:center;background:#fff}
    .main-table .w-space{width:145px;background:#bfbfbf;border-left:2px solid #000;border-right:2px solid #000}
    .main-table .w-d1{width:180px;text-align:center;background:#fff}
    .main-table .w-d2{width:170px;text-align:center;background:#fff}
    .main-table .w-d3{width:175px;text-align:center;background:#fff}
    .main-table th{background:#bfbfbf;text-align:center;font-weight:700}
    .main-table .graycell{background:#bfbfbf}
    .main-table .num{font-size:16px;background:#fff;text-align:center}
    .main-table .txt{font-size:15px;background:#fff;text-align:center}
    .main-table .bold-border-left{border-left:2px solid #000}.main-table .bold-border-right{border-right:2px solid #000}.main-table .bold-top{border-top:2px solid #000}.main-table .no-border{border:0;background:#bfbfbf}.stack-label{font-size:9px!important;font-weight:700;text-align:center;background:#bfbfbf}.small-right{font-size:11px!important;font-weight:700;text-align:right;background:#bfbfbf}.dunnage-label{font-size:12px!important;font-weight:700;text-align:right;background:#bfbfbf}
  .stack-box-combined{background:#bfbfbf!important;padding:0!important}.stack-box-combined table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed}.stack-box-combined td{border:0;padding:0 6px;vertical-align:middle}.stack-box-combined .stack-lefttext{width:68%;text-align:left;font-size:9px!important;font-weight:700;line-height:1.1;padding-left:10px}.stack-box-combined .stack-lefttext span{font-size:9px!important;font-weight:700;line-height:1.1;display:inline-block}.stack-box-combined .stack-rightlabel{width:32%;text-align:right;font-size:12px!important;font-weight:700;background:#bfbfbf}.stack-box-combined tr + tr td{border-top:1px solid #000}.stack-value{background:#fff!important;text-align:center!important;font-size:16px!important}
  
    /* ETAPA 4 - PICTURES */
    .pictures-wrap{border-top:3px solid #000;background:#fff}
    .pictures-table{width:100%;table-layout:fixed;border-collapse:collapse}
    .pictures-table td,.pictures-table th{border:1px solid #000;padding:0;vertical-align:top}
    .pictures-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .pictures-head td{height:14px;background:#d7d7d7;text-align:center;font-weight:700;font-size:9px;line-height:1.05;padding:1px 3px}
    .pictures-body td{height:152px;background:#fff}
    .pic-slot{height:150px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
    .photo-sim{width:95px;height:110px;background:linear-gradient(135deg,#fbf7ef,#d6c8b6);border:1px solid #ddd;display:flex;align-items:center;justify-content:center}
    .part-shape{width:58px;height:92px;border-radius:24px 24px 8px 8px;background:repeating-linear-gradient(90deg,#0b203d 0 5px,#142b4e 5px 9px);border:3px solid #111b2e;box-shadow:0 8px 18px rgba(0,0,0,.25)}
    .box-sim{width:74px;height:104px;background:#c9bca8;border:1px solid #876;padding:7px;display:grid;gap:4px}
    .box-sim span{background:#101820;border-radius:14px}
    .pallet-sim{width:150px;height:78px;position:relative;transform:skewX(-25deg);margin-top:18px}
    .pallet-sim:before{content:"";position:absolute;left:0;top:18px;width:148px;height:38px;background:#6fa2db;border:2px solid #2e5f96}
    .pallet-sim:after{content:"";position:absolute;left:16px;top:8px;width:148px;height:38px;background:repeating-linear-gradient(90deg,#74aee8 0 16px,#5188c0 16px 19px);border:2px solid #2e5f96}

  
    /* ETAPA 5 - REMARKS */
    .remarks-wrap{border-top:0;background:#fff}
    .remarks-table{width:100%;table-layout:fixed;border-collapse:collapse}
    .remarks-table td,.remarks-table th{border:1px solid #000;padding:0;vertical-align:middle}
    .remarks-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .remarks-body{height:45px;background:#fff;font-size:12px;line-height:1.15;font-weight:700;color:#0f2f69;padding:4px 6px!important;text-align:left}

  
    /* ETAPA 6 - PAGE 2 HEADER */
    .page2-header-wrap{background:#fff;border-top:0}
    .page2-header-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .page2-header-table td{border:1px solid #000;padding:0;vertical-align:middle}
    .page2-logo{width:198px;height:40px;background:#fff;text-align:left;padding-left:20px}
    .page2-logo span{display:inline-block;color:#24205f;font-size:28px;font-weight:700;letter-spacing:4px;transform:scaleX(1.22);transform-origin:left center}
    .page2-title{height:40px;background:#062a68;color:#fff;text-align:center;font-size:28px;font-weight:800;letter-spacing:.2px}

  
    /* ETAPA EXTRA - SIGNATURES ANTES DA PÁGINA 2 */
    .signatures-wrap{background:#fff;border-top:0}
    .signatures-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .signatures-table td,.signatures-table th{border:1px solid #000;padding:0;vertical-align:middle}
    .signatures-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .sig-label{background:#bfbfbf;text-align:right;font-weight:700;font-size:12px;padding-right:4px!important;line-height:1.05}
    .sig-value{background:#fff;text-align:center;font-size:12px;height:20px}
    .sig-name{font-size:11px;font-weight:700;white-space:nowrap}
    .sig-mark{font-family:"Brush Script MT",cursive;font-size:24px;line-height:1;text-align:center;color:#394b6a}
    .sig-row-1 td{height:34px}
    .sig-row td{height:20px}

  
    /* ETAPA 7 - BACK-UP PACKAGING DATA */
    .backup-main-wrap{background:#bfbfbf;border-top:3px solid #000}
    .backup-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800;line-height:20px}
    .backup-main-table{width:100%;height:210px;border-collapse:collapse;table-layout:fixed}
    .backup-main-table td,.backup-main-table th{border:1px solid #000;padding:0 4px;vertical-align:middle;font-size:12px;line-height:1.05}
    .backup-main-table th{background:#bfbfbf;text-align:center;font-weight:700}
    .backup-label{width:195px;background:#bfbfbf;text-align:right;font-weight:700}
    .backup-part{width:170px;background:#fff;text-align:center}
    .backup-pu{width:180px;background:#fff;text-align:center}
    .backup-hu{width:165px;background:#fff;text-align:center}
    .backup-space{width:140px;background:#bfbfbf;border-left:2px solid #000;border-right:2px solid #000}
    .backup-cover{width:180px;background:#fff;text-align:center}
    .backup-d1{width:170px;background:#fff;text-align:center}
    .backup-d2{width:170px;background:#fff;text-align:center}
    .backup-gray{background:#bfbfbf}
    .backup-num{font-size:16px;background:#fff;text-align:center}
    .backup-txt{font-size:15px;background:#fff;text-align:center}
    .backup-bold-left{border-left:2px solid #000!important}
    .backup-bold-right{border-right:2px solid #000!important}
    .backup-stackbox{background:#c6c6c6!important;text-align:left;font-size:9px!important;font-weight:700;line-height:1.1;padding:0 4px 0 10px!important}
    .backup-stackbox span{font-size:9px!important;font-weight:700;line-height:1.1;display:inline-block}
    .backup-white-label{background:#fff!important;text-align:right!important;font-size:12px!important;font-weight:700!important;padding-right:6px!important}
    .backup-white-value{background:#fff!important;text-align:center!important;font-size:16px!important}
    .backup-side-label{font-size:12px!important;font-weight:700;text-align:right;background:#bfbfbf;padding-right:6px!important}

  
    /* ESPAÇAMENTO ENTRE ETAPAS */
    .pack,
    .main-table-wrap,
    .pictures-wrap,
    .remarks-wrap,
    .signatures-wrap,
    .page2-header-wrap,
    .backup-main-wrap {
      margin-top: 2.5mm;
    }

  
    /* ETAPA 8 - BACK-UP PICTURES */
    .backup-pictures-wrap{background:#fff;border-top:0;margin-top:2.5mm}
    .backup-pictures-table{width:100%;table-layout:fixed;border-collapse:collapse}
    .backup-pictures-table td,.backup-pictures-table th{border:1px solid #000;padding:0;vertical-align:top}
    .backup-pictures-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .backup-pictures-head td{height:18px;background:#d7d7d7;text-align:center;font-weight:700;font-size:9px;line-height:1.05;padding:1px 3px}
    .backup-pictures-body td{height:202px;background:#fff}
    .backup-pictures-slot{height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}

  
    /* ETAPA 9 - BACK-UP REMARKS */
    .backup-remarks-wrap{background:#fff;border-top:0;margin-top:2.5mm}
    .backup-remarks-table{width:100%;table-layout:fixed;border-collapse:collapse}
    .backup-remarks-table td,.backup-remarks-table th{border:1px solid #000;padding:0;vertical-align:middle}
    .backup-remarks-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .backup-remarks-body{height:46px;background:#fff;font-size:12px;line-height:1.15;font-weight:700;color:#000;padding:4px 6px!important;text-align:left;vertical-align:top}

  
    /* ETAPA 10 - FINAL SIGNATURES */
    .final-signatures-wrap{background:#fff;border-top:0;margin-top:2.5mm}
    .final-signatures-table{width:100%;border-collapse:collapse;table-layout:fixed}
    .final-signatures-table td,.final-signatures-table th{border:1px solid #000;padding:0;vertical-align:middle}
    .final-signatures-title{height:20px;background:#000;color:#fff;text-align:center;font-size:16px;font-weight:800}
    .final-sig-label{background:#bfbfbf;text-align:right;font-weight:700;font-size:12px;padding-right:4px!important;line-height:1.05}
    .final-sig-value{background:#fff;text-align:center;font-size:12px;height:20px}
    .final-sig-name{font-size:11px;font-weight:700;white-space:nowrap}
    .final-sig-mark{font-family:"Brush Script MT",cursive;font-size:24px;line-height:1;text-align:center;color:#394b6a}
    .final-sig-row-1 td{height:34px}
    .final-sig-row td{height:20px}
      `}</style>

      <main className="sheet">
    <table>
      <tr><td className="logo"><span>faurecia</span></td><td className="blue">Packaging Data Sheet - Series (page 1/2)</td></tr>
    </table>
    <table className="meta"><tr><td className="meta-l">Document version</td><td className="meta-v">v1</td><td className="gap"></td><td className="date-l">Date</td><td className="date-v">22/12/2023 16:41</td></tr></table>
    <div className="info-area">
      <div className="left-info"><table className="info-table"><tr><th className="black" colSpan={4}>Part Description</th></tr><tr><td className="lbl-l">Faurecia part number(s)</td><td className="val" colspan="3">434802201xxx</td></tr><tr><td className="lbl-l">Description</td><td className="val" colspan="3">551 CC CAPA TEC SEDOSO/ LINHA CINZA</td></tr><tr><td className="lbl-l">Program</td><td className="val v-a">551</td><td className="lbl-l v-b">Daily consumption</td><td className="val v-c"></td></tr><tr><td className="lbl-l">Commodity</td><td className="val v-a"></td><td className="lbl-l v-b">Part unit</td><td className="val v-c right">Part</td></tr></table></div>
      <div className="mid-gap"></div>
      <div className="right-info"><table className="info-table supplier"><tr><th className="black" colSpan={2}>Supplier</th></tr><tr><td className="lbl-r">Supplier name</td><td className="val">FAURECIA AUTOMOTIVE DO BRASIL SJP</td></tr><tr><td className="lbl-r">Supplier code</td><td className="val">1021000000</td></tr><tr><td className="lbl-r">Valid for Faurecia plant</td><td className="val">FMM GOIANA - PERNAMBUCO</td></tr><tr><td className="lbl-r">Start of use</td><td className="val">2023</td></tr></table></div>
    </div>

    <section className="pack">
      <div className="pack-title">Packaging data</div>
      <div className="pack-body">
        <div className="p-left"><table><tr><td className="p-label">Serial packaging</td><td className="p-input left">Cardboard</td></tr><tr><td className="p-label">Back-up packaging</td><td className="p-input"></td></tr><tr><td className="p-label">Box label standard</td><td className="p-input"></td></tr><tr><td className="p-label">Box label qty / PU</td><td className="p-input">1</td></tr><tr><td className="p-label">Minimum Order Quantity (in units)</td><td className="p-input">120</td></tr><tr><td className="p-label">Order Lot size (in units)</td><td className="p-input">120</td></tr></table></div>
        <div className="p-mid"><table><tr><td className="p-label">Total packaging loop</td><td className="p-input"></td></tr><tr><td className="p-label">Packaging stock at the supplier</td><td className="p-input"></td></tr><tr><td className="p-label">Total number of PU</td><td className="p-input"></td></tr><tr><td className="p-label">Calculation based on:</td><td className="p-label"></td></tr><tr><td className="p-label">- Delivery frequency</td><td className="p-input">3</td></tr><tr><td className="p-label">- Return frequency</td><td className="p-input"></td></tr></table></div>
        <div className="p-unit"><table><tr><td>days</td></tr><tr><td>days</td></tr><tr><td></td></tr><tr><td></td></tr><tr><td>per week</td></tr><tr><td>per week</td></tr></table></div>
        <div className="p-check-labels"><table><tr><td>Reusable packaging</td></tr><tr><td>Rented packaging</td></tr><tr><td>If "yes", rental company</td></tr><tr><td>Mixed pallet</td></tr></table></div>
        <div className="p-check-table"><table><tr><th>yes</th><th>no</th></tr><tr><td>☐</td><td>☑</td></tr><tr><td>☐</td><td>☑</td></tr><tr><td>☐</td><td>☑</td></tr><tr><td>☐</td><td>☑</td></tr></table></div>
        <div className="p-end"></div>
      </div>
    </section>

    <section className="main-table-wrap">
      <table className="main-table">
        <colgroup>
          <col className="w-label" /><col className="w-part" /><col className="w-pu" /><col className="w-hu" /><col className="w-space" /><col className="w-d1" /><col className="w-d2" /><col className="w-d3" />
        </colgroup>
        <tr>
          <th></th><th>Part</th><th className="bold-border-left">Packaging Unit = PU</th><th className="bold-border-left bold-border-right">Handling Unit = HU</th><th className="w-space" rowSpan={11}></th><th>Dunnage 1</th><th>Dunnage 2</th><th className="bold-border-left">Dunnage 3</th>
        </tr>
        <tr><td className="w-label">Faurecia part number</td><td className="graycell"></td><td className="txt bold-border-left">BEM0803030N</td><td className="txt bold-border-left bold-border-right">TM15012014</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Description</td><td className="graycell"></td><td className="txt bold-border-left">800X300X300</td><td className="txt bold-border-left bold-border-right">1200x800x150</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Length (mm)</td><td className="num">360</td><td className="num bold-border-left">800</td><td className="num bold-border-left bold-border-right">1200</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Width (mm)</td><td className="num">100</td><td className="num bold-border-left">300</td><td className="num bold-border-left bold-border-right">800</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Height (mm)</td><td className="num">85</td><td className="num bold-border-left">300</td><td className="num bold-border-left bold-border-right">450</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Tare Weight (kg)</td><td></td><td className="num bold-border-left">0,2</td><td className="num bold-border-left bold-border-right">12,0</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Gross Weight (kg)</td><td className="num">0,06</td><td className="num bold-border-left">2,00</td><td className="num bold-border-left bold-border-right">20,0</td><td className="dunnage-label">Qty dunnages / PU</td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Package Density (units)</td><td className="graycell"></td><td className="num bold-border-left">30</td><td className="num bold-border-left bold-border-right">120</td><td className="dunnage-label">Qty dunnages / HU</td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">PU / layer of HU</td><td className="num">4</td><td className="stack-box-combined bold-border-left" rowSpan={2}><table><tr><td className="stack-lefttext" rowSpan={2}>Stackability<br /><span>(qty of levels per<br />stack)</span></td><td className="stack-rightlabel">Static</td></tr><tr><td className="stack-rightlabel">Dynamic</td></tr></table></td><td className="stack-value bold-border-left bold-border-right">6</td><td></td><td></td><td className="bold-border-left"></td></tr>
        <tr><td className="w-label">Quantity PU / HU</td><td className="num">4</td><td className="stack-value bold-border-left bold-border-right">3</td><td className="dunnage-label">Foldable ratio</td><td className="graycell" colSpan={2}></td></tr>
      </table>
    </section>
  
    <section className="pictures-wrap">
      <table className="pictures-table">
        <tr><th className="pictures-title" colSpan={4}>Pictures</th></tr>
        <tr className="pictures-head">
          <td>Part</td>
          <td>PU with parts (+ show label location)</td>
          <td>Complete HU with cover (+ show label location)</td>
          <td>Dunnage</td>
        </tr>
        <tr className="pictures-body">
          <td><div className="pic-slot"><div className="photo-sim"><div className="part-shape"></div></div></div></td>
          <td><div className="pic-slot"><div className="box-sim"><span></span><span></span><span></span></div></div></td>
          <td><div className="pic-slot"><div className="pallet-sim"></div></div></td>
          <td><div className="pic-slot"></div></td>
        </tr>
      </table>
    </section>

  
    <section className="remarks-wrap">
      <table className="remarks-table">
        <tr><th className="remarks-title">Remarks</th></tr>
        <tr><td className="remarks-body">*Altura máx 1,20M - As caixas que não tiverem pontos de apoio (pegas) devem ser incluidos nas embalagens, por recomendação da ERGONOMIA. Na falta da caixa padrão, a backup deve conter a mesma quantidade de peças conforme documento.</td></tr>
      </table>
    </section>

  
    
    <section className="signatures-wrap">
      <table className="signatures-table">
        <colgroup>
          <col style={{ width: "200px" }} /><col style={{ width: "170px" }} /><col style={{ width: "180px" }} /><col style={{ width: "170px" }} /><col style={{ width: "140px" }} /><col style={{ width: "180px" }} /><col style={{ width: "180px" }} /><col style={{ width: "148px" }} />
        </colgroup>
        <tr><th className="signatures-title" colSpan={8}>Signatures</th></tr>
        <tr className="sig-row-1">
          <td className="sig-label">Supplier Logistics</td>
          <td className="sig-value"></td>
          <td className="sig-label">Faurecia plant Logistics</td>
          <td className="sig-value"><div className="sig-mark">GM</div></td>
          <td className="sig-label">Faurecia plant Quality</td>
          <td className="sig-value"></td>
          <td className="sig-label">Faurecia plant HSE<br />(for new packaging)</td>
          <td className="sig-value"></td>
        </tr>
        <tr className="sig-row">
          <td className="sig-label">Position</td><td className="sig-value"></td>
          <td className="sig-label">Position</td><td className="sig-value"></td>
          <td className="sig-label">Position</td><td className="sig-value"></td>
          <td className="sig-label">Position</td><td className="sig-value"></td>
        </tr>
        <tr className="sig-row">
          <td className="sig-label">Name</td><td className="sig-value"></td>
          <td className="sig-label">Name</td><td className="sig-value sig-name">Gabryel Maia de Vasconcelos</td>
          <td className="sig-label">Name</td><td className="sig-value"></td>
          <td className="sig-label">Name</td><td className="sig-value"></td>
        </tr>
        <tr className="sig-row">
          <td className="sig-label">Date</td><td className="sig-value"></td>
          <td className="sig-label">Date</td><td className="sig-value"></td>
          <td className="sig-label">Date</td><td className="sig-value"></td>
          <td className="sig-label">Date</td><td className="sig-value"></td>
        </tr>
      </table>
    </section>


    <section className="page2-header-wrap">
      <table className="page2-header-table">
        <tr>
          <td className="page2-logo"><span>faurecia</span></td>
          <td className="page2-title">Packaging Data Sheet - Back up (page 2/2)</td>
        </tr>
      </table>
    </section>

  
    <section className="backup-main-wrap">
      <div className="backup-title">Back-up packaging data</div>
      <table className="backup-main-table">
        <colgroup>
          <col className="backup-label" /><col className="backup-part" /><col className="backup-pu" /><col className="backup-hu" /><col className="backup-space" /><col className="backup-cover" /><col className="backup-d1" /><col className="backup-d2" />
        </colgroup>
        <tr>
          <th></th>
          <th>Part</th>
          <th className="backup-bold-left">Packaging Unit = PU</th>
          <th className="backup-bold-left backup-bold-right">Handling Unit = HU</th>
          <th className="backup-space" rowSpan={11}></th>
          <th>Cover for HU</th>
          <th>Dunnage 1</th>
          <th>Dunnage 2</th>
        </tr>
        <tr><td className="backup-label">Faurecia part number</td><td className="backup-gray"></td><td className="backup-txt backup-bold-left">BEM0803030N</td><td className="backup-txt backup-bold-left backup-bold-right">TM15012014</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Description</td><td className="backup-gray"></td><td className="backup-txt backup-bold-left">800X300X300</td><td className="backup-txt backup-bold-left backup-bold-right">1200x800x150</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Length (mm)</td><td className="backup-num">360</td><td className="backup-num backup-bold-left">800</td><td className="backup-num backup-bold-left backup-bold-right">1200</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Width (mm)</td><td className="backup-num">100</td><td className="backup-num backup-bold-left">300</td><td className="backup-num backup-bold-left backup-bold-right">800</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Height (mm)</td><td className="backup-num">85</td><td className="backup-num backup-bold-left">300</td><td className="backup-num backup-bold-left backup-bold-right">450</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Tare Weight (kg)</td><td></td><td className="backup-num backup-bold-left">0,2</td><td className="backup-num backup-bold-left backup-bold-right">12</td><td></td><td></td><td></td></tr>
        <tr><td className="backup-label">Gross Weight (kg)</td><td></td><td className="backup-num backup-bold-left">2</td><td className="backup-num backup-bold-left backup-bold-right">20</td><td className="backup-side-label">Qty dunnages / PU</td><td></td><td></td></tr>
        <tr><td className="backup-label">Package Density (units)</td><td className="backup-gray"></td><td className="backup-num backup-bold-left">30</td><td className="backup-num backup-bold-left backup-bold-right">120</td><td className="backup-side-label">Qty dunnages / HU</td><td></td><td></td></tr>
        <tr><td className="backup-label">PU / layer of HU</td><td className="backup-num">4</td><td className="backup-stackbox backup-bold-left" rowSpan={2}>Stackability<br /><span>(qty of levels<br />per stack)</span></td><td className="backup-white-label backup-bold-left">Static</td><td className="backup-white-value backup-bold-right">6</td><td></td><td></td></tr>
        <tr><td className="backup-label">Quantity PU / HU</td><td className="backup-num">4</td><td className="backup-white-label backup-bold-left">Dynamic</td><td className="backup-white-value backup-bold-right">3</td><td className="backup-side-label">Foldable ratio</td><td></td><td></td></tr>
      </table>
    </section>


  
    <section className="backup-pictures-wrap">
      <table className="backup-pictures-table">
        <tr><th className="backup-pictures-title" colSpan={4}>Back-up pictures</th></tr>
        <tr className="backup-pictures-head">
          <td>Part</td>
          <td>PU with parts (+ show label location)</td>
          <td>Complete HU with cover (+ show label location)</td>
          <td>Dunnage</td>
        </tr>
        <tr className="backup-pictures-body">
          <td><div className="backup-pictures-slot"></div></td>
          <td><div className="backup-pictures-slot"></div></td>
          <td><div className="backup-pictures-slot"></div></td>
          <td><div className="backup-pictures-slot"></div></td>
        </tr>
      </table>
    </section>


  
    <section className="backup-remarks-wrap">
      <table className="backup-remarks-table">
        <tr><th className="backup-remarks-title">Back-up remarks</th></tr>
        <tr><td className="backup-remarks-body">(wrapping, thermo sealed bendings, multi-loop disposable packaging, kit, etc.)</td></tr>
      </table>
    </section>

    {/* SIGNATURES — PÁGINA 2 */}
    <section className="final-signatures-wrap">
      <table className="final-signatures-table">
        <colgroup>
          <col style={{ width: "200px" }} /><col style={{ width: "170px" }} /><col style={{ width: "180px" }} /><col style={{ width: "170px" }} /><col style={{ width: "140px" }} /><col style={{ width: "180px" }} /><col style={{ width: "180px" }} /><col style={{ width: "148px" }} />
        </colgroup>
        <tr><th className="final-signatures-title" colSpan={8}>Signatures</th></tr>
        <tr className="final-sig-row-1">
          <td className="final-sig-label">Supplier Logistics</td>
          <td className="final-sig-value"></td>
          <td className="final-sig-label">Faurecia plant Logistics</td>
          <td className="final-sig-value"></td>
          <td className="final-sig-label">Faurecia plant Quality</td>
          <td className="final-sig-value"></td>
          <td className="final-sig-label">Faurecia plant HSE<br />(for new packaging)</td>
          <td className="final-sig-value"></td>
        </tr>
        <tr className="final-sig-row">
          <td className="final-sig-label">Position</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Position</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Position</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Position</td><td className="final-sig-value"></td>
        </tr>
        <tr className="final-sig-row">
          <td className="final-sig-label">Name</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Name</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Name</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Name</td><td className="final-sig-value"></td>
        </tr>
        <tr className="final-sig-row">
          <td className="final-sig-label">Date</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Date</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Date</td><td className="final-sig-value"></td>
          <td className="final-sig-label">Date</td><td className="final-sig-value"></td>
        </tr>
      </table>
    </section>

  </main>
    </>
  );
}
