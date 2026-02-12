import { RequestHandler } from "express";

export const handlePaymentSchedulePNG: RequestHandler = async (req, res) => {
  try {
    const { amount, installments, data } = req.body;

    if (!amount || !installments || !Array.isArray(data)) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Generate HTML table
    const html = generatePaymentScheduleHTML(amount, data);

    // For now, return the HTML that can be rendered or use a service to convert
    // In production, you might use: puppeteer, wkhtmltopdf, or a headless browser service
    
    // Since we don't have puppeteer configured, we'll return SVG/Canvas data
    // The client can use this to render properly
    res.json({
      html,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating payment schedule PNG:", error);
    res.status(500).json({ error: "Failed to generate payment schedule" });
  }
};

function generatePaymentScheduleHTML(
  amount: number,
  paymentData: Array<{
    downPaymentPercent: number;
    downPayment: number;
    loanAmount: number;
    installments: number[];
  }>
): string {
  const rows = paymentData
    .map(
      (row) => `
    <tr style="background-color: #ffffff; color: #000000; border: 1px solid #6d2fce;">
      <td style="border: 1px solid #6d2fce; padding: 16px 6px; text-align: center; font-size: 17px; height: 60px;">
        %${row.downPaymentPercent} (${row.downPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺)
      </td>
      <td style="border: 1px solid #6d2fce; padding: 16px; text-align: center; font-size: 17px; height: 60px;">
        ${row.loanAmount.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺
      </td>
      ${row.installments.map((inst) => `<td style="border: 1px solid #6d2fce; padding: 16px; text-align: center; font-size: 17px; height: 60px;">${inst.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺</td>`).join("")}
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ödeme Planı</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: #ffffff;
          font-family: "Paytone One", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 20px;
        }
        .container {
          max-width: 100%;
          background-color: #ffffff;
        }
        .header {
          background-color: #1a2b7d;
          color: #ffffff;
          padding: 20px;
          border-bottom: 5px solid #6d2fce;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .header-title {
          font-size: 20px;
          font-weight: bold;
          flex: 1;
        }
        .header-logo {
          height: 60px;
          width: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff;
        }
        thead tr {
          background-color: #1800ae;
          color: #ffffff;
        }
        th {
          border: 2px solid #1800ae;
          padding: 20px;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
          height: 60px;
          vertical-align: middle;
        }
        td {
          border: 1px solid #6d2fce;
          padding: 16px;
          text-align: center;
          font-size: 17px;
          height: 60px;
          vertical-align: middle;
          background-color: #ffffff;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
          }
          table {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-title">
            ${amount.toLocaleString("tr-TR")} TL ARAÇ İÇİN TAKSİTLİ SATIŞ ÖRNEK ÖDEME TABLOSU
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="border: 2px solid #1800ae;">PEŞİNAT</th>
              <th style="border: 2px solid #1800ae;">KREDİ TUTARI</th>
              <th style="border: 2px solid #1800ae;">12AY</th>
              <th style="border: 2px solid #1800ae;">18AY</th>
              <th style="border: 2px solid #1800ae;">24AY</th>
              <th style="border: 2px solid #1800ae;">36AY</th>
              <th style="border: 2px solid #1800ae;">48AY</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
}
