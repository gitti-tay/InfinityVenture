import { useNavigate } from 'react-router';

import { PageWrapper } from '@/app/components/page-wrapper';
import { PROJECTS } from '@/app/data/projects';

/* ── Sub-components ──────────────────────────────────────────────── */

function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1132d4]/10 dark:bg-[#1132d4]/20 text-[#1132d4] text-xs font-bold tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1132d4] animate-pulse" />
      Trusted by 50,000+ Investors
    </div>
  );
}

function HeroSection({ navigate }: { navigate: (p: string) => void }) {
  return (
    <section className="text-center space-y-6 px-6 pt-16 pb-8">
      <HeroBadge />
      <h1 className="text-4xl font-extrabold tracking-tight leading-[1.15] dark:text-white">
        Institutional-Grade
        <br />
        Assets for <span className="text-[#1132d4]">Everyone</span>
      </h1>
      <p className="text-slate-500 dark:text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
        Access fractional ownership in premium real-world assets — from
        agriculture and healthcare to real estate and green energy.
      </p>
      <div className="flex gap-3 justify-center pt-2">
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3.5 bg-[#1132d4] hover:bg-[#0d26a3] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Log In
        </button>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold text-[#1132d4]">{value}</p>
      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function StatsBar() {
  const stats = [
    { value: '$120M+', label: 'Assets Managed' },
    { value: '50K+', label: 'Investors' },
    { value: '15+', label: 'Countries' },
    { value: '12%', label: 'Avg APY' },
  ];

  return (
    <section className="mx-6 py-6 grid grid-cols-4 gap-4 border-y border-gray-100 dark:border-gray-800">
      {stats.map((s) => (
        <StatCard key={s.label} value={s.value} label={s.label} />
      ))}
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-[#1132d4]/10 dark:bg-[#1132d4]/20 flex items-center justify-center mb-3">
        <span className="material-icons text-[#1132d4] text-xl">{icon}</span>
      </div>
      <h3 className="font-bold text-sm dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeaturesGrid() {
  const features = [
    {
      icon: 'token',
      title: 'Tokenized RWA',
      desc: 'Real-world assets digitized on blockchain with full legal backing.',
    },
    {
      icon: 'shield',
      title: 'Bank-Level Security',
      desc: 'Multi-layer encryption, 2FA, and institutional-grade custody.',
    },
    {
      icon: 'payments',
      title: 'Fractional Investing',
      desc: 'Start with as little as $100. No accreditation required.',
    },
    {
      icon: 'trending_up',
      title: 'Passive Income',
      desc: 'Earn quarterly yields from real revenue-generating assets.',
    },
  ];

  return (
    <section className="px-6 py-8">
      <h2 className="text-xl font-bold dark:text-white mb-5 text-center">
        Why Infinity Ventures?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
        ))}
      </div>
    </section>
  );
}

function ProjectPreviewCard({ project }: { project: typeof PROJECTS[number] }) {
  return (
    <div className="min-w-[260px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm snap-start">
      <div className="h-32 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {project.symbol}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {project.category}
          </span>
        </div>
        <h4 className="font-bold text-sm dark:text-white truncate">{project.name}</h4>
        <div className="flex justify-between text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {project.apy} APY
          </span>
          <span className="text-slate-400">{project.risk}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectShowcase() {
  const featured = PROJECTS.slice(0, 5);

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold dark:text-white mb-5 text-center px-6">
        Featured Opportunities
      </h2>
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
        {featured.map((p) => (
          <ProjectPreviewCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

function TrustSignals() {
  const badges = [
    { icon: 'verified_user', label: 'SEC Compliant' },
    { icon: 'gpp_good', label: 'Audited Smart Contracts' },
    { icon: 'lock', label: 'End-to-End Encrypted' },
    { icon: 'account_balance', label: 'Regulated Custodian' },
  ];

  return (
    <section className="px-6 py-8">
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-sm text-center dark:text-white mb-4">
          Security & Compliance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-xs">
              <span className="material-icons text-green-600 dark:text-green-400 text-base">
                {b.icon}
              </span>
              <span className="text-slate-600 dark:text-gray-400 font-medium">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA({ navigate }: { navigate: (p: string) => void }) {
  return (
    <section className="px-6 pb-12 pt-4">
      <div className="bg-gradient-to-br from-[#1132d4] to-indigo-600 rounded-2xl p-6 text-center text-white shadow-xl">
        <h3 className="text-lg font-bold mb-2">
          Start Building Wealth Today
        </h3>
        <p className="text-sm text-white/80 mb-5">
          Join thousands of investors earning passive income from real-world
          assets.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="w-full py-3.5 bg-white text-[#1132d4] font-bold rounded-xl hover:bg-gray-100 transition active:scale-[0.98]"
        >
          Create Free Account
        </button>
      </div>
    </section>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <PageWrapper hideNav className="overflow-y-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-[#1132d4]/8 to-transparent" />
        <div className="absolute top-[5%] right-[-15%] w-[350px] h-[350px] bg-[#1132d4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Nav logo */}
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1132d4] rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">IV</span>
            </div>
            <span className="font-bold text-lg dark:text-white">
              Infinity<span className="text-[#1132d4]">Ventures</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#1132d4] hover:underline"
          >
            Sign In
          </button>
        </header>

        <HeroSection navigate={navigate} />
        <StatsBar />
        <FeaturesGrid />
        <ProjectShowcase />
        <TrustSignals />
        <BottomCTA navigate={navigate} />

        {/* Footer */}
        <footer className="text-center py-8 px-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-slate-400 dark:text-gray-500">
            &copy; 2025 Infinity Ventures. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-300 dark:text-gray-600 mt-2">
            Not financial advice. All investments carry risk. Past performance
            does not guarantee future results.
          </p>
        </footer>
      </div>
    </PageWrapper>
  );
}
