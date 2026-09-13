export type CertificateType =
  | 'FIRST_PAYOUT'
  | 'FUNDED_ACCOUNT'
  | 'PROFIT_MILESTONE'
  | 'CONSISTENCY'
  | 'RISK_DISCIPLINE'
  | 'SCALING'
  | 'ELITE_PAYOUT'
  | 'PRECISION_MODEL'

export interface DemoAchievement {
  id: string
  student: string
  accountTier: string
  type: CertificateType
  badgeLabel: string
  title: string
  payoutAmount: string
  date: string
  evaluationModel: string
  certificateNo: string
  disclaimer: string
  accentColor: string
  secondaryColor: string
  metrics: {
    winRate: string
    riskReward: string
    tradesLogged: string
  }
}

export const DEMO_ACHIEVEMENTS: DemoAchievement[] = [
  {
    id: 'ach-1',
    student: 'Arun K.',
    accountTier: '$50K Funded Account',
    type: 'FIRST_PAYOUT',
    badgeLabel: 'FIRST PAYOUT',
    title: 'First Payout Achievement',
    payoutAmount: '$1,284.00',
    date: 'Demo Achievement',
    evaluationModel: 'ICT Liquidity & Order Block Model',
    certificateNo: 'PICT-ACH-2026-001',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#38BDF8', // Cyan
    secondaryColor: '#2563EB',
    metrics: { winRate: '68%', riskReward: '1:2.4', tradesLogged: '38' }
  },
  {
    id: 'ach-2',
    student: 'Rahul M.',
    accountTier: '$100K Funded Account',
    type: 'FUNDED_ACCOUNT',
    badgeLabel: 'SECOND PAYOUT',
    title: 'Funded Account Milestone',
    payoutAmount: '$2,460.50',
    date: 'Demo Achievement',
    evaluationModel: 'ICT Silver Bullet Execution',
    certificateNo: 'PICT-ACH-2026-002',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#10B981', // Emerald
    secondaryColor: '#059669',
    metrics: { winRate: '72%', riskReward: '1:2.8', tradesLogged: '44' }
  },
  {
    id: 'ach-3',
    student: 'Vikram S.',
    accountTier: '$25K Funded Account',
    type: 'PROFIT_MILESTONE',
    badgeLabel: 'PROFIT MILESTONE',
    title: 'Profit Target Milestone',
    payoutAmount: '$875.00',
    date: 'Demo Achievement',
    evaluationModel: 'Market Structure & BOS Alignment',
    certificateNo: 'PICT-ACH-2026-003',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#F59E0B', // Amber
    secondaryColor: '#D97706',
    metrics: { winRate: '65%', riskReward: '1:2.2', tradesLogged: '26' }
  },
  {
    id: 'ach-4',
    student: 'Neha P.',
    accountTier: '$100K Funded Account',
    type: 'CONSISTENCY',
    badgeLabel: 'CONSISTENCY AWARD',
    title: 'Consistency Achievement',
    payoutAmount: '$3,120.00',
    date: 'Demo Achievement',
    evaluationModel: 'Killzone Timing & Fair Value Gaps',
    certificateNo: 'PICT-ACH-2026-004',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#60A5FA', // Blue
    secondaryColor: '#4F46E5',
    metrics: { winRate: '74%', riskReward: '1:3.0', tradesLogged: '52' }
  },
  {
    id: 'ach-5',
    student: 'Karan T.',
    accountTier: '$200K Funded Account',
    type: 'ELITE_PAYOUT',
    badgeLabel: 'ELITE PAYOUT',
    title: 'Elite Master Milestone',
    payoutAmount: '$5,890.00',
    date: 'Demo Achievement',
    evaluationModel: 'Advanced Liquidity Runs & CHoCH',
    certificateNo: 'PICT-ACH-2026-005',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#F43F5E', // Rose
    secondaryColor: '#BE123C',
    metrics: { winRate: '70%', riskReward: '1:3.4', tradesLogged: '61' }
  },
  {
    id: 'ach-6',
    student: 'Divya R.',
    accountTier: '$50K Funded Account',
    type: 'RISK_DISCIPLINE',
    badgeLabel: 'RISK MANAGEMENT',
    title: 'Risk Discipline Achievement',
    payoutAmount: '$1,640.00',
    date: 'Demo Achievement',
    evaluationModel: 'Max 1% Risk Protocol & Drawdown Shield',
    certificateNo: 'PICT-ACH-2026-006',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#34D399', // Mint
    secondaryColor: '#059669',
    metrics: { winRate: '69%', riskReward: '1:2.6', tradesLogged: '41' }
  },
  {
    id: 'ach-7',
    student: 'Siddharth B.',
    accountTier: '$150K Funded Account',
    type: 'SCALING',
    badgeLabel: 'SCALE MILESTONE',
    title: 'Account Scaling Achievement',
    payoutAmount: '$4,210.00',
    date: 'Demo Achievement',
    evaluationModel: 'Multi-Timeframe Top-Down Bias',
    certificateNo: 'PICT-ACH-2026-007',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#818CF8', // Indigo
    secondaryColor: '#4338CA',
    metrics: { winRate: '71%', riskReward: '1:2.9', tradesLogged: '56' }
  },
  {
    id: 'ach-8',
    student: 'Ananya G.',
    accountTier: '$50K Funded Account',
    type: 'FIRST_PAYOUT',
    badgeLabel: 'FIRST PAYOUT',
    title: 'First Payout Achievement',
    payoutAmount: '$1,450.00',
    date: 'Demo Achievement',
    evaluationModel: 'London & NY Session Overlap',
    certificateNo: 'PICT-ACH-2026-008',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#38BDF8', // Cyan
    secondaryColor: '#0284C7',
    metrics: { winRate: '67%', riskReward: '1:2.5', tradesLogged: '33' }
  },
  {
    id: 'ach-9',
    student: 'Rohit V.',
    accountTier: '$100K Funded Account',
    type: 'FUNDED_ACCOUNT',
    badgeLabel: 'FUNDED TRADER',
    title: 'Funded Trader Milestone',
    payoutAmount: '$2,870.00',
    date: 'Demo Achievement',
    evaluationModel: 'Judas Swing & Turtle Soup Model',
    certificateNo: 'PICT-ACH-2026-009',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#F59E0B', // Amber
    secondaryColor: '#B45309',
    metrics: { winRate: '73%', riskReward: '1:2.7', tradesLogged: '48' }
  },
  {
    id: 'ach-10',
    student: 'Manoj K.',
    accountTier: '$25K Funded Account',
    type: 'PRECISION_MODEL',
    badgeLabel: 'PRECISION MODEL',
    title: 'Smart Money Precision',
    payoutAmount: '$920.00',
    date: 'Demo Achievement',
    evaluationModel: 'Premium & Discount Array Matrix',
    certificateNo: 'PICT-ACH-2026-010',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#34D399', // Mint
    secondaryColor: '#10B981',
    metrics: { winRate: '64%', riskReward: '1:2.3', tradesLogged: '29' }
  },
  {
    id: 'ach-11',
    student: 'Pooja S.',
    accountTier: '$100K Funded Account',
    type: 'CONSISTENCY',
    badgeLabel: 'PAYOUT MILESTONE',
    title: 'Payout Milestone',
    payoutAmount: '$3,450.00',
    date: 'Demo Achievement',
    evaluationModel: 'Weekly Profiles & Expansion Cycles',
    certificateNo: 'PICT-ACH-2026-011',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#60A5FA', // Blue
    secondaryColor: '#2563EB',
    metrics: { winRate: '75%', riskReward: '1:3.1', tradesLogged: '58' }
  },
  {
    id: 'ach-12',
    student: 'Aditya N.',
    accountTier: '$200K Funded Account',
    type: 'ELITE_PAYOUT',
    badgeLabel: 'ELITE PAYOUT',
    title: 'Funded Trader Milestone',
    payoutAmount: '$6,380.00',
    date: 'Demo Achievement',
    evaluationModel: 'Full Institutional ICT Playbook',
    certificateNo: 'PICT-ACH-2026-012',
    disclaimer: 'DEMO ACHIEVEMENT · ILLUSTRATIVE EXAMPLE',
    accentColor: '#38BDF8', // Cyan
    secondaryColor: '#6366F1',
    metrics: { winRate: '76%', riskReward: '1:3.5', tradesLogged: '67' }
  }
]
