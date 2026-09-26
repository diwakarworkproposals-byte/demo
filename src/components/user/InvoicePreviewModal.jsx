import React, { useRef } from 'react';
import {
  Printer,
  Download,
  X,
  FileCheck,
  CheckCircle,
  Building,
  QrCode,
  ShieldCheck,
  Edit
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate, numberToWordsIndian } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export const InvoicePreviewModal = ({
  invoice,
  onClose,
  onGenerate,
  isDraft = false,
  onEdit
}) => {
  const { currentUser } = useAuth();
  const invoiceRef = useRef(null);

  if (!invoice) return null;

  // Print invoice handler
  const handlePrint = () => {
    window.print();
  };

  // Download PDF handler using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoice.invoiceNumber || 'ASAN-BILL'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback: trigger print dialog which lets user Save As PDF
      window.print();
    }
  };

  const business = {
    name: currentUser?.businessName || 'Shree Balaji Enterprises',
    owner: currentUser?.name || 'Rajesh Kumar',
    address: currentUser?.address || 'Commercial Complex, MG Road, Mumbai',
    gstNumber: currentUser?.gstNumber || '27AABCU9603R1ZM',
    phone: currentUser?.phone || '+91 98201 12345',
    email: currentUser?.email || 'sales@shreeenterprises.com',
    state: currentUser?.state || 'Maharashtra',
    stateCode: currentUser?.stateCode || '27',
    bank: currentUser?.bankDetails || {
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234',
      branch: 'MG Road, Mumbai',
      upiId: 'shreebalaji@okaxis'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 mat-shadow-lg border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">
              {isDraft ? 'Invoice Preview & Validation' : `Tax Invoice: ${invoice.invoiceNumber}`}
            </span>
            {isDraft && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                Draft Preview
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDraft && onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Invoice</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {isDraft && onGenerate && (
              <button
                onClick={onGenerate}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Generate Invoice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex-1">
          <div
            id="printable-invoice"
            ref={invoiceRef}
            className="bg-white p-8 max-w-3xl mx-auto shadow-sm border border-slate-200 text-slate-900 font-sans"
            style={{ minHeight: '1050px' }}
          >
            {/* Header: ASAN BILL + Business Information */}
            <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-sm">
                    AB
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-blue-700">ASAN BILL</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  {business.name}
                </h1>
                <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed">
                  {business.address}
                </p>
                <div className="text-xs text-slate-700 mt-1.5 space-y-0.5">
                  <div>GSTIN: <strong className="font-mono text-slate-900">{business.gstNumber}</strong></div>
                  <div>State: {business.state} (Code: {business.stateCode}) • Phone: {business.phone}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  TAX INVOICE
                </span>
                <div className="mt-3 text-xs space-y-1">
                  <div>
                    <span className="text-slate-500">Invoice No: </span>
                    <strong className="font-mono text-sm text-slate-900">{invoice.invoiceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Invoice Date: </span>
                    <strong className="text-slate-800">{formatDate(invoice.invoiceDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Due Date: </span>
                    <strong className="text-slate-800">{formatDate(invoice.dueDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Tax Type: </span>
                    <span className="font-semibold text-slate-800">
                      {invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billed To (Customer Details) */}
            <div className="grid grid-cols-2 gap-6 py-5 border-b border-slate-200 text-xs">
              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  BILLED TO:
                </span>
                <div className="font-bold text-sm text-slate-900">{invoice.customerName}</div>
                <div className="text-slate-600 mt-0.5">{invoice.customerAddress || 'Address on file'}</div>
                <div className="mt-1.5 space-y-0.5 text-slate-700">
                  <div>GSTIN: <strong className="font-mono">{invoice.customerGst || 'Unregistered'}</strong></div>
                  <div>Phone: {invoice.customerPhone || '-'}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  PLACE OF SUPPLY:
                </span>
                <div className="font-bold text-sm text-slate-800">{invoice.customerState || business.state}</div>
                <div className="text-slate-500 mt-1">Payment Status:</div>
                <div className="mt-0.5">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                    invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {invoice.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-8 text-center">#</th>
                    <th className="py-2.5 px-3 font-bold">Item Description</th>
                    <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-bold text-right">Price</th>
                    <th className="py-2.5 px-3 font-bold text-right">GST %</th>
                    <th className="py-2.5 px-3 font-bold text-right">Taxable</th>
                    <th className="py-2.5 px-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        {item.sku && <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold font-mono">
                        {item.quantity} {item.unit || 'Pcs'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(item.sellingPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {item.gstRate}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(item.taxableAmount || (item.sellingPrice * item.quantity))}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations and Breakdown Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 pb-6 border-b border-slate-200 text-xs">
              {/* Left Column: Bank Details & Terms */}
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bank & UPI Settlement Details</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <div>Bank: <strong>{business.bank.bankName}</strong></div>
                    <div>A/C Number: <strong className="font-mono">{business.bank.accountNumber}</strong></div>
                    <div>IFSC Code: <strong className="font-mono">{business.bank.ifsc}</strong></div>
                    <div>Branch: {business.bank.branch}</div>
                    <div className="pt-1 text-blue-700 font-semibold flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI ID: {business.bank.upiId}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                    Terms & Conditions:
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    1. Goods once sold will not be taken back or exchanged.<br />
                    2. Payment is due within 15 days of invoice issue.<br />
                    3. All disputes subject to local jurisdiction only.
                  </p>
                </div>
              </div>

              {/* Right Column: Financial Summary Table */}
              <div className="space-y-2">
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>

                {invoice.totalDiscount > 0 && (
                  <div className="flex justify-between py-1 text-amber-700 font-semibold">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-{formatCurrency(invoice.totalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 text-slate-700 border-t border-slate-100 font-medium">
                  <span>Taxable Amount:</span>
                  <span className="font-mono">{formatCurrency(invoice.taxableAmount)}</span>
                </div>

                {/* GST Breakdown */}
                {invoice.isInterState ? (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>IGST (Integrated GST):</span>
                    <span className="font-mono">{formatCurrency(invoice.igstTotal || invoice.taxTotal)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>CGST (Central GST):</span>
                      <span className="font-mono">{formatCurrency(invoice.cgstTotal || (invoice.taxTotal / 2))}</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>SGST (State GST):</span>
                      <span className="font-mono">{formatCurrency(invoice.sgstTotal || (invoice.taxTotal / 2))}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-extrabold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base text-blue-700">{formatCurrency(invoice.grandTotal)}</span>
                </div>

                {/* Amount in words */}
                <div className="text-[11px] text-slate-500 italic text-right pt-1">
                  Amount in words: <strong className="text-slate-700 not-italic">{numberToWordsIndian(invoice.grandTotal)}</strong>
                </div>

                {/* Profit stored display */}
                <div className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-right text-[11px] text-emerald-800">
                  <span className="text-slate-500 mr-2">Calculated Margin:</span>
                  <strong className="font-mono">{formatCurrency(invoice.profit)}</strong>
                </div>
              </div>
            </div>

            {/* Signatures & Professional Footer */}
            <div className="pt-8 flex justify-between items-end">
              <div className="text-[10px] text-slate-400">
                Generated using <strong>ASAN BILL</strong> • Simple Stock Management & Billing SaaS
              </div>

              <div className="text-right">
                <div className="h-10"></div>
                <div className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-1 px-4">
                  For {business.name}
                </div>
                <div className="text-[10px] text-slate-400">Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex justify-between items-center no-print">
          <div className="text-xs text-slate-400">
            Click <strong>Download PDF</strong> to save invoice file or <strong>Print</strong> for A4/Thermal printing.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
