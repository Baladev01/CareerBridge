import { FaBuildingColumns } from "react-icons/fa6";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { PiStudentBold } from "react-icons/pi";
const Features =()=>{
    return(
        <>
        



                       <div className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-4">
                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="text-teal-700 text-sm font-semibold">Uniquely Us</span>
                        </div>
                        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4'>What Makes Us Different </h1>
                        <h2 className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Setting new standards in education and careers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* For Students Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-teal-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <PiStudentBold /> 
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Student Dashboard</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                       Upload your journey, projects, and placement updates. Track your progress and receive financial support throughout your academic career.
                                    </p>
                                </div>
                                
                            </div>
                        </div>

                        {/* For Government Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <FaBuildingColumns />
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Government Monitoring</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                        Comprehensive dashboard with colleges, students, jobs created, and scholarships given. Make informed policy decisions with real-time data.
                                    </p>
                                </div>
                                
                            </div>
                        </div>

                        {/* For Companies Card */}
                        <div className='group relative bg-white rounded-2xl p-8 hover:shadow-2xl shadow-lg border border-slate-200 hover:border-indigo-300 transition-all duration-500 hover:-translate-y-2'>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-2xl md:text-3xl p-4 rounded-2xl shadow-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <HiBuildingOffice2 />
                                </div>
                                <div className="text-center mb-4">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">For Companies</h1>
                                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-center leading-relaxed text-base">
                                        Post your requirements, track the talent pool, and hire students directly. Build your workforce with the best graduates from leading institutions.
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                  
                </div>
            </div>
        </>
    )
}
export default Features;