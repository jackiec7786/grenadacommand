// ─── INCOME STREAMS ────────────────────────────────────────────────────────
// Max values represent the ceiling for each phase
export const INCOME_STREAMS = [
  { id: 'cambly',      name: 'Cambly',            max: 1500 },
  { id: 'callcenter',  name: 'Call Center',        max: 1800 },
  { id: 'upwork',      name: 'Upwork',             max: 4000 },
  { id: 'agency',      name: 'Digital Agency',     max: 4500 },
  { id: 'research',    name: 'Research Studies',   max: 400  },
  { id: 'spice',       name: 'SpiceClassifieds',   max: 4000 },
  { id: 'amazon',      name: 'Amazon FBA',         max: 5000 },
  { id: 'tiktok',      name: 'TikTok Shop',        max: 2000 },
  { id: 'affiliate',   name: 'Amazon Affiliate',   max: 500  },
  { id: 'etsy',        name: 'Etsy POD',           max: 600  },
  { id: 'property',    name: 'Property Mgmt',      max: 4000 },
  { id: 'other',       name: 'Other',              max: 1000 },
]

// ─── PHASE CONFIGS ─────────────────────────────────────────────────────────
export const PHASE_CONFIGS = {
  1: {
    name: 'Survival',
    months: '1–3',
    incomeTarget: 2500,
    incomeGate: '$1,500–2,500/month consistent for 30 days',
    focus: 'Cambly + Call Center + SpiceClassifieds payment fix. Nothing else.',
    color: 'danger',
    cssColor: 'var(--danger)',
    activeStreams: ['cambly', 'callcenter', 'research', 'spice'],
    keyMetric: 'Cash runway weeks',
    gateQuestion: 'Is income above $1,500/month consistently for 30 days?',
  },
  2: {
    name: 'Stability',
    months: '3–5',
    incomeTarget: 4000,
    incomeGate: '$3,000+/month consistent for 30 days',
    focus: 'Add ONE upgrade path — Upwork retainer OR digital agency. SpiceClassifieds growing.',
    color: 'warn',
    cssColor: 'var(--warn)',
    activeStreams: ['cambly', 'callcenter', 'upwork', 'agency', 'research', 'spice', 'affiliate', 'etsy'],
    keyMetric: 'Monthly income trend',
    gateQuestion: 'Is income above $3,000/month and capital growing above $10,000?',
  },
  3: {
    name: 'Build',
    months: '5–9',
    incomeTarget: 7000,
    incomeGate: 'Amazon FBA inventory in transit. Capital at $15,000+.',
    focus: 'Amazon FBA infrastructure + wholesale bridge. SpiceClassifieds event categories. Agency scaling.',
    color: 'accent2',
    cssColor: 'var(--accent2)',
    activeStreams: ['callcenter', 'upwork', 'agency', 'spice', 'amazon', 'affiliate', 'etsy', 'property'],
    keyMetric: 'Amazon FBA progress',
    gateQuestion: 'Is first PO placed and inventory in transit?',
  },
  4: {
    name: 'Scale',
    months: '9–12+',
    incomeTarget: 15000,
    incomeGate: '$8,000+/month combined, systems documented',
    focus: 'Amazon FBA live. TikTok Shop. SpiceClassifieds Caribbean expansion. Layer streams one at a time.',
    color: 'primary',
    cssColor: 'var(--accent)',
    activeStreams: ['upwork', 'agency', 'spice', 'amazon', 'tiktok', 'affiliate', 'etsy', 'property', 'other'],
    keyMetric: 'Combined income ceiling',
    gateQuestion: 'Which stream gives highest income per hour? Put 60% of effort there.',
  },
} as const

// ─── PHASE LABELS ──────────────────────────────────────────────────────────
export const PHASE_LABELS: Record<number, string> = {
  1: 'Phase 1 — Survival',
  2: 'Phase 2 — Stability',
  3: 'Phase 3 — Build',
  4: 'Phase 4 — Scale',
}

export const PHASES = [
  { n: 1, name: 'Survival' },
  { n: 2, name: 'Stability' },
  { n: 3, name: 'Build' },
  { n: 4, name: 'Scale' },
]

// ─── PHASE CHECKLISTS ──────────────────────────────────────────────────────
// Each phase has its own setup checklist
export const PHASE_CHECKLISTS: Record<number, { id: string; category: string; text: string }[]> = {
  1: [
    { id: 'p1s1',  category: 'INTERNET',  text: 'Ethernet cable plugged in — wired connection only' },
    { id: 'p1s2',  category: 'INTERNET',  text: 'Speed test at fast.com — 25+ Mbps confirmed' },
    { id: 'p1s3',  category: 'INTERNET',  text: 'Backup mobile hotspot plan activated' },
    { id: 'p1s4',  category: 'CAMBLY',    text: 'Cambly application submitted at cambly.com/tutor' },
    { id: 'p1s5',  category: 'CAMBLY',    text: 'Cambly Kids application submitted (extra $1.80/hr)' },
    { id: 'p1s6',  category: 'INCOME',    text: 'Respondent.io profile complete with full professional background' },
    { id: 'p1s7',  category: 'INCOME',    text: 'UserTesting account live and screener complete' },
    { id: 'p1s8',  category: 'INCOME',    text: 'Userlytics and Testbirds profiles created' },
    { id: 'p1s9',  category: 'JOBS',      text: 'TTEC application submitted at ttec.com/careers' },
    { id: 'p1s10', category: 'JOBS',      text: 'Transcom application submitted' },
    { id: 'p1s11', category: 'JOBS',      text: 'OutPlex application submitted' },
    { id: 'p1s12', category: 'NETWORK',   text: 'Grenada Expats, Jobs, Buy Sell Trade Facebook groups joined' },
    { id: 'p1s13', category: 'NETWORK',   text: 'First walk of the Carenage taken — identify no-Google businesses' },
    { id: 'p1s14', category: 'SPICE',     text: 'SpiceClassifieds payment bug fix confirmed with developer' },
    { id: 'p1s15', category: 'SPICE',     text: 'Featured ($15) and Premium ($50) listing tiers live' },
    { id: 'p1s16', category: 'UPWORK',    text: 'Upwork profile 100% complete with portfolio samples' },
    { id: 'p1s17', category: 'UPWORK',    text: 'First 10 Upwork proposals submitted' },
    { id: 'p1s18', category: 'AMAZON',    text: 'Amazon Associates account created (affiliate links)' },
  ],
  2: [
    { id: 'p2s1',  category: 'INCOME',    text: 'Call center income stable — first full paycheck received' },
    { id: 'p2s2',  category: 'INCOME',    text: 'Cambly regular students booked — at least 3 recurring slots weekly' },
    { id: 'p2s3',  category: 'UPWORK',    text: 'First Upwork client hired — project underway' },
    { id: 'p2s4',  category: 'UPWORK',    text: 'First 5-star Upwork review received' },
    { id: 'p2s5',  category: 'AGENCY',    text: 'First digital agency pitch sent to Caribbean tourism business' },
    { id: 'p2s6',  category: 'AGENCY',    text: 'First agency client signed — any retainer amount' },
    { id: 'p2s7',  category: 'BUSINESS',  text: 'Wyoming C-Corp formation started at northwestregisteredagent.com' },
    { id: 'p2s8',  category: 'BUSINESS',  text: 'Mercury US business bank account opened' },
    { id: 'p2s9',  category: 'SPICE',     text: 'SpiceClassifieds at 100+ active listings' },
    { id: 'p2s10', category: 'SPICE',     text: 'SpiceClassifieds WhatsApp broadcast list at 50+ subscribers' },
    { id: 'p2s11', category: 'SPICE',     text: 'SpiceClassifieds Google Business Profile claimed' },
    { id: 'p2s12', category: 'POD',       text: 'Etsy shop live with 5+ Grenada-niche designs' },
    { id: 'p2s13', category: 'AMAZON',    text: 'Amazon product research underway — Helium10 free trial active' },
    { id: 'p2s14', category: 'CAPITAL',   text: 'Capital above $10,000 and growing' },
  ],
  3: [
    { id: 'p3s1',  category: 'BUSINESS',  text: 'Wyoming C-Corp fully formed — EIN received' },
    { id: 'p3s2',  category: 'BUSINESS',  text: 'Mercury bank account funded with business capital' },
    { id: 'p3s3',  category: 'AMAZON',    text: 'Amazon Seller Central account created' },
    { id: 'p3s4',  category: 'AMAZON',    text: 'Helium10 paid plan active — product research complete' },
    { id: 'p3s5',  category: 'AMAZON',    text: 'Top 3 product candidates validated — BSR, competition, margin confirmed' },
    { id: 'p3s6',  category: 'AMAZON',    text: 'Wholesale bridge: first supplier contacted' },
    { id: 'p3s7',  category: 'AMAZON',    text: 'Wholesale bridge: first order placed and selling on Amazon' },
    { id: 'p3s8',  category: 'AMAZON',    text: 'Private label supplier shortlisted — samples ordered' },
    { id: 'p3s9',  category: 'AMAZON',    text: 'Freight forwarder selected (Unicargo or Guided Imports)' },
    { id: 'p3s10', category: 'AMAZON',    text: 'Prep center confirmed (Dollan Delaware)' },
    { id: 'p3s11', category: 'AMAZON',    text: 'Capital at $15,000+ — first private label PO placed' },
    { id: 'p3s12', category: 'SPICE',     text: 'SpiceClassifieds at 200+ listings — event categories added' },
    { id: 'p3s13', category: 'AGENCY',    text: 'Digital agency at 2+ retainer clients' },
    { id: 'p3s14', category: 'PROPERTY',  text: 'First property management inquiry received or contract signed' },
    { id: 'p3s15', category: 'TIKTOK',    text: 'TikTok account at 1,000+ followers — affiliate eligible' },
  ],
  4: [
    { id: 'p4s1',  category: 'AMAZON',    text: 'FBA inventory arrived at Amazon warehouse' },
    { id: 'p4s2',  category: 'AMAZON',    text: 'Amazon listing live and indexed' },
    { id: 'p4s3',  category: 'AMAZON',    text: 'PPC campaign running at $40/day budget' },
    { id: 'p4s4',  category: 'AMAZON',    text: '15+ Vine reviews received on first ASIN' },
    { id: 'p4s5',  category: 'AMAZON',    text: 'First profitable FBA month confirmed' },
    { id: 'p4s6',  category: 'TIKTOK',    text: 'TikTok Shop seller account approved' },
    { id: 'p4s7',  category: 'TIKTOK',    text: 'First TikTok Shop product live and driving sales' },
    { id: 'p4s8',  category: 'SPICE',     text: 'SpiceClassifieds at 500+ listings — paid ads running' },
    { id: 'p4s9',  category: 'SPICE',     text: 'SpiceClassifieds Power Seller subscriptions: 10+ active' },
    { id: 'p4s10', category: 'SPICE',     text: 'SpiceClassifieds St. Lucia expansion: triggered ($2,000+/month from Grenada)' },
    { id: 'p4s11', category: 'AGENCY',    text: 'Digital agency at 3+ retainer clients — consider hiring junior VA' },
    { id: 'p4s12', category: 'PROPERTY',  text: 'Property management at 2+ properties — concierge upsell active' },
    { id: 'p4s13', category: 'CAPITAL',   text: 'Total monthly income above $8,000 — systems documented' },
    { id: 'p4s14', category: 'CAPITAL',   text: 'Year 2 plan written — CBI consulting prep begun' },
  ],
}

// ─── PHASE SCORECARDS ──────────────────────────────────────────────────────
// 5 items to check each week per phase
export const PHASE_SCORECARDS: Record<number, Record<number, string[]>> = {
  1: {
    1: [
      'Cambly application submitted and onboarding started',
      'Research study profiles complete on all 4 platforms',
      'Call center applications submitted (TTEC, Transcom, OutPlex)',
      'Internet wired and tested — 25+ Mbps confirmed',
      'Upwork profile live with first 5 proposals sent',
    ],
    2: [
      'First Cambly session completed and PayPal connected',
      'First research study or UserTesting test completed',
      '10 Upwork proposals submitted this week',
      'Grenada Facebook groups joined and first post made',
      'SpiceClassifieds payment bug fix confirmed with developer',
    ],
    3: [
      'Cambly running 3+ sessions per week with regulars forming',
      'Call center interview or onboarding call happened',
      '10 more Upwork proposals sent this week',
      'First local contact made — name, WhatsApp, what they do',
      'SpiceClassifieds Featured and Premium tiers live and tested',
    ],
    4: [
      'Total Month 1 income above $300',
      'At least 2 income sources active and generating money',
      'One call center in hiring process or approved',
      'One real local Grenada contact made this month',
      'Still executing the plan — zero pivots to new ideas',
    ],
  },
  2: {
    1: [
      'Call center first full paycheck received',
      'Cambly at 3+ regular students — weekly bookings stable',
      'First Upwork proposal responded to or client interview scheduled',
      'First agency pitch sent to a Caribbean tourism business',
      'Wyoming C-Corp formation process started',
    ],
    2: [
      'First Upwork client hired and work underway',
      'Agency client pipeline: 3+ businesses in conversation',
      'Mercury US bank account opened and verified',
      'SpiceClassifieds at 50+ active listings',
      'Helium10 free trial started — first product searches done',
    ],
    3: [
      'First 5-star Upwork review received',
      'First agency client signed — any retainer amount',
      'Wyoming C-Corp EIN received',
      'SpiceClassifieds at 100+ active listings',
      'Capital above $8,000 and growing',
    ],
    4: [
      'Total month income above $2,500',
      'Income stable for 30 days — not fluctuating wildly',
      'One upgrade path (Upwork OR agency) generating $500+/month',
      'SpiceClassifieds WhatsApp list at 50+ subscribers',
      'Amazon product research: first 10 candidates identified',
    ],
  },
  3: {
    1: [
      'Amazon Seller Central account created',
      'Helium10 paid plan active',
      'Top product candidate validated — BSR, competition, margin checked',
      'Wholesale supplier contacted and first catalogue reviewed',
      'Agency at 2+ retainer clients generating $1,500+/month',
    ],
    2: [
      'Wholesale order placed — first Amazon inventory en route',
      'First wholesale ASIN live on Amazon',
      'Private label supplier shortlist: 3 suppliers with samples ordered',
      'Freight forwarder selected and briefed',
      'SpiceClassifieds event categories live — first festival listing added',
    ],
    3: [
      'Capital hit $15,000+ milestone',
      'Private label PO placed with confirmed supplier',
      'Prep center confirmed — Dollan Delaware briefed',
      'TikTok account at 500+ followers',
      'Property management: first outreach to CBI property owners sent',
    ],
    4: [
      'Private label inventory in transit to Amazon warehouse',
      'Amazon listing draft complete — title, bullets, images ready',
      'PPC campaign structure planned',
      'TikTok at 1,000+ followers — affiliate program applied for',
      'Total income above $4,000/month this month',
    ],
  },
  4: {
    1: [
      'Amazon FBA listing live and indexed on Amazon',
      'PPC campaign running at $40/day',
      'First 5 Vine reviews received',
      'TikTok Shop seller account approved',
      'SpiceClassifieds at 300+ listings',
    ],
    2: [
      '15+ Vine reviews received — organic rank improving',
      'First TikTok Shop product live and making sales',
      'Amazon FBA first profitable week confirmed',
      'Agency at 3+ clients — VA hire being evaluated',
      'Property management: first contract signed',
    ],
    3: [
      'First profitable FBA month confirmed',
      'TikTok Shop affiliate earning $200+/month',
      'SpiceClassifieds at 500+ listings — paid ads running',
      'SpiceClassifieds Power Seller tier: 10+ paying subscribers',
      'Total income above $8,000/month this month',
    ],
    4: [
      'SpiceClassifieds generating $2,000+/month — St. Lucia expansion triggered',
      'All streams documented — SOPs written for handoff',
      'Year 2 income target set — CBI consulting prep begun',
      'Amazon Canada FBA evaluation started',
      'Total income above $10,000/month this month',
    ],
  },
}

// ─── TASKS (per phase, contextual) ────────────────────────────────────────
export const TASKS: Record<number, { label: string; tag: string; time: string }[]> = {
  1: [
    { label: 'Run Cambly sessions — minimum 2hrs today', tag: 'CAMBLY', time: '2hr' },
    { label: 'Check Respondent + UserTesting for new studies', tag: 'INCOME', time: '15min' },
    { label: 'Submit 5 Upwork proposals (30min — do not obsess)', tag: 'UPWORK', time: '30min' },
    { label: 'Follow up call center applications — one email each', tag: 'JOBS', time: '20min' },
    { label: 'SpiceClassifieds — message 10 local businesses via WhatsApp', tag: 'SPICE', time: '30min' },
    { label: 'Post one listing category to 2 Grenada Facebook groups', tag: 'SPICE', time: '15min' },
    { label: 'Log today as active (streak)', tag: 'HABITS', time: '2min' },
  ],
  2: [
    { label: 'Deliver current Upwork client work — meet or beat deadline', tag: 'UPWORK', time: 'varies' },
    { label: 'Send 2 agency pitches to Caribbean hospitality businesses', tag: 'AGENCY', time: '45min' },
    { label: 'Cambly — 1-2 sessions to maintain regulars', tag: 'CAMBLY', time: '1-2hr' },
    { label: 'SpiceClassifieds — onboard 5 new sellers personally', tag: 'SPICE', time: '45min' },
    { label: 'Helium10 — run keyword research on 1 product niche', tag: 'AMAZON', time: '1hr' },
    { label: 'Wyoming C-Corp: check application status or next step', tag: 'BUSINESS', time: '15min' },
    { label: 'Review monthly income vs $3,000 target — adjust if needed', tag: 'FINANCE', time: '15min' },
  ],
  3: [
    { label: 'Amazon: respond to supplier comms within 24hrs', tag: 'AMAZON', time: '30min' },
    { label: 'Amazon: review listing draft — title, bullets, images', tag: 'AMAZON', time: '1hr' },
    { label: 'Agency client delivery — maintain quality and deadlines', tag: 'AGENCY', time: 'varies' },
    { label: 'SpiceClassifieds — add event vendor listings for next festival', tag: 'SPICE', time: '45min' },
    { label: 'TikTok — post one piece of Caribbean content today', tag: 'TIKTOK', time: '30min' },
    { label: 'Check capital level — update runway calculator', tag: 'FINANCE', time: '10min' },
    { label: 'Property management: follow up one CBI property owner', tag: 'PROPERTY', time: '20min' },
  ],
  4: [
    { label: 'Amazon PPC: review yesterday\'s campaign performance', tag: 'AMAZON', time: '20min' },
    { label: 'Amazon: respond to customer questions/reviews', tag: 'AMAZON', time: '15min' },
    { label: 'TikTok: post one product review or lifestyle video', tag: 'TIKTOK', time: '30min' },
    { label: 'SpiceClassifieds: Business Pro outreach to 3 local businesses', tag: 'SPICE', time: '30min' },
    { label: 'Agency: deliver client work + check in with all retainers', tag: 'AGENCY', time: 'varies' },
    { label: 'Property management: handle any guest or maintenance requests', tag: 'PROPERTY', time: 'varies' },
    { label: 'Monthly review: which stream gave highest income per hour this week?', tag: 'STRATEGY', time: '20min' },
  ],
}

// ─── MILESTONES ────────────────────────────────────────────────────────────
export const MILESTONES = [
  // Phase 1 — Survival
  { id: 'm1',  text: 'Cambly application submitted',               month: 'Day 1',     phase: 1 },
  { id: 'm2',  text: 'Research study profiles live (all 4)',        month: 'Day 1',     phase: 1 },
  { id: 'm3',  text: 'First Cambly payment received',               month: 'Week 2',    phase: 1 },
  { id: 'm4',  text: 'SpiceClassifieds payment bug fixed',          month: 'Week 1',    phase: 1 },
  { id: 'm5',  text: 'Call center approved and onboarding started', month: 'Month 2',   phase: 1 },
  { id: 'm6',  text: '$500 earned in a single month',               month: 'Month 1',   phase: 1 },
  { id: 'm7',  text: '$1,000 earned in a single month',             month: 'Month 2',   phase: 1 },
  { id: 'm8',  text: '$1,500+ earned — consistent for 30 days',     month: 'Month 3',   phase: 1 },
  // Phase 2 — Stability
  { id: 'm9',  text: 'First Upwork client hired',                   month: 'Month 2-3', phase: 2 },
  { id: 'm10', text: 'First agency retainer client signed',         month: 'Month 3-4', phase: 2 },
  { id: 'm11', text: 'Wyoming C-Corp formed + Mercury account open', month: 'Month 4',  phase: 2 },
  { id: 'm12', text: '$2,500+ earned in a month',                   month: 'Month 3',   phase: 2 },
  { id: 'm13', text: '$3,000+ earned — stable for 30 days',         month: 'Month 4',   phase: 2 },
  { id: 'm14', text: 'Capital above $10,000',                       month: 'Month 4-5', phase: 2 },
  // Phase 3 — Build
  { id: 'm15', text: 'Amazon Seller Central account created',       month: 'Month 4-5', phase: 3 },
  { id: 'm16', text: 'Top product validated (BSR + margin confirmed)', month: 'Month 5', phase: 3 },
  { id: 'm17', text: 'Wholesale bridge: first order on Amazon',     month: 'Month 5-6', phase: 3 },
  { id: 'm18', text: 'Capital at $15,000+ — private label PO placed', month: 'Month 7', phase: 3 },
  { id: 'm19', text: 'FBA inventory in transit to warehouse',       month: 'Month 7-8', phase: 3 },
  { id: 'm20', text: 'TikTok account at 1,000 followers',           month: 'Month 6-7', phase: 3 },
  // Phase 4 — Scale
  { id: 'm21', text: 'Amazon FBA listing live and indexed',         month: 'Month 8',   phase: 4 },
  { id: 'm22', text: '15+ Vine reviews on first ASIN',              month: 'Month 8-9', phase: 4 },
  { id: 'm23', text: 'First profitable FBA month confirmed',        month: 'Month 9',   phase: 4 },
  { id: 'm24', text: 'TikTok Shop approved and first sale made',    month: 'Month 10',  phase: 4 },
  { id: 'm25', text: 'SpiceClassifieds at 500+ listings',           month: 'Month 8-9', phase: 4 },
  { id: 'm26', text: 'SpiceClassifieds St. Lucia expansion live',   month: 'Month 9-12',phase: 4 },
  { id: 'm27', text: 'Total income above $8,000/month',             month: 'Month 10',  phase: 4 },
  { id: 'm28', text: 'Total income above $10,000/month',            month: 'Month 12',  phase: 4 },
]

// ─── INCOME TARGETS PER PHASE ──────────────────────────────────────────────
export const PHASE_INCOME_TARGETS: Record<number, number> = {
  1: 2500,
  2: 4000,
  3: 7000,
  4: 15000,
}

// ─── CRISIS MESSAGES ───────────────────────────────────────────────────────
export const CRISIS_MESSAGES = [
  { min: 0, max: 1,  msg: 'Under 1 week left. Crisis protocol: Cambly 6hrs/day. Nothing else.' },
  { min: 1, max: 2,  msg: 'Under 2 weeks. Flood research studies every morning. Post Google profile offer locally.' },
  { min: 2, max: 4,  msg: 'Under 4 weeks. Reduce costs now. Cambly maximum hours. No new experiments.' },
]

// ─── TYPES ─────────────────────────────────────────────────────────────────
export interface MoodEntry {
  date: string
  level: 'green' | 'yellow' | 'red'
}

export interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
  isRecurring: boolean
}

export interface PomodoroSession {
  id: string
  type: 'work' | 'break'
  duration: number
  completedAt: string
  label?: string
}

export interface AppState {
  income: Record<string, number>
  monthlyHistory: Record<string, Record<string, number>>
  scores: Record<string, Record<number, boolean>>
  tasks: Record<string, Record<number, boolean>>
  milestones: Record<string, boolean>
  phaseChecks: Record<string, boolean>
  survivalChecks: Record<string, boolean>
  cash: number
  currentPhase: number
  currentWeek: number
  currentMonth: string
  notes: string
  streakDays: number
  lastActiveDate: string
  mood: MoodEntry[]
  spice: { listings: number; whatsapp: number; subscriptions: number }
  planStartDate: string
  expenses: Expense[]
  pomodoroSessions: PomodoroSession[]
  incomeTarget: number
  // New in v4
  weeklyReviews: WeeklyReview[]
  contacts: Contact[]
  decisions: Decision[]
  capitalHistory: CapitalEntry[]
  goals: Goal[]
  // New in v5
  resilience: Record<string, boolean>
  amazonProducts: AmazonProduct[]
  eventChecks: Record<string, boolean>
  // New in v6 utilities
  upworkProposals: UpworkProposal[]
  credentials: Credential[]
  speedLog: SpeedEntry[]
}

export const DEFAULT_STATE: AppState = {
  income: {},
  monthlyHistory: {},
  scores: {},
  tasks: {},
  milestones: {},
  phaseChecks: {},
  survivalChecks: {},
  cash: 0,
  currentPhase: 1,
  currentWeek: 1,
  currentMonth: new Date().toISOString().slice(0, 7),
  notes: '',
  streakDays: 0,
  lastActiveDate: '',
  mood: [],
  spice: { listings: 0, whatsapp: 0, subscriptions: 0 },
  planStartDate: '',
  expenses: [],
  pomodoroSessions: [],
  incomeTarget: 2500,
  weeklyReviews: [],
  contacts: [],
  decisions: [],
  capitalHistory: [],
  goals: [],
  resilience: {},
  amazonProducts: [],
  eventChecks: {},
  upworkProposals: [],
  credentials: [],
  speedLog: [],
}

// ─── WEEKLY REVIEW ─────────────────────────────────────────────────────────
export interface WeeklyReview {
  id: string
  weekNumber: number
  planMonth: number
  dateCompleted: string
  wentWell: string
  didntWork: string
  oneFocus: string
  incomeThisWeek: number
  cashPosition: number
  phaseAtTime: number
  energyRating: 'green' | 'yellow' | 'red'
}

// ─── CONTACTS ──────────────────────────────────────────────────────────────
export const CONTACT_CATEGORIES = [
  'Call Center',
  'Upwork Client',
  'Agency Client',
  'Developer',
  'Marina / Network',
  'Amazon Supplier',
  'Property Owner',
  'SpiceClassifieds',
  'Other',
] as const

export type ContactCategory = typeof CONTACT_CATEGORIES[number]

export const CONTACT_STATUSES = [
  'To Contact',
  'Contacted',
  'In Progress',
  'Active',
  'On Hold',
  'Closed',
] as const

export type ContactStatus = typeof CONTACT_STATUSES[number]

export interface Contact {
  id: string
  name: string
  category: ContactCategory
  status: ContactStatus
  lastContactDate: string
  nextAction: string
  notes: string
  phone?: string
  email?: string
}

// ─── DECISION LOG ──────────────────────────────────────────────────────────
export const DECISION_CATEGORIES = [
  'Phase Advance',
  'Income Strategy',
  'Amazon FBA',
  'SpiceClassifieds',
  'Capital Allocation',
  'Cut / Stop',
  'Other',
] as const

export interface Decision {
  id: string
  date: string
  category: typeof DECISION_CATEGORIES[number]
  decision: string
  reasoning: string
  phase: number
  outcome?: string
}

// ─── NET WORTH / CAPITAL ───────────────────────────────────────────────────
export interface CapitalEntry {
  id: string
  month: string  // YYYY-MM
  cashBalance: number
  businessAssets: number  // inventory, equipment, deposits
  platformBalances: number  // Stripe, PayPal, Wise outstanding
  liabilities: number  // owed to suppliers, loans
  notes: string
}

// ─── GOALS WITH SUB-TASKS ──────────────────────────────────────────────────
export interface GoalSubTask {
  id: string
  text: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  phase: number
  targetDate: string
  status: 'not-started' | 'in-progress' | 'complete' | 'blocked'
  subTasks: GoalSubTask[]
  notes: string
}

// ─── UTILITY TYPES ────────────────────────────────────────────────────────
export interface UpworkProposal {
  id: string
  date: string
  jobTitle: string
  category: string
  rateBid: number
  status: 'sent' | 'viewed' | 'interviewing' | 'hired' | 'declined' | 'no-response'
  notes: string
}

export interface Credential {
  id: string
  platform: string
  category: string
  username: string
  email: string
  password: string
  accountNumber: string
  notes: string
  url: string
}

export interface SpeedEntry {
  id: string
  date: string
  download: number
  upload: number
  connection: 'wired' | 'wifi' | 'hotspot'
  notes: string
}

// ─── EXTEND APP STATE ──────────────────────────────────────────────────────
// These are added to AppState via intersection — update AppState interface:

// ─── GRENADA EVENT CALENDAR ────────────────────────────────────────────────
export interface GrenadaEvent {
  id: string
  name: string
  dates: string
  confirmedDates: string  // ISO range or single date
  audience: string
  audienceSize: string
  spiceAction: string
  revenueModel: string
  realisticRevenue: string
  urgency: 'now' | 'soon' | 'upcoming' | 'future'
  category: 'festival' | 'sailing' | 'food' | 'culture' | 'business'
}

export const GRENADA_EVENTS: GrenadaEvent[] = [
  {
    id: 'ev1',
    name: 'Carriacou Maroon & String Band Festival',
    dates: 'April 24–26, 2026',
    confirmedDates: '2026-04-24',
    audience: 'Regional Caribbean, diaspora, cultural tourists',
    audienceSize: '5,000+',
    spiceAction: 'Add Carriacou Experience category. List local transport, accommodation, tour guides. Pitch 10 Carriacou vendors this week.',
    revenueModel: 'Featured listings $15–50. Transport/accommodation referrals.',
    realisticRevenue: '$50–200 this event',
    urgency: 'now',
    category: 'culture',
  },
  {
    id: 'ev2',
    name: 'Grenada Chocolate Festival',
    dates: 'May 22–27, 2026',
    confirmedDates: '2026-05-22',
    audience: 'Food tourists, cocoa industry, international press',
    audienceSize: '3,000+',
    spiceAction: 'Create Chocolate Festival vendor section. Pitch estate tours, accommodation, transport, food vendors. Target 30 listings before May 1.',
    revenueModel: 'Featured placement $50. Business Pro pitch to estate operators. Lead gen for tour packages.',
    realisticRevenue: '$150–400 this event',
    urgency: 'soon',
    category: 'food',
  },
  {
    id: 'ev3',
    name: 'Spicemas 2026 (Grenada Carnival)',
    dates: 'August 1–11, 2026',
    confirmedDates: '2026-08-01',
    audience: 'Diaspora returning, regional visitors, costume/music fans',
    audienceSize: '20,000+',
    spiceAction: 'Largest revenue event of year. Costume makers, pan yards, fetes, accommodation, catering — all list here. Start outreach June 1. Aim for 100+ Spicemas listings.',
    revenueModel: 'Featured $50, Premium $150 for event week. Power Seller subscriptions for vendors. WhatsApp broadcast to 500+ subscribers.',
    realisticRevenue: '$500–1,500 across the season',
    urgency: 'upcoming',
    category: 'festival',
  },
  {
    id: 'ev4',
    name: 'Grenada Sailing Week 2027',
    dates: 'January 25–30, 2027',
    confirmedDates: '2027-01-25',
    audience: 'International sailing community, yacht crews, marine industry',
    audienceSize: '3,500+',
    spiceAction: 'Build year-round yachting/marine category. Charter services, provisioning, crew accommodation, marine supplies. IGY Marina and Port Louis contacts are the entry point.',
    revenueModel: 'Marine Business Pro subscription $99/month. Premium listings for charter operators. Lead gen for crew accommodation.',
    realisticRevenue: '$200–600 for sailing week + recurring marine subscriptions',
    urgency: 'future',
    category: 'sailing',
  },
  {
    id: 'ev5',
    name: 'Hurricane Season Preparation Window',
    dates: 'June–November (annual)',
    confirmedDates: '2026-06-01',
    audience: 'Property owners, contractors, hardware suppliers',
    audienceSize: 'All Grenada residents',
    spiceAction: 'Hurricane Beryl reconstruction demand is active. Add Construction/Trades category. Hardware suppliers, contractors, and repair services are in high demand.',
    revenueModel: 'Construction Business Pro $99/month. Featured contractor listings. Lead gen for large jobs.',
    realisticRevenue: '$200–800/month during active season',
    urgency: 'upcoming',
    category: 'business',
  },

  // ── 2026 public holidays (upcoming from Apr 25 2026) ──────────────────
  { id: 'ph_2026_labour',       name: 'Labour Day',                   dates: 'May 1, 2026',      confirmedDates: '2026-05-01', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'now',      category: 'culture'  },
  { id: 'ph_2026_whit',         name: 'Whit Monday',                  dates: 'May 25, 2026',     confirmedDates: '2026-05-25', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'soon',     category: 'culture'  },
  { id: 'ph_2026_corpus',       name: 'Corpus Christi',               dates: 'Jun 4, 2026',      confirmedDates: '2026-06-04', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'soon',     category: 'culture'  },
  { id: 'bday_sp_2026',         name: "Sp's Birthday",                dates: 'Jun 8, 2026',      confirmedDates: '2026-06-08', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'soon',     category: 'culture'  },
  { id: 'ph_2026_emancipation', name: 'Emancipation Day (in lieu)',   dates: 'Aug 3, 2026',      confirmedDates: '2026-08-03', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'upcoming', category: 'culture'  },
  { id: 'ph_2026_carnival_mon', name: 'Carnival Monday',              dates: 'Aug 10, 2026',     confirmedDates: '2026-08-10', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'upcoming', category: 'festival' },
  { id: 'ph_2026_carnival_tue', name: 'Carnival Tuesday',             dates: 'Aug 11, 2026',     confirmedDates: '2026-08-11', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'upcoming', category: 'festival' },
  { id: 'ph_2026_heroes',       name: 'National Heroes Day',          dates: 'Oct 19, 2026',     confirmedDates: '2026-10-19', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'upcoming', category: 'culture'  },
  { id: 'ph_2026_thanks',       name: 'Thanksgiving',                 dates: 'Oct 25–26, 2026',  confirmedDates: '2026-10-25', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'upcoming', category: 'culture'  },
  { id: 'ph_2026_christmas',    name: 'Christmas Day',                dates: 'Dec 25, 2026',     confirmedDates: '2026-12-25', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2026_boxing',       name: 'Boxing Day',                   dates: 'Dec 26, 2026',     confirmedDates: '2026-12-26', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },

  // ── 2027 public holidays ──────────────────────────────────────────────
  { id: 'ph_2027_newyear',      name: "New Year's Day",               dates: 'Jan 1, 2027',      confirmedDates: '2027-01-01', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_independence', name: 'Independence Day',             dates: 'Feb 7–8, 2027',    confirmedDates: '2027-02-07', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_goodfriday',   name: 'Good Friday',                  dates: 'Mar 26, 2027',     confirmedDates: '2027-03-26', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_easter',       name: 'Easter Monday',                dates: 'Mar 29, 2027',     confirmedDates: '2027-03-29', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_labour',       name: 'Labour Day',                   dates: 'May 1, 2027',      confirmedDates: '2027-05-01', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_whit',         name: 'Whit Monday',                  dates: 'May 17, 2027',     confirmedDates: '2027-05-17', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_corpus',       name: 'Corpus Christi',               dates: 'May 27, 2027',     confirmedDates: '2027-05-27', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_emancipation', name: 'Emancipation Day (in lieu)',   dates: 'Aug 2, 2027',      confirmedDates: '2027-08-02', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_carnival_mon', name: 'Carnival Monday',              dates: 'Aug 9, 2027',      confirmedDates: '2027-08-09', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'festival' },
  { id: 'ph_2027_carnival_tue', name: 'Carnival Tuesday',             dates: 'Aug 10, 2027',     confirmedDates: '2027-08-10', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'festival' },
  { id: 'ph_2027_heroes',       name: 'National Heroes Day',          dates: 'Oct 19, 2027',     confirmedDates: '2027-10-19', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_thanks',       name: 'Thanksgiving',                 dates: 'Oct 25, 2027',     confirmedDates: '2027-10-25', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_christmas',    name: 'Christmas Day',                dates: 'Dec 25, 2027',     confirmedDates: '2027-12-25', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
  { id: 'ph_2027_boxing',       name: 'Boxing Day',                   dates: 'Dec 26, 2027',     confirmedDates: '2027-12-26', audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '', urgency: 'future',   category: 'culture'  },
]

// ─── RISK / CONTINGENCY PROTOCOLS ─────────────────────────────────────────
export interface RiskScenario {
  id: string
  title: string
  probability: 'HIGH' | 'MEDIUM' | 'LOW'
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  immediateActions: string[]
  parallelActions: string[]
  prevention: string[]
}

export const RISK_SCENARIOS: RiskScenario[] = [
  {
    id: 'r1',
    title: 'Amazon Account Suspension',
    probability: 'HIGH',
    impact: 'CRITICAL',
    immediateActions: [
      'Do NOT appeal immediately — read the suspension notice fully first',
      'Hire an Amazon suspension specialist (not a VA, a specialist)',
      'Activate Shopify + Instagram as alternative channels same day',
      'Do not create a new seller account — permanent ban risk',
    ],
    parallelActions: [
      'Rebuild income from Track A (Cambly, call center, Upwork) immediately',
      'Contact all active customers via email list — direct sales only',
      'Prepare Plan of Action (POA) document with specialist',
      'Timeline: POA submission within 14 days of suspension',
    ],
    prevention: [
      'Never exceed 1% order defect rate',
      'Maintain 2+ qualified suppliers — never single-source',
      'Product liability insurance: $2M coverage minimum',
      'No incentivised reviews — Vine only',
    ],
  },
  {
    id: 'r2',
    title: 'TikTok Shop Ban (US Federal)',
    probability: 'HIGH',
    impact: 'CRITICAL',
    immediateActions: [
      'Activate Instagram Shop immediately — same products, same content',
      'Register Walmart Marketplace as backup channel (do this before ban)',
      'Download all TikTok content — repurpose for Instagram Reels and YouTube Shorts',
      'Contact all TikTok customers via any email/DM collected',
    ],
    parallelActions: [
      'Shift TikTok ad budget to Meta immediately',
      'Apply to Walmart Marketplace seller program now — approval takes 2–4 weeks',
      'TikTok affiliate links redirect to Amazon — protect that revenue stream',
    ],
    prevention: [
      'Never let TikTok exceed 30% of total revenue — hard rule',
      'Maintain Amazon FBA as primary channel always',
      'Register Instagram Shop and Walmart in Month 9 alongside TikTok — not after',
    ],
  },
  {
    id: 'r3',
    title: 'Freight / Prep Centre Failure',
    probability: 'MEDIUM',
    impact: 'HIGH',
    immediateActions: [
      'Contact backup freight forwarder (Flexport or Guided Imports) immediately',
      'Request inventory status from failed provider — get written confirmation',
      'File freight insurance claim if inventory is lost or damaged',
      'Notify Amazon of delay via Seller Central — extend lead time in inventory settings',
    ],
    parallelActions: [
      'Activate Jay Group (prep centre backup) for all future shipments',
      'Request inventory redirect if goods are in transit',
    ],
    prevention: [
      'Primary: Unicargo or Guided Imports for freight',
      'Primary: Dollan (Delaware) for prep',
      'Backup: Flexport for freight, Jay Group for prep — both briefed before first shipment',
      'Never use same freight + prep provider — dual failure risk',
    ],
  },
  {
    id: 'r4',
    title: 'Supplier Collapse or Quality Failure',
    probability: 'MEDIUM',
    impact: 'HIGH',
    immediateActions: [
      'Request all open PO deposits back in writing immediately',
      'Activate backup supplier — samples should already be on file',
      'Do not launch with failing supplier product — listing suspension risk',
      'Check AliExpress for emergency stopgap stock if inventory is critically low',
    ],
    parallelActions: [
      'File Alibaba Trade Assurance claim if deposit protected',
      'Begin new supplier qualification — 3 candidates, samples ordered within 7 days',
    ],
    prevention: [
      'Maintain 2 qualified suppliers per product at all times',
      'Quality inspection at factory before shipment — never skip',
      'Never pay more than 30% deposit before samples approved',
      'Alibaba Trade Assurance on all orders — non-negotiable',
    ],
  },
  {
    id: 'r5',
    title: 'Banking / Currency Crisis',
    probability: 'LOW',
    impact: 'HIGH',
    immediateActions: [
      'Move funds from affected account to Wise immediately',
      'Notify Amazon and all clients of new payment details',
      'Use Wise as primary operating account until resolved',
      'Do not leave more than 1 month operating expenses in any single account',
    ],
    parallelActions: [
      'Open Payoneer as third USD account backup',
      'Ensure local Grenada account has 2 months living expenses minimum',
    ],
    prevention: [
      'Maintain: Mercury (primary US business) + Wise (international) + local Grenada account',
      'Never concentrate more than 40% of capital in one account',
      'Crypto (USDC) as last-resort backup — hardware wallet only',
    ],
  },
  {
    id: 'r6',
    title: 'Track A Income Collapses (Below $1,500 at Month 3)',
    probability: 'MEDIUM',
    impact: 'CRITICAL',
    immediateActions: [
      'STOP all business spending immediately — freeze all non-essential outflows',
      'Full focus on Cambly — 6 hours per day, every day',
      'Flood Respondent.io and UserTesting — apply to every available study',
      'Do NOT touch Amazon capital under any circumstances',
    ],
    parallelActions: [
      'Post Google Business Profile offer in all Grenada Facebook groups ($50 per setup)',
      'Direct WhatsApp outreach to 20 personal contacts for any remote work',
      'Reduce living costs immediately — local market, bus not taxi, negotiate rent',
    ],
    prevention: [
      'Never let Cambly slip below 2 hours/day during Phase 1',
      'Maintain minimum 4 active income applications at all times',
      'Keep 3-month cash reserve before any FBA spending begins',
    ],
  },
]

export const RISK_QUICK_RESPONSES: { trigger: string; response: string }[] = [
  { trigger: 'Call center rejects Grenada', response: 'Double down on Upwork + Cambly + digital agency outreach — all three verified accessible from Grenada' },
  { trigger: 'SpiceClassifieds payment still broken', response: 'Do not launch any paid tier. Fix before monetizing. Every day it runs broken is leaking revenue.' },
  { trigger: 'Amazon listing rejected', response: 'Fix compliance issue — do not panic-appeal. Read the rejection reason fully. Hire specialist if ASIN flagged.' },
  { trigger: 'Supplier misses deadline', response: 'Activate backup supplier immediately. Never single-source after first order. Request deposit refund in writing.' },
  { trigger: 'TikTok gets banned in US', response: 'Instagram Shop + Walmart already registered and ready — activate same day. Shift ad budget to Meta.' },
  { trigger: 'Capital runs out before FBA launch', response: 'Pause FBA. Rebuild with Track A. Do not borrow to fund inventory — ever.' },
  { trigger: 'Amazon account suspended', response: 'Do not appeal immediately. Hire specialist. Activate Shopify + Instagram as alternative channels.' },
  { trigger: 'SpiceClassifieds stalls below 200 listings', response: 'Stop all other SpiceClassifieds work. Personally onboard 50 sellers by phone and WhatsApp.' },
  { trigger: 'Track A income below $1,500 at Month 3', response: 'Stop all business spending. Full focus on jobs. Do not touch Amazon or SpiceClassifieds capital.' },
  { trigger: 'Upwork not generating after 30 proposals', response: 'Lower rate for first 2 clients to get reviews, then raise. Or pivot to direct digital agency outreach.' },
  { trigger: 'Hurricane disrupts operations', response: 'Platform on cloud hosting survives. WhatsApp broadcast notifies users. 3-month cash reserve covers living costs.' },
  { trigger: 'CBI program changes or suspends', response: 'Pivot SpiceClassifieds to remote workers + retirees + eco-tourism. Same platform, different audience.' },
]

// ─── RESILIENCE SCORECARD ─────────────────────────────────────────────────
export const RESILIENCE_ITEMS = [
  { id: 'res1',  category: 'Platform',   text: 'No single income platform above 40% of monthly revenue', ideal: 'Below 30%' },
  { id: 'res2',  category: 'Platform',   text: 'TikTok Shop never exceeds 30% of total revenue', ideal: 'Below 20%' },
  { id: 'res3',  category: 'Suppliers',  text: '2+ qualified Amazon suppliers per product on file', ideal: '3 across 2 countries' },
  { id: 'res4',  category: 'Logistics',  text: 'Backup freight forwarder briefed (Flexport or Guided Imports)', ideal: '3 options total' },
  { id: 'res5',  category: 'Logistics',  text: 'Backup prep centre confirmed (Jay Group)', ideal: '2 prep centres briefed' },
  { id: 'res6',  category: 'Banking',    text: 'Mercury (primary US) + Wise (international) both active', ideal: 'Plus local Grenada account' },
  { id: 'res7',  category: 'Banking',    text: 'No more than 40% of capital in any single account', ideal: '25% max per account' },
  { id: 'res8',  category: 'Emergency',  text: '3 months operating expenses in cash ($15,000 minimum)', ideal: '6 months ($30,000+)' },
  { id: 'res9',  category: 'Insurance',  text: 'Amazon cargo insurance on all shipments', ideal: 'Plus product liability $2M' },
  { id: 'res10', category: 'Platforms',  text: 'Instagram Shop registered as TikTok backup', ideal: 'Plus Walmart Marketplace' },
  { id: 'res11', category: 'Platforms',  text: 'Amazon FBA never falls below 40% of total e-commerce revenue', ideal: '60% minimum always' },
  { id: 'res12', category: 'SpiceClass', text: 'SpiceClassifieds has its own revenue before depending on it', ideal: '$500+/month before expansion' },
]

// ─── AMAZON PRODUCT TRACKER ───────────────────────────────────────────────
export interface AmazonProduct {
  id: string
  name: string
  niche: string
  targetPrice: number
  estimatedMargin: number
  bsrRange: string
  competitorCount: number
  status: 'researching' | 'validated' | 'sampling' | 'ordered' | 'live' | 'cut'
  helium10Score: number  // 0-100
  supplierName: string
  supplierContact: string
  sampleOrdered: boolean
  sampleApproved: boolean
  moq: number
  unitCost: number
  notes: string
}

export const PRODUCT_VALIDATION_CRITERIA = [
  'BSR in top 1% of category (under 50,000 in most categories)',
  'Monthly revenue $10,000–100,000 for top 10 listings',
  'Less than 300 reviews on page 1 average',
  'Main keyword search volume 5,000–50,000/month',
  'Can differentiate from existing listings (size, material, bundle)',
  'Estimated margin 35%+ at target price',
  'Not seasonal — sells year-round',
]

// ─── PSYCHOLOGICAL CONTRACT MESSAGES ─────────────────────────────────────
export const PSYCH_MESSAGES = {
  month1: [
    'Week 1 will feel like nothing is working. That is exactly what Week 1 feels like.',
    'You have submitted the applications. The income starts in 7–14 days. Not today.',
    'The plan works over months, not days. The people who succeed are more patient, not smarter.',
    'Do not make strategic decisions in Week 1. Execute the plan. Evaluate in Week 4.',
  ],
  lowMood: [
    'Do not make strategic decisions on red days. Cambly sessions, a walk, local food. Tomorrow is different.',
    'Everyone building something from scratch has days that feel exactly like this.',
    'The plan did not break. The day broke. Execute one small thing and call it done.',
    'Rough days are not evidence the plan is wrong. They are evidence you are human.',
  ],
  lowIncome: [
    'Income in Month 1 is $300–800. That is in the plan. You are on track.',
    'Every income source takes 2–4 weeks to ramp. You are in the ramp period.',
    'The gap between now and $1,500/month is smaller than it feels. Keep the applications active.',
    'Call center approvals take 2–4 weeks. That time is passing whether you panic or not.',
  ],
  onTrack: [
    'Consistency on one thing always beats novelty on ten things.',
    'The foundation is being built. The income will follow the foundation.',
    'Small progress on the right thing is more valuable than large progress on the wrong thing.',
    'You are further along than it feels from inside the work.',
  ],
  streakMilestone: [
    '7 days straight. That is the hardest week. It gets easier from here.',
    '14 days. You have built a habit. Habits compound.',
    '30 days. A month in. This is now who you are.',
  ],
}

export const QUOTES = [
  { text: "The sea does not reward those who are too anxious, too greedy, or too impatient. To dig for treasures shows not only impatience and greed, but lack of faith. Patience, patience, patience, is what the sea teaches.", author: "Anne Morrow Lindbergh" },
  { text: "Small islands make large contributions to the world.", author: "Island Proverb" },
  { text: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Unknown" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "A rising tide lifts all boats.", author: "John F. Kennedy" },
  { text: "The ocean is a mighty harmonist.", author: "William Wordsworth" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Grenada is not just a place. It is a state of mind — warm, resilient, and full of potential.", author: "Island Wisdom" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
  { text: "The spice must flow. So must the work.", author: "Grenada Command" },
  { text: "Opportunities are like sunrises. If you wait too long, you miss them.", author: "William Arthur Ward" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Nutmeg, mace, cinnamon — Grenada's spices carried the world. So will your work.", author: "Island Wisdom" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
]
