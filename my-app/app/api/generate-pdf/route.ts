import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(req: NextRequest) {
  const invoiceData = await req.json();

  // Create a document
  const doc = new PDFDocument();
  const chunks: Uint8Array[] = [];

  // Pipe its output somewhere, in this case to a buffer
  doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
  doc.on('end', () => {});

  // Add content to the PDF
  doc.fontSize(25).text('Invoice', 100, 80);

  // Seller Details
  doc.fontSize(15).text('Seller:', 100, 120);
  doc.fontSize(10)
    .text(`${invoiceData.seller.name}`, 100, 140)
    .text(`${invoiceData.seller.email}`, 100, 155)
    .text(`${invoiceData.seller.address}`, 100, 170)
    .text(`${invoiceData.seller.city}, ${invoiceData.seller.state} ${invoiceData.seller.zip}`, 100, 185)
    .text(`${invoiceData.seller.country}`, 100, 200)
    .text(`EVM Address: ${invoiceData.seller.evmAddress}`, 100, 215);

  // Client Details
  doc.fontSize(15).text('Client:', 300, 120);
  doc.fontSize(10)
    .text(`${invoiceData.client.name}`, 300, 140)
    .text(`${invoiceData.client.email}`, 300, 155)
    .text(`${invoiceData.client.address}`, 300, 170)
    .text(`${invoiceData.client.city}, ${invoiceData.client.state} ${invoiceData.client.zip}`, 300, 185)
    .text(`${invoiceData.client.country}`, 300, 200)
    .text(`EVM Address: ${invoiceData.paymentDetails.receiverAddress}`, 300, 215);

  // Payment Details
  doc.fontSize(15).text('Payment Details:', 100, 250);
  doc.fontSize(10)
    .text(`Chain: ${invoiceData.paymentDetails.chain}`, 100, 270)
    .text(`Currency: ${invoiceData.paymentDetails.currency}`, 100, 285)
    .text(`Stream Type: ${invoiceData.paymentDetails.streamType}`, 100, 300);

  // Invoice Items
  doc.fontSize(15).text('Invoice Items:', 100, 330);
  let yPosition = 350;
  doc.fontSize(10);
  invoiceData.invoiceItems.forEach((item: any, index: number) => {
    doc.text(`${index + 1}. ${item.name}`, 100, yPosition);
    doc.text(`${item.quantity}`, 300, yPosition);
    doc.text(`$${item.price.toFixed(2)}`, 350, yPosition);
    doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 400, yPosition);
    yPosition += 20;
  });

  // Total Amount
  doc.fontSize(15).text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`, 300, yPosition + 20);

  // Finalize PDF file
  doc.end();

  // Wait for the PDF to be generated
  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });

  // Return the PDF as a response
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    },
  });
}