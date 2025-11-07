import { useState, useEffect } from 'react';
import image1 from '../Images/add1.png';
import image2 from '../Images/add2.png';
import image3 from '../Images/add3.png';

const Advertisement = () => {
    const [currentAd, setCurrentAd] = useState(0);

    // Advertisement data - replace these with your actual image paths
    const advertisements = [
        {
            id: 1,
            image: image1 , // Replace with your image path
            alt: "Image"
            
        },
        {
            id: 2,
            image: image2 , // Replace with your image path
            alt: "Image"
            
        },
        {
            id: 3,
            image: image3 , // Replace with your image path
            alt: "Image"
        }
    ];

    // Auto-rotate advertisements every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAd((prev) => (prev + 1) % advertisements.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [advertisements.length]);

    // Manual navigation functions
    const nextAd = () => {
        setCurrentAd((prev) => (prev + 1) % advertisements.length);
    };

    const prevAd = () => {
        setCurrentAd((prev) => (prev - 1 + advertisements.length) % advertisements.length);
    };

    const goToAd = (index) => {
        setCurrentAd(index);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Advertisement Banner */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group">
                {/* Main Advertisement Image */}
                <div className="relative h-64 md:h-80 lg:h-96 w-full">
                    {advertisements.map((ad, index) => (
                        <a
                            key={ad.id}
                            href={ad.link}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                                index === currentAd ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={ad.image}
                                alt={ad.alt}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors duration-300"></div>
                        </a>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevAd}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Previous advertisement"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextAd}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    aria-label="Next advertisement"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {advertisements.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToAd(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentAd 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to advertisement ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div 
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ 
                            width: `${((currentAd + 1) / advertisements.length) * 100}%` 
                        }}
                    />
                </div>
            </div>

            {/* Optional: Advertisement Info */}
            
        </div>
    );
};

export default Advertisement;