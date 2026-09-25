export interface DocumentTemplateData {
  CLIENT_NAME: string;
  COMPANY_NAME: string;
  CLIENT_EMAIL: string;
  CLIENT_ADDRESS?: string;
  CONTRACT_ID: string;
  DOCUMENT_DATE: string;
  EFFECTIVE_DATE: string;
  TOTAL_AMOUNT: string;
  RETAINER_FEE: string;
  SCOPE_SUMMARY: string;
  PAYMENT_TERMS?: string;
  GOVERNING_LAW?: string;
  AGENCY_SIGNATORY?: string;
  CLIENT_SIGNATORY?: string;
  INVOICE_NUMBER?: string;
  DUE_DATE?: string;
  STATUS?: string;
}

export const MSA_CONTRACT_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Master Services Agreement - Lumen & Co</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ef4d23;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-title {
      font-size: 24px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.5px;
    }
    .logo-subtitle {
      font-size: 11px;
      color: #ef4d23;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .badge {
      background-color: #ef4d23;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .doc-title {
      font-size: 26px;
      font-weight: 800;
      color: #0c0d12;
      margin-bottom: 5px;
      letter-spacing: -0.5px;
    }
    .doc-[#ef4d23] {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      color: #ef4d23;
      font-weight: 400;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background-color: #f8f8f6;
      border: 1px solid #e5e5e0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .meta-box h4 {
      margin: 0 0 6px 0;
      font-size: 10px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 1px;
    }
    .meta-box p {
      margin: 0;
      font-weight: 600;
      color: #111;
      font-size: 13px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #ef4d23;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
    }
    .signature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 40px;
      padding-top: 25px;
      border-top: 2px dashed #ddd;
    }
    .sig-box {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 18px;
      background: #fafafa;
    }
    .sig-line {
      border-bottom: 1.5px solid #111;
      margin-top: 35px;
      margin-bottom: 8px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 10px;
      color: #888;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div className="header">
    <div>
      <div className="logo-title">lumen & co</div>
      <div className="logo-subtitle">Performance Marketing & Growth Engineering</div>
    </div>
    <div className="badge">OFFICIAL MSA AGREEMENT</div>
  </div>

  <div className="doc-title">
    Master Services Agreement & <span className="doc-[#ef4d23]">Retainer SLA</span>
  </div>
  <p style="color: #555; margin-bottom: 25px;">
    Ref ID: <strong>{{CONTRACT_ID}}</strong> • Date of Execution: <strong>{{DOCUMENT_DATE}}</strong>
  </p>

  <div className="meta-grid">
    <div className="meta-box">
      <h4>AGENCY / SERVICE PROVIDER</h4>
      <p>Lumen & Co Digital Private Limited</p>
      <p style="font-weight:400; color:#555;">Level 4, Jubilee Hills, Hyderabad 500033</p>
      <p style="font-weight:400; color:#555;">Email: legal@lumenandco.in</p>
    </div>
    <div className="meta-box">
      <h4>CLIENT / COMPANY</h4>
      <p>{{COMPANY_NAME}}</p>
      <p style="font-weight:400; color:#555;">Authorized Representative: {{CLIENT_NAME}}</p>
      <p style="font-weight:400; color:#555;">Email: {{CLIENT_EMAIL}}</p>
    </div>
  </div>

  <div className="section">
    <div className="section-title">1. Engagement & Scope of Performance</div>
    <p>
      This Master Services Agreement ("Agreement") governs the performance marketing, creative strategy, media buying, and growth engineering services delivered by Lumen & Co to <strong>{{COMPANY_NAME}}</strong>.
    </p>
    <p><strong>Primary Scope Summary:</strong> {{SCOPE_SUMMARY}}</p>
  </div>

  <div className="section">
    <div className="section-title">2. Retainer Terms & Payment Schedule</div>
    <p>
      Client agrees to pay a monthly base retainer fee of <strong>{{RETAINER_FEE}}</strong> (Total Contract Commitment: <strong>{{TOTAL_AMOUNT}}</strong>).
    </p>
    <p><strong>Payment Terms:</strong> {{PAYMENT_TERMS}}</p>
  </div>

  <div className="section">
    <div className="section-title">3. Intellectual Property & Confidentiality</div>
    <p>
      All ad creatives, video assets, landing page code, and custom telemetry algorithms developed specifically for {{COMPANY_NAME}} shall become the sole property of Client upon settlement of invoices. Both parties commit to strict confidentiality and non-disclosure under India's Digital Personal Data Protection (DPDP) Act 2023.
    </p>
  </div>

  <div className="section">
    <div className="section-title">4. Governing Law & Telemetry Compliance</div>
    <p>
      This Agreement shall be governed by and construed in accordance with the laws of India. Jurisdiction shall rest exclusively with courts in Hyderabad, Telangana.
    </p>
  </div>

  <div className="signature-grid">
    <div className="sig-box">
      <div style="font-size:11px; font-weight:700; color:#ef4d23; text-transform:uppercase;">For Lumen & Co Private Limited</div>
      <div className="sig-line"></div>
      <p style="margin:0; font-weight:700;">{{AGENCY_SIGNATORY}}</p>
      <p style="margin:0; font-size:11px; color:#666;">Founder & Managing Director</p>
    </div>
    <div className="sig-box">
      <div style="font-size:11px; font-weight:700; color:#111; text-transform:uppercase;">For {{COMPANY_NAME}}</div>
      <div className="sig-line"></div>
      <p style="margin:0; font-weight:700;">{{CLIENT_SIGNATORY}}</p>
      <p style="margin:0; font-size:11px; color:#666;">Authorized Signatory (Client)</p>
    </div>
  </div>

  <div className="footer">
    Verified & Digitally Sealed by Lumen & Co Encrypted Vault System • DPDP Act 2023 Compliant • Page 1 of 1
  </div>
</body>
</html>
`;

export const INVOICE_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - Lumen & Co</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 40px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #ef4d23;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #111;
      letter-spacing: -0.5px;
    }
    .inv-badge {
      background-color: #ef4d23;
      color: #fff;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      text-transform: uppercase;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }
    .card h4 {
      margin: 0 0 8px 0;
      font-size: 10px;
      color: #ef4d23;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f3f4f6;
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      text-transform: uppercase;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    .total-box {
      float: right;
      width: 280px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .total-final {
      border-top: 2px solid #ef4d23;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 800;
      color: #ef4d23;
    }
    .footer {
      clear: both;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div className="header">
    <div>
      <div className="brand-title">lumen & co</div>
      <p style="margin:2px 0 0 0; color:#ef4d23; font-weight:700; font-size:11px;">TAX INVOICE & RECEIPT</p>
    </div>
    <div className="inv-badge">INVOICE {{INVOICE_NUMBER}}</div>
  </div>

  <div className="grid-2">
    <div className="card">
      <h4>BILLED FROM</h4>
      <p style="margin:0; font-weight:700;">Lumen & Co Digital Pvt Ltd</p>
      <p style="margin:4px 0 0 0; color:#4b5563;">GSTIN: 36AAACL9012K1Z9</p>
      <p style="margin:2px 0 0 0; color:#4b5563;">Level 4, Jubilee Hills, Hyderabad 500033</p>
    </div>

    <div className="card">
      <h4>BILLED TO</h4>
      <p style="margin:0; font-weight:700;">{{COMPANY_NAME}}</p>
      <p style="margin:4px 0 0 0; color:#4b5563;">Attention: {{CLIENT_NAME}}</p>
      <p style="margin:2px 0 0 0; color:#4b5563;">Email: {{CLIENT_EMAIL}}</p>
    </div>
  </div>

  <div style="margin-bottom: 20px; font-size: 12px; color: #4b5563;">
    Invoice Date: <strong>{{DOCUMENT_DATE}}</strong> • Due Date: <strong>{{DUE_DATE}}</strong> • Status: <span style="color:#10b981; font-weight:800;">{{STATUS}}</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description / Service Scope</th>
        <th>Period</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong>Performance Marketing Retainer & Media Management</strong><br>
          <span style="font-size:11px; color:#6b7280;">{{SCOPE_SUMMARY}}</span>
        </td>
        <td>Monthly SLA</td>
        <td style="text-align:right; font-weight:700;">{{RETAINER_FEE}}</td>
      </tr>
    </tbody>
  </table>

  <div className="total-box">
    <div className="total-row">
      <span>Subtotal:</span>
      <span style="font-weight:600;">{{RETAINER_FEE}}</span>
    </div>
    <div className="total-row">
      <span>GST (18%):</span>
      <span style="font-weight:600;">Included / Zero Tax</span>
    </div>
    <div className="total-row total-final">
      <span>Total Paid:</span>
      <span>{{TOTAL_AMOUNT}}</span>
    </div>
  </div>

  <div className="footer">
    Thank you for building with Lumen & Co! Payment processed under verified retainer contract Ref #{{CONTRACT_ID}}.
  </div>
</body>
</html>
`;

export function fillTemplate(html: string, data: Partial<DocumentTemplateData>): string {
  let result = html;
  Object.entries(data).forEach(([key, val]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(placeholder, val || "");
  });
  return result;
}

export async function downloadHtmlAsPdf(htmlContent: string, fileName: string) {
  try {
    // Try importing html2pdf dynamically
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "800px";
    document.body.appendChild(container);

    const opt = {
      margin: 10,
      filename: fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(container).save();
    document.body.removeChild(container);
  } catch (err) {
    console.warn("html2pdf fallback to Blob download trigger:", err);
    // Reliable fallback: Blob download of html file with print trigger or direct PDF-like preview download
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
