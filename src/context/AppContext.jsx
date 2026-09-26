import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_PURCHASES,
  INITIAL_INVOICES
} from '../data/initialData';
import { addMonthsToDate, determineUserStatus } from '../utils/helpers';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth();

  // Toast notification state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Users state (Admin manages this)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // 2. Customers state
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // 3. Products / Stock state
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 4. Purchases state
  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_purchases');
      return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  // 5. Invoices state
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('asan_bill_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('asan_bill_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('asan_bill_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('asan_bill_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('asan_bill_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('asan_bill_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Dynamic user status updater based on expiry date
  useEffect(() => {
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        status: determineUserStatus(u.expiryDate, u.status)
      }))
    );
  }, []);

  // Filter scoped data for current user (or all if admin)
  const userCustomers = customers.filter(
    (c) => currentUser?.role === 'admin' || c.userId === currentUser?.id
  );

  const userProducts = products.filter(
    (p) => currentUser?.role === 'admin' || p.userId === currentUser?.id
  );

  const userPurchases = purchases.filter(
    (p) => currentUser?.role === 'admin' || p.userId === currentUser?.id
  );

  const userInvoices = invoices.filter(
    (inv) => currentUser?.role === 'admin' || inv.userId === currentUser?.id
  );

  // --- ADMIN ACTIONS ---
  const addUser = (userData) => {
    const months = userData.plan === '12 Months' ? 12 : 6;
    const computedExpiry = userData.expiryDate || addMonthsToDate(userData.startDate || new Date().toISOString().split('T')[0], months);
    
    const newUser = {
      id: `user-${Date.now()}`,
      role: 'user',
      name: userData.fullName || userData.name,
      businessName: userData.businessName,
      email: userData.email,
      phone: userData.phone || userData.mobileNumber,
      username: userData.username,
      password: userData.password || 'user123',
      address: userData.address || '',
      gstNumber: userData.gstNumber || '',
      state: userData.state || 'Maharashtra',
      stateCode: userData.stateCode || '27',
      plan: userData.plan,
      planPrice: userData.plan === '12 Months' ? 7999 : 4999,
      startDate: userData.startDate || new Date().toISOString().split('T')[0],
      expiryDate: computedExpiry,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      bankDetails: {
        bankName: userData.bankName || 'State Bank of India',
        accountNumber: userData.accountNumber || '1234567890',
        ifsc: userData.ifsc || 'SBIN0001234',
        branch: userData.branch || 'Main Branch',
        upiId: userData.upiId || `${userData.username}@upi`
      },
      invoicePrefix: (userData.businessName ? userData.businessName.substring(0, 3).toUpperCase() : 'ASB'),
      nextInvoiceNumber: 1001
    };

    setUsers((prev) => [newUser, ...prev]);
    showToast('User account created successfully.', 'success');
    return newUser;
  };

  const updateUser = (userId, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedFields };
          if (updatedFields.expiryDate) {
            updated.status = determineUserStatus(updatedFields.expiryDate, updated.status);
          }
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('User updated successfully.', 'success');
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'disabled' ? determineUserStatus(u.expiryDate, 'active') : 'disabled';
          const updated = { ...u, status: newStatus };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast('User status updated.', 'info');
  };

  const extendSubscription = (userId, monthsToAdd, planName) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          // If already expired, start from today. Else start from existing expiry date.
          const baseDate = new Date(u.expiryDate) > new Date() ? u.expiryDate : new Date().toISOString().split('T')[0];
          const newExpiry = addMonthsToDate(baseDate, monthsToAdd);
          const updated = {
            ...u,
            plan: planName || (monthsToAdd >= 12 ? '12 Months' : '6 Months'),
            planPrice: monthsToAdd >= 12 ? 7999 : 4999,
            expiryDate: newExpiry,
            status: 'active'
          };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    showToast(`Subscription extended by ${monthsToAdd} months.`, 'success');
  };

  const resetUserPassword = (userId, newPassword) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    );
    showToast('Password reset successfully.', 'success');
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User deleted.', 'warning');
  };

  // --- CUSTOMER ACTIONS ---
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      userId: currentUser?.id || 'user-01',
      ...customerData
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast('Customer added successfully.');
    return newCust;
  };

  const updateCustomer = (customerId, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updatedFields } : c))
    );
    showToast('Customer updated.');
  };

  const deleteCustomer = (customerId) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    showToast('Customer removed.', 'info');
  };

  // --- PRODUCT / STOCK ACTIONS ---
  const addProduct = (productData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      userId: currentUser?.id || 'user-01',
      name: productData.name,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      category: productData.category || 'General',
      unit: productData.unit || 'Pcs',
      purchasePrice: parseFloat(productData.purchasePrice) || 0,
      sellingPrice: parseFloat(productData.sellingPrice) || 0,
      currentStock: parseInt(productData.currentStock, 10) || 0,
      minStockLevel: parseInt(productData.minStockLevel, 10) || 5,
      gstRate: parseFloat(productData.gstRate) || 18,
      description: productData.description || ''
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('Product added to inventory.');
    return newProd;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...updatedFields,
            purchasePrice: updatedFields.purchasePrice !== undefined ? parseFloat(updatedFields.purchasePrice) : p.purchasePrice,
            sellingPrice: updatedFields.sellingPrice !== undefined ? parseFloat(updatedFields.sellingPrice) : p.sellingPrice,
            currentStock: updatedFields.currentStock !== undefined ? parseInt(updatedFields.currentStock, 10) : p.currentStock,
            minStockLevel: updatedFields.minStockLevel !== undefined ? parseInt(updatedFields.minStockLevel, 10) : p.minStockLevel,
            gstRate: updatedFields.gstRate !== undefined ? parseFloat(updatedFields.gstRate) : p.gstRate
          };
        }
        return p;
      })
    );
    showToast('Product updated.');
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted from inventory.', 'info');
  };

  // --- PURCHASE ACTIONS (Increases Stock automatically!) ---
  const recordPurchase = (purchaseData) => {
    const qty = parseInt(purchaseData.quantity, 10);
    const price = parseFloat(purchaseData.purchasePrice);
    const prodId = purchaseData.productId;

    const prod = products.find((p) => p.id === prodId);
    if (!prod) {
      showToast('Selected product not found.', 'error');
      return false;
    }

    const newPurchase = {
      id: `pur-${Date.now()}`,
      userId: currentUser?.id || 'user-01',
      supplier: purchaseData.supplier,
      productId: prodId,
      productName: prod.name,
      quantity: qty,
      purchasePrice: price,
      totalAmount: qty * price,
      purchaseDate: purchaseData.purchaseDate || new Date().toISOString().split('T')[0],
      referenceNumber: purchaseData.referenceNumber || `PUR-${Date.now().toString().slice(-5)}`
    };

    // 1. Record the purchase
    setPurchases((prev) => [newPurchase, ...prev]);

    // 2. Automatically INCREMENT Stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          return {
            ...p,
            currentStock: p.currentStock + qty,
            purchasePrice: price // update latest cost price
          };
        }
        return p;
      })
    );

    showToast(`Purchase recorded. Stock increased by ${qty} units.`, 'success');
    return newPurchase;
  };

  // --- INVOICE ACTIONS (Decreases Stock automatically, validates stock!) ---
  const createInvoice = (invoiceData) => {
    // 0. Check account expiration
    if (currentUser?.status === 'expired' || (currentUser?.role === 'user' && currentUser?.expiryDate && new Date(currentUser.expiryDate) < new Date())) {
      showToast('Your ASAN BILL account has expired. Please contact the administrator to renew your subscription.', 'error');
      return { success: false, message: 'Account expired' };
    }

    // 1. Validate Stock for all items
    for (const item of invoiceData.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        showToast(`Product "${item.productName}" not found in inventory.`, 'error');
        return { success: false, message: `Product "${item.productName}" not found.` };
      }
      if (item.quantity > prod.currentStock) {
        const errorMsg = `Insufficient stock. Only ${prod.currentStock} units are available for "${prod.name}".`;
        showToast(errorMsg, 'error');
        return { success: false, message: errorMsg };
      }
    }

    // 2. Format & Generate Invoice
    const currentNumber = currentUser?.nextInvoiceNumber || (userInvoices.length + 1001);
    const prefix = currentUser?.invoicePrefix || 'ASB';
    const year = new Date().getFullYear();
    const formattedInvNumber = `${prefix}-${year}-${String(currentNumber).padStart(4, '0')}`;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      userId: currentUser?.id || 'user-01',
      invoiceNumber: invoiceData.invoiceNumber || formattedInvNumber,
      ...invoiceData,
      createdAt: new Date().toISOString()
    };

    // 3. Automatically DECREASE Stock for each sold product
    setProducts((prev) =>
      prev.map((p) => {
        const soldItem = invoiceData.items.find((item) => item.productId === p.id);
        if (soldItem) {
          const updatedStock = Math.max(0, p.currentStock - soldItem.quantity);
          return {
            ...p,
            currentStock: updatedStock
          };
        }
        return p;
      })
    );

    // 4. Save Invoice
    setInvoices((prev) => [newInvoice, ...prev]);

    // 5. Increment user nextInvoiceNumber
    if (currentUser && currentUser.role === 'user') {
      const nextNum = currentNumber + 1;
      updateUser(currentUser.id, { nextInvoiceNumber: nextNum });
    }

    showToast(`Invoice ${newInvoice.invoiceNumber} generated! Stock updated.`, 'success');
    return { success: true, invoice: newInvoice };
  };

  const deleteInvoice = (invoiceId) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    showToast('Invoice deleted.', 'info');
  };

  // --- RESET TO DEMO DATA ---
  const resetToDemoData = () => {
    localStorage.removeItem('asan_bill_users');
    localStorage.removeItem('asan_bill_customers');
    localStorage.removeItem('asan_bill_products');
    localStorage.removeItem('asan_bill_purchases');
    localStorage.removeItem('asan_bill_invoices');
    setUsers(INITIAL_USERS);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setPurchases(INITIAL_PURCHASES);
    setInvoices(INITIAL_INVOICES);
    showToast('Demo data reset to factory initial state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        customers: userCustomers,
        allCustomers: customers,
        products: userProducts,
        allProducts: products,
        purchases: userPurchases,
        allPurchases: purchases,
        invoices: userInvoices,
        allInvoices: invoices,
        toast,
        showToast,
        // Admin user actions
        addUser,
        updateUser,
        toggleUserStatus,
        extendSubscription,
        resetUserPassword,
        deleteUser,
        // User entity actions
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
        recordPurchase,
        createInvoice,
        deleteInvoice,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
