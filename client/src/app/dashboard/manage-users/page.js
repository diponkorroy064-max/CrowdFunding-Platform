"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Coins, 
  ShieldCheck, 
  Trash2, 
  UserCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentName, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      Swal.fire({
        title: 'Role Updated!',
        text: `${currentName}'s role has been changed to ${newRole}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchUsers();
    } catch (err) {
      console.error('Role update error:', err);
      Swal.fire('Error', 'Failed to update user role.', 'error');
    }
  };

  const handleDeleteUser = (userId, name) => {
    Swal.fire({
      title: 'Remove User?',
      text: `Are you sure you want to delete ${name}'s account from the platform?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove User',
      confirmButtonColor: '#e11d48',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/admin/users/${userId}`);
          Swal.fire('Removed', 'User account was deleted.', 'success');
          fetchUsers();
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire('Error', 'Failed to delete user.', 'error');
        }
      }
    });
  };

  if (loading) {
    return <LoadingSpinner text="Fetching platform users..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" />
          Manage Platform Users
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervise user permissions, adjust roles (Admin, Creator, Supporter), and inspect credit balances.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6 font-bold">User</th>
                <th className="py-4 px-6 font-bold">Email</th>
                <th className="py-4 px-6 font-bold">Role Selector</th>
                <th className="py-4 px-6 font-bold">Credits</th>
                <th className="py-4 px-6 font-bold">Joined Date</th>
                <th className="py-4 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {u.name || 'Member'}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {u.role || 'supporter'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={u.role || 'supporter'}
                      onChange={(e) => handleRoleChange(u._id, u.name, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-emerald-500" />
                      {u.credits ?? 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Seed'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
