import React, { useState, useEffect } from 'react';
import { usePoints } from '../context/PointsContext';
import { useUser } from '../context/UserContext'; 
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PointsPage = () => {
  const { points, getPointsLevel, deductPoints, pointsHistory } = usePoints();
  const { currentUser } = useUser(); // ✅ ADD THIS
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolder: '',
    bankName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userBankAccounts, setUserBankAccounts] = useState([]);

  const { level, rank, color, icon } = getPointsLevel();

  // Conversion rate: 5 points = 20 Rs (1 point = 4 Rs)
  const POINT_TO_RUPEE_RATE = 4;
  const availableCash = points * POINT_TO_RUPEE_RATE;

  // Load data and fetch user bank accounts
  useEffect(() => {
    if (currentUser) {
      fetchWithdrawalHistory();
      fetchUserBankAccounts();
    }
  }, [currentUser]); // ✅ ADD currentUser dependency

  const fetchWithdrawalHistory = async () => {
    try {
      console.log('🔄 Fetching withdrawal history for user:', currentUser?.id);
      
      // ✅ ADD User-ID header
      const config = {
        headers: {
          'User-ID': currentUser?.id?.toString() || ''
        }
      };

      const response = await api.get('/withdrawals/user', config);
      console.log('📊 Withdrawal history response:', response.data);
      
      if (response.data.success) {
        setWithdrawalHistory(response.data.data);
      } else {
        console.log('❌ Withdrawal history fetch failed:', response.data.message);
      }
    } catch (error) {
      console.log('💥 Error fetching withdrawal history:', error);
      console.log('💥 Error details:', error.response?.data);
    }
  };

  const fetchUserBankAccounts = async () => {
    try {
      console.log('🔄 Fetching bank accounts for user:', currentUser?.id);
      
      // ✅ ADD User-ID header
      const config = {
        headers: {
          'User-ID': currentUser?.id?.toString() || ''
        }
      };

      const response = await api.get('/bank-accounts/user', config);
      console.log('📊 Bank accounts response:', response.data);
      
      if (response.data.success) {
        setUserBankAccounts(response.data.data);
      } else {
        console.log('❌ Bank accounts fetch failed:', response.data.message);
      }
    } catch (error) {
      console.log('💥 Error fetching bank accounts:', error);
      console.log('💥 Error details:', error.response?.data);
    }
  };

  const getLevelDetails = (level) => {
    const levels = {
      5: { level: 'Elite', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '👑' },
      4: { level: 'Advanced', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '⭐' },
      3: { level: 'Intermediate', color: 'text-green-600', bgColor: 'bg-green-100', icon: '🚀' },
      2: { level: 'Rookie', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '🔥' },
      1: { level: 'Starter', color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: '🌟' },
      0: { level: 'Beginner', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🌱' }
    };
    return levels[level] || levels[0];
  };

  const levelDetails = getLevelDetails(level);

  const handleWithdraw = async () => {
    // ✅ ADD user check
    if (!currentUser) {
      alert('❌ Please login first!');
      navigate('/login');
      return;
    }

    const cashAmount = parseFloat(withdrawAmount);
    
    if (!cashAmount || cashAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const pointsRequired = Math.ceil(cashAmount / POINT_TO_RUPEE_RATE);

    if (pointsRequired > points) {
      alert(`Insufficient points! You need ${pointsRequired} points for ₹${cashAmount}`);
      return;
    }

    if (cashAmount < 50) {
      alert('Minimum withdrawal amount is ₹50');
      return;
    }

    if (selectedPaymentMethod === 'bank') {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder || !bankDetails.bankName) {
        alert('Please fill in all bank details');
        return;
      }
    } else if (selectedPaymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID');
        return;
      }
    }

    setIsProcessing(true);
    await processRealWithdrawal(cashAmount, pointsRequired);
    setIsProcessing(false);
  };

  const processRealWithdrawal = async (cashAmount, pointsRequired) => {
  try {
    console.log("=== 🚀 WITHDRAWAL PROCESS STARTED ===");
    console.log("💰 Amount:", cashAmount, "Points:", pointsRequired);
    console.log("👤 Current User ID:", currentUser?.id);

    if (!currentUser || !currentUser.id) {
      alert('❌ User not logged in');
      return;
    }

    const withdrawalData = {
      amount: cashAmount,
      pointsUsed: pointsRequired,
      paymentMethod: selectedPaymentMethod,
      bankDetails: selectedPaymentMethod === 'bank' ? bankDetails : null,
      upiId: selectedPaymentMethod === 'upi' ? upiId : null
    };

    console.log("📦 Withdrawal data:", withdrawalData);

    // ✅ TRY TO SAVE BANK ACCOUNT FIRST (if bank method)
    if (selectedPaymentMethod === 'bank') {
      console.log("💾 Attempting to save bank account first...");
      const saved = await saveBankAccount();
      if (!saved) {
        console.log("⏭️ Continuing without saving bank account...");
      }
    }

    console.log("📤 Sending withdrawal request...");
    const response = await api.post('/withdrawals/request', withdrawalData);
    
    console.log("✅ Backend response:", response.data);
    
    if (response.data.success) {
      const withdrawal = response.data.data;
      
      // Deduct points
      const success = deductPoints(pointsRequired, `Withdrawal of ₹${cashAmount}`);
      
      if (success) {
        setWithdrawalHistory(prev => [withdrawal, ...prev]);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setBankDetails({
          accountNumber: '',
          ifscCode: '',
          accountHolder: '',
          bankName: ''
        });
        setUpiId('');
        
        alert(`✅ Withdrawal request for ₹${cashAmount} submitted successfully!\n\n📋 Transaction ID: ${withdrawal.transactionId}`);
        
        await fetchWithdrawalHistory();
      }
    } else {
      alert(`❌ Withdrawal failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error('💥 Withdrawal error:', error);
    
    if (error.response?.status === 500) {
      alert('❌ Server error. Please check if database tables exist and backend is properly configured.');
    } else if (error.code === 'NETWORK_ERROR') {
      alert('❌ Cannot connect to server. Please ensure backend is running on port 8080.');
    } else {
      alert(`❌ Withdrawal failed: ${error.response?.data?.message || error.message}`);
    }
  }
};

  const saveBankAccount = async () => {
  if (!currentUser) {
    alert('❌ Please login first!');
    return false;
  }

  if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder || !bankDetails.bankName) {
    alert('Please fill in all bank details to save');
    return false;
  }

  try {
    const config = {
      headers: {
        'User-ID': currentUser.id.toString(),
        'Content-Type': 'application/json'
      }
    };

    console.log('💾 Attempting to save bank account...', bankDetails);
    const response = await api.post('/bank-accounts/save', bankDetails, config);
    
    if (response.data.success) {
      console.log('✅ Bank account saved successfully!');
      // Update local state with the saved account (including ID)
      if (response.data.data && response.data.data.id) {
        setBankDetails(prev => ({...prev, id: response.data.data.id}));
      }
      await fetchUserBankAccounts();
      return true;
    } else {
      console.log('❌ Failed to save bank account:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('💥 Bank account save error:', error);
    console.error('💥 Error details:', error.response?.data);
    alert('❌ Failed to save bank account. Please try again.');
    return false;
  }
};

  const getRecentWithdrawals = () => withdrawalHistory.slice(0, 3);
  const getTotalWithdrawn = () => withdrawalHistory.reduce((total, w) => total + w.amount, 0);

  const paymentMethods = [
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      icon: '🏦',
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50'
    },
    { 
      id: 'upi', 
      name: 'UPI', 
      icon: '📱',
      gradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50'
    }
  ];

  const getActivityIcon = (reason) => {
    if (reason.includes('Form')) return '📝';
    if (reason.includes('Withdrawal')) return '💸';
    if (reason.includes('Bonus')) return '🎁';
    if (reason.includes('Referral')) return '👥';
    return '✨';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'history', name: 'Points History', icon: '📈' },
    { id: 'withdrawals', name: 'Withdrawals', icon: '💸' }
  ];

  const statsCards = [
    {
      title: 'Total Points',
      value: points.toLocaleString(),
      icon: '⭐',
      description: 'Accumulated points',
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Available Cash',
      value: `₹${availableCash.toLocaleString()}`,
      icon: '💰',
      description: 'Ready to withdraw',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Forms Completed',
      value: Math.floor(points / 10).toLocaleString(),
      icon: '📝',
      description: 'Total forms filled',
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Withdrawals',
      value: withdrawalHistory.length,
      icon: '💸',
      description: 'Total withdrawals',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const actionCards = [
    {
      title: 'Points History',
      description: 'View all your transactions and earnings',
      onClick: () => setActiveTab('history'),
      icon: '📊',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Withdrawal History',
      description: 'Check your past withdrawals and status',
      onClick: () => setActiveTab('withdrawals'),
      icon: '💸',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Go to Dashboard',
      description: 'Complete forms to earn more points',
      onClick: () => navigate('/dashboard'),
      icon: '🚀',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Back to Home',
      description: 'Return to homepage',
      onClick: () => navigate('/'),
      icon: '🏠',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  // ✅ ADD debug info component
  const DebugInfo = () => (
    <div className="max-w-7xl mx-auto mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
      <div className="text-sm text-yellow-800">
        <strong>Debug Info:</strong> 
        User ID: {currentUser?.id || 'Not logged in'} | 
        Points: {points} | 
        Cash: ₹{availableCash} | 
        Backend: {process.env.REACT_APP_API_URL || 'http://localhost:8080'} |
        Headers: User-ID: {currentUser?.id || 'Missing'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* Debug Info - Remove in production */}
      {/* <DebugInfo /> */}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Rewards Wallet
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Convert your points to real money • Secure bank transfers • Instant processing
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-gradient-to-b from-blue-50 to-white'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                        <p className="text-gray-500 text-xs">{card.description}</p>
                      </div>
                      <div className={`w-14 h-14 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                        <span className="text-2xl">{card.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Available Balance</h3>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">₹{availableCash.toLocaleString()}</div>
                  <p className="text-blue-100 text-sm mb-6">{points.toLocaleString()} points • 5 pts = ₹20</p>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={points < 5}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      points < 5
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-lg'
                    }`}
                  >
                    💸 Withdraw Money
                  </button>
                </div>

                {/* Level Card */}
                <div className="bg-white rounded-2xl border border-white/20 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Current Level</h3>
                    <span className={`text-2xl ${levelDetails.color}`}>{levelDetails.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">{rank}</div>
                  <p className="text-gray-600 text-sm mb-4">{points} / 1000 points to Elite</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Beginner</span>
                    <span>Elite</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl border border-white/20 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span>📝</span> Forms Completed
                      </span>
                      <span className="font-semibold text-gray-900">{Math.floor(points / 10)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span>💸</span> Total Withdrawn
                      </span>
                      <span className="font-semibold text-gray-900">₹{getTotalWithdrawn()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span>⚡</span> Success Rate
                      </span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {actionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={card.onClick}
                    className="bg-white rounded-2xl border border-white/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl text-white">{card.icon}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{card.title}</h4>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Points History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-white/20 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-xl text-white">📊</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Points History</h3>
                      <p className="text-gray-600">{pointsHistory.length} transactions</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {pointsHistory.length > 0 ? (
                    pointsHistory.map((activity, index) => (
                      <div 
                        key={activity.id || index} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            activity.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            <span className="text-xl">{getActivityIcon(activity.reason || activity.description)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {activity.reason || activity.description}
                            </div>
                            <div className="text-sm text-gray-600">
                              {activity.time}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          activity.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {activity.points > 0 ? '+' : ''}{activity.points}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <div className="text-6xl mb-6">📈</div>
                      <p className="text-xl font-semibold mb-2">No points history yet</p>
                      <p className="text-sm">Complete forms to start earning points!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === 'withdrawals' && (
            <div className="bg-white rounded-2xl border border-white/20 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-xl text-white">💸</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Withdrawal History</h3>
                      <p className="text-gray-600">{withdrawalHistory.length} withdrawals</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    New Withdrawal
                  </button>
                </div>
                
                {withdrawalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {withdrawalHistory.map(withdrawal => (
                      <div key={withdrawal.id} className="p-5 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-bold text-gray-900 text-xl">₹{withdrawal.amount}</div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            withdrawal.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                            withdrawal.status === 'Processing' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {withdrawal.status}
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm mb-2">
                          {withdrawal.paymentMethod === 'bank' ? 'Bank Transfer' : 'UPI'} • {withdrawal.transactionId}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-6xl mb-6">💸</div>
                    <p className="text-xl font-semibold mb-2">No withdrawals yet</p>
                    <p className="text-sm">Withdraw your points to see history here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

     {/* Withdrawal Modal */}
{showWithdrawModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl border border-white/20 shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Withdraw Funds</h3>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 mb-6 text-center text-white">
            <p className="text-blue-100 text-sm mb-2">Available Balance</p>
            <p className="text-4xl font-bold">₹{availableCash.toLocaleString()}</p>
            <p className="text-blue-100 text-sm mt-3">{points} points • 1 point = ₹{POINT_TO_RUPEE_RATE}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Enter Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="100"
                min="50"
                step="1"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {withdrawAmount && (
              <p className="text-sm text-gray-600 mt-3">
                Points required: {Math.ceil(parseFloat(withdrawAmount) / POINT_TO_RUPEE_RATE)} points
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedPaymentMethod === method.id
                      ? `border-blue-500 bg-gradient-to-r ${method.gradient} text-white shadow-lg`
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-sm font-semibold">{method.name}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedPaymentMethod === 'bank' && (
            <div className="space-y-4 mb-6">
              {/* Saved Bank Accounts */}
              {userBankAccounts.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Use Saved Bank Account
                  </label>
                  <select
                    onChange={(e) => {
                      const selectedAccount = userBankAccounts.find(acc => acc.id === parseInt(e.target.value));
                      if (selectedAccount) {
                        setBankDetails(selectedAccount);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select saved account</option>
                    {userBankAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.bankName} - ****{account.accountNumber.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bank Name *</label>
                <select
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails(prev => ({...prev, bankName: e.target.value}))}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Axis">Axis Bank</option>
                  <option value="Kotak">Kotak Mahindra Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="Canara">Canara Bank</option>
                  <option value="Other">Other Bank</option>
                </select>
              </div>
              
              <input
                type="text"
                placeholder="Account Holder Name *"
                value={bankDetails.accountHolder}
                onChange={(e) => setBankDetails(prev => ({...prev, accountHolder: e.target.value}))}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                placeholder="Account Number *"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({...prev, accountNumber: e.target.value}))}
                required
                minLength="9"
                maxLength="18"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                placeholder="IFSC Code *"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails(prev => ({...prev, ifscCode: e.target.value.toUpperCase()}))}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {selectedPaymentMethod === 'upi' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                UPI ID *
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">Enter your UPI ID (e.g., username@paytm, username@ybl)</p>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) < 50 || isProcessing || 
              (selectedPaymentMethod === 'bank' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder || !bankDetails.bankName)) ||
              (selectedPaymentMethod === 'upi' && !upiId)}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              !withdrawAmount || parseFloat(withdrawAmount) < 50 || isProcessing || 
              (selectedPaymentMethod === 'bank' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder || !bankDetails.bankName)) ||
              (selectedPaymentMethod === 'upi' && !upiId)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              `Withdraw ₹${withdrawAmount || '0'}`
            )}
          </button>

          {/* Terms and Info */}
          <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
            <p>💰 Minimum withdrawal: ₹50</p>
            <p>⚡ Processing time: 24-48 hours</p>
            <p>🔒 Secure & encrypted transactions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default PointsPage;