import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPhone, FaComments, FaChevronRight } from 'react-icons/fa';
import { HiLightBulb } from 'react-icons/hi';

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('faq');

  // Professional color schemes matching Navbar
  const colorSchemes = {
    primary: 'from-blue-600 to-indigo-700',
    secondary: 'from-emerald-600 to-teal-700',
    accent: 'from-slate-700 to-slate-800',
    success: 'from-green-600 to-emerald-700',
    info: 'from-blue-600 to-cyan-700',
    warning: 'from-amber-600 to-orange-700'
  };

  const faqCategories = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: '🎯',
      questions: [
        {
          question: 'How do I create my profile?',
          answer: 'Navigate to the Dashboard and complete the Personal Details, Education Details, and Job Details forms. Each form completion earns you points!'
        },
        {
          question: 'What are points and how do I earn them?',
          answer: 'Points are rewards for completing your profile. Earn 10 points per form completed. Reach 30 points for Gold tier!'
        },
        {
          question: 'How do I upload a profile picture?',
          answer: 'Go to Personal Details form and use the image upload feature. Supported formats: JPG, PNG, WebP.'
        }
      ]
    },
    {
      id: 'points-rewards',
      title: '⭐ Points & Rewards',
      icon: '🏆',
      questions: [
        {
          question: 'What are the different achievement levels?',
          answer: 'Beginner (0-9 pts), Bronze (10-19 pts), Silver (20-29 pts), Gold (30+ pts). Each level unlocks special badges!'
        },
        {
          question: 'Can I lose points?',
          answer: 'No, points are permanent rewards for completing your profile. They help track your progress!'
        },
        {
          question: 'How do I check my points history?',
          answer: 'Visit the Points page and click on the History tab to see your complete points journey.'
        }
      ]
    },
    {
      id: 'technical',
      title: '🔧 Technical Support',
      icon: '⚙️',
      questions: [
        {
          question: 'The page is not loading properly',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Ensure JavaScript is enabled.'
        },
        {
          question: 'I forgot my password',
          answer: 'Use the "Forgot Password" feature on the login page. A reset link will be sent to your email.'
        },
        {
          question: 'How do I update my email?',
          answer: 'Go to Account Settings → Personal Information → Update Email. Verification required.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-2xl text-white" />,
      title: 'Email Support',
      description: 'Get detailed assistance via email',
      details: 'careerbridge@gmail.com',
      action: 'Send us an email',
      color: 'bg-gradient-to-r from-blue-600 to-indigo-700'
    },
    {
      icon: <FaPhone className="text-2xl text-white" />,
      title: 'Phone Support',
      description: 'Talk directly with our team',
      details: '+91 9886459391',
      action: 'Call now',
      color: 'bg-gradient-to-r from-emerald-600 to-teal-700'
    },
    {
      icon: <FaComments className="text-2xl text-white" />,
      title: 'Live Chat',
      description: 'Instant messaging support',
      details: 'Available 24/7',
      action: 'Start chat',
      color: 'bg-gradient-to-r from-amber-600 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Help & Support
            </h1>
            <p className="text-gray-600 text-sm font-medium">Your success is our priority</p>
          </div>

          {/* Main Content Tabs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'faq', label: 'FAQ', icon: '❓', color: 'from-blue-600 to-indigo-700' },
                { id: 'contact', label: 'Contact', icon: '📞', color: 'from-emerald-600 to-teal-700' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 font-semibold text-sm transition-all duration-300 relative overflow-hidden group ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg mr-2">{tab.icon}</span>
                  {tab.label}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 transform ${
                    activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'
                  } transition-transform duration-300`}></div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 lg:p-8">
              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <HiLightBulb className="text-4xl text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 text-sm font-medium">Quick answers to common questions</p>
                  </div>

                  {faqCategories.map((category) => (
                    <div key={category.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-xl">{category.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {category.title}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {category.questions.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group hover:scale-[1.02] shadow-sm"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-gray-800 font-semibold text-sm mb-2 group-hover:text-blue-600 transition-colors">
                                  {item.question}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium">{item.answer}</p>
                              </div>
                              <FaChevronRight className="text-blue-500 mt-1 text-sm group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <FaComments className="text-4xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Get in Touch
                    </h2>
                    <p className="text-gray-600 text-sm font-medium">We're here to help you 24/7</p>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {contactMethods.map((method, index) => (
                      <div
                        key={index}
                        className={`${method.color} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                            {method.icon}
                          </div>
                          <h3 className="text-lg font-semibold">{method.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm font-medium mb-3">{method.description}</p>
                        <p className="font-semibold text-base mb-4">{method.details}</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 border border-white/30 hover:scale-105 text-sm">
                          {method.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Support */}
          <div className="bg-gradient-to-r from-red-600 to-pink-700 rounded-xl p-8 text-white text-center shadow-lg border border-white/20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaPhone className="text-2xl" />
              <h3 className="text-xl font-semibold">Emergency Support</h3>
            </div>
            <p className="text-sm font-medium mb-6">Need immediate assistance? Our emergency team is here to help 24/7!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm transition-all duration-300 border border-white/30 hover:scale-105">
                📞 Call Emergency Line
              </button>
              <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold text-sm transition-all duration-300 border border-white/30 hover:scale-105">
                🚨 Report Critical Issue
              </button>
            </div>
          </div>

          {/* Centered Back Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-md border border-gray-200"
            >
              <FaArrowLeft className="text-sm" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;