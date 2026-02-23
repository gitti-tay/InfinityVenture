import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './admin-layout';
import { adminClient } from '@/app/api/adminClient';

export function AdminComplianceScreen() {
  const [flags, setFlags] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, open: 0, critical: 0, high: 0 });
  const [filter, setFilter] = useState<string>('open');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadFlags = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminClient.get(`/compliance/admin/flags?status=${filter}&limit=100`);
      setFlags(res.flags || []);
      setStats(res.stats || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadFlags(); }, [loadFlags]);

  const updateFlag = async (id: string, status: string, note?: string) => {
    setUpdating(id);
    try {
      await adminClient.put(`/compliance/admin/flags/${id}`, { status, resolutionNote: note });
      loadFlags();
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  const runAMLScan = async () => {
    if (!confirm('Run AML scan on all transactions from last 24 hours?')) return;
    try {
      const res = await adminClient.post('/compliance/admin/aml-scan');
      alert(`Scanned ${res.scanned} transactions. ${res.flagsRaised} new flags raised.`);
      loadFlags();
    } catch (e) { alert('Error running scan'); }
  };

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'open': return 'bg-red-50 text-red-700';
      case 'investigating': return 'bg-yellow-50 text-yellow-700';
      case 'resolved': return 'bg-green-50 text-green-700';
      case 'dismissed': return 'bg-gray-50 text-gray-500';
      case 'escalated': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <AdminLayout title="Compliance & AML">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-sm text-gray-500">Total Flags</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500">Open</div>
          <div className="text-2xl font-bold text-red-600">{stats.open}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm border-l-4 border-l-red-700">
          <div className="text-sm text-gray-500">Critical</div>
          <div className="text-2xl font-bold text-red-800">{stats.critical}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm border-l-4 border-l-orange-500">
          <div className="text-sm text-gray-500">High Priority</div>
          <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-white border rounded-lg p-1">
          {['open', 'investigating', 'resolved', 'dismissed', 'escalated'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={runAMLScan}
          className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
          🔍 Run AML Scan
        </button>
      </div>

      {/* Flags List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : flags.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border">
          <div className="text-4xl mb-2">✅</div>
          <div className="font-medium">No {filter} flags</div>
        </div>
      ) : (
        <div className="space-y-3">
          {flags.map(flag => (
            <div key={flag.id} className={`bg-white rounded-xl border p-4 ${flag.severity === 'critical' ? 'border-red-300 ring-1 ring-red-200' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${severityColor(flag.severity)}`}>
                    {flag.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(flag.status)}`}>
                    {flag.status}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{flag.flag_type}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(flag.created_at).toLocaleString()}</span>
              </div>

              <div className="text-sm text-gray-800 mb-2">{flag.description}</div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>👤 {flag.user_email || flag.user_id}</span>
                {flag.user_name && <span>({flag.user_name})</span>}
                <span className={`px-1.5 py-0.5 rounded ${flag.kyc_status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  KYC: {flag.kyc_status || 'none'}
                </span>
              </div>

              {flag.status === 'open' && (
                <div className="flex gap-2 pt-2 border-t">
                  <button onClick={() => updateFlag(flag.id, 'investigating')}
                    disabled={updating === flag.id}
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600 disabled:opacity-50">
                    Investigate
                  </button>
                  <button onClick={() => {
                    const note = prompt('Resolution note:');
                    if (note !== null) updateFlag(flag.id, 'resolved', note);
                  }} disabled={updating === flag.id}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                    Resolve
                  </button>
                  <button onClick={() => {
                    const note = prompt('Dismissal reason:');
                    if (note !== null) updateFlag(flag.id, 'dismissed', note);
                  }} disabled={updating === flag.id}
                    className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs font-medium hover:bg-gray-500 disabled:opacity-50">
                    Dismiss
                  </button>
                  <button onClick={() => updateFlag(flag.id, 'escalated')}
                    disabled={updating === flag.id}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 disabled:opacity-50">
                    Escalate
                  </button>
                </div>
              )}

              {flag.status === 'investigating' && (
                <div className="flex gap-2 pt-2 border-t">
                  <button onClick={() => {
                    const note = prompt('Resolution note:');
                    if (note !== null) updateFlag(flag.id, 'resolved', note);
                  }} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">
                    Resolve
                  </button>
                  <button onClick={() => updateFlag(flag.id, 'escalated')}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700">
                    Escalate
                  </button>
                </div>
              )}

              {flag.resolution_note && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <strong>Note:</strong> {flag.resolution_note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
