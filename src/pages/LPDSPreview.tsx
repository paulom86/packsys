<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LPDS - Etapa 1 - Cabeçalho Corrigido</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 24px;
      background: #e9e9e9;
      font-family: Arial, Helvetica, sans-serif;
      color: #000;
    }

    .page-wrapper {
      width: 1388px;
      margin: 0 auto;
      background: #fff;
    }

    .lpds-step-1 {
      width: 1388px;
      height: 160px;
      border: 3px solid #000;
      background: #fff;
      overflow: hidden;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
    }

    td, th {
      border: 1px solid #000;
      padding: 0 4px;
      vertical-align: middle;
      line-height: 1;
    }

    .top-grid { height: 40px; }

    .logo-cell {
      width: 198px;
      height: 40px;
      background: #fff;
      text-align: left;
      padding-left: 20px;
      border-left: 0;
      border-top: 0;
    }

    .logo-text {
      display: inline-block;
      color: #24205f;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 4px;
      transform: scaleX(1.22);
      transform-origin: left center;
    }

    .title-cell {
      height: 40px;
      background: #062a68;
      color: #fff;
      text-align: center;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: .2px;
      border-top: 0;
      border-right: 0;
    }

    .meta-grid { height: 24px; }

    .meta-left-label {
      width: 198px;
      background: #d9d9d9;
      text-align: right;
      font-size: 11px;
      font-weight: 700;
    }

    .meta-left-value {
      width: 520px;
      background: #fff;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
    }

    .meta-gap {
      width: 142px;
      background: #fff;
      border-left: 0;
      border-right: 0;
    }

    .meta-date-label {
      width: 151px;
      background: #d9d9d9;
      text-align: right;
      font-size: 11px;
      font-weight: 700;
    }

    .meta-date-value {
      width: 371px;
      background: #fff;
      text-align: left;
      font-size: 14px;
    }

    .body-row {
      display: grid;
      grid-template-columns: 718px 142px 522px;
      height: 90px;
    }

    .left-block {
      width: 718px;
      height: 90px;
      border-right: 1px solid #000;
    }

    .center-gap {
      width: 142px;
      height: 90px;
      background: #fff;
      border-left: 0;
      border-right: 0;
    }

    .right-block {
      width: 522px;
      height: 90px;
      border-left: 1px solid #000;
    }

    .info-table { height: 90px; }

    .info-table td,
    .info-table th {
      height: 18px;
      font-size: 12px;
    }

    .left-label {
      width: 198px;
      background: #bfbfbf;
      text-align: right;
      font-size: 10px !important;
      font-weight: 700;
    }

    .left-value-a { width: 172px; }
    .left-value-b { width: 180px; }
    .left-value-c { width: 168px; }

    .right-label {
      width: 180px;
      background: #bfbfbf;
      text-align: right;
      font-size: 10px !important;
      font-weight: 700;
    }

    .right-value {
      width: 342px;
      background: #fff;
      text-align: left;
      font-size: 12px !important;
    }

    .section-title {
      background: #000;
      color: #fff;
      text-align: center;
      font-size: 16px !important;
      font-weight: 800;
      height: 20px !important;
    }

    .input-cell {
      background: #fff;
      text-align: left;
      font-size: 12px !important;
      white-space: nowrap;
      overflow: hidden;
    }

    .value-right { text-align: right; }

    @media print {
      body {
        padding: 0;
        background: #fff;
      }

      .page-wrapper { margin: 0; }

      @page {
        size: A4 landscape;
        margin: 4mm;
      }
    }
  </style>
</head>

<body>
  <main class="page-wrapper">
    <section class="lpds-step-1" aria-label="LPDS Etapa 1 - Cabeçalho corrigido">
      <table class="top-grid">
        <tr>
          <td class="logo-cell">
            <span class="logo-text">faurecia</span>
          </td>
          <td class="title-cell">
            Packaging Data Sheet - Series (page 1/2)
          </td>
        </tr>
      </table>

      <table class="meta-grid">
        <tr>
          <td class="meta-left-label">Document version</td>
          <td class="meta-left-value">v1</td>
          <td class="meta-gap"></td>
          <td class="meta-date-label">Date</td>
          <td class="meta-date-value">22/12/2023 16:41</td>
        </tr>
      </table>

      <div class="body-row">
        <div class="left-block">
          <table class="info-table">
            <tr>
              <th class="section-title" colspan="4">Part Description</th>
            </tr>

            <tr>
              <td class="left-label">Faurecia part number(s)</td>
              <td class="input-cell" colspan="3">434802201xxx</td>
            </tr>

            <tr>
              <td class="left-label">Description</td>
              <td class="input-cell" colspan="3">551 CC CAPA TEC SEDOSO/ LINHA CINZA</td>
            </tr>

            <tr>
              <td class="left-label">Program</td>
              <td class="input-cell left-value-a">551</td>
              <td class="left-label left-value-b">Daily consumption</td>
              <td class="input-cell left-value-c"></td>
            </tr>

            <tr>
              <td class="left-label">Commodity</td>
              <td class="input-cell left-value-a"></td>
              <td class="left-label left-value-b">Part unit</td>
              <td class="input-cell left-value-c value-right">Part</td>
            </tr>
          </table>
        </div>

        <div class="center-gap"></div>

        <div class="right-block">
          <table class="info-table">
            <tr>
              <th class="section-title" colspan="2">Supplier</th>
            </tr>

            <tr>
              <td class="right-label">Supplier name</td>
              <td class="right-value">FAURECIA AUTOMOTIVE DO BRASIL SJP</td>
            </tr>

            <tr>
              <td class="right-label">Supplier code</td>
              <td class="right-value">1021000000</td>
            </tr>

            <tr>
              <td class="right-label">Valid for Faurecia plant</td>
              <td class="right-value">FMM GOIANA - PERNAMBUCO</td>
            </tr>

            <tr>
              <td class="right-label">Start of use</td>
              <td class="right-value">2023</td>
            </tr>
          </table>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
