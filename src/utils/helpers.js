// Helpers for formatting, calculations, and date manipulation
export { INDIAN_STATES } from '../data/initialData';

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const addMonthsToDate = (startDateStr, months) => {
  const date = startDateStr ? new Date(startDateStr) : new Date();
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  
  const target = new Date(date.getTime());
  target.setMonth(target.getMonth() + parseInt(months, 10));
  return target.toISOString().split('T')[0];
};

export const calculateDaysRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return 0;
  const expiry = new Date(expiryDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const determineUserStatus = (expiryDateStr, currentStatus) => {
  if (currentStatus === 'disabled') return 'disabled';
  const days = calculateDaysRemaining(expiryDateStr);
  if (days < 0) return 'expired';
  if (days <= 15) return 'expiring_soon';
  return 'active';
};

// Convert number to Indian Rupees words
export const numberToWordsIndian = (num) => {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    } else {
      str += a[n];
    }
    return str;
  };

  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return 'Zero Rupees Only';

  let output = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;

  if (crore > 0) output += inWords(crore) + 'Crore ';
  if (lakh > 0) output += inWords(lakh) + 'Lakh ';
  if (thousand > 0) output += inWords(thousand) + 'Thousand ';
  if (hundred > 0) output += inWords(hundred) + 'Hundred ';
  if (rest > 0) output += (output ? 'and ' : '') + inWords(rest);

  return output.trim() + ' Rupees Only';
};
