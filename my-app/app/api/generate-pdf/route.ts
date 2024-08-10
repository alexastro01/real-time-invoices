import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';
import { IInvoiceData } from '@/types/interfaces';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';

export async function POST(req: NextRequest) {
  const invoiceData: IInvoiceData = await req.json();

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

  // Define colors
  const primaryColor = '#000000';  // Black
  const secondaryColor = '#333333';  // Dark Gray

  // Add logo and title
  doc.image(path.resolve('./public/logo_cropped.png'), 50, 45, { width: 50 })
     .fontSize(28)
     .fillColor(primaryColor)
     .text('Invoice [testnet]', 110, 57);

  // Add a colored rectangle
  doc.rect(0, 120, 595.28, 10).fill(primaryColor);

  // Add seller and client information
  doc.fontSize(10);
  addInformation(doc, 'Seller:', invoiceData.partiesDetails.seller, invoiceData.paymentDetails.payeeAddress, 50, 150);
  addInformation(doc, 'Client:', invoiceData.partiesDetails.client, invoiceData.paymentDetails.payerAddress, 300, 150);

  // Add a separating line
  doc.moveTo(50, 300).lineTo(545, 300).stroke(secondaryColor);

  // Format the due date
  const formattedDueDate = formatDate(invoiceData.paymentDetails.dueDate as number);

  // Add payment details
  doc.fontSize(16)
     .fillColor(primaryColor)
     .text('Payment Details', 50, 320);
  doc.moveTo(50, 345).lineTo(545, 345).stroke(primaryColor);

  doc.fontSize(10)
     .fillColor(secondaryColor);

  addDetailRow(doc, 'Chain:', chainInfo[invoiceData.paymentDetails.chain as ValidChainId].name, 50, 360);
  addDetailRow(doc, 'Currency:', 'tUSDC', 50, 380);
  addDetailRow(doc, 'Stream Type:', invoiceData.paymentDetails.streamType, 50, 400);
  addDetailRow(doc, 'Due Date:', formattedDueDate, 50, 420);

  // Add invoice items
  doc.fontSize(16)
     .fillColor(primaryColor)
     .text('Invoice Items', 50, 460);
  doc.moveTo(50, 485).lineTo(545, 485).stroke(primaryColor);

  const tableTop = 500;
  generateTable(doc, invoiceData.paymentDetails.invoiceItems, tableTop, secondaryColor);

  // Add total amount
  const totalTop = tableTop + (invoiceData.paymentDetails.invoiceItems.length + 1) * 30 + 20;
  doc.fontSize(14)
     .fillColor(primaryColor)
     .text(`Total Amount:`, 400, totalTop)
     .fontSize(16)
     .text(`$${invoiceData.paymentDetails.totalAmount}`, 400, totalTop + 20);

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks as any));
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

function addInformation(doc: PDFKit.PDFDocument, title: string, data: any, evmAddress: string, x: number, y: number) {
  doc.fontSize(14)
     .fillColor('#000000')  // Black
     .text(title, x, y);
  doc.fontSize(10)
     .fillColor('#333333')  // Dark Gray
     .text(data.name, x, y + 25)
     .text(data.email, x, y + 40)
     .text(data.address || '', x, y + 55)
     .text(`${data.city || ''}, ${data.state || ''} ${data.zip || ''}`, x, y + 70)
     .text(data.country || '', x, y + 85)
     .fontSize(8)
     .text('EVM Address:', x, y + 100)
     .text(evmAddress, x, y + 115, { width: 200, align: 'left' });
}

function addDetailRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number) {
  doc.fillColor('#000000')  // Black
     .text(label, x, y)
     .fillColor('#333333')  // Dark Gray
     .text(value, x + 100, y);
}

function generateTable(doc: PDFKit.PDFDocument, items: any[], y: number, color: string) {
  const headers = ['Item', 'Quantity', 'Price', 'Amount'];
  
  doc.fontSize(10)
     .fillColor(color);

  headers.forEach((header, i) => {
    doc.text(header, 50 + i * 125, y);
  });

  doc.moveTo(50, y + 15).lineTo(545, y + 15).stroke(color);

  items.forEach((item, i) => {
    const rowY = y + 25 + (i * 25);
    doc.text(item.name, 50, rowY)
       .text(item.quantity.toString(), 175, rowY)
       .text(`$${item.price.toFixed(2)}`, 300, rowY)
       .text(`$${(item.quantity * item.price).toFixed(2)}`, 425, rowY);
  });
}

function formatDate(timestamp: number | string): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}