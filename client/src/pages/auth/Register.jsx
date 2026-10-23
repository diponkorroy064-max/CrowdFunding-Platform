import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Image, Upload, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supporter'); // 'supporter' | 'creator'
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // imgBB Image Upload Handler (Challenge requirement)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage('');
    try {
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (imgbbApiKey && imgbbApiKey !== 'placeholder_imgbb_key') {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        if (res.data?.data?.url) {
          setPhotoURL(res.data.data.url);
        }
      } else {
        // Fallback FileReader preview if imgBB key not supplied
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoURL(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMessage('Could not upload image to imgBB. You can also paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const validatePasswordStrength = (pass) => {
    if (pass.length < 6) return 'Password must be at least 6 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must include at least one lowercase letter.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const passError = validatePasswordStrength(password);
    if (passError) {
      setErrorMessage(passError);
      return;
    }

    setSubmitting(true);
    try {
      const defaultPhoto = photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      const newUser = await registerUser(email, password, name, defaultPhoto, role);

      const grantedCredits = role === 'creator' ? 20 : 50;

      Swal.fire({
        icon: 'success',
        title: 'Account Created Successfully!',
        html: `Welcome, <b>${name}</b>!<br/>You received <b class="text-emerald-600">${grantedCredits} Welcome Credits</b> as a ${role.toUpperCase()}!`,
        confirmButtonColor: '#10b981',
      });

      if (role === 'creator') {
        navigate('/dashboard/creator-home', { replace: true });
      } else {
        navigate('/dashboard/supporter-home', { replace: true });
      }
    } catch (err) {
      console.error(err);
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Join <span className="text-emerald-500">CrowdSpark</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign up and receive free welcome credits to start funding or creating!
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Role Drop-Down */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your Platform Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('supporter')}
                className={`py-3 px-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'supporter'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold text-slate-900">Supporter</span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  🎁 Gets 50 Free Credits
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`py-3 px-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  role === 'creator'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold text-slate-900">Creator</span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  🚀 Gets 20 Free Credits
                </span>
              </button>
            </div>
          </div>

          {/* Profile Picture URL + imgBB Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Picture URL / Upload
              </label>
              <label className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload (imgBB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Image className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
            {uploadingImage && (
              <p className="text-[11px] text-emerald-600 animate-pulse mt-1">Uploading image...</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 chars with Uppercase & Lowercase"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Minimum 6 characters, must include at least 1 uppercase and 1 lowercase letter.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <span className="animate-pulse">Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign In here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
