import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PlusCircle, Trash2, PieChart, Settings, Target, Briefcase, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: ''
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : {
      income: ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lainnya'],
      expense: ['Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Belanja', 'Kesehatan', 'Lainnya']
    };
  });

  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem('savings');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Dana Darurat', target: 10000000, current: 0, color: 'blue' },
      { id: 2, name: 'Liburan', target: 5000000, current: 0, color: 'green' }
    ];
  });

  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Reksadana', amount: 0, color: 'purple' },
      { id: 2, name: 'Saham', amount: 0, color: 'orange' }
    ];
  });

  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState('expense');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSavingForm, setShowSavingForm] = useState(false);
  const [newSaving, setNewSaving] = useState({ name: '', target: '', color: 'blue' });
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [newInvestment, setNewInvestment] = useState({ name: '', color: 'purple' });
  const [showAddFunds, setShowAddFunds] = useState(null);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [showAddInvestFunds, setShowAddInvestFunds] = useState(null);
  const [addInvestFundsAmount, setAddInvestFundsAmount] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('savings', JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    const total = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
    setBalance(total);
  }, [transactions]);

  const handleSubmit = () => {
    if (!formData.category || !formData.amount) return;
    const newTransaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toLocaleDateString('id-ID')
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ type: 'expense', category: '', amount: '', description: '' });
    setShowForm(false);
  };

  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const expenseByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories({ ...categories, [categoryType]: [...categories[categoryType], newCategory] });
    setNewCategory('');
    setShowCategoryForm(false);
  };

  const deleteCategory = (type, category) => {
    setCategories({ ...categories, [type]: categories[type].filter(c => c !== category) });
  };

  const addSaving = () => {
    if (!newSaving.name || !newSaving.target) return;
    setSavings([...savings, { id: Date.now(), name: newSaving.name, target: parseFloat(newSaving.target), current: 0, color: newSaving.color }]);
    setNewSaving({ name: '', target: '', color: 'blue' });
    setShowSavingForm(false);
  };

  const addFundsToSaving = (id) => {
    if (!addFundsAmount) return;
    setSavings(savings.map(s => s.id === id ? { ...s, current: s.current + parseFloat(addFundsAmount) } : s));
    setAddFundsAmount('');
    setShowAddFunds(null);
  };

  const deleteSaving = (id) => setSavings(savings.filter(s => s.id !== id));

  const addInvestment = () => {
    if (!newInvestment.name) return;
    setInvestments([...investments, { id: Date.now(), name: newInvestment.name, amount: 0, color: newInvestment.color }]);
    setNewInvestment({ name: '', color: 'purple' });
    setShowInvestmentForm(false);
  };

  const addFundsToInvestment = (id) => {
    if (!addInvestFundsAmount) return;
    setInvestments(investments.map(i => i.id === id ? { ...i, amount: i.amount + parseFloat(addInvestFundsAmount) } : i));
    setAddInvestFundsAmount('');
    setShowAddInvestFunds(null);
  };

  const deleteInvestment = (id) => setInvestments(investments.filter(i => i.id !== id));

  const totalSavings = savings.reduce((sum, s) => sum + s.current, 0);
  const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalAssets = balance + totalSavings + totalInvestments;

  const colorClasses = {
    blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500',
    orange: 'bg-orange-500', pink: 'bg-pink-500', red: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'dashboard', icon: Wallet, label: 'Dashboard' },
              { id: 'savings', icon: Target, label: 'Tabungan' },
              { id: 'investments', icon: Briefcase, label: 'Investasi' },
              { id: 'admin', icon: Settings, label: 'Admin' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Dompet Gue</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition">
                  <PlusCircle className="w-5 h-5" />Tambah
                </button>
              </div>

              {/* Separated Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 opacity-90" />
                    <p className="text-sm opacity-90">Saldo (Keluar Masuk)</p>
                  </div>
                  <p className="text-2xl font-bold">Rp {balance.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 opacity-90" />
                    <p className="text-sm opacity-90">Total Tabungan</p>
                  </div>
                  <p className="text-2xl font-bold">Rp {totalSavings.toLocaleString('id-ID')}</p>
                  <p className="text-xs opacity-80 mt-1">{savings.length} target aktif</p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 opacity-90" />
                    <p className="text-sm opacity-90">Total Investasi</p>
                  </div>
                  <p className="text-2xl font-bold">Rp {totalInvestments.toLocaleString('id-ID')}</p>
                  <p className="text-xs opacity-80 mt-1">{investments.length} portfolio</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-white mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm opacity-90">Total Semua Aset</p>
                  <p className="text-xl font-bold">Rp {totalAssets.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <TrendingUp className="w-5 h-5" /><p className="text-sm font-medium">Pemasukan</p>
                  </div>
                  <p className="text-2xl font-bold text-green-800">Rp {totalIncome.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <TrendingDown className="w-5 h-5" /><p className="text-sm font-medium">Pengeluaran</p>
                  </div>
                  <p className="text-2xl font-bold text-red-800">Rp {totalExpense.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            {showForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Transaksi Baru</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {['income', 'expense'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value={type} checked={formData.type === type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                          className="w-4 h-4 text-indigo-600" />
                        <span className={`${type === 'income' ? 'text-green-700' : 'text-red-700'} font-medium`}>
                          {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </label>
                    ))}
                  </div>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="">Pilih Kategori</option>
                    {categories[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input type="number" placeholder="Jumlah (Rp)" value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  <input type="text" placeholder="Keterangan (opsional)" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                  <div className="flex gap-3">
                    <button onClick={handleSubmit} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">Simpan</button>
                    <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300">Batal</button>
                  </div>
                </div>
              </div>
            )}

            {Object.keys(expenseByCategory).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-800">Pengeluaran per Kategori</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(expenseByCategory).sort(([,a], [,b]) => b - a).map(([category, amount]) => {
                    const pct = (amount / totalExpense) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{category}</span>
                          <span className="text-gray-600">Rp {amount.toLocaleString('id-ID')} ({pct.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Transaksi</h2>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Belum ada transaksi nih bro</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                          <span className="font-semibold text-gray-800">{t.category}</span>
                        </div>
                        {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">{t.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                        </span>
                        <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Savings Tab */}
        {activeTab === 'savings' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Target Tabungan</h2>
              <button onClick={() => setShowSavingForm(!showSavingForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                <PlusCircle className="w-5 h-5" />Tambah Target
              </button>
            </div>

            {showSavingForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <input type="text" placeholder="Nama Tabungan" value={newSaving.name}
                  onChange={(e) => setNewSaving({ ...newSaving, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" placeholder="Target (Rp)" value={newSaving.target}
                  onChange={(e) => setNewSaving({ ...newSaving, target: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <select value={newSaving.color} onChange={(e) => setNewSaving({ ...newSaving, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="blue">Biru</option><option value="green">Hijau</option>
                  <option value="purple">Ungu</option><option value="orange">Orange</option><option value="pink">Pink</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={addSaving} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Simpan</button>
                  <button onClick={() => setShowSavingForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savings.map(s => {
                const pct = (s.current / s.target) * 100;
                return (
                  <div key={s.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{s.name}</h3>
                        <p className="text-sm text-gray-600">Rp {s.current.toLocaleString('id-ID')} / Rp {s.target.toLocaleString('id-ID')}</p>
                      </div>
                      <button onClick={() => deleteSaving(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div className={`h-3 rounded-full transition-all ${colorClasses[s.color]}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pct.toFixed(1)}% tercapai</p>
                    {showAddFunds === s.id ? (
                      <div className="flex gap-2">
                        <input type="number" placeholder="Jumlah" value={addFundsAmount}
                          onChange={(e) => setAddFundsAmount(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm" />
                        <button onClick={() => addFundsToSaving(s.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">OK</button>
                        <button onClick={() => { setShowAddFunds(null); setAddFundsAmount(''); }} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setShowAddFunds(s.id)} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">Tambah Dana</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Portfolio Investasi</h2>
              <button onClick={() => setShowInvestmentForm(!showInvestmentForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                <PlusCircle className="w-5 h-5" />Tambah Investasi
              </button>
            </div>

            {showInvestmentForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <input type="text" placeholder="Nama Investasi (Reksadana, Saham, Crypto, dll)" value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                <select value={newInvestment.color} onChange={(e) => setNewInvestment({ ...newInvestment, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="purple">Ungu</option><option value="orange">Orange</option>
                  <option value="blue">Biru</option><option value="green">Hijau</option><option value="red">Merah</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={addInvestment} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Simpan</button>
                  <button onClick={() => setShowInvestmentForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investments.map(inv => (
                <div key={inv.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colorClasses[inv.color]}`}></div>
                      <h3 className="font-bold text-gray-800">{inv.name}</h3>
                    </div>
                    <button onClick={() => deleteInvestment(inv.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-3">Rp {inv.amount.toLocaleString('id-ID')}</p>
                  {showAddInvestFunds === inv.id ? (
                    <div className="flex gap-2">
                      <input type="number" placeholder="Jumlah" value={addInvestFundsAmount}
                        onChange={(e) => setAddInvestFundsAmount(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
                      <button onClick={() => addFundsToInvestment(inv.id)} className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">OK</button>
                      <button onClick={() => { setShowAddInvestFunds(null); setAddInvestFundsAmount(''); }} className="bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddInvestFunds(inv.id)} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">Tambah Dana</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kelola Kategori</h2>
              <div className="space-y-6">
                {['income', 'expense'].map(type => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-bold ${type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                        Kategori {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </h3>
                      <button onClick={() => { setShowCategoryForm(true); setCategoryType(type); }}
                        className={`${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1`}>
                        <PlusCircle className="w-4 h-4" />Tambah
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories[type].map(cat => (
                        <div key={cat} className={`${type === 'income' ? 'bg-green-50' : 'bg-red-50'} px-3 py-2 rounded-lg flex items-center gap-2`}>
                          <span className={`text-sm ${type === 'income' ? 'text-green-800' : 'text-red-800'}`}>{cat}</span>
                          <button onClick={() => deleteCategory(type, cat)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {showCategoryForm && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Tambah Kategori {categoryType === 'income' ? 'Pemasukan' : 'Pengeluaran'}</h4>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Nama kategori" value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
                      <button onClick={addCategory} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Simpan</button>
                      <button onClick={() => { setShowCategoryForm(false); setNewCategory(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistik</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">Total Transaksi</p>
                  <p className="text-3xl font-bold text-blue-800">{transactions.length}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-700 mb-1">Target Tabungan</p>
                  <p className="text-3xl font-bold text-purple-800">{savings.length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-orange-700 mb-1">Portfolio Investasi</p>
                  <p className="text-3xl font-bold text-orange-800">{investments.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
