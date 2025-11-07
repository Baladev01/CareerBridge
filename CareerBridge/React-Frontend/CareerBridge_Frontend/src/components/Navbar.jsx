import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RiLoginCircleFill, RiNotification3Line, RiDashboardLine } from 'react-icons/ri';
import { BsX, BsChevronRight, BsShieldLock } from 'react-icons/bs';
import { FaUser, FaCog, FaSignOutAlt, FaCoins, FaTrophy, FaQuestionCircle, FaBell, FaHistory } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import logo from "../Images/logo.png";
import profile from "../Images/user.png";
import { useUser } from '../context/UserContext';
import { usePoints } from '../context/PointsContext';
import api from '../services/api';

const Navbar = () => {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasInitializedNotifications, setHasInitializedNotifications] = useState(false);
  const sidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const adminModalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfileImage, setUserProfileImage] = useState(profile);
  
  const { currentUser, logout, getUserDisplayName, getJoinDate } = useUser();
  const { points, addPoints, refreshPoints, getPointsLevel, getRecentActivity, isNewUser } = usePoints();
  const { level, rank, color, icon } = getPointsLevel();

  // Professional color schemes
  const colorSchemes = {
    primary: 'from-blue-600 to-indigo-700',
    secondary: 'from-emerald-600 to-teal-700',
    accent: 'from-slate-700 to-slate-800',
    success: 'from-green-600 to-emerald-700',
    info: 'from-blue-600 to-cyan-700',
    warning: 'from-amber-600 to-orange-700'
  };

  // Admin password configuration
  const ADMIN_PASSWORDS = [
    'admin123', // Default admin password
    'superadmin', // Super admin password
    'tamilnadu2024', // Regional admin password
    'careerconnect' // App-specific password
  ];

  // Load notifications from localStorage when component mounts
  useEffect(() => {
    if (currentUser) {
      loadNotificationsFromStorage();
    }
  }, [currentUser]);

  // Fetch user profile photo when component mounts or currentUser changes
  useEffect(() => {
  if (currentUser) {
    fetchUserProfilePhoto();
  } else {
    setUserProfileImage(profile);
  }
}, [currentUser]);

  // Initialize notifications only once when user logs in
  useEffect(() => {
    if (currentUser && !hasInitializedNotifications) {
      initializeNotifications();
      setHasInitializedNotifications(true);
    } else if (!currentUser) {
      setNotifications([]);
      setHasInitializedNotifications(false);
    }
  }, [currentUser, hasInitializedNotifications]);

  // Add new notifications when points change or recent activity updates
  useEffect(() => {
    if (currentUser && hasInitializedNotifications) {
      addNewActivityNotifications();
    }
  }, [points, getRecentActivity()]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (currentUser && notifications.length > 0) {
      saveNotificationsToStorage();
    }
  }, [notifications, currentUser]);

  // Click outside handlers for all modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsProfileSidebarOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (adminModalRef.current && !adminModalRef.current.contains(event.target)) {
        setIsAdminModalOpen(false);
        setAdminPassword('');
        setAdminError('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileSidebarOpen(false);
        setIsNotificationsOpen(false);
        setIsAdminModalOpen(false);
        setAdminPassword('');
        setAdminError('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Points earned event listener
 // Navbar.js - useEffect-ல்
useEffect(() => {
  const handlePointsEarned = (event) => {
    const { points: pointsEarned, reason, message } = event.detail;
    
    console.log('🎯 Points earned event received in Navbar:', { 
      pointsEarned, 
      reason, 
      message 
    });
    
    // ✅ DATE & TIME ADD பண்ணுங்க
    const now = new Date();
    const timestamp = now.toISOString();
    const formattedTime = formatTimeAgo(timestamp);
    const detailedTime = formatDetailedTime(timestamp);
    
    // Create notification for points earned
    const newNotification = {
      id: Date.now() + Math.random(),
      text: message || `+${pointsEarned} points: ${reason}`,
      time: formattedTime, // ✅ "2 minutes ago"
      detailedTime: detailedTime, // ✅ "Dec 25, 2024, 10:30 AM"
      timestamp: timestamp, // ✅ ISO string for sorting
      unread: true,
      type: 'points-earned',
      points: pointsEarned,
      persistent: false
    };

    console.log('📢 Adding notification to navbar:', newNotification);
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Refresh points display
    refreshPoints();
  };

  // ✅ TIME FORMATTING FUNCTIONS
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now - notificationTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    // For older notifications, show actual date
    return notificationTime.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDetailedTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  window.addEventListener('pointsEarned', handlePointsEarned);

  return () => {
    window.removeEventListener('pointsEarned', handlePointsEarned);
  };
}, [refreshPoints]);

  // Load notifications from localStorage
  const loadNotificationsFromStorage = () => {
    try {
      const stored = localStorage.getItem(`notifications_${currentUser.id}`);
      if (stored) {
        const parsedNotifications = JSON.parse(stored);
        setNotifications(parsedNotifications);
        setHasInitializedNotifications(true);
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      initializeNotifications();
    }
  };

  // Save notifications to localStorage
  const saveNotificationsToStorage = () => {
    try {
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  };
const initializeNotifications = () => {
  const userData = {
    name: getUserDisplayName(),
    email: currentUser ? currentUser.email : "guest@example.com",
    joinDate: getJoinDate(),
  };

  // Check if we already have notifications in storage
  const storedNotifications = localStorage.getItem(`notifications_${currentUser.id}`);
  if (storedNotifications) {
    const parsedNotifications = JSON.parse(storedNotifications);
    setNotifications(parsedNotifications);
    return;
  }

 // ✅ DATE & TIME WITH INITIAL NOTIFICATIONS (REMOVED THE 0 POINTS MESSAGE)
  const now = new Date().toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const initialNotifications = [
    { 
      id: 1, 
      text: `Welcome ${userData.name}!`, 
      time: "Just now",
      detailedTime: formatDetailedTime(now),
      timestamp: now,
      unread: true, 
      type: 'welcome',
      persistent: true
    },
    // ❌ REMOVED THIS NOTIFICATION:
    // { 
    //   id: 2, 
    //   text: `You've earned ${points} points so far!`, 
    //   time: "Today",
    //   detailedTime: formatDetailedTime(now),
    //   timestamp: now,
    //   unread: true, 
    //   type: 'points',
    //   persistent: false
    // },
    { 
      id: 2, // Changed from 3 to 2 since we removed one
      text: "Complete your profile to earn more points", 
      time: "2 hours ago",
      detailedTime: formatDetailedTime(twoHoursAgo),
      timestamp: twoHoursAgo,
      unread: true, 
      type: 'reminder',
      persistent: false
    }
  ];

  setNotifications(initialNotifications);
};

// ✅ FORMAT DETAILED TIME FUNCTION ADD பண்ணுங்க
const formatDetailedTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  const addNewActivityNotifications = () => {
    const recentActivity = getRecentActivity();
    if (recentActivity.length > 0) {
      const newActivityNotifications = recentActivity
        .filter(activity => {
          return !notifications.some(notification => 
            notification.text.includes(`+${activity.points} points: ${activity.reason}`)
          );
        })
        .map(activity => ({
          id: Date.now() + Math.random(),
          text: `+${activity.points} points: ${activity.reason}`,
          time: activity.time,
          unread: true,
          type: 'points-earned',
          timestamp: new Date().toISOString(),
          persistent: false
        }));

      if (newActivityNotifications.length > 0) {
        setNotifications(prev => [...newActivityNotifications, ...prev]);
      }
    }
  };

  const fetchUserProfilePhoto = async () => {
  try {
    const personalResponse = await api.get(`/personal/user/${currentUser.id}`);
    if (personalResponse.data.success && personalResponse.data.data) {
      const personalData = personalResponse.data.data;
      if (personalData.profilePhoto) {
        // Construct full URL if needed
        const photoUrl = personalData.profilePhoto.startsWith('http') 
          ? personalData.profilePhoto 
          : `${api.defaults.baseURL}${personalData.profilePhoto}`;
        setUserProfileImage(photoUrl);
      } else {
        setUserProfileImage(profile);
      }
    }
  } catch (error) {
    console.log('Using default profile image');
    setUserProfileImage(profile);
  }
};

  const userData = {
    name: getUserDisplayName(),
    email: currentUser ? currentUser.email : "guest@example.com",
    avatar: userProfileImage,
    joinDate: getJoinDate(),
    points: points,
    level: level,
    rank: rank,
    icon: icon
  };

  // Mark single notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        unread: false
      }))
    );
  };

  // Clear all notifications (optional)
  const clearAllNotifications = () => {
    setNotifications([]);
    if (currentUser) {
      localStorage.removeItem(`notifications_${currentUser.id}`);
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Navigation handlers
  const handleNavigateToPoints = () => {
    navigate('/pointpage');
    setIsProfileSidebarOpen(false);
  };

  const handleNavigateToProfile = () => {
    navigate('/MyProfile');
    setIsProfileSidebarOpen(false);
  };

  const handleNavigateToSettings = () => {
    navigate('/AccountPage');
    setIsProfileSidebarOpen(false);
  };

  const handleNavigateToHelpSupport = () => {
    navigate('/help-support');
    setIsProfileSidebarOpen(false);
  };

  const handleNavigateToPointsHistory = () => {
    navigate('/pointpage?tab=history');
    setIsProfileSidebarOpen(false);
  };

  // Admin password verification
  const handleAdminButtonClick = () => {
    setIsAdminModalOpen(true);
    setAdminPassword('');
    setAdminError('');
  };

  const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      setAdminError('Please enter admin password');
      return;
    }

    setIsLoading(true);
    setAdminError('');

    // Simulate API call delay
    setTimeout(() => {
      if (ADMIN_PASSWORDS.includes(adminPassword.trim())) {
        // Password correct - navigate to admin login
        setIsAdminModalOpen(false);
        setAdminPassword('');
        navigate('/adminLogin');
      } else {
        setAdminError('Invalid admin password. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminPasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  const handleLogout = async () => {
    try {
      // Only clear non-persistent notifications on logout
      const persistentNotifications = notifications.filter(n => n.persistent);
      setNotifications(persistentNotifications);
      
      logout();
      setIsProfileSidebarOpen(false);
      setUserProfileImage(profile);
      setHasInitializedNotifications(false);
      alert('✅ Successfully logged out!');
      navigate('/');
    } catch (error) {
      console.error('❌ Logout error:', error);
      localStorage.clear();
      window.location.href = '/';
    }
  };

  useEffect(() => {
    if (isProfileSidebarOpen && currentUser) {
      refreshPoints();
      fetchUserProfilePhoto();
    }
  }, [isProfileSidebarOpen, currentUser]);

  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileSidebarOpen(false);
  };

  // Clear duplicate notifications function
  const clearDuplicateNotifications = () => {
    setNotifications(prev => {
      const uniqueNotifications = [];
      const seenTexts = new Set();
      
      prev.forEach(notification => {
        if (!seenTexts.has(notification.text)) {
          seenTexts.add(notification.text);
          uniqueNotifications.push(notification);
        }
      });
      
      return uniqueNotifications;
    });
  };


  // Fetch user profile photo when component mounts or currentUser changes
useEffect(() => {
  const fetchProfilePhoto = async () => {
    if (currentUser) {
      try {
        // ✅ ENHANCED: Check user context first for profile photo
        if (currentUser.profilePhoto) {
          setUserProfileImage(currentUser.profilePhoto);
          console.log('🔄 Using profile photo from user context');
          return;
        }

        // ✅ ENHANCED: Fetch from personal details as fallback
        const personalResponse = await api.get(`/personal/user/${currentUser.id}`);
        if (personalResponse.data.success && personalResponse.data.data) {
          const personalData = personalResponse.data.data;
          if (personalData.profilePhoto) {
            setUserProfileImage(personalData.profilePhoto);
            console.log('🔄 Using profile photo from personal details');
          } else {
            setUserProfileImage(profile);
          }
        }
      } catch (error) {
        console.log('Using default profile image');
        setUserProfileImage(profile);
      }
    } else {
      setUserProfileImage(profile);
    }
  };

  fetchProfilePhoto();
}, [currentUser]);

// ✅ ADD: Listen for profile photo updates
useEffect(() => {
  const handleProfileUpdate = () => {
    if (currentUser?.profilePhoto) {
      setUserProfileImage(currentUser.profilePhoto);
      console.log('🔄 Navbar received profile photo update');
    }
  };

  // Custom event listener for profile updates
  window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
  
  return () => {
    window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
  };
}, [currentUser]);

  // Clear duplicates when notifications get too many
  useEffect(() => {
    if (notifications.length > 20) {
      clearDuplicateNotifications();
    }
  }, [notifications.length]);

  if (location.pathname === '/loginform') return null;

  // Professional color schemes for different notification types
  const getNotificationColors = (type) => {
    const colors = {
      'welcome': {
        bg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        border: 'border-blue-200',
        icon: '👋',
        badge: 'bg-blue-500'
      },
      'points': {
        bg: 'bg-gradient-to-r from-emerald-600 to-teal-700',
        border: 'border-emerald-200',
        icon: '⭐',
        badge: 'bg-emerald-500'
      },
      'points-earned': {
        bg: 'bg-gradient-to-r from-cyan-600 to-blue-700',
        border: 'border-cyan-200',
        icon: '🎯',
        badge: 'bg-cyan-500'
      },
      'achievement': {
        bg: 'bg-gradient-to-r from-violet-600 to-purple-700',
        border: 'border-violet-200',
        icon: '🏆',
        badge: 'bg-violet-500'
      },
      'reminder': {
        bg: 'bg-gradient-to-r from-amber-600 to-orange-700',
        border: 'border-amber-200',
        icon: '💡',
        badge: 'bg-amber-500'
      }
    };
    return colors[type] || colors['reminder'];
  };

  return (
    <>
      {/* ---------------- PROFESSIONAL NAVBAR ---------------- */}
      <nav className='flex justify-between items-center bg-white border-b border-gray-200 px-6 py-4 sticky top-0 shadow-sm z-50 backdrop-blur-sm bg-opacity-95'>
        <div className='flex-shrink-0'>
          <img 
            src={logo}
            alt="logo"
            className="w-50 ml-10 md:w-40 brightness-100 invert-0 drop-shadow-sm transform hover:scale-105 transition-all duration-300 cursor-pointer hover:rotate-2 hover:shadow-lg"
            onClick={() => navigate('/')}
          />
        </div>

        <div className='hidden lg:flex absolute left-1/2 transform -translate-x-1/2'>
          <ul className='flex space-x-1 bg-white rounded-lg p-1 border border-gray-200 shadow-sm'>
            <Link to="/">
              <li className='flex items-center text-gray-700 font-semibold px-4 py-2.5 cursor-pointer rounded-md hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden'>
                <RiDashboardLine className="mr-2 text-lg group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300" /> 
                <span className="text-sm group-hover:text-blue-700 transition-colors duration-300">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </li>
            </Link>
            <Link to="/dashboard">
              <li className='flex items-center text-gray-700 font-semibold px-4 py-2.5 cursor-pointer rounded-md hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden'>
                <HiOutlineSparkles className="mr-2 text-lg group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300" /> 
                <span className="text-sm group-hover:text-blue-700 transition-colors duration-300">Complete Info</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </li>
            </Link>
            <Link to="/pointpage">
              <li className='flex items-center text-gray-700 font-semibold px-4 py-2.5 cursor-pointer rounded-md hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden'>
                <FaTrophy className="mr-2 text-lg group-hover:scale-110 group-hover:text-yellow-600 transition-transform duration-300" /> 
                <span className="text-sm group-hover:text-blue-700 transition-colors duration-300">Rewards ({points})</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </li>
            </Link>
            
            {/* Admin Button with Password Protection */}
            <li 
              onClick={handleAdminButtonClick}
              className='flex items-center text-gray-700 font-semibold px-4 py-2.5 cursor-pointer rounded-md hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-200 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden'
            >
              <BsShieldLock className="mr-2 text-lg group-hover:scale-110 group-hover:text-red-600 transition-transform duration-300" /> 
              <span className="text-sm group-hover:text-red-700 transition-colors duration-300">Admin</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={toggleNotifications}
              className="p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 text-gray-600 relative shadow-sm border border-gray-200 hover:shadow-md hover:scale-110 hover:-translate-y-0.5 hover:border-blue-200 group"
            >
              <FaBell className="w-5 h-5 group-hover:scale-110 group-hover:text-blue-600 transition-transform duration-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm group-hover:scale-125 group-hover:animate-pulse transition-transform duration-300">
                  {unreadCount}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
          </div>

          {/* Login / Profile */}
          {!currentUser ? (
            <Link to='/loginform'> 
              <button className='hidden sm:flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 group relative overflow-hidden'>
                <RiLoginCircleFill className="mr-2 text-lg group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300" /> 
                <span className="text-sm group-hover:tracking-wide transition-all duration-300">Sign in</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-gray-600 font-semibold text-xs bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 group cursor-default">
                🎯 {points} pts
              </div>
              <div className="text-gray-700 font-semibold text-sm max-w-32 truncate hover:text-blue-600 transition-colors duration-300">
                Hi, {currentUser.firstName}
              </div>
            </div>
          )}

          {/* Profile Image */}
          <div className="relative group">
            <div 
              onClick={toggleProfileSidebar}
              className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:scale-110 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-600 relative"
            >
              <img 
                src={userProfileImage} 
                alt="profile" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = profile;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {currentUser && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white shadow-sm group-hover:scale-125 group-hover:animate-pulse transition-transform duration-300"></div>
            )}
          </div>
        </div>
      </nav>

      {/* ---------------- ADMIN PASSWORD MODAL ---------------- */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div 
            ref={adminModalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
          >
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl border-b border-red-500`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                  <BsShieldLock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                  <p className="text-white/90 text-sm">Enter admin password to continue</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError('');
                    }}
                    onKeyPress={handleAdminPasswordKeyPress}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    disabled={isLoading}
                  />
                  {adminError && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                      <span>⚠️</span>
                      {adminError}
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 text-sm">ℹ️</span>
                    </div>
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">
                        Restricted Access
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        This area is for authorized administrators only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAdminModalOpen(false);
                  setAdminPassword('');
                  setAdminError('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                disabled={isLoading || !adminPassword.trim()}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <BsShieldLock className="text-lg" />
                    Continue
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PROFESSIONAL NOTIFICATIONS SIDEBAR ---------------- */}
      <div 
        ref={notificationsRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isNotificationsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${colorSchemes.primary} border-b border-blue-500`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 hover:scale-105 transition-transform duration-300">
                <FaBell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
                <p className="text-white/90 text-sm font-medium">
                  {unreadCount} unread
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 group"
            >
              <BsX className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Clear All Button */}
          {notifications.length > 0 && (
            <div className="mt-4">
              <button 
                onClick={clearAllNotifications}
                className="text-white/80 hover:text-white text-sm font-medium hover:underline transition-all duration-300"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-200 hover:scale-105 transition-transform duration-300">
                <FaBell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No notifications</p>
              <p className="text-gray-500 text-sm">We'll notify you when something new happens</p>
            </div>
          ) : (
           <ul className="space-y-3">
  {notifications.map((notification) => {
    const colors = getNotificationColors(notification.type);
    return (
      <li 
        key={notification.id}
        onClick={() => markAsRead(notification.id)}
        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border hover:scale-102 hover:shadow-md group ${
          notification.unread 
            ? `${colors.bg} text-white border-transparent` 
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex gap-3 items-start">
          {/* Professional Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
            notification.unread ? 'bg-white/20' : 'bg-gray-100'
          }`}>
            <span className="text-lg group-hover:scale-125 transition-transform duration-300">{colors.icon}</span>
          </div>
          
          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm leading-relaxed group-hover:tracking-wide transition-all duration-300 ${
              notification.unread ? 'text-white' : 'text-gray-700'
            }`}>
              {notification.text}
            </p>
            
            {/* ✅ DATE & TIME DISPLAY */}
            <div className="flex justify-between items-center mt-2">
              <span 
                className={`text-xs font-medium px-2 py-1 rounded group-hover:scale-105 transition-transform duration-300 ${
                  notification.unread ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
                title={notification.detailedTime} // ✅ Hover-ல் full date/time
              >
                {notification.time} {/* ✅ "2 minutes ago" */}
              </span>
              
              <div className="flex items-center gap-2">
                {notification.unread && (
                  <span className={`w-2 h-2 rounded-full ${colors.badge} shadow-sm group-hover:scale-150 transition-transform duration-300`}></span>
                )}
                <span className={`text-xs px-2 py-1 rounded font-medium group-hover:scale-105 transition-transform duration-300 ${
                  notification.unread ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {notification.type.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* ✅ POINTS DISPLAY (If available) */}
            {notification.points && (
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${
                  notification.unread ? 'text-yellow-300' : 'text-yellow-600'
                } font-bold`}>
                  +{notification.points} points
                </span>
              </div>
            )}
          </div>
        </div>
      </li>
    );
  })}
</ul>
          )}
        </div>

        {/* Bottom Clear All */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <button 
              onClick={markAllAsRead}
              className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:bg-blue-700 hover:shadow-lg hover:scale-105 group'
            >
              <div className="w-4 h-4 bg-white rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-blue-600 text-xs font-bold group-hover:scale-125 transition-transform duration-300">✓</span>
              </div>
              Mark All as Read ({unreadCount})
            </button>
          </div>
        )}
      </div>

      {/* ---------------- PROFESSIONAL PROFILE SIDEBAR ---------------- */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${colorSchemes.primary} border-b border-blue-500`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">👤 {currentUser ? 'Profile' : 'Guest'}</h2>
            <button 
              onClick={toggleProfileSidebar}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 group"
            >
              <BsX className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-6 group">
            <div className="relative group">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                <img 
                  src={userProfileImage} 
                  alt="profile" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = profile;
                  }}
                />
              </div>
              {currentUser && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm group-hover:scale-125 group-hover:animate-pulse transition-transform duration-300"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{userData.name}</h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">📧 {userData.email}</p>
              <p className="text-gray-500 text-xs mt-2 bg-gray-50 px-3 py-1.5 rounded-lg inline-block border border-gray-200 group-hover:shadow-sm group-hover:scale-105 transition-all duration-300">
                {currentUser ? `🗓️ Member since ${userData.joinDate}` : '👋 Guest User'}
              </p>
            </div>
          </div>

          {/* Points Card */}
          <div 
            className={`bg-gradient-to-r ${color} rounded-xl p-4 text-white shadow-sm cursor-pointer transition-all duration-300 border border-white/20 hover:shadow-lg hover:scale-105 group relative overflow-hidden`}
            onClick={handleNavigateToPoints}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <FaCoins className="text-xl text-yellow-300 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Your Points</p>
                  <p className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">{userData.points}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-sm font-medium">Level</p>
                <p className="font-bold text-yellow-300 text-lg flex items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                  {icon} {userData.level}
                </p>
                <p className="text-xs text-white/70 bg-black/20 px-2 py-1 rounded mt-1 group-hover:scale-105 transition-transform duration-300">{userData.rank}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {currentUser && (
            <div className="flex gap-2 mt-4">
              <button onClick={handleNavigateToPointsHistory} className="flex-1 bg-blue-600 text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:scale-105 group">
                <FaHistory className="text-sm group-hover:scale-110 group-hover:rotate-180 transition-transform duration-500" /> 
                <span className="group-hover:tracking-wide transition-all duration-300">History</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="p-4">
          <ul className="space-y-2 mb-20">
            <li onClick={handleNavigateToProfile} className='flex items-center justify-between text-gray-700 px-4 py-3 font-semibold cursor-pointer rounded-lg bg-white hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:shadow-md hover:scale-102 hover:-translate-y-0.5 group'>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                  <FaUser className="text-lg text-blue-600 group-hover:scale-125 transition-transform duration-300" />
                </div>
                <span className="text-sm group-hover:text-blue-700 group-hover:tracking-wide transition-all duration-300">My Profile</span>
              </div>
              <BsChevronRight className="text-gray-400 text-lg group-hover:scale-125 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
            </li>

            <li onClick={handleNavigateToSettings} className='flex items-center justify-between text-gray-700 px-4 py-3 font-semibold cursor-pointer rounded-lg bg-white hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:shadow-md hover:scale-102 hover:-translate-y-0.5 group'>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 border border-purple-200">
                  <FaCog className="text-lg text-purple-600 group-hover:scale-125 group-hover:rotate-90 transition-transform duration-500" />
                </div>
                <span className="text-sm group-hover:text-purple-700 group-hover:tracking-wide transition-all duration-300">Settings</span>
              </div>
              <BsChevronRight className="text-gray-400 text-lg group-hover:scale-125 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
            </li>

            <li onClick={toggleNotifications} className='flex items-center justify-between text-gray-700 px-4 py-3 font-semibold cursor-pointer rounded-lg bg-white hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:shadow-md hover:scale-102 hover:-translate-y-0.5 group'>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 border border-green-200">
                  <RiNotification3Line className="text-lg text-green-600 group-hover:scale-125 group-hover:animate-bounce transition-transform duration-300" />
                </div>
                <div className="flex items-center">
                  <span className="text-sm group-hover:text-green-700 group-hover:tracking-wide transition-all duration-300">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:animate-pulse transition-transform duration-300">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <BsChevronRight className="text-gray-400 text-lg group-hover:scale-125 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
            </li>

            <li 
              onClick={handleNavigateToHelpSupport}
              className='flex items-center justify-between text-gray-700 px-4 py-3 font-semibold cursor-pointer rounded-lg bg-white hover:bg-blue-50 transition-all duration-300 border border-gray-200 hover:shadow-md hover:scale-102 hover:-translate-y-0.5 group'
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 border border-orange-200">
                  <FaQuestionCircle className="text-lg text-orange-600 group-hover:scale-125 group-hover:animate-pulse transition-transform duration-300" />
                </div>
                <span className="text-sm group-hover:text-orange-700 group-hover:tracking-wide transition-all duration-300">Help & Support</span>
              </div>
              <BsChevronRight className="text-gray-400 text-lg group-hover:scale-125 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300" />
            </li>
          </ul>
        </div>

        {/* Bottom Logout / Sign In */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          {currentUser ? (
            <button 
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 group'
            >
              <FaSignOutAlt className="text-lg group-hover:scale-110 group-hover:-translate-x-1 transition-transform duration-300" /> 
              <span className="group-hover:tracking-wide transition-all duration-300">Logout</span>
            </button>
          ) : (
            <Link to="/loginform" className="w-full block">
              <button 
                onClick={() => setIsProfileSidebarOpen(false)}
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 group'
              >
                <RiLoginCircleFill className="text-lg group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300" /> 
                <span className="group-hover:tracking-wide transition-all duration-300">Sign In</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      {(isProfileSidebarOpen || isNotificationsOpen || isAdminModalOpen) && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => {
            setIsProfileSidebarOpen(false);
            setIsNotificationsOpen(false);
            setIsAdminModalOpen(false);
            setAdminPassword('');
            setAdminError('');
          }}
        />
      )}

      <style jsx>{`
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
};

export default Navbar;