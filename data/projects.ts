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
}

export const PROJECTS: Project[] = [
  {
    id: 'ptf',
    name: 'PTF \u2014 Prime Timber Forestry',
    symbol: 'PTF',
    location: 'Doi Saket, Chiang Mai',
    category: 'Agriculture',
    region: 'Doi Saket, Chiang Mai',
    apy: '14.2%',
    term: '12 Months',
    min: '$500',
    risk: 'Low Risk',
    raised: '768K',
    target: '3.0M',
    investors: 58,
    progress: 25,
    img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    series: 'Series A',
    type: 'Agriculture',
    badge: 'Asset Backed',
    assetId: '#8827-RWA',
    payout: 'Monthly',
    consistency: 'High',
    overview: 'Prime Timber Forestry (PTF) is a sustainable teak forestry investment located in Doi Saket, Chiang Mai, Thailand. The project encompasses 150 rai (24 hectares) of FSC-certified teak plantation with 12-year rotation cycles. Revenue is generated through selective harvesting, timber sales, and carbon credit programs. The land and timber serve as the underlying real-world asset, tokenized on-chain for fractional ownership. PTF targets steady income through quarterly timber sales and annual carbon credit auctions, offering investors exposure to a hard asset with inflation-hedging properties.',
    highlights: [
      'FSC-certified sustainable teak plantation with 150 rai of managed forest',
      'Dual revenue streams: timber sales + voluntary carbon credits (VCS/Gold Standard)',
      'Physical asset custody with on-chain proof-of-reserve audits quarterly',
      'Operating partner: Thai Forestry Group, 18+ years track record',
      'Land title held in SPV trust with investor priority lien'
    ],
    riskDetails: 'Low Risk — Backed by physical land and timber assets. Primary risks include natural disasters (mitigated by insurance), timber price fluctuations, and regulatory changes. The 12-year rotation cycle provides time diversification. Carbon credit revenue adds a secondary income buffer.',
    performanceData: [10.8, 11.5, 12.1, 13.2, 13.8, 14.2],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Term Sheet', size: '3.2 MB' },
      { name: 'FSC Certification & Land Title', size: '5.1 MB' },
      { name: 'Financial Model & Projections', size: '2.8 MB' },
      { name: 'Risk Disclosure Statement', size: '1.4 MB' }
    ]
  },
  {
    id: 'scn',
    name: 'SCN \u2014 Suburban Care Network',
    symbol: 'SCN',
    location: 'Sukhumvit, Bangkok',
    category: 'Healthcare',
    region: 'Sukhumvit, Bangkok',
    apy: '12.5%',
    term: '12 Months',
    min: '$750',
    risk: 'Medium Risk',
    raised: '100K',
    target: '5.0M',
    investors: 31,
    progress: 2,
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    series: 'Series A',
    type: 'Healthcare',
    badge: 'Asset Backed',
    assetId: '#8829-RWA',
    payout: 'Monthly',
    consistency: 'Medium',
    overview: 'Suburban Care Network (SCN) is a premium outpatient healthcare network operating three clinics across Bangkok\u2019s Sukhumvit corridor. The project tokenizes the clinic\u2019s receivables and equipment leases, generating yield from patient revenue and health insurance reimbursements. SCN serves the growing medical tourism market and Bangkok\u2019s expanding middle-class demographic, partnering with 5 major Thai and international insurance providers. The clinics are valued at THB 180M in total assets, providing a tangible collateral base for token holders.',
    highlights: [
      '3 operational clinics in prime Sukhumvit locations with 85% average occupancy',
      'Revenue backed by insurance receivables (5 major providers incl. AIA, Bupa)',
      'Medical tourism growth: 15% YoY increase in international patient volume',
      'Equipment and real estate collateral valued at THB 180M',
      'Managed by Dr. Kasem Medical Group with 12 years operational history'
    ],
    riskDetails: 'Medium Risk — Healthcare sector provides recession-resistant revenue, but expansion phase introduces execution risk. Key risks include regulatory changes in medical licensing, insurance reimbursement delays, and competition from larger hospital groups. Mitigation includes diversified insurance partnerships and established patient base.',
    performanceData: [8.5, 9.2, 10.1, 11.0, 11.8, 12.5],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Clinic Valuation', size: '4.1 MB' },
      { name: 'Insurance Receivables Audit', size: '2.3 MB' },
      { name: 'Medical License Documentation', size: '3.5 MB' },
      { name: 'Risk Disclosure Statement', size: '1.6 MB' }
    ]
  },
  {
    id: 'mfx',
    name: 'MFX \u2014 MetaFlex Exchange',
    symbol: 'MFX',
    location: 'Singapore',
    category: 'Real Estate',
    region: 'Singapore',
    apy: '22%',
    term: '6 Months',
    min: '$1,000',
    risk: 'High Risk',
    raised: '1.2M',
    target: '10.0M',
    investors: 142,
    progress: 12,
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    series: 'Series B',
    type: 'Fintech',
    badge: 'High Yield',
    assetId: '#8830-RWA',
    payout: 'Monthly',
    consistency: 'Variable',
    overview: 'MetaFlex Exchange (MFX) is a Singapore-based digital asset exchange and co-working space hybrid, combining fintech operations with premium commercial real estate in the CBD. The project tokenizes revenue from exchange trading fees, membership subscriptions, and rental income from 3 floors of Grade-A office space in Raffles Place. MFX operates under MAS regulatory sandbox and holds a Payment Services Act license. The high APY reflects both the growth potential and the inherent volatility of exchange-derived revenue.',
    highlights: [
      'MAS-regulated exchange with Payment Services Act license (Singapore)',
      'Triple revenue: trading fees ($2.1M annual) + co-working ($800K) + office rental ($1.5M)',
      'Grade-A office space: 3 floors at One Raffles Place, 92% occupancy',
      'Series B raised $4.2M from institutional investors (2024)',
      'Active user base: 28,000+ KYC-verified traders across APAC'
    ],
    riskDetails: 'High Risk — Exchange revenue is highly correlated with crypto market conditions and trading volume. Regulatory changes in Singapore could impact operations. The commercial real estate component provides a baseline yield floor, but the high APY is primarily driven by variable trading fee revenue. Not suitable for conservative investors.',
    performanceData: [15.0, 28.5, 18.2, 35.1, 19.8, 22.0],
    performanceLabels: ['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25E'],
    documents: [
      { name: 'Investment Memo & Exchange Audit', size: '5.8 MB' },
      { name: 'MAS License & Compliance Report', size: '3.2 MB' },
      { name: 'Property Valuation (CBRE)', size: '4.5 MB' },
      { name: 'Risk Disclosure & Volatility Report', size: '2.1 MB' }
    ]
  },
  {
    id: 'gev',
    name: 'GEV \u2014 Green Energy Ventures',
    symbol: 'GEV',
    location: 'Phuket, Thailand',
    category: 'Agriculture',
    region: 'Phuket, Thailand',
    apy: '13.5%',
    term: '24 Months',
    min: '$500',
    risk: 'Low Risk',
    raised: '2.4M',
    target: '8.0M',
    investors: 89,
    progress: 30,
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    series: 'Series A',
    type: 'Energy',
    badge: 'Asset Backed',
    assetId: '#8831-RWA',
    payout: 'Monthly',
    consistency: 'High',
    overview: 'Green Energy Ventures (GEV) operates a 5.2 MW solar farm installation across rooftops of 12 resort hotels in Phuket, Thailand. Revenue is generated through Power Purchase Agreements (PPAs) with EGAT (Electricity Generating Authority of Thailand) and direct hotel partnerships under net-metering arrangements. The solar panels and inverters serve as tokenized real-world assets. Thailand\u2019s tropical climate provides consistent solar irradiance (avg 4.8 kWh/m\u00b2/day), supporting predictable energy output year-round. GEV benefits from government feed-in tariffs and growing ESG investor demand.',
    highlights: [
      '5.2 MW installed capacity across 12 resort hotel rooftops in Phuket',
      '20-year PPA with EGAT guaranteeing minimum floor price per kWh',
      'Average capacity factor: 18.5% (above Thailand national average)',
      'Government feed-in tariff: THB 2.20/kWh guaranteed for 10 years',
      'B Corp certified, aligned with UN SDG 7 (Affordable & Clean Energy)'
    ],
    riskDetails: 'Low Risk — Solar energy revenue is backed by government-guaranteed PPAs and feed-in tariffs. Primary risks include equipment degradation (mitigated by manufacturer warranties and insurance), weather variability, and regulatory policy changes. The 20-year PPA provides long-term revenue visibility.',
    performanceData: [11.2, 11.8, 12.4, 12.9, 13.2, 13.5],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Solar Audit', size: '4.3 MB' },
      { name: 'EGAT PPA Agreement', size: '6.2 MB' },
      { name: 'Environmental Impact Assessment', size: '3.8 MB' },
      { name: 'Risk Disclosure Statement', size: '1.5 MB' }
    ]
  },
  {
    id: 'urb',
    name: 'URB \u2014 Urban Realty Block',
    symbol: 'URB',
    location: 'Sathorn, Bangkok',
    category: 'Real Estate',
    region: 'Sathorn, Bangkok',
    apy: '11%',
    term: '24 Months',
    min: '$1,000',
    risk: 'Low Risk',
    raised: '1.8M',
    target: '12.0M',
    investors: 67,
    progress: 15,
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    series: 'Series B',
    type: 'Real Estate',
    badge: 'Revenue Generating',
    assetId: '#8832-RWA',
    payout: 'Quarterly',
    consistency: 'High',
    overview: 'Urban Realty Block (URB) is a tokenized commercial real estate fund focused on two Grade-A office towers in Bangkok\u2019s Sathorn financial district. The fund holds 18 floors of leasable office space (total 12,400 sqm) with a current occupancy rate of 94%. Tenants include multinational corporations, law firms, and fintech companies on 3-5 year leases. Revenue is derived from rental income with annual CPI-linked escalation clauses. The underlying properties are valued at THB 3.2 billion with a conservative LTV ratio of 45%.',
    highlights: [
      '18 floors of Grade-A office space in Sathorn CBD, 12,400 sqm total',
      '94% occupancy with blue-chip tenants on 3-5 year leases',
      'Annual rent escalation: CPI + 1.5% built into all lease agreements',
      'Property valuation: THB 3.2B (independent appraisal by JLL)',
      'Conservative 45% LTV with priority lien structure for token holders'
    ],
    riskDetails: 'Low Risk — Prime CBD commercial real estate with long-term institutional tenants. Risks include vacancy during tenant turnover, Bangkok office market oversupply, and interest rate impacts on property valuations. Mitigated by premium location, diversified tenant base, and conservative leverage.',
    performanceData: [9.5, 9.8, 10.2, 10.5, 10.8, 11.0],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Property Appraisal', size: '5.5 MB' },
      { name: 'Tenant Roster & Lease Summaries', size: '3.8 MB' },
      { name: 'JLL Independent Valuation Report', size: '4.2 MB' },
      { name: 'Risk Disclosure Statement', size: '1.7 MB' }
    ]
  },
  {
    id: 'mdd',
    name: 'MDD \u2014 Metropolitan District Development',
    symbol: 'MDD',
    location: 'Asoke, Bangkok',
    category: 'Real Estate',
    region: 'Asoke, Bangkok',
    apy: '11.8%',
    term: '13 Months',
    min: '$650',
    risk: 'Medium Risk',
    raised: '400K',
    target: '8.0M',
    investors: 4,
    progress: 5,
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    series: 'Series B',
    type: 'Real Estate',
    badge: 'Revenue Generating',
    assetId: '#8828-RWA',
    payout: 'Monthly',
    consistency: 'Medium',
    overview: 'Metropolitan District Development (MDD) is a mixed-use development project in Bangkok\u2019s Asoke intersection, one of the city\u2019s highest-traffic commercial nodes. The project encompasses 3,200 sqm of retail podium space and 48 serviced apartment units positioned above the BTS Asoke and MRT Sukhumvit interchange. Revenue streams include retail tenant rents, short-term serviced apartment bookings (via Airbnb Plus and corporate partnerships), and advertising revenue from digital signage on the building facade. The property is currently in its stabilization phase with 72% overall occupancy.',
    highlights: [
      'Prime location: BTS Asoke & MRT Sukhumvit double transit intersection',
      'Mixed-use: 3,200 sqm retail + 48 serviced apartments + digital signage',
      'Airbnb Plus certified units with 78% average nightly occupancy',
      'Retail tenants include 7-Eleven, Starbucks, and local F&B brands',
      'Digital signage generates THB 2.4M/year in advertising revenue'
    ],
    riskDetails: 'Medium Risk — Mixed-use development in stabilization phase with room for occupancy improvement. Key risks include Bangkok tourism seasonality affecting serviced apartments, retail tenant turnover, and competition from new developments in the Asoke area. The strong transit location and diversified revenue streams provide downside protection.',
    performanceData: [0, 0, 8.5, 10.2, 11.0, 11.8],
    performanceLabels: ['2020', '2021', '2022', '2023', '2024', '2025E'],
    documents: [
      { name: 'Investment Memo & Development Plan', size: '6.1 MB' },
      { name: 'Building Permit & Chanote Title', size: '4.3 MB' },
      { name: 'Occupancy & Revenue Projections', size: '2.9 MB' },
      { name: 'Risk Disclosure Statement', size: '1.8 MB' }
    ]
  }
];
