import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoints } from '../../context/PointsContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { points } = usePoints();

  // Cap profile completion at 100%
  const maxPoints = 30; // total points for 100% completion
  const profileCompletion = Math.min(100, Math.floor((points / maxPoints) * 100));

  const cards = [
    {
      title: 'Personal Details',
      description: 'Add your personal information',
      route: '/persionalForm',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      icon: '👤',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      borderColor: 'border-l-4 border-purple-500',
      glow: 'hover:shadow-2xl hover:shadow-purple-500/30',
      textColor: 'text-gray-800',
      descriptionColor: 'text-gray-600'
    },
    {
      title: 'Education Details',
      description: 'Share your educational background',
      route: '/educationForm',
      gradient: 'from-green-400 via-blue-500 to-teal-500',
      icon: '🎓',
      bgColor: 'bg-gradient-to-br from-green-100 to-blue-100',
      borderColor: 'border-l-4 border-green-500',
      glow: 'hover:shadow-2xl hover:shadow-green-500/30',
      textColor: 'text-gray-800',
      descriptionColor: 'text-gray-600'
    },
    {
      title: 'Job Details',
      description: 'Provide your professional experience',
      route: '/jobForm',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: '💼',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      borderColor: 'border-l-4 border-orange-500',
      glow: 'hover:shadow-2xl hover:shadow-orange-500/30',
      textColor: 'text-gray-800',
      descriptionColor: 'text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-6 shadow-lg">
            <span className="text-2xl text-white">🚀</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Complete your profile step by step and track your progress with our integrated points system
          </p>
          
          {/* Points Display */}
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl px-8 py-4 border border-cyan-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              <div className="text-gray-800 font-semibold text-lg">
                Total Points: 
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
              {points} pts
            </div>
            <button
              onClick={() => navigate('/pointpage')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:from-cyan-600 hover:to-blue-600 flex items-center gap-2 group shadow-md"
            >
              View Details
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-500"
              onClick={() => navigate(card.route)}
            >
              <div className={`${card.bgColor} rounded-2xl shadow-xl ${card.glow} transition-all duration-500 border border-gray-200 overflow-hidden ${card.borderColor} relative hover:border-gray-300`}>
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg border border-white">
                      <span className="text-3xl">{card.icon}</span>
                    </div>
                    <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white transition-all duration-500 shadow-md group-hover:shadow-lg border border-white">
                      <span className="text-gray-600 group-hover:text-gray-800 text-lg font-bold">→</span>
                    </div>
                  </div>
                  
                  <h3 className={`text-2xl font-bold ${card.textColor} mb-4 group-hover:text-gray-900 transition-all duration-300`}>
                    {card.title}
                  </h3>
                  <p className={`${card.descriptionColor} mb-8 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300`}>
                    {card.description}
                  </p>
                  
                  <div className={`bg-gradient-to-r ${card.gradient} text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-3 group-hover:shadow-2xl transition-all duration-500 transform group-hover:translate-x-2 group-hover:scale-105 shadow-md`}>
                    Start Now
                    <span className="group-hover:translate-x-2 transition-transform duration-300 text-xl">⚡</span>
                  </div>
                </div>
                
                {/* Floating effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="text-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
          <button
            onClick={() => navigate('/pointpage')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 inline-flex items-center gap-3"
          >
            <span className="text-2xl">📊</span>
            View Points Details
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 inline-flex items-center gap-3"
          >
            <span className="text-2xl">🏠</span>
            Back to Home
          </button>
        </div>

        {/* Progress Indicator */}
        {/* <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-800 font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Profile Completion
            </span>
            <span className="text-cyan-600 font-bold text-xl">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-md"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 text-center font-medium">
            Complete all forms to maximize your points and profile strength ✨
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;