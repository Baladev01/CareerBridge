import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {  IoLogoTwitter } from "react-icons/io";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    const handleLinkClick = (section) => {
        // You can add functionality for each link here
        console.log(`Clicked: ${section}`);
        // Example: navigate to different pages or show modals
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
                
                <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
                    {/* Main footer content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-lg">CB</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Career Bridge</h2>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Building bridges between talent and opportunity. Empowering careers through innovative solutions and dedicated support.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center">
                            <h3 className="text-white font-semibold text-lg mb-4 border-b border-gray-600 pb-2 inline-block">Quick Links</h3>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => handleLinkClick('About')}
                                    className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 hover:underline w-full text-center md:text-left"
                                >
                                    About Us
                                </button>
                                <button 
                                    onClick={() => handleLinkClick('Privacy')}
                                    className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 hover:underline w-full text-center md:text-left"
                                >
                                    Privacy Policy
                                </button>
                                <button 
                                    onClick={() => handleLinkClick('Terms')}
                                    className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 hover:underline w-full text-center md:text-left"
                                >
                                    Terms & Conditions
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="text-center md:text-right">
                            <h3 className="text-white font-semibold text-lg mb-4 border-b border-gray-600 pb-2 inline-block">Get In Touch</h3>
                            <div className="space-y-2 text-gray-300">
                                <p className="hover:text-white transition-colors duration-300">
                                    📧 support@careerbridge.com
                                </p>
                                <p className="hover:text-white transition-colors duration-300">
                                    📞 +91 9886459391
                                </p>
                                {/* <p className="text-sm">
                                    Mon - Fri: 9:00 AM - 6:00 PM
                                </p> */}
                            </div>
                        </div>
                    </div>

                    {/* Social Links & Additional Navigation */}
                    <div className="border-t border-gray-600 pt-8 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            {/* Social Media Icons */}
                            <div className="flex space-x-4">
                                {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                                    <button
                                        key={social}
                                        className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 transform hover:scale-110 transition-all duration-300"
                                        aria-label={social}
                                    >
                                        <span className="text-sm font-semibold">
                                            {social === 'Facebook' && <FaFacebookF />}
                                            {social === 'Twitter' && <IoLogoTwitter />}
                                            {social === 'LinkedIn' && <FaLinkedinIn />}
                                            {social === 'Instagram' && <FaInstagram />}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Additional Links */}
                            {/* <div className="flex flex-wrap justify-center gap-4">
                                {['Support', 'Careers', 'Blog', 'FAQ'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => handleLinkClick(item)}
                                        className="text-gray-300 hover:text-white text-sm transition-colors duration-300 hover:underline"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div> */}

                            {/* Back to Top Button */}
                            <button
                                onClick={scrollToTop}
                                className="bg-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                            >
                                <span>Back to Top</span>
                                <span>↑</span>
                            </button>
                        </div>
                    </div>

                   
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>
            </div>
            
            {/* Copyright Section - Enhanced */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center py-4">
                        <h3 className="text-white text-center md:text-left text-sm mb-2 md:mb-0">
                            © {currentYear} Career Bridge. All Rights Reserved.
                        </h3>
                        <div className="flex space-x-6 text-xs text-gray-400">
                            <span>Made with  for job seekers</span>
                            <span>•</span>
                            <span>Building better careers</span>
                        </div>
                    </div>
                </div>
                
                {/* Animated progress bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-pulse"></div>
            </div>
        </>
    );
};

export default Footer;