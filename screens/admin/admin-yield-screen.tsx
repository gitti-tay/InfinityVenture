import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import api from '@/app/api/client';

export function AdminYieldScreen() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [stats, setStats] = useState({ totalPaid: 0, activeInvestments: 0, monthlyProjection: 0 });

  const loadPayouts = async () => {
    try {
      const res = await api.request('GET', '/admin/yield-payouts');
      setPayouts(res.payouts || []);

      // Calculate stats
      const dashboard = await api.request('GET', '/admin/dashboard');
      const totalPaid = (res.payouts || []).reduce((s: number, p: any) => s + p.amount, 0);
      setStats({
        totalPaid,
        activeInvestments: dashboard.dashboard?.stats?.activeInvestments || 0,
        monthlyProjection: totalPaid / Math.max(1, new Set((res.payouts || []).map((p: any) => p.period)).size),
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadPayouts(); }, []);

  const handleTriggerPayout = async () => {
    if (!confirm('This will calculate and credit monthly yield for ALL active investments. Proceed?')) return;
    setTriggering(true);
    try {
      const res = await api.request('POST', '/admin/yield-payouts/trigger');
      setLastResult(res);
      loadPayouts();
    } catch (e: any) { alert(e.message); }
    setTriggering(false);
  };

  return (
    <AdminLayout title="Yield Engine">
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Total Yield Paid</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#059669', marginTop: 4 }}>${stats.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Active Investments</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>{stats.activeInvestments}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Avg Monthly Payout</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed', marginTop: 4 }}>${stats.monthlyProjection.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Total Payouts</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#374151', marginTop: 4 }}>{payouts.length}</div>
          </div>
        </div>

        {/* Trigger Payout */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Manual Yield Payout</h3>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>Trigger monthly yield calculation and distribution for all active investments. Each investment receives (amount × APY / 12). Duplicate payouts for the same period are automatically prevented.</p>
          <button onClick={handleTriggerPayout} disabled={triggering} style={{ padding: '12px 24px', background: triggering ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            {triggering ? '⏳ Processing payouts...' : '💰 Trigger Monthly Payout'}
          </button>
          {lastResult && (
            <div style={{ marginTop: 16, padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>Payout Complete</p>
              <p style={{ fontSize: 13, color: '#166534' }}>Investments paid: {lastResult.investmentsPaid} · Total: ${lastResult.totalPaid?.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Payout History */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Payout History</h3>
          </div>
          {loading ? <p style={{ padding: 20 }}>Loading...</p> : payouts.length === 0 ? (
            <p style={{ padding: 20, color: '#888', textAlign: 'center' }}>No payouts yet. Trigger a manual payout or set up automated scheduling.</p>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>User</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Project</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#374151' }}>Amount</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Period</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{p.full_name}</div>
                        <div style={{ color: '#888', fontSize: 11 }}>{p.email}</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>{p.project_name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#059669' }}>${p.amount.toFixed(2)}</td>
                      <td style={{ padding: '10px 16px' }}>{p.period}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: p.status === 'completed' ? '#dcfce7' : '#fef3c7', color: p.status === 'completed' ? '#166534' : '#92400e' }}>{p.status}</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#666' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
