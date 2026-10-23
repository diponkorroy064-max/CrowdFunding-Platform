"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  User, 
  Upload, 
  ArrowRight, 
  HeartHandshake, 
  Rocket,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function RegisterFormClient() {
  const router = useRouter();
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supporter');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Invalid File', 'Please select a valid image file (JPG, PNG, WEBP, GIF, SVG, AVIF, etc.)', 'warning');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToMulter = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
    const res = await axios.post(`${apiBase}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data?.success && res.data?.url) {
      return res.data.url;
    }
    throw new Error(res.data?.message || 'Multer file upload failed');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      Swal.fire('Missing Information', 'Please complete all required fields.', 'warning');
      return;
    }

    if (password.length < 6) {
      Swal.fire('Weak Password', 'Password must be at least 6 characters long.', 'warning');
      return;
    }

    setSubmitting(true);
    let photoURL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    try {
      if (imageFile) {
        setUploadingImage(true);
        photoURL = await uploadImageToMulter(imageFile);
        setUploadingImage(false);
      }

      await registerUser(email, password, name, photoURL, role);

      const bonusCredits = role === 'creator' ? 20 : 50;

      Swal.fire({
        title: 'Registration Complete!',
        text: `Welcome to CrowdSpark, ${name}! As a new ${role}, you received ${bonusCredits} bonus credits!`,
        icon: 'success',
        confirmButtonColor: '#059669',
      });

      if (role === 'creator') {
        router.push('/dashboard/creator-home');
      } else {
        router.push('/dashboard/supporter-home');
      }
    } catch (err) {
      console.error('Registration error:', err);
      Swal.fire('Registration Error', err.message || 'Failed to complete registration.', 'error');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
      <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80">
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Choose Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Supporter Option */}
              <div
                onClick={() => setRole('supporter')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-start ${
                  role === 'supporter'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <HeartHandshake className={`w-5 h-5 ${role === 'supporter' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    +50 Credits
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-900">Supporter</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Fund impactful campaigns</span>
              </div>

              {/* Creator Option */}
              <div
                onClick={() => setRole('creator')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-start ${
                  role === 'creator'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Rocket className={`w-5 h-5 ${role === 'creator' ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    +20 Credits
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-900">Creator</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Launch innovative projects</span>
              </div>

            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-slate-50/50"
                required
              />
            </div>
          </div>

          {/* Profile Image Upload (Multer) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Profile Avatar (Multer File Upload: JPG, PNG, WEBP, GIF, SVG, AVIF)
            </label>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-600">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>{imageFile ? imageFile.name : 'Choose Image File to Upload'}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Converted into a static URL via Express Multer storage.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>
              {uploadingImage
                ? 'Uploading Avatar via Multer...'
                : submitting
                ? 'Creating Account...'
                : `Sign Up as ${role === 'creator' ? 'Creator (+20 Credits)' : 'Supporter (+50 Credits)'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 pt-4 border-t border-slate-100">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
