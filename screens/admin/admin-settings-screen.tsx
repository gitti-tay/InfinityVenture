import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

const SETTING_GROUPS = [
  {
    title: '💰 Deposit Settings',
    keys: ['deposit_min', 'deposit_max', 'deposit_fee_percent', 'auto_approve_deposits'],
  },
  {
    title: '📤 Withdrawal Settings',
    keys: ['withdraw_min', 'withdraw_max', 'withdraw_daily_limit', 'withdraw_fee_percent', 'withdraw_fee_flat', 'auto_approve_withdrawals'],
  },
  {
    title: '🔒 Security & KYC',
    keys: ['require_kyc_for_invest', 'require_kyc_for_withdraw', 'max_login_attempts', 'lockout_duration_minutes'],
  },
  {
    title: '🛠 System',
    keys: ['maintenance_mode', 'signup_enabled', 'platform_name', 'support_email'],
  },
];

export function AdminSettingsScreen() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(res => { setSettings(res.settings || {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setEdited(e => ({ ...e, [key]: value }));
  };

  const getValue = (key: string) => {
    if (key in edited) return edited[key];
    return settings[key]?.value ?? '';
  };

  const hasChanges = Object.keys(edited).length > 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(edited);
      const res = await adminApi.getSettings();
      setSettings(res.settings || {});
      setEdited({});
      alert('Settings saved successfully');
    } catch (e: any) { alert('Error: ' + e.message); }
    setSaving(false);
  };

  const isBoolSetting = (key: string) => {
    const val = settings[key]?.value;
    return val === 'true' || val === 'false';
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400 text-sm">Configure platform behavior and limits</p>
        {hasChanges && (
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : `Save ${Object.keys(edited).length} Change(s)`}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {SETTING_GROUPS.map(group => (
          <div key={group.title} className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h3 className="text-white font-semibold mb-4">{group.title}</h3>
            <div className="space-y-3">
              {group.keys.filter(k => settings[k]).map(key => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-mono">{key}</p>
                    <p className="text-slate-500 text-xs">{settings[key]?.description || ''}</p>
                  </div>
                  <div className="w-full sm:w-48">
                    {isBoolSetting(key) ? (
                      <button
                        onClick={() => handleChange(key, getValue(key) === 'true' ? 'false' : 'true')}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          getValue(key) === 'true'
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {getValue(key) === 'true' ? '✓ Enabled' : '✗ Disabled'}
                      </button>
                    ) : (
                      <input
                        value={getValue(key)}
                        onChange={e => handleChange(key, e.target.value)}
                        className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm ${
                          key in edited ? 'border-blue-500' : 'border-slate-700'
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
