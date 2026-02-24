import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import api from '@/app/api/client';

export function AdminSupportScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('');

  const loadTickets = async () => {
    try {
      const qs = filter ? `?status=${filter}` : '';
      const res = await api.request('GET', `/admin/support/tickets${qs}`);
      setTickets(res.tickets || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, [filter]);

  const loadTicketDetail = async (id: string) => {
    try {
      const res = await api.request('GET', `/support/tickets/${id}`);
      setSelectedTicket(res.ticket);
      setMessages(res.messages || []);
    } catch (e: any) {
      // If user-scoped, try admin approach
      const ticket = tickets.find(t => t.id === id);
      setSelectedTicket(ticket);
      setMessages([]);
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await api.request('POST', `/admin/support/tickets/${selectedTicket.id}/reply`, { message: reply });
      setReply('');
      loadTicketDetail(selectedTicket.id);
      loadTickets();
    } catch (e: any) { alert(e.message); }
    setSending(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.request('PUT', `/admin/support/tickets/${id}/status`, { status });
      loadTickets();
      if (selectedTicket?.id === id) setSelectedTicket((t: any) => ({ ...t, status }));
    } catch (e: any) { alert(e.message); }
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    open: { bg: '#dbeafe', text: '#1e40af' },
    in_progress: { bg: '#fef3c7', text: '#92400e' },
    waiting: { bg: '#f3e8ff', text: '#6b21a8' },
    resolved: { bg: '#dcfce7', text: '#166534' },
    closed: { bg: '#f3f4f6', text: '#374151' },
  };

  const priorityColors: Record<string, string> = {
    urgent: '#ef4444', high: '#f97316', normal: '#3b82f6', low: '#6b7280',
  };

  return (
    <AdminLayout title="Support Tickets">
      <div style={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
        {/* Ticket List */}
        <div style={{ width: 400, borderRight: '1px solid #e5e7eb', overflow: 'auto', background: '#fff' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Tickets ({tickets.length})</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['', 'open', 'in_progress', 'waiting', 'resolved', 'closed'].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: filter === s ? '2px solid #2563eb' : '1px solid #d1d5db', background: filter === s ? '#eff6ff' : '#fff', cursor: 'pointer', fontWeight: filter === s ? 600 : 400 }}>{s || 'All'}</button>
              ))}
            </div>
          </div>
          {loading ? <p style={{ padding: 16 }}>Loading...</p> : tickets.length === 0 ? (
            <p style={{ padding: 16, color: '#888' }}>No tickets found</p>
          ) : tickets.map(t => (
            <div key={t.id} onClick={() => loadTicketDetail(t.id)} style={{ padding: 16, borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: selectedTicket?.id === t.id ? '#eff6ff' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{t.subject}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColors[t.priority] || '#6b7280', flexShrink: 0, marginTop: 6 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#666' }}>{t.user_name || t.user_email}</span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: statusColors[t.status]?.bg || '#f3f4f6', color: statusColors[t.status]?.text || '#374151' }}>{t.status}</span>
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{t.category} · {t.message_count} msgs · {new Date(t.updated_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>

        {/* Ticket Detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
          {!selectedTicket ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Select a ticket to view details</div>
          ) : (
            <>
              <div style={{ padding: 20, background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedTicket.subject}</h3>
                    <p style={{ color: '#666', fontSize: 13 }}>{selectedTicket.user_name || selectedTicket.user_email} · {selectedTicket.category} · {selectedTicket.priority} priority</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                      <button key={s} onClick={() => handleStatusChange(selectedTicket.id, s)} style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, border: selectedTicket.status === s ? '2px solid #2563eb' : '1px solid #d1d5db', background: selectedTicket.status === s ? '#eff6ff' : '#fff', cursor: 'pointer', fontWeight: selectedTicket.status === s ? 600 : 400 }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
                {messages.map(m => (
                  <div key={m.id} style={{ marginBottom: 16, display: 'flex', justifyContent: m.is_admin ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: 12, borderRadius: 12, background: m.is_admin ? '#2563eb' : '#fff', color: m.is_admin ? '#fff' : '#111', border: m.is_admin ? 'none' : '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{m.sender_name} · {m.sender_role} · {new Date(m.created_at).toLocaleString()}</div>
                      <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{m.message}</div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedTicket.status !== 'closed' && (
                <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8 }}>
                  <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} placeholder="Type admin reply..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
                  <button onClick={handleReply} disabled={sending || !reply.trim()} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: sending ? 0.5 : 1 }}>{sending ? '...' : 'Reply'}</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
