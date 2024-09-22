import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
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

  // Define colors for light mode
  const backgroundColor = '#ffffff';
  const textColor = '#333333';
  const warningColor = '#ff6b6b';
  const borderColor = '#cccccc';

  // Set background color
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(backgroundColor);

  // Add title
  doc.fontSize(28)
     .fillColor(textColor)
     .text('Invoice', 50, 50, { align: 'center' });

  // Add warning if past due
  const currentDate = new Date();
  const dueDate = new Date(invoiceData.paymentDetails.dueDate);
  if (currentDate > dueDate) {
    doc.fontSize(12)
       .fillColor(warningColor)
       .text('This invoice is past due', 50, 90, { align: 'center' });
  }

  // Add seller and client information
  doc.fontSize(14)
     .fillColor(textColor);
  const infoY = 130;
  addInformation(doc, 'Seller:', invoiceData.partiesDetails.seller, invoiceData.paymentDetails.payeeAddress, 50, infoY);
  addInformation(doc, 'Client:', invoiceData.partiesDetails.client, invoiceData.paymentDetails.payerAddress, 300, infoY);
  
  // Add border around seller and client information
  doc.rect(40, infoY - 10, 515, 200).stroke(borderColor);

  // Add payment details
  const paymentY = 350;
  doc.fontSize(16)
     .text('Payment Details:', 50, paymentY);
  
  doc.fontSize(12);
  addDetailRow(doc, 'Chain:', chainInfo[invoiceData.paymentDetails.chain as ValidChainId].name, 50, paymentY + 30);
  addDetailRow(doc, 'Currency:', invoiceData.paymentDetails.currency, 50, paymentY + 50);
  addDetailRow(doc, 'Stream Type:', invoiceData.paymentDetails.streamType, 50, paymentY + 70);
  addDetailRow(doc, 'Due Date:', formatDate(invoiceData.paymentDetails.dueDate as any), 50, paymentY + 90);

  // Add border around payment details
  doc.rect(40, paymentY - 10, 515, 130).stroke(borderColor);

  // Add invoice items
  const itemsY = 500;
  doc.fontSize(16)
     .text('Invoice Items', 50, itemsY);

  const tableTop = itemsY + 30;
  generateTable(doc, invoiceData.paymentDetails.invoiceItems, tableTop, borderColor);

  // Add total amount
  const totalTop = tableTop + (invoiceData.paymentDetails.invoiceItems.length + 1) * 30 + 20;
  doc.fontSize(16)
     .text(`Total Amount: ${invoiceData.paymentDetails.totalAmount} USDC`, 50, totalTop, { align: 'right' });

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
     .text(title, x, y);
  doc.fontSize(10)
     .text(data.name, x, y + 25)
     .text(data.email, x, y + 40)
     .text(data.address || '', x, y + 55)
     .text(`${data.city || ''}, ${data.state || ''} ${data.zip || ''}`, x, y + 70)
     .text(data.country || '', x, y + 85)
     .text('EVM Address:', x, y + 100)
     .text(evmAddress, x, y + 115, { width: 200, align: 'left' });
}

function addDetailRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number) {
  doc.text(label, x, y)
     .text(value, x + 150, y);
}

function generateTable(doc: PDFKit.PDFDocument, items: any[], y: number, borderColor: string) {
  const headers = ['Item', 'Quantity', 'Price', 'Total'];
  const columnWidth = 128;
  
  doc.fontSize(12);

  // Draw table header
  doc.rect(50, y, 515, 30).stroke(borderColor);
  headers.forEach((header, i) => {
    doc.text(header, 55 + i * columnWidth, y + 10);
    if (i < headers.length - 1) {
      doc.moveTo(50 + (i + 1) * columnWidth, y)
         .lineTo(50 + (i + 1) * columnWidth, y + 30 + items.length * 30)
         .stroke(borderColor);
    }
  });

  // Draw table rows
  items.forEach((item, i) => {
    const rowY = y + 30 + (i * 30);
    doc.rect(50, rowY, 515, 30).stroke(borderColor);
    doc.text(item.name, 55, rowY + 10)
       .text(item.quantity.toString(), 55 + columnWidth, rowY + 10)
       .text(item.price.toFixed(2), 55 + 2 * columnWidth, rowY + 10)
       .text((item.quantity * item.price).toFixed(2), 55 + 3 * columnWidth, rowY + 10);
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