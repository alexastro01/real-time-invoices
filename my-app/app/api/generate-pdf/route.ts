import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';

export async function POST(req: NextRequest) {
  const invoiceData = await req.json();

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  // Add logo and title
  doc.image(path.resolve('./public/usdc.png'), 50, 45, { width: 50 })
     .fontSize(25)
     .text('Invoice', 110, 57);

  // Add a colored rectangle
  // doc.rect(0, 120, 595.28, 10).fill('#2C3E50');

  // Add seller and client information with more space between them
  doc.fontSize(10);
  addInformation(doc, 'Seller:', invoiceData.seller, 50, 150);
  addInformation(doc, 'Client:', invoiceData.client, 300, 150);

  // Add a separating line closer to the seller and client information
  doc.moveTo(50, 300).lineTo(545, 300).stroke();

  // Add payment details with less whitespace and an underline
  doc.fontSize(14)
     .text('Payment Details', 50, 320);
  doc.moveTo(50, 340).lineTo(545, 340).stroke(); // Underline

  doc.fontSize(10)
     .text(`Chain: ${invoiceData.paymentDetails.chain}`, 50, 350)
     .text(`Currency: ${invoiceData.paymentDetails.currency}`, 50, 370)
     .text(`Stream Type: ${invoiceData.paymentDetails.streamType}`, 50, 390);

  // Add invoice items
  doc.fontSize(14)
     .text('Invoice Items', 50, 420);
     doc.moveTo(50, 440).lineTo(545, 440).stroke(); // Underline

  const tableTop = 450;
  doc.fontSize(10);

  generateTable(doc, invoiceData.invoiceItems, tableTop);

  // Add total amount
  const totalTop = tableTop + (invoiceData.invoiceItems.length + 1) * 30;
  doc
     .fontSize(14)
     .text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`, 400, totalTop);

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    },
  });
}

function addInformation(doc: PDFKit.PDFDocument, title: string, data: any, x: number, y: number) {
  doc.fontSize(12)
     .text(title, x, y);
  doc.fontSize(10)
     .text(data.name, x, y + 20)
     .text(data.email, x, y + 35)
     .text(data.address, x, y + 50)
     .text(`${data.city}, ${data.state} ${data.zip}`, x, y + 65)
     .text(data.country, x, y + 80);
  
  // Handle long EVM address
  const evmAddress = data.evmAddress || data.receiverAddress;
  doc.fontSize(8)
     .text('EVM Address:', x, y + 95)
     .text(evmAddress, x, y + 110, { width: 200, align: 'left' });
}

function generateTable(doc: PDFKit.PDFDocument, items: any[], y: number) {
  const headers = ['Item', 'Quantity', 'Price', 'Amount'];
  
  doc.fontSize(10)
     .text(headers[0], 50, y)
     .text(headers[1], 200, y)
     .text(headers[2], 280, y)
     .text(headers[3], 360, y);

  doc.moveTo(50, y + 15).lineTo(545, y + 15).stroke();

  items.forEach((item, i) => {
    const rowY = y + 25 + (i * 25);
    doc.fontSize(10)
       .text(item.name, 50, rowY)
       .text(item.quantity.toString(), 200, rowY)
       .text(`$${item.price.toFixed(2)}`, 280, rowY)
       .text(`$${(item.quantity * item.price).toFixed(2)}`, 360, rowY);
  });
}