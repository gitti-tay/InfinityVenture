import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminAuditScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminApi.getAuditLogs({ action: filter || undefined, limit: 200 })
      .then(res => { setLogs(res.logs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const actionColors: Record<string, string> = {
    'user.suspend': 'text-red-400',
    'user.unsuspend': 'text-emerald-400',
    'kyc.approve': 'text-emerald-400',
    'kyc.reject': 'text-red-400',
    'admin.deposit.approve': 'text-emerald-400',
    'admin.deposit.reject': 'text-red-400',
    'admin.withdraw.approve': 'text-emerald-400',
    'admin.withdraw.reject': 'text-red-400',
    'admin.balance_adjust': 'text-amber-400',
    'admin.settings.update': 'text-blue-400',
    'admin.wallet.create': 'text-blue-400',
    'transaction.deposit': 'text-emerald-400',
    'transaction.withdraw': 'text-orange-400',
  };

  return (
    <AdminLayout>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'admin', 'kyc', 'transaction', 'user'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {f || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No audit logs found</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {logs.map(log => (
              <div key={log.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-medium ${actionColors[log.action] || 'text-slate-300'}`}>
                      {log.action}
                    </span>
                    {log.resourceType && (
                      <span className="text-xs text-slate-600">→ {log.resourceType}</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    by {log.userName || log.userEmail || 'system'}
                    {log.ipAddress && <span className="ml-2 font-mono">[{log.ipAddress}]</span>}
                  </p>
                  {log.details && typeof log.details === 'object' && (
                    <p className="text-slate-600 text-xs font-mono mt-0.5 truncate max-w-md">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <span className="text-slate-600 text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
