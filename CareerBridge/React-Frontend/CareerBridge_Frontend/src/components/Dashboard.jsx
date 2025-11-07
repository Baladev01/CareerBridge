// Create this file: src/components/Dashboard.jsx
import React from 'react';
import { useUser } from '../context/UserContext';
import { usePoints } from '../context/PointsContext';

const Dashboard = () => {
  const { currentUser } = useUser();
  const { points } = usePoints();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text">
            {currentUser ? `Welcome back, ${currentUser.firstName}! 👋` : 'Professional Dashboard'}
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Track your career progress and manage your professional journey in one place
          </p>
        </div>
        
        {/* Main Points Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Career Points</h2>
              <p className="text-gray-600 text-lg font-medium">
                {points >= 5 ? '🎉 Outstanding progress! Keep going!' : 'Complete tasks to unlock rewards!'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent mb-2">
                {points}
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Total Points
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">1</div>
            <p className="text-gray-600 font-semibold mb-2">Profile Created</p>
            <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full inline-block">
              ✓ Complete
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">⭐</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{points}</div>
            <p className="text-gray-600 font-semibold mb-2">Points Earned</p>
            <div className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${
              points > 0 
                ? 'bg-amber-50 text-amber-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {points > 0 ? '🏆 Active' : 'Start earning'}
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl text-white">📊</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">0</div>
            <p className="text-gray-600 font-semibold mb-2">Jobs Applied</p>
            <div className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
              Ready to apply
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Career Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Profile Completion</span>
                <span className="text-lg font-bold text-green-600">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full w-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Points Progress</span>
                <span className="text-lg font-bold text-blue-600">{points}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${points}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📝</div>
              <p className="font-semibold text-gray-700">Update Profile</p>
            </button>
            <button className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <p className="font-semibold text-gray-700">View Rewards</p>
            </button>
            <button className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🔍</div>
              <p className="font-semibold text-gray-700">Find Jobs</p>
            </button>
            <button className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📈</div>
              <p className="font-semibold text-gray-700">Progress Report</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;