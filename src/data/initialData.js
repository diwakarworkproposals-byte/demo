// Initial seed data for ASAN BILL SaaS

export const INITIAL_ADMIN = {
  id: 'admin-01',
  role: 'admin',
  name: 'System Administrator',
  email: 'admin@asanbill.com',
  username: 'admin',
  businessName: 'ASAN BILL Head Office',
  phone: '+91 98765 00000',
  status: 'active'
};

export const INITIAL_USERS = [
  {
    id: 'user-01',
    role: 'user',
    name: 'Rajesh Kumar',
    businessName: 'Shree Balaji Enterprises',
    email: 'rajesh@shreeenterprises.com',
    username: 'rajesh',
    password: 'user123',
    phone: '+91 98201 12345',
    address: 'Shop 14, Commercial Complex, MG Road, Mumbai',
    gstNumber: '27AABCU9603R1ZM',
    state: 'Maharashtra',
    stateCode: '27',
    plan: '12 Months',
    planPrice: 7999,
    startDate: '2026-01-15',
    expiryDate: '2027-01-15', // Active
    status: 'active',
    createdAt: '2026-01-15',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234',
      branch: 'MG Road Branch, Mumbai',
      upiId: 'shreebalaji@okaxis'
    },
    invoicePrefix: 'ASB',
    nextInvoiceNumber: 1006
  },
  {
    id: 'user-02',
    role: 'user',
    name: 'Vikram Sharma',
    businessName: 'Metro Hardware & Electricals',
    email: 'vikram@metrotraders.in',
    username: 'vikram',
    password: 'user123',
    phone: '+91 98112 54321',
    address: 'Plot 45, Industrial Area, Okhla Phase 2, New Delhi',
    gstNumber: '07BAPPC1234F1Z8',
    state: 'Delhi',
    stateCode: '07',
    plan: '6 Months',
    planPrice: 4999,
    startDate: '2026-04-01',
    expiryDate: '2026-10-01', // Expiring in ~5 days from current simulated date Sep 26, 2026!
    status: 'expiring_soon',
    createdAt: '2026-04-01',
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumber: '002105009988',
      ifsc: 'ICIC0000021',
      branch: 'Okhla, New Delhi',
      upiId: 'metroelect@icici'
    },
    invoicePrefix: 'MTR',
    nextInvoiceNumber: 1042
  },
  {
    id: 'user-03',
    role: 'user',
    name: 'Sunil Patel',
    businessName: 'Apex Technologies & Mobile Hub',
    email: 'sunil@apextech.com',
    username: 'sunil',
    password: 'user123',
    phone: '+91 97234 88776',
    address: '201, Shivalik High Street, CG Road, Ahmedabad',
    gstNumber: '24AAJCA4567M1ZX',
    state: 'Gujarat',
    stateCode: '24',
    plan: '6 Months',
    planPrice: 4999,
    startDate: '2026-02-10',
    expiryDate: '2026-08-10', // Expired on Aug 10, 2026!
    status: 'expired',
    createdAt: '2026-02-10',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '32009876543',
      ifsc: 'SBIN0004567',
      branch: 'CG Road, Ahmedabad',
      upiId: 'apextech@oksbi'
    },
    invoicePrefix: 'APX',
    nextInvoiceNumber: 1018
  },
  {
    id: 'user-04',
    role: 'user',
    name: 'Ananya Verma',
    businessName: 'Green Organic Stores',
    email: 'ananya@greenorganic.in',
    username: 'ananya',
    password: 'user123',
    phone: '+91 99345 77665',
    address: '88, Indiranagar 100ft Road, Bengaluru',
    gstNumber: '29ABCDE1234F2Z5',
    state: 'Karnataka',
    stateCode: '29',
    plan: '12 Months',
    planPrice: 7999,
    startDate: '2026-06-01',
    expiryDate: '2027-06-01',
    status: 'active',
    createdAt: '2026-06-01',
    bankDetails: {
      bankName: 'Axis Bank',
      accountNumber: '91802003456789',
      ifsc: 'UTIB0000845',
      branch: 'Indiranagar, Bengaluru',
      upiId: 'greenorganic@axis'
    },
    invoicePrefix: 'GOS',
    nextInvoiceNumber: 1025
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-01',
    userId: 'user-01',
    name: 'Omkar Infotech Pvt Ltd',
    contactPerson: 'Omkar Joshi',
    phone: '+91 98200 44556',
    email: 'purchase@omkarinfotech.com',
    address: '402, Lotus Grandeur, Andheri West',
    gstNumber: '27AADCO8899P1ZK',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400053'
  },
  {
    id: 'cust-02',
    userId: 'user-01',
    name: 'Pooja Retail Solutions',
    contactPerson: 'Pooja Nair',
    phone: '+91 98450 11223',
    email: 'pooja@poojaretail.com',
    address: '12, Brigade Towers, Residency Road',
    gstNumber: '29AAACP9922K1Z9',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '560025'
  },
  {
    id: 'cust-03',
    userId: 'user-01',
    name: 'Sunrise General Stores',
    contactPerson: 'Manish Gupta',
    phone: '+91 98920 66778',
    email: 'sunrisestores@gmail.com',
    address: 'Shop 5, Station Road, Thane West',
    gstNumber: '27AAHCS3344M1Z2',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400601'
  },
  {
    id: 'cust-04',
    userId: 'user-01',
    name: 'Royal Traders & Co',
    contactPerson: 'Harpreet Singh',
    phone: '+91 98140 77889',
    email: 'royaltraders.delhi@gmail.com',
    address: '77, Chandni Chowk',
    gstNumber: '07AAECR5566N1ZB',
    state: 'Delhi',
    stateCode: '07',
    pincode: '110006'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    userId: 'user-01',
    name: 'Wireless Ergonomic Keyboard',
    sku: 'WEK-201',
    category: 'Electronics',
    unit: 'Pcs',
    purchasePrice: 1200,
    sellingPrice: 1850,
    currentStock: 24,
    minStockLevel: 8,
    gstRate: 18,
    description: '2.4GHz multi-device bluetooth keyboard with wrist rest'
  },
  {
    id: 'prod-02',
    userId: 'user-01',
    name: 'Optical USB Mouse Pro',
    sku: 'MOU-502',
    category: 'Electronics',
    unit: 'Pcs',
    purchasePrice: 280,
    sellingPrice: 499,
    currentStock: 45,
    minStockLevel: 15,
    gstRate: 18,
    description: 'Precision 1600 DPI silent optical wired mouse'
  },
  {
    id: 'prod-03',
    userId: 'user-01',
    name: 'Industrial Heavy Duty Extension Board (5M)',
    sku: 'EXT-105',
    category: 'Electricals',
    unit: 'Pcs',
    purchasePrice: 500,
    sellingPrice: 700,
    currentStock: 10, // Matching the prompt's example: 500 purchase, 700 selling, 10 qty
    minStockLevel: 5,
    gstRate: 18,
    description: 'Surge protected 16A 4-socket copper core extension cord'
  },
  {
    id: 'prod-04',
    userId: 'user-01',
    name: 'CAT-6 Gigabit High Speed LAN Cable (305M Roll)',
    sku: 'LAN-305',
    category: 'Networking',
    unit: 'Box',
    purchasePrice: 4200,
    sellingPrice: 6200,
    currentStock: 3, // LOW STOCK!
    minStockLevel: 6,
    gstRate: 18,
    description: 'Pure copper UTP unshielded twisted pair network cable'
  },
  {
    id: 'prod-05',
    userId: 'user-01',
    name: 'Thermal Receipt Paper Roll (80mm x 50m)',
    sku: 'THP-080',
    category: 'Stationery',
    unit: 'Box',
    purchasePrice: 450,
    sellingPrice: 750,
    currentStock: 2, // LOW STOCK!
    minStockLevel: 10,
    gstRate: 12,
    description: 'Pack of 10 BPA-free high sensitivity thermal billing rolls'
  },
  {
    id: 'prod-06',
    userId: 'user-01',
    name: 'Full HD 1080p Web Camera with Mic',
    sku: 'CAM-108',
    category: 'Electronics',
    unit: 'Pcs',
    purchasePrice: 950,
    sellingPrice: 1599,
    currentStock: 18,
    minStockLevel: 5,
    gstRate: 18,
    description: 'Plug and play autofocus webcam with noise reduction mic'
  }
];

export const INITIAL_PURCHASES = [
  {
    id: 'pur-01',
    userId: 'user-01',
    supplier: 'TechNova Distributors Mumbai',
    productId: 'prod-01',
    productName: 'Wireless Ergonomic Keyboard',
    quantity: 20,
    purchasePrice: 1200,
    totalAmount: 24000,
    purchaseDate: '2026-09-10',
    referenceNumber: 'TN-98442'
  },
  {
    id: 'pur-02',
    userId: 'user-01',
    supplier: 'Apex Cables & Wires Ltd',
    productId: 'prod-04',
    productName: 'CAT-6 Gigabit High Speed LAN Cable (305M Roll)',
    quantity: 5,
    purchasePrice: 4200,
    totalAmount: 21000,
    purchaseDate: '2026-09-15',
    referenceNumber: 'AC-1029'
  },
  {
    id: 'pur-03',
    userId: 'user-01',
    supplier: 'PowerGuard Electricals',
    productId: 'prod-03',
    productName: 'Industrial Heavy Duty Extension Board (5M)',
    quantity: 15,
    purchasePrice: 500,
    totalAmount: 7500,
    purchaseDate: '2026-09-20',
    referenceNumber: 'PG-5501'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'inv-01',
    userId: 'user-01',
    invoiceNumber: 'ASB-2026-0001',
    customerId: 'cust-01',
    customerName: 'Omkar Infotech Pvt Ltd',
    customerGst: '27AADCO8899P1ZK',
    customerState: 'Maharashtra',
    customerAddress: '402, Lotus Grandeur, Andheri West, Mumbai',
    customerPhone: '+91 98200 44556',
    invoiceDate: '2026-09-24',
    dueDate: '2026-10-09',
    isInterState: false, // Intra-state (27 to 27) -> CGST + SGST
    items: [
      {
        productId: 'prod-01',
        productName: 'Wireless Ergonomic Keyboard',
        sku: 'WEK-201',
        unit: 'Pcs',
        quantity: 4,
        purchasePrice: 1200,
        sellingPrice: 1850,
        gstRate: 18,
        discountType: 'percentage',
        discountValue: 5,
        itemDiscount: 370,
        taxableAmount: 7030,
        cgstRate: 9,
        cgstAmount: 632.7,
        sgstRate: 9,
        sgstAmount: 632.7,
        igstRate: 0,
        igstAmount: 0,
        total: 8295.4,
        profit: (1850 - 1200) * 4 - 370 // 2600 - 370 = 2230
      },
      {
        productId: 'prod-02',
        productName: 'Optical USB Mouse Pro',
        sku: 'MOU-502',
        unit: 'Pcs',
        quantity: 5,
        purchasePrice: 280,
        sellingPrice: 499,
        gstRate: 18,
        discountType: 'percentage',
        discountValue: 0,
        itemDiscount: 0,
        taxableAmount: 2495,
        cgstRate: 9,
        cgstAmount: 224.55,
        sgstRate: 9,
        sgstAmount: 224.55,
        igstRate: 0,
        igstAmount: 0,
        total: 2944.1,
        profit: (499 - 280) * 5 // 1095
      }
    ],
    subtotal: 9895,
    discountType: 'percentage',
    discountValue: 0,
    overallDiscountAmount: 0,
    totalDiscount: 370,
    taxableAmount: 9525,
    cgstTotal: 857.25,
    sgstTotal: 857.25,
    igstTotal: 0,
    taxTotal: 1714.5,
    grandTotal: 11239.5,
    profit: 3325,
    status: 'paid',
    notes: 'Thank you for your business. Please make payment via RTGS/NEFT/UPI.'
  },
  {
    id: 'inv-02',
    userId: 'user-01',
    invoiceNumber: 'ASB-2026-0002',
    customerId: 'cust-02',
    customerName: 'Pooja Retail Solutions',
    customerGst: '29AAACP9922K1Z9',
    customerState: 'Karnataka',
    customerAddress: '12, Brigade Towers, Residency Road, Bengaluru',
    customerPhone: '+91 98450 11223',
    invoiceDate: '2026-09-26', // Today's date!
    dueDate: '2026-10-11',
    isInterState: true, // Inter-state (27 to 29) -> IGST
    items: [
      {
        productId: 'prod-03',
        productName: 'Industrial Heavy Duty Extension Board (5M)',
        sku: 'EXT-105',
        unit: 'Pcs',
        quantity: 5,
        purchasePrice: 500,
        sellingPrice: 700,
        gstRate: 18,
        discountType: 'fixed',
        discountValue: 0,
        itemDiscount: 0,
        taxableAmount: 3500,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 18,
        igstAmount: 630,
        total: 4130,
        profit: (700 - 500) * 5 // 1000
      }
    ],
    subtotal: 3500,
    discountType: 'percentage',
    discountValue: 10,
    overallDiscountAmount: 350,
    totalDiscount: 350,
    taxableAmount: 3150,
    cgstTotal: 0,
    sgstTotal: 0,
    igstTotal: 567,
    taxTotal: 567,
    grandTotal: 3717,
    profit: 650, // 1000 - 350 discount = 650
    status: 'paid',
    notes: 'Interstate sale under IGST.'
  },
  {
    id: 'inv-03',
    userId: 'user-01',
    invoiceNumber: 'ASB-2026-0003',
    customerId: 'cust-03',
    customerName: 'Sunrise General Stores',
    customerGst: '27AAHCS3344M1Z2',
    customerState: 'Maharashtra',
    customerAddress: 'Shop 5, Station Road, Thane West',
    customerPhone: '+91 98920 66778',
    invoiceDate: '2026-09-26', // Today's date!
    dueDate: '2026-10-10',
    isInterState: false,
    items: [
      {
        productId: 'prod-06',
        productName: 'Full HD 1080p Web Camera with Mic',
        sku: 'CAM-108',
        unit: 'Pcs',
        quantity: 2,
        purchasePrice: 950,
        sellingPrice: 1599,
        gstRate: 18,
        discountType: 'none',
        discountValue: 0,
        itemDiscount: 0,
        taxableAmount: 3198,
        cgstRate: 9,
        cgstAmount: 287.82,
        sgstRate: 9,
        sgstAmount: 287.82,
        igstRate: 0,
        igstAmount: 0,
        total: 3773.64,
        profit: (1599 - 950) * 2 // 1298
      }
    ],
    subtotal: 3198,
    discountType: 'fixed',
    discountValue: 0,
    overallDiscountAmount: 0,
    totalDiscount: 0,
    taxableAmount: 3198,
    cgstTotal: 287.82,
    sgstTotal: 287.82,
    igstTotal: 0,
    taxTotal: 575.64,
    grandTotal: 3773.64,
    profit: 1298,
    status: 'pending',
    notes: 'Payment terms: Due within 14 days.'
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_6m',
    name: '6 Month Plan',
    durationMonths: 6,
    durationText: '6 Months',
    price: 4999,
    priceDisplay: '₹4,999',
    gstNote: '+ GST',
    effectivePerMonth: '₹833/mo',
    badge: 'Popular',
    features: [
      'Stock Management',
      'Purchase & Selling Price Management',
      'Invoice Generation',
      'Discount Management',
      'Daily Sales Reports',
      'Invoice History',
      'PDF Invoice Download',
      'Customer Management',
      'Single User Access',
      'Standard Support'
    ]
  },
  {
    id: 'plan_12m',
    name: 'Year Long Plan',
    durationMonths: 12,
    durationText: '12 Months',
    price: 7999,
    priceDisplay: '₹7,999',
    gstNote: '+ GST',
    effectivePerMonth: '₹666/mo',
    badge: 'Best Value — Save ₹2,000',
    features: [
      'Stock Management',
      'Purchase & Selling Price Management',
      'Invoice Generation',
      'Discount Management',
      'Daily Sales Reports',
      'Invoice History',
      'PDF Invoice Download',
      'Customer Management',
      'Priority Phone & WhatsApp Support',
      'Free Business Setup Consultation'
    ]
  }
];

export const INDIAN_STATES = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '19', name: 'West Bengal' },
  { code: '21', name: 'Odisha' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' }
];
