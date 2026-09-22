import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/api/apiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineGlobe, HiOutlineRefresh, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Captcha State
  const [captchaText, setCaptchaText] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaText(`${num1} + ${num2} = ?`);
    setCaptchaAnswer((num1 + num2).toString());
    setUserCaptcha('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (userCaptcha !== captchaAnswer) {
      setErrorMsg('Invalid Captcha. Please solve the math problem correctly.');
      generateCaptcha();
      return;
    }

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ admin: userData.admin, token: userData.token }));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.data?.error || 'Login failed. Please try again.');
      generateCaptcha();
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
        <div className="card w-full max-w-md bg-base-100/95 backdrop-blur-md shadow-2xl border border-base-content/5">
          <div className="card-body px-6 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg shadow-primary/25">
              <HiOutlineGlobe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate pb-1">
              Guinness Book of World Record
            </h1>
            <p className="text-base-content/50 text-sm mt-2">Admin Portal — Sign in to continue</p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="alert alert-error mb-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Email Address</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20">
                <HiOutlineMail className="w-5 h-5 text-base-content/40" />
                <input
                  type="email"
                  className="grow"
                  placeholder="admin@worldrecord.com"
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address (e.g., user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Password</span>
              </label>
              <label className="input input-bordered w-full flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 relative">
                <HiOutlineLockClosed className="w-5 h-5 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </label>
              <label className="label justify-end pb-0">
                <Link to="/forgot-password" className="label-text-alt link link-primary font-medium">
                  Forgot Password?
                </Link>
              </label>
            </div>

            {/* Math Captcha */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Security Check</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-base-200/80 h-12 flex items-center justify-center px-4 rounded-lg font-mono font-bold tracking-widest border border-base-content/10 shadow-inner select-none flex-none text-center text-base-content/80">
                  {captchaText}
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 font-mono text-center grow"
                  placeholder="Answer"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="btn btn-square btn-outline border-base-content/20 hover:bg-base-200 hover:text-base-content flex-none h-12 w-12"
                  title="Reload Captcha"
                >
                  <HiOutlineRefresh className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full mt-4 text-base font-semibold shadow-lg shadow-primary/25 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


        </div>
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
