import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegisterUserMutation, useGetPublicPataksQuery } from '../store/api/apiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlineIdentification, HiOutlinePhotograph, HiOutlineCalendar, 
  HiOutlineOfficeBuilding, HiCheckCircle
} from 'react-icons/hi';

export default function UserRegistrationPage() {
  const { referralCode } = useParams();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { data: pataks = [], isLoading: isLoadingPataks } = useGetPublicPataksQuery();

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
    if (!formData.patakId) return setError('Please select a Patak (Organization).');
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
          className="absolute -left-[10%] md:-left-[5%] top-[2%] md:top-[5%] h-[70vh] md:h-[85vh] object-contain mix-blend-multiply opacity-70" 
        />
        <img 
          src="/dhol-player.jpg" 
          alt="Dhol Player Right" 
          className="absolute -right-[10%] md:-right-[5%] top-[2%] md:top-[5%] h-[70vh] md:h-[85vh] object-contain mix-blend-multiply opacity-70 transform scale-x-[-1]" 
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
              <div className="card-body p-6 md:p-8">
                {error && (
                  <div className="alert alert-error mb-6 rounded-lg text-sm">
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-base-200 pb-2">Organization Details</h3>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Select Patak (Organization) *</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-base-content/40" />
                        <select
                          name="patakId"
                          className="grow bg-transparent outline-none"
                          value={formData.patakId}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            {isLoadingPataks ? 'Loading Pataks...' : '-- Select Your Patak --'}
                          </option>
                          {pataks.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-base-200 pb-2 mt-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Full Name *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineUser className="w-5 h-5 text-base-content/40" />
                          <input type="text" name="fullName" className="grow" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Email Address *</span>
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
                        <label className="label">
                          <span className="label-text font-medium">Contact Number *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlinePhone className="w-5 h-5 text-base-content/40" />
                          <input type="tel" name="phone" className="grow" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Date of Birth *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineCalendar className="w-5 h-5 text-base-content/40" />
                          <input type="date" name="dob" className="grow" value={formData.dob} onChange={handleChange} required />
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Gender *</span>
                        </label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Male" className="radio radio-primary radio-sm" onChange={handleChange} required />
                            <span>Male</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Female" className="radio radio-primary radio-sm" onChange={handleChange} required />
                            <span>Female</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="gender" value="Other" className="radio radio-primary radio-sm" onChange={handleChange} required />
                            <span>Other</span>
                          </label>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Blood Group *</span>
                        </label>
                        <select name="bloodGroup" className="select select-bordered focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full" value={formData.bloodGroup} onChange={handleChange} required>
                          <option value="" disabled>Select Blood Group</option>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text font-medium">Address *</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                          <HiOutlineLocationMarker className="w-5 h-5 text-base-content/40" />
                          <input type="text" name="address" className="grow" placeholder="Full Address" value={formData.address} onChange={handleChange} required />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Identity & Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-base-200 pb-2 mt-4">Identity & Documents</h3>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Aadhar Card Number *</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                        <HiOutlineIdentification className="w-5 h-5 text-base-content/40" />
                        <input type="text" name="aadharNo" className="grow" placeholder="1234 5678 9012" value={formData.aadharNo} onChange={handleChange} required minLength={12} maxLength={12} />
                      </label>
                      <label className="label pb-0">
                        <span className="label-text-alt text-base-content/60">Enter 12-digit Aadhar number without spaces</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Upload Aadhar Card *</span>
                        </label>
                        <input 
                          type="file" 
                          name="aadharImage"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="file-input file-input-bordered file-input-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full" 
                          required 
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Upload Passport Photo *</span>
                        </label>
                        <input 
                          type="file" 
                          name="passportPhoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="file-input file-input-bordered file-input-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="btn btn-success text-white w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner"></span>
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
