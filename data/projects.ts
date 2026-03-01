// ═══════════════════════════════════════════════════════════════════
// Infinity Ventures — Project Data & Types
// Enhanced with RWA OS Architecture (Master Prompts 1-5)
// TypeScript Strict Mode | Error Handled | Functions ≤30 lines
// Import Order: Built-in → Third-party → Internal → Types → Assets
// ═══════════════════════════════════════════════════════════════════

// ─── Token & Investment Types (from Strategic Prompt) ───

export type TokenType = 'INCOME_NOTE' | 'REVENUE_SHARE' | 'HYBRID';
export type LiquidityMode = 'INSTANT' | 'PERIODIC' | 'SLA' | 'SECONDARY';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High';
export type PayoutFrequency = 'Weekly' | 'Monthly' | 'Quarterly' | 'At Maturity' | 'Event Based';
export type ProjectCategory = 'Agriculture' | 'Medical Device' | 'Healthcare' | 'Green Infrastructure' | 'Real Estate';

export interface WaterfallStep {
  order: number;
  label: string;
  description: string;
  percentage?: number;
}

export interface PayoutScheme {
  frequency: PayoutFrequency;
  currency: string;
  waterfallSteps: WaterfallStep[];
  autoStepDown: boolean;
  stepDownTrigger?: string;
}

export interface LiquidityRules {
  primaryMode: LiquidityMode;
  secondaryMode?: LiquidityMode;
  maxProcessingDays?: number;
  redemptionCap?: number;
  lockupMonths?: number;
  slaDescription: string;
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  targetDate: string;
  escrowRelease?: number;
  description: string;
}

export interface TrancheConfig {
  name: string;
  targetAmount: number;
  couponRate: number;
  feeWaiver: boolean;
  priorityExit: boolean;
}

export interface Project {
  id: string;
  name: string;
  symbol: string;
  location: string;
  category: string;
  region: string;
  apy: string;
  term: string;
  min: string;
  risk: string;
  raised: string;
  target: string;
  investors: number;
  progress: number;
  img: string;
  series?: string;
  type?: string;
  badge?: string;
  image?: string;
  assetId?: string;
  // Rich detail fields
  overview?: string;
  highlights?: string[];
  riskDetails?: string;
  payout?: string;
  consistency?: string;
  performanceData?: number[];
  performanceLabels?: string[];
  documents?: { name: string; size: string }[];
  // ─── NEW: RWA OS Fields (Master Prompt Architecture) ───
  tokenType?: TokenType;
  liquidityRules?: LiquidityRules;
  payoutScheme?: PayoutScheme;
  milestones?: Milestone[];
  tranches?: TrancheConfig[];
  minInvestmentRetail?: number;
  minInvestmentPro?: number;
  investmentCapRetail?: number;
  managementFee?: number;
  performanceFee?: number;
  useOfFunds?: { category: string; percentage: number }[];
  investorRights?: string[];
  kpis?: { label: string; value: string; unit: string; trend: string }[];
  riskItems?: { category: string; level: string; description: string; mitigation: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: 'blm',
    name: 'BLM \u2014 Bloombase Seed Potato',
    symbol: 'BLM',
    location: 'Doi Saket, Chiang Mai',
    category: 'Agriculture',
    region: 'Chiang Mai, Thailand',
    apy: '14.5%',
    term: '12-18 Months',
    min: '$100',
    risk: 'Low Risk',
    raised: '420K',
    target: '1.5M',
    investors: 47,
    progress: 28,
    img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=90',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=90',
    series: 'Series A',
    type: 'Agriculture',
    badge: 'Asset Backed',
    assetId: '#9001-RWA',
    payout: 'Quarterly + Harvest',
    consistency: 'High',
    tokenType: 'HYBRID',
    overview: 'Bloombase is not ordinary potato farming \u2014 it is a premium seed potato supply-chain business producing virus-free, early-generation seed potatoes (G0 tissue culture through G2\u2013G3) in Chiang Mai, Thailand. The economic value comes from disease-free, uniform seed that improves yield stability for commercial growers. International standards describe G0 as a tissue-culture pre-basic stage; Thai materials also describe generation grading (G0 pre-basic, G1 basic, G2 certified). Thailand\'s potato production is concentrated in northern provinces like Chiang Mai/Chiang Rai, and reliance on recycled seed constrains productivity \u2014 creating a structural opportunity for premium seed supply.',
    highlights: [
      'Premium seed potato production: Tissue Culture \u2192 G0 \u2192 G1 \u2192 G2\u2013G3 (virus-free early generation)',
      'Structural market opportunity: Thai growers depend on recycled seed, limiting yields',
      'Lab + greenhouse + field multiplication + cold storage integrated supply chain',
      'Pre-signed offtake agreements with contract farming networks and chip processors',
      'Physical asset custody: land title held in SPV trust with investor priority lien',
      'Monthly KPI dashboard: plantlet production, microtuber output, disease test results'
    ],
    riskDetails: 'Low Risk \u2014 Backed by physical agricultural assets, lab infrastructure, and pre-contracted offtake buyers. Primary risks include disease outbreak (mitigated by isolation protocols and certified testing), weather variability (greenhouse-controlled early stages), and logistics delays. Reserve account auto-reduces dividends if KPIs are missed (waterfall step-down).',
    performanceData: [10.2, 11.5, 12.8, 13.5, 14.0, 14.5],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Term Sheet', size: '3.2 MB' },
      { name: 'Seed Certification & Land Title', size: '5.1 MB' },
      { name: 'Financial Model & Projections', size: '2.8 MB' },
      { name: 'Risk Disclosure Statement', size: '1.4 MB' },
      { name: 'Offtake Agreements Summary', size: '2.1 MB' }
    ],
    liquidityRules: {
      primaryMode: 'PERIODIC',
      secondaryMode: 'SECONDARY',
      maxProcessingDays: 30,
      lockupMonths: 6,
      slaDescription: 'Quarterly redemption windows after 6-month lockup. Max 30-day processing. Optional OTC secondary (not guaranteed, may trade at discount).'
    },
    payoutScheme: {
      frequency: 'Quarterly',
      currency: 'USDC',
      autoStepDown: true,
      stepDownTrigger: 'Monthly KPI below 80% target triggers automatic dividend reduction',
      waterfallSteps: [
        { order: 1, label: 'Gross Revenue', description: 'Seed sales + contract farming payments', percentage: 100 },
        { order: 2, label: 'Operating Costs', description: 'Lab, greenhouse, field, labor, logistics', percentage: 45 },
        { order: 3, label: 'Reserve Top-Up', description: 'Risk buffer replenishment (disease/weather)', percentage: 10 },
        { order: 4, label: 'Investor Payout', description: 'Base coupon + performance upside to HYB holders', percentage: 35 },
        { order: 5, label: 'Sponsor Fee', description: 'Operating partner performance incentive', percentage: 10 }
      ]
    },
    minInvestmentRetail: 100,
    minInvestmentPro: 10000,
    investmentCapRetail: 8500,
    managementFee: 1.5,
    performanceFee: 15,
    useOfFunds: [
      { category: 'Lab & Tissue Culture Equipment', percentage: 30 },
      { category: 'Greenhouse Construction', percentage: 25 },
      { category: 'Field Multiplication & Cold Storage', percentage: 20 },
      { category: 'Working Capital (1st cycle)', percentage: 15 },
      { category: 'Regulatory & Certification', percentage: 10 }
    ],
    investorRights: [
      'Quarterly distribution from net operating cashflow',
      'Monthly KPI reporting with disease test results',
      'Waterfall step-down protection if targets missed',
      'SPV lien on land and equipment assets',
      'Vote on material changes (pivot/extension/early exit)'
    ],
    kpis: [
      { label: 'Plantlets Produced', value: '12,500', unit: 'units/month', trend: 'UP' },
      { label: 'G2 Output', value: '8.2', unit: 'tons', trend: 'UP' },
      { label: 'Disease Test Pass', value: '98.5', unit: '%', trend: 'STABLE' },
      { label: 'Offtake Coverage', value: '87', unit: '%', trend: 'UP' }
    ]
  },
  {
    id: 'reh',
    name: 'REH \u2014 re:H Medical Device',
    symbol: 'REH',
    location: 'Bangkok, Thailand',
    category: 'Medical Device',
    region: 'Bangkok + Export',
    apy: '13.0%',
    term: '18-30 Months',
    min: '$500',
    risk: 'Medium Risk',
    raised: '310K',
    target: '3.0M',
    investors: 23,
    progress: 10,
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=90',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=90',
    series: 'Series A',
    type: 'Medical Device',
    badge: 'Milestone Escrow',
    assetId: '#9002-RWA',
    payout: 'Monthly Revenue Share',
    consistency: 'Medium',
    tokenType: 'REVENUE_SHARE',
    overview: 're:H Medical Device is a medical device development, manufacturing, and distribution company based in Bangkok, Thailand. The project uses milestone-based escrow financing \u2014 funds are released only when regulatory and commercial milestones are achieved. Investors receive a monthly revenue share from device sales, consumables, and servicing contracts. The milestone escrow structure protects investors by ensuring capital is deployed only upon verified progress.',
    highlights: [
      'Milestone escrow: funds released only on regulatory approval + first revenue targets',
      'Revenue Share Token (RST): monthly distribution from net device sales revenue',
      'Thai FDA registration pathway + CE marking for European export',
      'ISO 13485 certified manufacturing partner with 15+ years medical device experience',
      'Target: 10 hospital/clinic partners within first 12 months post-approval',
      'Investor vote triggers if milestones fail (extend / pivot / partial refund)'
    ],
    riskDetails: 'Medium Risk \u2014 Medical device development carries regulatory and market adoption risk. Mitigated by milestone escrow (capital not deployed until milestones hit), experienced manufacturing partner, and diversified revenue (devices + consumables + servicing). Key risks: regulatory delays, hospital procurement cycles, and competitive alternatives.',
    performanceData: [0, 0, 5.2, 8.5, 11.0, 13.0],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Milestone Schedule', size: '4.5 MB' },
      { name: 'Thai FDA Submission Status', size: '2.8 MB' },
      { name: 'ISO 13485 Manufacturing Certificate', size: '1.9 MB' },
      { name: 'Financial Model & Revenue Projections', size: '3.2 MB' },
      { name: 'Risk Disclosure Statement', size: '1.6 MB' }
    ],
    liquidityRules: {
      primaryMode: 'SLA',
      secondaryMode: 'SECONDARY',
      maxProcessingDays: 60,
      lockupMonths: 12,
      slaDescription: 'SLA-based withdrawal: max 60 days after 12-month lockup. Optional OTC bulletin board (not guaranteed; discount possible).'
    },
    milestones: [
      { id: 'm1', order: 1, title: 'Regulatory Submission Completed', status: 'COMPLETED', targetDate: '2025-03-01', escrowRelease: 500000, description: 'Thai FDA dossier submitted with clinical evidence package' },
      { id: 'm2', order: 2, title: 'Thai FDA Approval Received', status: 'IN_PROGRESS', targetDate: '2025-09-01', escrowRelease: 800000, description: 'Marketing authorization granted for Thailand market' },
      { id: 'm3', order: 3, title: 'First 10 Hospital Contracts', status: 'PENDING', targetDate: '2026-03-01', escrowRelease: 700000, description: 'Signed distribution agreements with 10+ hospitals/clinics' },
      { id: 'm4', order: 4, title: 'Revenue Target: $500K', status: 'PENDING', targetDate: '2026-09-01', escrowRelease: 1000000, description: 'Cumulative revenue reaches $500,000 milestone' }
    ],
    minInvestmentRetail: 500,
    minInvestmentPro: 25000,
    investmentCapRetail: 8500,
    managementFee: 2.0,
    performanceFee: 0
  },
  {
    id: 'awl',
    name: 'AWL \u2014 Aesthetic Wellness Longevity',
    symbol: 'AWL',
    location: 'Sukhumvit, Bangkok',
    category: 'Healthcare',
    region: 'Bangkok, Thailand',
    apy: '15.0%',
    term: '36-60 Months',
    min: '$500',
    risk: 'Medium Risk',
    raised: '680K',
    target: '5.0M',
    investors: 52,
    progress: 14,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=90',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=90',
    series: 'Series A',
    type: 'Healthcare',
    badge: 'K-Beauty x Thai',
    assetId: '#9003-RWA',
    payout: 'Monthly',
    consistency: 'Medium',
    tokenType: 'HYBRID',
    overview: 'AWL is a premium aesthetic, wellness, and longevity clinic in Bangkok combining Korean medical expertise with Thai hospitality. The clinic offers minimal-invasive treatments with Korean doctor consultations (online + on-site) and standardized high-quality protocols. Revenue comes from treatment fees, membership subscriptions, and product sales. Future expansion includes longevity/personalized wellness services within regulatory scope.',
    highlights: [
      'K-Beauty Precision \u00d7 Thai Hospitality \u00d7 Longevity Science brand positioning',
      'Online consultation with Korean doctors + local execution in Thailand',
      'Hybrid Token: monthly EBITDA dividend + growth bonus on expansion milestones',
      'Membership NFT program (separate from investment): booking priority, discounts',
      'Target: 2nd branch within 18 months, franchise model by month 36',
      'Strict regulatory compliance: no unverified clinical claims, phased service rollout'
    ],
    riskDetails: 'Medium Risk \u2014 Healthcare clinic with execution risk during growth phase. Revenue backed by established patient base and insurance partnerships. Key risks: medical advertising regulations, practitioner availability, competition from hospital groups. Mitigated by diversified revenue (treatments + membership + products) and conservative expansion timeline.',
    performanceData: [0, 0, 8.5, 11.2, 13.5, 15.0],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Clinic Business Plan', size: '5.2 MB' },
      { name: 'Medical License Documentation', size: '3.1 MB' },
      { name: 'Financial Model & EBITDA Projections', size: '2.9 MB' },
      { name: 'Treatment Protocol Standards', size: '4.0 MB' },
      { name: 'Risk Disclosure Statement', size: '1.5 MB' }
    ],
    liquidityRules: {
      primaryMode: 'PERIODIC',
      maxProcessingDays: 30,
      redemptionCap: 10,
      lockupMonths: 12,
      slaDescription: 'Quarterly redemption windows capped at 10% of outstanding supply. Optional buyback from retained earnings after month 18-24.'
    },
    minInvestmentRetail: 500,
    minInvestmentPro: 50000,
    investmentCapRetail: 8500,
    managementFee: 2.0,
    performanceFee: 20
  },
  {
    id: 'zew',
    name: 'ZEW \u2014 Zero Emission Waste Recycle',
    symbol: 'ZEW',
    location: 'Eastern Seaboard, Thailand',
    category: 'Green Infrastructure',
    region: 'Rayong, Thailand',
    apy: '15.0%',
    term: '48-60 Months',
    min: '$1,000',
    risk: 'Medium Risk',
    raised: '1.8M',
    target: '12.0M',
    investors: 31,
    progress: 15,
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=90',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=90',
    series: 'Series B',
    type: 'Green Infrastructure',
    badge: 'First Close $5M',
    assetId: '#9004-RWA',
    payout: 'Quarterly',
    consistency: 'Medium',
    tokenType: 'INCOME_NOTE',
    overview: 'ZEW is a large-scale waste recycling and resource recovery facility on Thailand\'s Eastern Seaboard. The project converts municipal and industrial waste into recycled materials and energy. Project starts only if First Close >= $5,000,000 is achieved. Early investors (Founders Close Preferred) receive 25%+ value uplift vs. base terms \u2014 including higher coupon, fee waiver, and priority exit queue. Revenue from tipping fees, recycled material sales, and potential carbon credit generation.',
    highlights: [
      'First Close condition: project starts only when $5M threshold is met (escrow protected)',
      'Founders Close Preferred: 15% coupon (25% above base 12%) + zero platform fees + priority exit',
      'Revenue: tipping fees + recycled material sales + carbon credit/REC potential',
      'Thailand supports tokenized carbon credits for licensed operators',
      'Impact dashboard: CO2e avoided, waste diverted, compliance metrics',
      'Use-of-funds released by milestones: permits \u2192 EPC signed \u2192 site mobilization'
    ],
    riskDetails: 'Medium Risk \u2014 Large infrastructure project with construction and operational risk. Mitigated by escrow (funds held until $5M First Close), milestone-based fund release, and government waste management contracts. Key risks: construction delays, permit timeline, waste supply consistency, and commodity price fluctuations for recycled materials.',
    performanceData: [0, 0, 0, 8.0, 11.5, 15.0],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Project Finance Model', size: '6.5 MB' },
      { name: 'Environmental Impact Assessment', size: '4.8 MB' },
      { name: 'EPC Contract Summary', size: '3.2 MB' },
      { name: 'Permit & License Status', size: '2.4 MB' },
      { name: 'Risk Disclosure & First Close Terms', size: '2.1 MB' }
    ],
    liquidityRules: {
      primaryMode: 'PERIODIC',
      secondaryMode: 'SECONDARY',
      maxProcessingDays: 60,
      lockupMonths: 24,
      redemptionCap: 5,
      slaDescription: 'Lock-up: 12-24 months until commissioning. After commissioning: quarterly redemption windows capped at 5%. Optional OTC bulletin board (not guaranteed; discount possible).'
    },
    tranches: [
      { name: 'Founders Close Preferred (FCP)', targetAmount: 5000000, couponRate: 15.0, feeWaiver: true, priorityExit: true },
      { name: 'Main Close (Base)', targetAmount: 7000000, couponRate: 12.0, feeWaiver: false, priorityExit: false }
    ],
    minInvestmentRetail: 1000,
    minInvestmentPro: 50000,
    investmentCapRetail: 8500,
    managementFee: 2.0,
    performanceFee: 15
  },
  {
    id: 'gpr',
    name: 'GPR \u2014 Global Prime Real Estate',
    symbol: 'GPR',
    location: 'New York & London',
    category: 'Real Estate',
    region: 'NYC / London',
    apy: '11.5%',
    term: '24-60 Months',
    min: '$1,000',
    risk: 'Low Risk',
    raised: '2.1M',
    target: '15.0M',
    investors: 89,
    progress: 14,
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=90',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=90',
    series: 'Series B',
    type: 'Real Estate',
    badge: 'Prime Global',
    assetId: '#9005-RWA',
    payout: 'Monthly',
    consistency: 'High',
    tokenType: 'HYBRID',
    overview: 'GPR is a tokenized prime real estate fund focused on stabilized rental properties and select development opportunities in New York City and London. The fund offers three investment models: SPV Equity Fractional (token represents SPV shares), Income Note (debt-like with fixed coupon), and Interval Basket Fund (diversified portfolio with quarterly repurchase). All models feature net-of-fees distributions with automatic deduction of management, maintenance, taxes, and FX costs. Secondary liquidity is available but may trade at discount \u2014 disclosed transparently per Bricklane-style honesty.',
    highlights: [
      'Prime NYC + London assets: single trophy property + diversified basket options',
      '3 investment models: SPV Equity, Income Note, Interval Basket Fund',
      'Monthly net-of-fees distributions (auto-deduct management/tax/FX)',
      'JLL independent valuations + quarterly NAV updates',
      'On-chain proof-of-reserves style reporting for cash accounts',
      'Secondary market available but discount risk clearly disclosed'
    ],
    riskDetails: 'Low Risk \u2014 Prime city real estate with institutional-grade tenants on long leases. Primary risks include vacancy during turnover, FX fluctuations (GBP/USD), interest rate impacts on valuations, and limited liquidity (quarterly windows). Mitigated by premium locations, diversified tenant base, conservative leverage (45% LTV), and transparent NAV reporting.',
    performanceData: [9.5, 9.8, 10.2, 10.8, 11.0, 11.5],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Property Portfolio', size: '7.2 MB' },
      { name: 'JLL Independent Valuations', size: '5.5 MB' },
      { name: 'SPV Structure & Legal Opinion', size: '3.8 MB' },
      { name: 'Tenant Roster & Lease Summaries', size: '4.1 MB' },
      { name: 'Risk Disclosure & Liquidity Terms', size: '2.3 MB' },
      { name: 'Fee Schedule & Net Return Scenarios', size: '1.8 MB' }
    ],
    liquidityRules: {
      primaryMode: 'PERIODIC',
      secondaryMode: 'SECONDARY',
      maxProcessingDays: 60,
      redemptionCap: 10,
      lockupMonths: 6,
      slaDescription: 'Quarterly repurchases capped at 5-10%. SLA: 30-60 day processing. Optional OTC bulletin board available but may trade at discount \u2014 this is transparently disclosed.'
    },
    minInvestmentRetail: 1000,
    minInvestmentPro: 100000,
    investmentCapRetail: 8500,
    managementFee: 1.5,
    performanceFee: 20
  }
];
