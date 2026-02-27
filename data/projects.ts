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
  // Additional fields for invest flow
  series?: string;
  type?: string;
  badge?: string;
  image?: string;
  assetId?: string;
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
    assetId: '#8827-RWA'
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
    assetId: '#8829-RWA'
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
    assetId: '#8830-RWA'
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
    assetId: '#8831-RWA'
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
    assetId: '#8832-RWA'
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
    assetId: '#8828-RWA'
  }
];
