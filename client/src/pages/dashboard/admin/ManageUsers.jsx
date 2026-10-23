import React, { useState, useEffect } from 'react';
import { Users, Trash2, ShieldCheck, UserCheck, Coins, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import apiClient from '../../../api/apiClient';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.warn('Fallback users list:', err);
      setUsers([
        {
          _id: 'u1',
          name: 'Diponkor Roy (Admin)',
          email: 'admin@crowdspark.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          role: 'admin',
          credits: 1000
        },
        {
          _id: 'u2',
          name: 'Sarah Jenkins (Creator)',
          email: 'creator@crowdspark.com',
          photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          role: 'creator',
          credits: 20
        },
        {
          _id: 'u3',
          name: 'Priya Sharma (Supporter)',
          email: 'supporter@crowdspark.com',
          photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          role: 'supporter',
          credits: 50
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Role Change (Dropdown field)
  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      Swal.fire({
        icon: 'success',
        title: 'Role Updated!',
        text: `User role has been changed to ${newRole.toUpperCase()}.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update user role.', 'error');
    }
  };

  // Handle Remove User (Delete from server)
  const handleRemoveUser = async (u) => {
    const result = await Swal.fire({
      title: 'Remove User?',
      html: `Are you sure you want to delete user <b>${u.name}</b> (${u.email}) from the server database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete User'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/users/${u._id}`);
        setUsers((prev) => prev.filter((item) => item._id !== u._id));
        Swal.fire({
          icon: 'success',
          title: 'User Deleted',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to remove user.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Platform Users
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying all registered members, roles, and available platform credits.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
          {users.length} Registered Users
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Current Credits</th>
                <th className="py-4 px-6">Assigned Role (Dropdown)</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <span className="font-bold text-slate-900">{u.name || 'Member'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600">
                    {u.email}
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">
                    {u.credits ?? 0} Credits
                  </td>
                  <td className="py-4 px-6">
                    {/* Role Dropdown (Page 11 Requirement) */}
                    <select
                      value={u.role?.toLowerCase() || 'supporter'}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleRemoveUser(u)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Remove User from Server"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
};

export default ManageUsers;
