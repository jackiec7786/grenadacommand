// ─── INCOME STREAMS ────────────────────────────────────────────────────────
export const INCOME_STREAMS = [
  { id: 'spice',       name: 'SpiceClassifieds',    max: 6000 },
  { id: 'digitize',    name: 'Local Digitization',  max: 5000 },
  { id: 'n8n',         name: 'n8n/Make Automation', max: 4000 },
  { id: 'aivoice',     name: 'AI Voice Agents',     max: 8000 },
  { id: 'whatsapp',    name: 'WhatsApp AI Agents',  max: 4000 },
  { id: 'aiagency',    name: 'AI Agency Retainers', max: 12000 },
  { id: 'yacht',       name: 'Yacht Concierge',     max: 4000 },
  { id: 'cohost',      name: 'Vacation Co-hosting', max: 8000 },
  { id: 'cbi',         name: 'CBI Local Fixer',     max: 5000 },
  { id: 'hotel',       name: 'Hotel Retainers',     max: 8000 },
  { id: 'bridge',      name: 'Bridge Income',       max: 1500 },
  { id: 'other',       name: 'Other',               max: 2000 },
]

// ─── PHASE CONFIGS ─────────────────────────────────────────────────────────
export const PHASE_CONFIGS = {
  1: {
    name: 'Survival',
    months: '1–3',
    incomeTarget: 2500,
    incomeGate: '$1,500/month consistent for 30 days + at least 2 income sources stable',
    focus: 'Walk into businesses. SpiceClassifieds banner sales + local digitization pipeline. Apply bridge income Day 1.',
    color: 'danger',
    cssColor: 'var(--danger)',
    activeStreams: ['spice', 'digitize', 'bridge', 'yacht'],
    keyMetric: 'Cash runway weeks',
    gateQuestion: 'Is income above $1,500/month consistently for 30 days?',
  },
  2: {
    name: 'Stability',
    months: '3–6',
    incomeTarget: 5000,
    incomeGate: '$3,000/month stable + Wyoming LLC formed + capital growing',
    focus: 'AI retainer clients. Wyoming LLC. SpiceClassifieds job board + dealer subs. First co-hosting property.',
    color: 'warn',
    cssColor: 'var(--warn)',
    activeStreams: ['spice', 'digitize', 'n8n', 'aivoice', 'whatsapp', 'yacht', 'cohost', 'cbi', 'bridge'],
    keyMetric: 'Monthly income trend',
    gateQuestion: 'Is income above $3,000/month stable AND Wyoming LLC formed AND capital growing?',
  },
  3: {
    name: 'Build',
    months: '6–12',
    incomeTarget: 8000,
    incomeGate: '3+ AI retainer clients + first IsleClassifieds island expansion live',
    focus: 'AI retainer book 5–8 clients. IsleClassifieds Dominica+SVG. Co-hosting 8–12 properties. First hotel retainer.',
    color: 'accent2',
    cssColor: 'var(--accent2)',
    activeStreams: ['spice', 'n8n', 'aivoice', 'whatsapp', 'aiagency', 'yacht', 'cohost', 'cbi', 'hotel'],
    keyMetric: 'AI retainer MRR',
    gateQuestion: 'Are 3+ AI retainers stable AND Grenada SpiceClassifieds at EC$10,000/mo?',
  },
  4: {
    name: 'Scale',
    months: '12–24',
    incomeTarget: 15000,
    incomeGate: 'Systems documented, team hired, multi-island classifieds running',
    focus: 'AI agency at scale. Multi-island IsleClassifieds. Co-hosting 20+ properties. Hotel retainers 3–5. CBI developer partnerships.',
    color: 'primary',
    cssColor: 'var(--accent)',
    activeStreams: ['spice', 'aiagency', 'cohost', 'hotel', 'cbi', 'yacht', 'other'],
    keyMetric: 'Combined MRR',
    gateQuestion: 'Which stream delivers highest income per hour? Put 60% of effort there.',
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
export const PHASE_CHECKLISTS: Record<number, { id: string; category: string; text: string }[]> = {
  1: [
    { id: 'p1s1',  category: 'PAYMENTS',    text: 'Payoneer account live at payoneer.com — primary receiving rail' },
    { id: 'p1s2',  category: 'PAYMENTS',    text: 'Wise personal account live — best FX for moving money' },
    { id: 'p1s3',  category: 'PAYMENTS',    text: 'Coinbase + USDC wallet created — 10 minutes, unlocks high-ticket clients' },
    { id: 'p1s4',  category: 'PAYMENTS',    text: 'Deel contractor profile at deel.com — enables US company direct hires' },
    { id: 'p1s5',  category: 'PAYMENTS',    text: 'RemotePass account created — physical card for local spending' },
    { id: 'p1s6',  category: 'PAYMENTS',    text: 'WiPay account at wipaycaribbean.com — for SpiceClassifieds local payments' },
    { id: 'p1s7',  category: 'PAYMENTS',    text: 'W-8BEN form downloaded from irs.gov, filled out, saved as PDF — ready before first US client' },
    { id: 'p1s8',  category: 'SPICE',       text: 'SpiceClassifieds payment bug confirmed fixed — test end-to-end' },
    { id: 'p1s9',  category: 'SPICE',       text: 'Founding sponsor rate card built (5-slide pitch deck)' },
    { id: 'p1s10', category: 'SPICE',       text: 'List of 15 Grenada target businesses written — SMB owners first, not corporate' },
    { id: 'p1s11', category: 'SPICE',       text: 'First 8 founding sponsor meetings walked into and pitched' },
    { id: 'p1s12', category: 'SPICE',       text: 'First 2–3 founding sponsors signed — prepaid 3-month deal' },
    { id: 'p1s13', category: 'SPICE',       text: 'SpiceClassifieds affiliate links live: Starlink, SafetyWing, WorldNomads, Wise referral' },
    { id: 'p1s14', category: 'SPICE',       text: 'Job board: 5 real Grenada job listings seeded for free (from Carenage walk-ins)' },
    { id: 'p1s15', category: 'LOCAL',       text: 'Grenada Expats, Jobs, Buy Sell Trade Facebook groups joined' },
    { id: 'p1s16', category: 'LOCAL',       text: 'Expat tech setup post published in Grenada Expats Facebook group' },
    { id: 'p1s17', category: 'LOCAL',       text: 'Grand Anse corridor walk done — 5+ tourist-facing businesses identified with no Google profile' },
    { id: 'p1s18', category: 'LOCAL',       text: 'First QR menu or Google profile job closed and paid' },
    { id: 'p1s19', category: 'LOCAL',       text: 'Port Louis and Clarkes Court marina walk done — first yacht captain contact made' },
    { id: 'p1s20', category: 'LOCAL',       text: 'First tour operator pitched with Rezdy booking demo (NOT FareHarbor — Stripe blocked)' },
    { id: 'p1s21', category: 'AI-BIZ',      text: 'AI consulting brand domain purchased' },
    { id: 'p1s22', category: 'AI-BIZ',      text: 'Landing page live: offer, outcomes, $497 audit Calendly link' },
    { id: 'p1s23', category: 'AI-BIZ',      text: 'LinkedIn updated: "AI Workflow Engineer | n8n, Make, Claude | AST timezone"' },
    { id: 'p1s24', category: 'BRIDGE',      text: 'Applied to Invisible Technologies (invisible.email)' },
    { id: 'p1s25', category: 'BRIDGE',      text: 'Applied to Pareto.ai — highlight Claude/coding skills for specialist track ($160/hr)' },
    { id: 'p1s26', category: 'BRIDGE',      text: 'Emailed Surge AI at talent@surgehq.ai with AI eval pitch' },
    { id: 'p1s27', category: 'BRIDGE',      text: 'Respondent.io profile complete — professional background entered for high-value B2B studies' },
    { id: 'p1s28', category: 'UPWORK',      text: 'Upwork profile 100% complete with n8n/Make/Claude skills highlighted' },
    { id: 'p1s29', category: 'UPWORK',      text: 'First 10 targeted Upwork proposals sent (n8n/Make niche only)' },
    { id: 'p1s30', category: 'UPWORK',      text: 'First-review underbid executed: one $300–400 bid on a $500–800 project for first review' },
  ],
  2: [
    { id: 'p2s1',  category: 'INCOME',      text: 'SpiceClassifieds: 6+ founding sponsors active — EC$2,000–3,500/mo confirmed' },
    { id: 'p2s2',  category: 'INCOME',      text: 'SpiceClassifieds job board: first paid listing sold at EC$200–400' },
    { id: 'p2s3',  category: 'INCOME',      text: 'SpiceClassifieds: first car dealer subscription pitched (Massy, McIntyre, ANSA)' },
    { id: 'p2s4',  category: 'AI-BIZ',      text: 'First Upwork 5-star review received — full rate proposals now' },
    { id: 'p2s5',  category: 'AI-BIZ',      text: 'First AI audit paid ($497–997) — converted or in conversion to sprint' },
    { id: 'p2s6',  category: 'AI-BIZ',      text: 'SpiceClassifieds WhatsApp AI bot demo built (3–5 hours) — sales tool for hotels' },
    { id: 'p2s7',  category: 'AI-BIZ',      text: 'First Grand Anse hotel pitched with live WhatsApp bot demo' },
    { id: 'p2s8',  category: 'BUSINESS',    text: 'Wyoming LLC formation started via Firstbase ($399) or Doola ($297)' },
    { id: 'p2s9',  category: 'BUSINESS',    text: 'Mercury US bank account opened and verified' },
    { id: 'p2s10', category: 'BUSINESS',    text: 'EIN received from IRS' },
    { id: 'p2s11', category: 'LOCAL',       text: 'Local digitization pipeline: 3–5 active clients at various stages' },
    { id: 'p2s12', category: 'LOCAL',       text: 'First vacation rental co-hosting property: Airbnb co-host payment split set up FIRST before starting' },
    { id: 'p2s13', category: 'LOCAL',       text: 'CBI law firm introductory meeting done (Ciboney, Grant Joseph, or similar)' },
    { id: 'p2s14', category: 'UPWORK',      text: 'First n8n retainer client signed ($500–1,500/mo)' },
  ],
  3: [
    { id: 'p3s1',  category: 'AI-BIZ',      text: 'Wyoming LLC fully operational — EIN + Mercury + Stripe active' },
    { id: 'p3s2',  category: 'AI-BIZ',      text: 'AI voice agent demo complete (HVAC scenario, 20–40 hours total build)' },
    { id: 'p3s3',  category: 'AI-BIZ',      text: 'Apollo prospect list built: 500 HVAC/dental/roofing US businesses' },
    { id: 'p3s4',  category: 'AI-BIZ',      text: 'Cold email campaign live (Smartlead/Instantly): 50+ sends per day' },
    { id: 'p3s5',  category: 'AI-BIZ',      text: 'First AI voice agent client signed ($1,500–5,000 setup + retainer)' },
    { id: 'p3s6',  category: 'AI-BIZ',      text: '3+ AI retainer clients active — $3,000+/mo from AI services alone' },
    { id: 'p3s7',  category: 'AI-BIZ',      text: 'Anthropic Claude Partner Network application submitted' },
    { id: 'p3s8',  category: 'SPICE',       text: 'SpiceClassifieds Grenada at EC$10,000/mo — IsleClassifieds expansion gate cleared' },
    { id: 'p3s9',  category: 'SPICE',       text: 'SpiceClassifieds: 500+ active listings' },
    { id: 'p3s10', category: 'SPICE',       text: 'SpiceClassifieds: auto dealer subscriptions — 3+ dealers signed' },
    { id: 'p3s11', category: 'ISLE',        text: 'IsleClassifieds Dominica subdomain research complete — local VA contact identified' },
    { id: 'p3s12', category: 'ISLE',        text: 'IsleClassifieds Dominica + SVG soft launch (same WiPay XCD account)' },
    { id: 'p3s13', category: 'LOCAL',       text: 'Vacation rental co-hosting: 8+ properties active ($3,200+/mo)' },
    { id: 'p3s14', category: 'LOCAL',       text: 'First Caribbean boutique hotel marketing retainer signed ($1,000–1,500/mo)' },
    { id: 'p3s15', category: 'LOCAL',       text: 'CBI relocation: first client completed — law firm referral pipeline established' },
  ],
  4: [
    { id: 'p4s1',  category: 'AI-BIZ',      text: 'AI retainer book: 5–8 clients generating $5,000–12,000/mo MRR' },
    { id: 'p4s2',  category: 'AI-BIZ',      text: 'First offshore developer hired ($800–1,500/mo) — triples delivery capacity' },
    { id: 'p4s3',  category: 'AI-BIZ',      text: 'Anthropic Claude Partner Network approved — inbound leads flowing' },
    { id: 'p4s4',  category: 'ISLE',        text: 'IsleClassifieds: St. Lucia + Antigua launched' },
    { id: 'p4s5',  category: 'ISLE',        text: 'IsleClassifieds: multi-island MRR at EC$10,000–20,000/mo combined' },
    { id: 'p4s6',  category: 'LOCAL',       text: 'Vacation co-hosting: 15–25 properties — local coordinator hired' },
    { id: 'p4s7',  category: 'LOCAL',       text: 'Caribbean hotel retainers: 3+ hotels at $1,000–2,500/mo each' },
    { id: 'p4s8',  category: 'LOCAL',       text: 'CBI developer marketing retainer signed ($2,000/mo + referral upside)' },
    { id: 'p4s9',  category: 'STRATEGY',    text: 'Year 2 plan written: agency model vs vertical SaaS — decision made' },
    { id: 'p4s10', category: 'STRATEGY',    text: 'All income streams documented — SOPs written for handoff' },
    { id: 'p4s11', category: 'STRATEGY',    text: 'Total monthly income above $10,000 confirmed for 30 consecutive days' },
    { id: 'p4s12', category: 'STRATEGY',    text: 'CPA on retainer — Form 5472 + Grenada Inland Revenue compliance annual' },
  ],
}

// ─── PHASE SCORECARDS ──────────────────────────────────────────────────────
export const PHASE_SCORECARDS: Record<number, Record<number, string[]>> = {
  1: {
    1: [
      'Payoneer + Wise + Coinbase + Deel + RemotePass all live and tested',
      'W-8BEN form ready as PDF — before any US client conversation',
      'SpiceClassifieds payment bug fixed and founding sponsor rate card built',
      'Bridge income applications submitted: Invisible Technologies + Pareto.ai + Surge AI',
      'Expat tech setup post published in Grenada Expats Facebook group',
    ],
    2: [
      'Grand Anse walk done — 5+ businesses pitched with QR menu or Google profile offer',
      'First SpiceClassifieds sponsor meeting held in person',
      'Upwork profile 100% complete — first 10 n8n/Make proposals sent',
      'Port Louis and Clarkes Court marina walk done — first captain contact made',
      'First tour operator pitched with Rezdy demo (not FareHarbor)',
    ],
    3: [
      'First founding sponsor signed — prepaid 3-month deal (large cash event)',
      'First QR menu or Google profile job delivered and paid',
      'First Upwork proposal response or interview scheduled',
      'SpiceClassifieds job board: 5 free listings seeded from real employers',
      'AI consulting landing page live with $497 audit booking link',
    ],
    4: [
      'Total Month 1 income above $500',
      '2–3 SpiceClassifieds founding sponsors signed',
      'At least 1 local digitization job completed and paid',
      'Bridge income onboarding underway (Invisible or Pareto task assigned)',
      'No pivots — executing the same two engines as Week 1',
    ],
  },
  2: {
    1: [
      'Wyoming LLC formation started — Firstbase or Doola order placed',
      'SpiceClassifieds job board: first paid listing sold (EC$200–400)',
      'WhatsApp AI bot demo built on SpiceClassifieds — ready to show hotels',
      'First hotel or real estate agent pitched with live chatbot demo',
      'Vacation rental co-hosting: first property approached via cold DM',
    ],
    2: [
      'First Upwork 5-star review received — full rate proposals now',
      'Wyoming LLC EIN received — Mercury bank account opened',
      'SpiceClassifieds: first car dealer subscription pitched',
      'Local digitization pipeline: 3+ clients at various stages',
      'First AI audit booked and delivered ($497–997)',
    ],
    3: [
      'First n8n retainer client signed ($500–1,500/mo)',
      'SpiceClassifieds: 3+ job board paid listings per month',
      'First vacation rental property: Airbnb co-host payment split confirmed',
      'CBI law firm introductory meeting completed',
      'Total income above $2,000/month this month',
    ],
    4: [
      'Wyoming LLC fully operational: EIN + Mercury + Stripe active',
      'Total income above $3,000/month — stable for 30 days',
      'AI services: at least 1 retainer or 2 completed projects',
      'SpiceClassifieds: EC$3,000+/mo from sponsors + job board',
      'Capital growing — not shrinking month over month',
    ],
  },
  3: {
    1: [
      'AI voice agent demo complete (HVAC scenario) — ready for cold email',
      'Apollo list of 500 US HVAC/dental/roofing prospects built',
      'Cold email campaign live at 50+ sends per day',
      'SpiceClassifieds at 200+ active listings',
      'Co-hosting: 3+ properties active and generating income',
    ],
    2: [
      'First AI voice agent client signed — setup fee collected',
      'SpiceClassifieds: auto dealer subscription signed (EC$300–1,000/mo)',
      'First Caribbean hotel marketing retainer conversation started',
      'IsleClassifieds: Dominica/SVG research complete — expansion ready',
      'Total AI services income above $2,000/month',
    ],
    3: [
      'SpiceClassifieds Grenada at EC$10,000/mo — IsleClassifieds gate cleared',
      'IsleClassifieds Dominica + SVG soft launched',
      '3+ AI retainer clients active — $3,000+/mo from AI services',
      'First Caribbean hotel retainer signed ($1,000–1,500/mo)',
      'Co-hosting: 8+ properties ($3,200+/mo)',
    ],
    4: [
      'Anthropic Claude Partner Network application submitted',
      'CBI: first relocation client completed — law firm referral confirmed',
      'Total income above $6,000/month this month',
      'Offshore developer hired or seriously evaluated',
      'Year 2 decision timeline set — agency vs SaaS path chosen',
    ],
  },
  4: {
    1: [
      'AI retainer book: 5+ clients generating $5,000+/mo MRR',
      'IsleClassifieds: St. Lucia and Antigua launched',
      'Co-hosting: 15+ properties — local coordinator hired or in process',
      'Hotel retainers: 2+ Caribbean boutique hotels signed',
      'Claude Partner Network approved — first inbound leads',
    ],
    2: [
      'AI retainer book: $8,000+/mo from AI services alone',
      'IsleClassifieds multi-island: EC$10,000+/mo combined',
      'CBI developer marketing retainer signed ($2,000/mo + referral)',
      'All income streams have SOPs written',
      'Total income above $10,000/month confirmed',
    ],
    3: [
      'Total income above $12,000/month for 30 consecutive days',
      'Team: developer + VA operational and documented',
      'IsleClassifieds: Barbados expansion evaluated (BBD rail)',
      'Form 5472 + Grenada Inland Revenue compliance current',
      'Year 2 plan: agency model vs vertical SaaS — decision executed',
    ],
    4: [
      'Total income above $15,000/month — target hit',
      'No single income source above 40% of total revenue',
      'Emergency cash reserve: $15,000+ minimum',
      'All platforms documented — SOPs written for every handoff',
      'Year 2 scaling plan written and execution started',
    ],
  },
}

// ─── TASKS (per phase) ────────────────────────────────────────────────────
export const TASKS: Record<number, { label: string; tag: string; time: string }[]> = {
  1: [
    { label: 'Walk Grand Anse corridor — pitch 3 businesses with QR menu or Google profile demo', tag: 'LOCAL', time: '2hr' },
    { label: 'SpiceClassifieds — follow up open sponsor conversations or book 2 new meetings', tag: 'SPICE', time: '45min' },
    { label: 'SpiceClassifieds — message 10 local businesses via WhatsApp to list for free', tag: 'SPICE', time: '30min' },
    { label: 'Submit 5 targeted Upwork proposals (n8n/Make niche — do not go generalist)', tag: 'UPWORK', time: '45min' },
    { label: 'Check Respondent.io + Pareto.ai + Invisible for new tasks or studies', tag: 'BRIDGE', time: '15min' },
    { label: 'Post in Grenada Expats group or follow up expat tech setup inquiry', tag: 'LOCAL', time: '15min' },
    { label: 'Log today as active (streak)', tag: 'HABITS', time: '2min' },
  ],
  2: [
    { label: 'Deliver current n8n/AI project work — meet or beat deadline', tag: 'AI-BIZ', time: 'varies' },
    { label: 'SpiceClassifieds — pitch 2 new businesses (car dealer or real estate focus)', tag: 'SPICE', time: '1hr' },
    { label: 'Hotel or tour op walk-in: demo WhatsApp bot or Rezdy booking system', tag: 'LOCAL', time: '1.5hr' },
    { label: 'Vacation co-hosting: cold DM 5 underperforming Airbnb listings (<30% occupancy)', tag: 'COHOST', time: '30min' },
    { label: 'Wyoming LLC: check formation status or next step', tag: 'BUSINESS', time: '15min' },
    { label: 'LinkedIn: publish one post in AI/automation niche (do this daily for 60 days)', tag: 'BRAND', time: '20min' },
    { label: 'Review monthly income vs $3,000 target — adjust channel focus if needed', tag: 'FINANCE', time: '15min' },
  ],
  3: [
    { label: 'AI voice agent: respond to cold email replies within 2 hours', tag: 'AIVOICE', time: '30min' },
    { label: 'AI retainer clients: deliver week\'s deliverables — quality over speed', tag: 'AI-BIZ', time: 'varies' },
    { label: 'SpiceClassifieds: add event vendor listings for next Grenada event', tag: 'SPICE', time: '45min' },
    { label: 'Co-hosting: respond to guest messages and handle any maintenance requests', tag: 'COHOST', time: '30min' },
    { label: 'IsleClassifieds expansion: one outreach action (VA contact, partnership, listing seed)', tag: 'ISLE', time: '30min' },
    { label: 'LinkedIn: publish one case study post or AI implementation insight', tag: 'BRAND', time: '20min' },
    { label: 'Capital check: update runway and net position numbers', tag: 'FINANCE', time: '10min' },
  ],
  4: [
    { label: 'AI retainer clients: review all active accounts — flag any churn risk', tag: 'AI-BIZ', time: '30min' },
    { label: 'IsleClassifieds: check multi-island metrics — which island needs attention', tag: 'ISLE', time: '20min' },
    { label: 'Co-hosting: pricing review — adjust rates on underperforming properties', tag: 'COHOST', time: '20min' },
    { label: 'Hotel retainer clients: monthly check-in and reporting', tag: 'HOTEL', time: 'varies' },
    { label: 'Strategy: which stream delivered highest income per hour this week?', tag: 'STRATEGY', time: '20min' },
    { label: 'Team: review developer output and VA tasks — maintain quality standard', tag: 'TEAM', time: '30min' },
    { label: 'Compliance check: Form 5472 deadline, Grenada Inland Revenue status', tag: 'LEGAL', time: '15min' },
  ],
}

// ─── MILESTONES ────────────────────────────────────────────────────────────
export const MILESTONES = [
  // Phase 1 — Survival
  { id: 'm1',  text: 'Payment stack live: Payoneer + Wise + Coinbase + Deel',        month: 'Day 1',     phase: 1 },
  { id: 'm2',  text: 'W-8BEN form ready as PDF — before first US client',            month: 'Day 1',     phase: 1 },
  { id: 'm3',  text: 'SpiceClassifieds payment bug confirmed fixed',                  month: 'Week 1',    phase: 1 },
  { id: 'm4',  text: 'First founding sponsor signed — prepaid 3-month cash event',   month: 'Week 2–3',  phase: 1 },
  { id: 'm5',  text: 'First QR menu or Google profile job paid',                     month: 'Week 1–2',  phase: 1 },
  { id: 'm6',  text: 'Bridge income: Invisible or Pareto first task completed',      month: 'Week 4–6',  phase: 1 },
  { id: 'm7',  text: '$500 earned in Month 1',                                        month: 'Month 1',   phase: 1 },
  { id: 'm8',  text: '$1,500/month consistent for 30 days — Phase 1 gate cleared',   month: 'Month 2–3', phase: 1 },
  // Phase 2 — Stability
  { id: 'm9',  text: 'First Upwork 5-star review — full rate unlocked',              month: 'Month 2–3', phase: 2 },
  { id: 'm10', text: 'Wyoming LLC formed + EIN received + Mercury opened',           month: 'Month 2–3', phase: 2 },
  { id: 'm11', text: 'First n8n retainer client signed ($500–1,500/mo)',             month: 'Month 2–3', phase: 2 },
  { id: 'm12', text: 'First vacation rental co-hosting property live on Airbnb',     month: 'Month 3–4', phase: 2 },
  { id: 'm13', text: 'SpiceClassifieds: 3+ car dealer or real estate subscriptions', month: 'Month 3–4', phase: 2 },
  { id: 'm14', text: '$3,000/month stable for 30 days — Phase 2 gate cleared',       month: 'Month 4–5', phase: 2 },
  // Phase 3 — Build
  { id: 'm15', text: 'AI voice agent demo complete — HVAC cold email campaign live', month: 'Month 4–5', phase: 3 },
  { id: 'm16', text: 'First AI voice agent client signed',                           month: 'Month 5–6', phase: 3 },
  { id: 'm17', text: '3+ AI retainer clients — $3,000+/mo from AI services',        month: 'Month 6–7', phase: 3 },
  { id: 'm18', text: 'SpiceClassifieds Grenada at EC$10,000/mo',                     month: 'Month 6–8', phase: 3 },
  { id: 'm19', text: 'IsleClassifieds Dominica + SVG launched',                      month: 'Month 7–9', phase: 3 },
  { id: 'm20', text: 'Co-hosting: 8+ properties active ($3,200+/mo)',                month: 'Month 6–8', phase: 3 },
  // Phase 4 — Scale
  { id: 'm21', text: 'AI retainer book: 5+ clients, $5,000+/mo MRR',                month: 'Month 9–10',  phase: 4 },
  { id: 'm22', text: 'IsleClassifieds: St. Lucia + Antigua launched',                month: 'Month 10–12', phase: 4 },
  { id: 'm23', text: 'Caribbean hotel retainer: 2+ hotels signed',                   month: 'Month 8–10',  phase: 4 },
  { id: 'm24', text: 'CBI developer marketing retainer signed ($2,000/mo)',          month: 'Month 9–12',  phase: 4 },
  { id: 'm25', text: 'Co-hosting: 15+ properties — coordinator hired',               month: 'Month 10–12', phase: 4 },
  { id: 'm26', text: 'Claude Partner Network approved — inbound AI leads flowing',   month: 'Month 8–12',  phase: 4 },
  { id: 'm27', text: 'Total income above $10,000/month for 30 consecutive days',     month: 'Month 12–15', phase: 4 },
  { id: 'm28', text: 'Total income above $15,000/month — final target hit',          month: 'Month 18–24', phase: 4 },
]

// ─── INCOME TARGETS PER PHASE ──────────────────────────────────────────────
export const PHASE_INCOME_TARGETS: Record<number, number> = {
  1: 2500,
  2: 5000,
  3: 8000,
  4: 15000,
}

// ─── CRISIS MESSAGES ───────────────────────────────────────────────────────
export const CRISIS_MESSAGES = [
  { min: 0, max: 1,  msg: 'Under 1 week left. Walk into businesses today. QR menus, Google profiles, SpiceClassifieds pitches. Nothing else.' },
  { min: 1, max: 2,  msg: 'Under 2 weeks. Flood Respondent.io for research studies. Post Google Business offer in all Grenada Facebook groups today.' },
  { min: 2, max: 4,  msg: 'Under 4 weeks. Reduce costs now. Maximum local walk-in sales. No new experiments. 50% upfront on everything.' },
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
    'Week 1 will feel like nothing is working. That is exactly what Week 1 feels like. The income starts in 7–14 days.',
    'The plan works over months, not days. The people who succeed are more patient, not smarter.',
    'Do not make strategic decisions in Month 1. Execute the plan. Evaluate in Week 8.',
    'You have submitted the applications. You have walked into businesses. The ramp is building.',
  ],
  lowMood: [
    'Do not make strategic decisions on red days. Local walk-ins, a walk, local food. Tomorrow is different.',
    'The plan did not break. The day broke. Execute one small thing and call it done.',
    'Rough days are not evidence the plan is wrong. They are evidence you are human.',
    'Everyone building something from scratch has days that feel exactly like this.',
  ],
  lowIncome: [
    'Month 1 target: $500–800. Month 2: $2,000. Month 3: $3,200. You are in the ramp period. This is normal.',
    'Every income source takes 2–4 weeks to ramp. The bridge income applications are clocking.',
    'The gap between now and $1,500/month is smaller than it feels. The walk-ins compound daily.',
    'SpiceClassifieds founders who sign in Week 3 paid 3 months upfront. One meeting = $4,500 cash event.',
  ],
  onTrack: [
    'Consistency on one thing always beats novelty on ten things.',
    'The local engine keeps you alive while the global engine grows. Both are running.',
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
