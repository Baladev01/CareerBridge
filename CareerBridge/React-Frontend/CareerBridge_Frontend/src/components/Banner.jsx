import bannerimage from  '../Images/student.jpg'
import projectdesign from '../Images/bluebanner.png'
import { Link } from "react-router-dom";

const Banner =()=>{

    const styles ={
        image:{animation:"updown 3s ease-in-out infinite"}
    }

    return(
        <>
        <div className='relative flex flex-col lg:flex-row justify-between items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8 sm:p-16 lg:p-26 h-auto lg:h-150 overflow-hidden'>
            {/* Dynamic Background Elements */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-10 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
                <div className='absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000'></div>
                <div className='absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000'></div>
            </div>
            
            {/* Grid Pattern Overlay */}
            <div className='absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-white to-transparent' 
                 style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)'}}></div>

            <div className='relative flex flex-col justify-center items-center mb-8 lg:mb-0 z-10'>
                <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6'>
                    <span className='w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse'></span>
                    <span className='text-teal-300 text-sm font-medium'>TRUSTED BY 10,000+ STUDENTS & COMPANIES</span>
                </div>
                
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold bg-gradient-to-r from-white via-teal-100 to-blue-100 bg-clip-text text-transparent px-4 sm:px-8 lg:px-0 leading-tight mb-6'>
                    Empowering Students, Connecting Companies, <span className='bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent'>Monitoring by Government</span>
                </h1>
                
                <h2 className='text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 m-2 sm:m-4 text-center px-4 sm:px-8 lg:px-4 leading-relaxed font-light max-w-4xl'>
                    One centralized platform where students build their journey, government monitors education and employment, and companies find the right talent.
                </h2>
                
                <div className='flex flex-col sm:flex-row gap-4 items-center'>
                    <Link to="/loginform">
                        <button className='group border-0 p-4 w-48 sm:w-52 rounded-xl m-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold cursor-pointer hover:-translate-y-1 transform transition-all duration-300 text-sm sm:text-base hover:shadow-2xl hover:from-teal-600 hover:to-blue-700 relative overflow-hidden'>
                            <span className='relative z-10'>ENROLL NOW</span>
                            <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </button>
                    </Link>
                    
                    
                </div>
                
                {/* Trust Indicators */}
                <div className='flex flex-wrap justify-center gap-6 mt-8 text-gray-400 text-sm'>
                    <div className='flex items-center'>
                        <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                        <span>Secure & Encrypted</span>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-2 h-2 bg-blue-400 rounded-full mr-2'></div>
                        <span>Government Approved</span>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-2 h-2 bg-purple-400 rounded-full mr-2'></div>
                        <span>24/7 Support</span>
                    </div>
                </div>
            </div>
            
            <div className='relative z-10'>
                <img 
                    style={styles.image} 
                    className='w-full sm:w-4/5 lg:w-110 rounded-3xl shadow-2xl max-w-sm sm:max-w-md lg:max-w-none border-4 border-white/10' 
                    src={bannerimage} 
                    alt="banner-image" 
                />
                {/* Image Glow Effect */}
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 mix-blend-overlay'></div>
            </div>
        </div>
        
        <div className='relative'>
            <img src={projectdesign} alt="banner-image" className='w-full h-auto lg:h-190' />
            <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent'></div>
        </div>

        <style>{`
        @keyframes updown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}
      </style>
       </>
    )

}
export default Banner;