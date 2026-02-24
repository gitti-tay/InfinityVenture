import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminKYCScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingKYC();
      setUsers(res.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (userId: string) => {
    if (!confirm('Approve this user\'s KYC?')) return;
    await adminApi.approveKYC(userId);
    load();
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    await adminApi.rejectKYC(userId, reason);
    load();
  };

  return (
    <AdminLayout>
      <div className="bg-slate-900 rounded-xl border border-slate-800">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-slate-400">No pending KYC reviews</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {users.map(u => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-white font-medium">{u.full_name}</p>
                  <p className="text-slate-400 text-sm">{u.email}</p>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500">
                    <span>Phone: {u.phone || '—'}</span>
                    <span>Docs: {u.doc_count || 0}</span>
                    <span>Joined: {new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(u.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                    ✓ Approve
                  </button>
                  <button onClick={() => handleReject(u.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
