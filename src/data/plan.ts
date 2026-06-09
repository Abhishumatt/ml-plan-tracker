import type { Algorithm, DailyRoutineItem, OutreachTarget, Project, WeekPlan } from '../types';

export const TOTAL_WEEKS = 18;
export const TOTAL_DAYS = TOTAL_WEEKS * 7;

export const PHASES: Record<number, string> = {
  0: 'Phase 0 — Setup',
  1: 'Weeks 1–2 — Foundations',
  3: 'Weeks 3–7 — Build the Offer',
  8: 'Weeks 8–10 — Projects & Outreach',
  11: 'Weeks 11–18 — Job + Income Sprint',
};

export const PHASE0_ITEMS = [
  { id: 'p0-colab', label: 'Set up Google Colab' },
  { id: 'p0-github', label: 'Create GitHub account + ml-portfolio repo' },
  { id: 'p0-crm', label: 'Create CRM (Notion or Google Sheets)' },
  { id: 'p0-linkedin', label: 'Optimize LinkedIn profile' },
  { id: 'p0-notes', label: 'Start notes.md — daily confusion log' },
];

export const DAILY_ROUTINE: DailyRoutineItem[] = [
  { id: 'routine-connections', label: '25 LinkedIn connection requests', track: 'C', durationMin: 20, startsWeek: 1 },
  { id: 'routine-comments', label: 'Comment substantively on 10 posts', track: 'C', durationMin: 30, startsWeek: 1 },
  { id: 'routine-dms', label: '5 personalised DMs (value-first)', track: 'C', durationMin: 20, startsWeek: 1 },
  { id: 'routine-study', label: 'Technical study / algorithm implementation', track: 'A', durationMin: 90, startsWeek: 1 },
  { id: 'routine-project', label: "Current week's project work", track: 'B', durationMin: 60, startsWeek: 3 },
  { id: 'routine-content', label: 'Publish/draft LinkedIn content', track: 'C', durationMin: 20, startsWeek: 2 },
  { id: 'routine-crm', label: 'Update CRM with all interactions', track: 'C', durationMin: 10, startsWeek: 1 },
  { id: 'routine-cold-email', label: 'Cold emails', track: 'C', durationMin: 20, startsWeek: 8 },
  { id: 'routine-consulting', label: 'Consulting prospect research', track: 'C', durationMin: 15, startsWeek: 5 },
  { id: 'routine-content-engine', label: 'Review content engine drafts', track: 'B', durationMin: 10, startsWeek: 11 },
];

export const OUTREACH_TARGETS: OutreachTarget[] = [
  { id: 'outreach-connections', label: 'Connection requests', dailyTarget: 25, startsWeek: 1 },
  { id: 'outreach-comments', label: 'Substantive comments', dailyTarget: 10, startsWeek: 1 },
  { id: 'outreach-dms', label: 'Personalised DMs', dailyTarget: 5, startsWeek: 1 },
  { id: 'outreach-cold-email', label: 'Cold emails (weekly)', dailyTarget: 50, startsWeek: 8 },
];

export const ALGORITHMS: Algorithm[] = [
  { id: 'algo-lr', name: 'Linear Regression', week: 3, bigO: 'CF: O(nd²+d³); GD: O(n·d·iters)' },
  { id: 'algo-logr', name: 'Logistic Regression', week: 3, bigO: 'O(n·d·iters)' },
  { id: 'algo-kmeans', name: 'K-means + k-means++', week: 4, bigO: 'O(n·k·d·iters)' },
  { id: 'algo-kfold', name: 'K-fold Cross Validation', week: 4, bigO: 'O(n) per split' },
  { id: 'algo-threshold', name: 'Threshold Optimiser', week: 4, bigO: 'O(n log n)' },
  { id: 'algo-nb', name: 'Naive Bayes text classifier', week: 5, bigO: 'fit O(N·L); predict O(M·V·C)' },
  { id: 'algo-median', name: 'Median Pooling 1D & 2D', week: 6, bigO: 'O(out·k·log k)' },
  { id: 'algo-matmul', name: 'Matrix Multiplication', week: 7, bigO: 'O(n³)' },
  { id: 'algo-nn', name: '1-hidden-layer NN', week: 8, bigO: 'O(n·(d·h+h)) / epoch' },
];

export const PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Churn Prediction / Demand Forecasting', week: 5, tech: 'sklearn + FastAPI + Streamlit' },
  { id: 'proj-2', name: 'Customer Segmentation', week: 7, tech: 'K-means + interactive dashboard' },
  { id: 'proj-3', name: 'EDA Mastery Report', week: 8, tech: 'pandas + Plotly + automated toolkit' },
  { id: 'proj-4', name: 'GenAI Hybrid Classifier', week: 9, tech: 'Rules → BERT → LLM' },
  { id: 'proj-5', name: 'RAG System', week: 10, tech: 'BM25 + semantic search + re-ranking' },
  { id: 'proj-6', name: 'MLOps Pipeline', week: 11, tech: 'Docker + GitHub Actions + cloud' },
  { id: 'proj-7', name: 'Autonomous Content Engine', week: 11, tech: 'Agent framework + LinkedIn API' },
];

export const WEEKS: WeekPlan[] = [
  {
    week: 1,
    title: 'Python + Core ML Vocabulary',
    phase: 'Foundations',
    studyDays: [
      { day: 1, topic: 'Python basics', goal: 'Variables, types, strings, f-strings. Re-implement 5 SQL string functions.', source: 'Corey Schafer Python #1–3' },
      { day: 2, topic: 'Data structures + ML vocab', goal: 'Lists, dicts, sets. Implement group_by(). Supervised vs unsupervised.', source: 'Corey Schafer #4–5; StatQuest ML Fundamentals' },
      { day: 3, topic: 'Control flow', goal: 'if/for/while. Implement INNER JOIN via nested loops, then dict lookup.', source: 'Corey Schafer #6–7' },
      { day: 4, topic: 'Functions + Linear Regression', goal: '*args/**kwargs, scope. ML: what LR optimises, assumptions.', source: 'Andrew Ng ML Spec C1 W1–2; StatQuest Linear Regression' },
      { day: 5, topic: 'Comprehensions + Logistic Regression', goal: 'List/dict comprehensions, lambda. ML: sigmoid, log-loss, L2.', source: 'Andrew Ng ML Spec C1 W3; StatQuest Logistic Regression' },
      { day: 6, topic: 'File I/O + Regularisation', goal: 'csv module, try/except. ML: L1 vs L2.', source: 'StatQuest Ridge/Lasso; ISLP Ch 6' },
      { day: 7, topic: 'Classes + Bias-Variance', goal: 'OOP, fit/predict pattern. Build MeanPredictor class.', source: 'StatQuest Bias-Variance + CV; ISLP Ch 5' },
    ],
    deliverables: [],
    stopAndCheck: 'Write CSV groupby-mean-filter-top3 function without Googling.',
    outreach: ['25 LinkedIn connections/day', '10 substantive comments/day', '5 personalised DMs/day', 'Set up CRM and log everything'],
  },
  {
    week: 2,
    title: 'NumPy / Pandas + Classification & Clustering',
    phase: 'Foundations',
    studyDays: [
      { day: 8, topic: 'NumPy arrays + Generative vs Discriminative', goal: 'array/zeros/arange/linspace. Generative P(X,Y) vs discriminative P(Y|X).', source: 'Keith Galli NumPy Tutorial' },
      { day: 9, topic: 'NumPy indexing + Naive Bayes', goal: 'Boolean/fancy indexing, np.where. Multinomial vs Bernoulli vs Gaussian NB.', source: 'StatQuest Naive Bayes' },
      { day: 10, topic: 'NumPy BROADCASTING (critical)', goal: '3 broadcasting rules, np.newaxis. Pairwise Euclidean distance, NO loops.', source: 'numpy.org broadcasting' },
      { day: 11, topic: 'NumPy aggregations + Metrics', goal: 'sum/mean/std with axis=. Precision, recall, F1, ROC-AUC vs PR-AUC.', source: 'StatQuest Confusion Matrix + ROC/AUC' },
      { day: 12, topic: 'NumPy linear algebra + K-means', goal: 'np.dot, @, linalg, .T. K-means = hard-EM, k-means++ init.', source: '3Blue1Brown Linear Algebra; StatQuest K-means' },
      { day: 13, topic: 'Pandas fast-track', goal: 'Series, DataFrame, groupby, merge, pivot_table. 10 SQL queries in Pandas.', source: "pandas.pydata.org 'Comparison with SQL'" },
      { day: 14, topic: 'Vectorisation + SVM/Imbalance', goal: 'Vectorise slow loop (50–500× speedup). SVM margin, SMOTE, focal loss.', source: 'StatQuest SVM; CS229 SVM notes' },
    ],
    deliverables: [],
    stopAndCheck: 'Write sigmoid(z), softmax(z), pairwise_distances(A,B) in pure NumPy under 5 min each.',
  },
  {
    week: 3,
    title: 'Positioning + sklearn API + Linear & Logistic Regression',
    phase: 'Build the Offer',
    studyDays: [
      { day: 15, topic: 'sklearn API + NN intuition', goal: 'fit/predict/transform on iris. Explain NN to a non-technical CEO.', source: 'sklearn docs' },
      { day: 16, topic: 'Linear Regression from scratch', goal: 'Closed-form (lstsq) AND gradient descent. Collinearity, scaling.', source: 'From scratch implementation' },
      { day: 17, topic: 'Logistic Regression from scratch', goal: 'Numerically-stable sigmoid, BCE loss, gradient descent, L2.', source: 'From scratch implementation' },
    ],
    deliverables: [
      '3 target markets identified (jobs + consulting)',
      'Value driver scorecard',
      'System design question bank (20 scenarios, 3 practiced)',
      'Linear Regression notebook (from scratch)',
      'Logistic Regression notebook (from scratch)',
    ],
    stopAndCheck: 'Implement Logistic Regression closed-book in under 30 minutes.',
  },
  {
    week: 4,
    title: 'Package the Offer + MLOps + K-means & K-fold',
    phase: 'Build the Offer',
    studyDays: [
      { day: 18, topic: 'K-means + k-means++ from scratch', goal: 'k-means++ init, broadcasting, centroid update, empty-cluster handling.', source: 'From scratch implementation' },
      { day: 19, topic: 'K-fold Cross Validation from scratch', goal: 'Split indices, distribute remainder, stratified & time-series variants.', source: 'From scratch implementation' },
      { day: 20, topic: 'Threshold Optimiser from scratch', goal: 'O(n log n) sweep tracking TP/FP/TN/FN; maximise F1.', source: 'From scratch implementation' },
    ],
    deliverables: [
      'Complete value stack (employment + consulting)',
      'MLOps checklist completed',
      'K-means, K-fold, Threshold Optimizer notebooks',
    ],
  },
  {
    week: 5,
    title: 'Name the Offer + Naive Bayes + Start Project 1',
    phase: 'Build the Offer',
    studyDays: [
      { day: 21, topic: 'Naive Bayes text classifier from scratch', goal: 'Multinomial NB, Laplace smoothing, log-probabilities, OOV handling.', source: 'From scratch implementation' },
    ],
    deliverables: [
      'Final offer document (dual: employer + client)',
      '2-minute pitch video',
      '10 intro variations written',
      'Naive Bayes notebook',
      'Project 1 in progress',
    ],
  },
  {
    week: 6,
    title: 'LinkedIn Authority + Median Pooling + Project 1 Done',
    phase: 'Build the Offer',
    studyDays: [
      { day: 22, topic: 'Median Pooling 1D & 2D from scratch', goal: 'Window/stride/padding, even-size median, sliding_window_view.', source: 'From scratch implementation' },
    ],
    deliverables: [
      'LinkedIn profile fully optimised',
      'Content calendar created',
      'First LinkedIn post published',
      'Project 1 deployed (FastAPI + Streamlit monitoring)',
      'Rapid prototype demo ready (90 min delivery)',
    ],
  },
  {
    week: 7,
    title: 'Outreach Quality + Matrix Multiplication + Project 2',
    phase: 'Build the Offer',
    studyDays: [
      { day: 23, topic: 'Matrix Multiplication from scratch', goal: 'Naive triple-loop, then cache-blocked/tiled. BLAS, np.allclose.', source: 'From scratch implementation' },
      { day: 24, topic: 'Collinear Points + sequence models', goal: 'Brute O(n³), slope-hashing O(n²). RNN vs LSTM vs Transformer.', source: 'From scratch + ML concepts' },
    ],
    deliverables: [
      'Outreach message sequences A/B tested',
      'Project 2 deployed — Customer Segmentation',
      'Matrix Multiplication + Collinear Points notebooks',
    ],
  },
  {
    week: 8,
    title: 'Multi-Channel Outreach + Project 3 (EDA)',
    phase: 'Projects & Outreach',
    studyDays: [
      { day: 25, topic: '1-hidden-layer NN from scratch', goal: 'Forward tanh→sigmoid, BCE loss, manual backprop, He/Xavier init.', source: 'From scratch implementation' },
    ],
    deliverables: [
      'Cold email campaign running (50/week)',
      'Twitter/X profile optimised, cross-posting active',
      'Project 3 deployed — publication-quality EDA report',
    ],
  },
  {
    week: 9,
    title: 'Interview Prep + Project 4 (GenAI Hybrid)',
    phase: 'Projects & Outreach',
    studyDays: [],
    deliverables: [
      'STAR answers for 10 common questions',
      '1 system design solved on video',
      'Objection scripts (jobs + consulting)',
      'Project 4 deployed — GenAI hybrid system',
    ],
    stopAndCheck: '30-min closed-book Deep-ML problem, LR from scratch, 20-min system design narration.',
  },
  {
    week: 10,
    title: 'Mock Interviews + Consulting Pipeline + Project 5 (RAG)',
    phase: 'Projects & Outreach',
    studyDays: [],
    deliverables: [
      'Mock interview recorded and reviewed',
      'Consulting pricing sheet created',
      'Discovery call script ready',
      'First consulting proposals sent',
      'Project 5 deployed — RAG system',
    ],
  },
  {
    week: 11,
    title: 'All 7 Projects Complete + Content Engine Live',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      'Project 6 deployed — full CI/CD system',
      'Project 7 deployed — content engine running',
      'All 7 projects on GitHub with clean READMEs',
      'Analytics dashboard live',
    ],
  },
  {
    week: 12,
    title: 'Portfolio Polish + Case Studies + Mock Round 1',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      '3 case studies written',
      'All GitHub repos polished',
      'Architecture diagrams complete',
      '2 mock interviews completed',
    ],
  },
  {
    week: 13,
    title: 'LinkedIn Authority Push + Mock Round 2',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      '2 Build in Public deep-dives published',
      '1 contrarian take published',
      '50 posts engaged in target market',
      'First consulting income or freelance win',
    ],
  },
  {
    week: 14,
    title: 'Interview Intensive',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      '2–4 interviews completed',
      '3 new system designs practiced',
      'Consulting discovery calls completed',
    ],
  },
  {
    week: 15,
    title: 'Offer Strategy + Negotiation Prep',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      'Salary benchmarking research done',
      'Counter-offer scripts ready',
      'Mini-demo for top-choice company',
      'OpenClaw/agent service packaged for first client',
    ],
  },
  {
    week: 16,
    title: 'Content Flywheel + 3 Income Paths Active',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      '2 interview experience posts published',
      'What I learned building X series started',
      '90-min rapid prototype demo practiced',
    ],
  },
  {
    week: 17,
    title: 'Full Network Activation',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      'Referral requests sent to 10+ people',
      'All 7 projects walkthrough-ready',
      'Final round interview prep complete',
    ],
  },
  {
    week: 18,
    title: 'Graduation + Multi-Income Strategy',
    phase: 'Job + Income Sprint',
    studyDays: [],
    deliverables: [
      'Accept offer OR 5+ active conversations',
      '90-day plan for new role written',
      'Final portfolio live publicly',
      'Consulting scaled to 3–5 clients',
    ],
  },
];

export function getWeekPlan(week: number): WeekPlan | undefined {
  return WEEKS.find((w) => w.week === week);
}

export function getPhaseForWeek(week: number): string {
  if (week <= 0) return PHASES[0];
  if (week <= 2) return PHASES[1];
  if (week <= 7) return PHASES[3];
  if (week <= 10) return PHASES[8];
  return PHASES[11];
}

export function deliverableId(week: number, index: number): string {
  return `deliverable-w${week}-${index}`;
}
