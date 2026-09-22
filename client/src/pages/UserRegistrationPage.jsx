import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegisterUserMutation, useGetPublicPathaksQuery } from '../store/api/apiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlineIdentification, HiOutlinePhotograph, HiOutlineCalendar, 
  HiOutlineOfficeBuilding, HiCheckCircle
} from 'react-icons/hi';

export default function UserRegistrationPage() {
  const { referralCode } = useParams();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { data: pataks = [], isLoading: isLoadingPataks } = useGetPublicPathaksQuery();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    patakId: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    aadharNo: '',
  });

  const [files, setFiles] = useState({
    aadharImage: null,
    passportPhoto: null,
  });

  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.patakId) return setError('Please Select a pathak (Organization).');
    if (!files.aadharImage || !files.passportPhoto) return setError('Both Aadhar image and Passport photo are required.');
    
    // Prepare FormData for file upload
    const submitData = new FormData();
    submitData.append('referralCode', referralCode);
    
    // Append text fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Append files
    submitData.append('aadharImage', files.aadharImage);
    submitData.append('passportPhoto', files.passportPhoto);

    try {
      await registerUser(submitData).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setError(err?.data?.error || 'Failed to register. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 via-base-200 to-base-300 relative overflow-hidden">
      {/* Background decoration with Dhol Players */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/dhol-player.jpg" 
          alt="Dhol Player Left" 
          className="absolute object-contain mix-blend-multiply transition-all duration-500 opacity-40 sm:opacity-50 md:opacity-60 lg:opacity-70 w-[55vw] h-auto -left-[10vw] top-[2%] sm:w-[50vw] sm:-left-[15vw] sm:top-[5%] md:w-[45vw] md:-left-[15vw] md:top-[10%] lg:w-auto lg:h-[85vh] lg:-left-[5%] lg:top-[5%]" 
        />
        <img 
          src="/dhol-player.jpg" 
          alt="Dhol Player Right" 
          className="absolute object-contain mix-blend-multiply transform scale-x-[-1] transition-all duration-500 opacity-40 sm:opacity-50 md:opacity-60 lg:opacity-70 w-[55vw] h-auto -right-[10vw] top-[2%] sm:w-[50vw] sm:-right-[15vw] sm:top-[5%] md:w-[45vw] md:-right-[15vw] md:top-[10%] lg:w-auto lg:h-[85vh] lg:-right-[5%] lg:top-[5%]" 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8 relative z-10 w-full">
        <div className="w-full max-w-3xl relative z-10">
        {/* No outside header, just the form card */}
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card bg-base-100/95 backdrop-blur-md shadow-2xl border border-base-content/5"
            >
              <div className="card-body px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8">
                {/* Header inside card */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
                    Pathak Member Registration
                  </h2>
                  <p className="text-sm text-base-content/50 mt-1">Please fill in your details accurately.</p>
                </div>

                {error && (
                  <div className="alert alert-error mb-4 rounded-lg text-sm shadow-sm py-2">
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Organization Details */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold border-b border-base-200 pb-2 text-primary uppercase tracking-wider">Organization Details</h3>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Select Pathak (Organization) *</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-base-content/40" />
                        <select
                          name="patakId"
                          className="grow bg-transparent outline-none cursor-pointer"
                          value={formData.patakId}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            {isLoadingPataks ? 'Loading Pataks...' : '-- Select Your Pathak --'}
                          </option>
                          {pataks.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold border-b border-base-200 pb-2 mt-4 text-primary uppercase tracking-wider">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Full Name *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineUser className="w-5 h-5 text-base-content/40" />
                          <input type="text" name="fullName" className="grow" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Email Address *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineMail className="w-5 h-5 text-base-content/40" />
                          <input 
                            type="email" 
                            name="email" 
                            className="grow" 
                            placeholder="john@example.com" 
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                            title="Please enter a valid email address (e.g., user@example.com)"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Contact Number *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlinePhone className="w-5 h-5 text-base-content/40" />
                          <input type="tel" name="phone" className="grow" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Date of Birth *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineCalendar className="w-5 h-5 text-base-content/40" />
                          <input type="date" name="dob" className="grow text-base-content/80 uppercase" value={formData.dob} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Gender *</span>
                        </label>
                        <div className="flex bg-base-100 border border-base-content/20 rounded-lg h-12 items-center px-4 gap-6 shadow-sm">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="gender" value="Male" className="radio radio-primary radio-sm group-hover:border-primary" onChange={handleChange} required />
                            <span className="text-sm font-medium">Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="gender" value="Female" className="radio radio-primary radio-sm group-hover:border-primary" onChange={handleChange} required />
                            <span className="text-sm font-medium">Female</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="gender" value="Other" className="radio radio-primary radio-sm group-hover:border-primary" onChange={handleChange} required />
                            <span className="text-sm font-medium">Other</span>
                          </label>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Blood Group *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full pr-0">
                          <div className="w-5 h-5 rounded-full bg-error/10 text-error flex items-center justify-center font-bold text-[10px]">AB</div>
                          <select name="bloodGroup" className="grow bg-transparent outline-none cursor-pointer" value={formData.bloodGroup} onChange={handleChange} required>
                            <option value="" disabled>Select Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      
                      <div className="form-control md:col-span-2">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Address *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineLocationMarker className="w-5 h-5 text-base-content/40" />
                          <input type="text" name="address" className="grow" placeholder="Full residential address" value={formData.address} onChange={handleChange} required />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Identity & Documents */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold border-b border-base-200 pb-2 mt-4 text-primary uppercase tracking-wider">Identity & Documents</h3>
                    
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Aadhar Card Number *</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                        <HiOutlineIdentification className="w-5 h-5 text-base-content/40" />
                        <input type="text" name="aadharNo" className="grow font-mono tracking-widest" placeholder="123456789012" value={formData.aadharNo} onChange={handleChange} required minLength={12} maxLength={12} />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Aadhar Document *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full p-0 overflow-hidden">
                          <input 
                            type="file" 
                            name="aadharImage"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="file-input file-input-ghost w-full h-full text-sm outline-none" 
                            required 
                          />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Passport Photo *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full p-0 overflow-hidden">
                          <input 
                            type="file" 
                            name="passportPhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input file-input-ghost w-full h-full text-sm outline-none" 
                            required 
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`btn bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-lg hover:shadow-primary/30 w-full mt-2 text-base font-semibold shadow-md transition-all ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Submitting...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="card bg-base-100 shadow-xl border border-success/20 overflow-hidden max-w-md mx-auto w-full"
            >
              <div className="card-body items-center text-center p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6"
                >
                  <HiCheckCircle className="w-16 h-16" />
                </motion.div>
                
                <h2 className="text-3xl font-bold mb-2">Registration Successful!</h2>
                <p className="text-base-content/70 max-w-md mx-auto mb-8">
                  Thank you for registering. Your details have been securely saved in our database and linked to the organization.
                </p>
                
                <div className="p-4 bg-base-200 rounded-xl border border-base-content/10 w-full max-w-sm mb-6">
                  <div className="text-sm text-base-content/60 mb-1">Registration ID / Name</div>
                  <div className="font-semibold text-lg">{formData.fullName}</div>
                </div>

                <Link to="/" className="btn btn-outline btn-sm">
                  Go to Homepage
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Separated Footer */}
      <div className="relative z-20 text-center text-xs sm:text-sm text-base-content/80 font-medium py-4 bg-base-100/40 backdrop-blur-sm border-t border-base-content/10 w-full">
        <p>
          Designed & Developed by <a href="https://veaglespace.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline drop-shadow-md">Veagle Space Technology Pvt. Ltd.</a>
          <span className="hidden sm:inline px-2">|</span>
          <span className="block sm:inline mt-1 sm:mt-0">© 2026 All Rights Reserved.</span>
        </p>
      </div>
    </div>
  );
}
