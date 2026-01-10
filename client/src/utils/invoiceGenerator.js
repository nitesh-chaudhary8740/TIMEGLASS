import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadInvoice = (order) => {
  const doc = new jsPDF();
  
  // Header & Brand
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text("TIMEGLASS", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 14, 30);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 35);
  doc.text(`Payment Method: ${order.paymentInfo.method}`, 14, 40);

  // Bill To & Ship To
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("BILLED TO:", 14, 55);
  doc.text("SHIPPING TO:", 105, 55);
 
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text(`${order.user.name}`, 14, 62);
  doc.text(`${order.user.email}`, 14, 67);

  doc.text(`${order.recipient.name}`, 105, 62);
  doc.text(`${order.shippingAddress.street}`, 105, 67);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 105, 72);
  doc.text(`${order.shippingAddress.postalCode}`, 105, 77);
  doc.text(`Phone: ${order.recipient.phone}`, 105, 82);

  const tableRows = order.items.map(item => [
    item.name,
    `INR ${item.price.toLocaleString()}`,
    item.quantity,
    `INR ${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    head: [['Product', 'Price', 'Qty', 'Total']],
    body: tableRows,
    startY: 95,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], fontSize: 10 },
    styles: { fontSize: 9 },
    columnStyles: { 3: { halign: 'right' } }
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont(undefined, 'normal');
  doc.text(`Subtotal: INR ${order.itemsPrice.toLocaleString()}`, 140, finalY);
  doc.text(`Shipping: INR ${order.shippingPrice.toLocaleString()}`, 140, finalY + 7);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(`Total Amount: INR ${order.totalAmount.toLocaleString()}`, 140, finalY + 16);

  doc.save(`Invoice_Timeglass_${order._id.slice(-6)}.pdf`);
};