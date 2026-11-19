/* Skill and project data for the homepage. Edit these to update site content. */

const CATEGORIES = {
  languages: { label: 'Languages & Core', base: 'var(--teal-dark)', tip: 'var(--teal-dark-tip)', pale: 'var(--teal-dark-pale)' },
  modeling: { label: 'Modeling & Stats', base: 'var(--coral)', tip: 'var(--coral-tip)', pale: 'var(--coral-pale)' },
  applied: { label: 'Applied Analysis', base: 'var(--teal-light)', tip: 'var(--teal-light-tip)', pale: 'var(--teal-light-pale)' },
  engineering: { label: 'Engineering & Viz', base: 'var(--coral-light)', tip: 'var(--coral-light-tip)', pale: 'var(--coral-light-pale)' },
};

/* Each skill's bar is drawn in three nested bands — an illustrative growth
   arc (first used -> regular use -> core toolkit), not a measured metric.
   TIER_SPLITS are the synthetic proportions of total length for each band. */
const TIER_SPLITS = [0.42, 0.72, 1.0];

/* length is a decorative rhythm (longest = most central to my work), not a proficiency score.
   dots: true marks a tip treated with the dotted-texture cap, as an accent, not a data signal. */
const SKILLS = [
  { name: 'Python', category: 'languages', length: 350, dots: false,
    description: 'My default tool for everything from data-generation scripts to statistical modeling — the common thread running through nearly every project below, from the Cooling Deserts thesis to the churn forecasting model.' },
  { name: 'SQL', category: 'languages', length: 330, dots: true,
    description: 'CTEs, window functions (LAG, RANK, NTILE), and layered schema design. This is the backbone of the PE scorecard, the churn analysis, and the ETL pipeline.' },
  { name: 'JavaScript', category: 'languages', length: 240, dots: false,
    description: 'Recomputing figures client-side so dashboard charts stay in sync with the SQL layer. I used this in Grid Signal to verify published numbers in the browser.' },
  { name: 'Statistical Modeling', category: 'modeling', length: 310, dots: false,
    description: 'Logistic regression and hypothesis testing. I trained a churn model with a cross-validated ROC AUC near 0.80.' },
  { name: 'K-Means Clustering', category: 'modeling', length: 260, dots: true,
    description: 'Used to site new cooling infrastructure across uncovered NYC census tracts in the Cooling Deserts thesis.' },
  { name: 'A/B Testing', category: 'modeling', length: 230, dots: false,
    description: 'Designed and read a two-proportion z-test for an onboarding experiment, finding a statistically significant 2.9-point retention lift.' },
  { name: 'Machine Learning', category: 'modeling', length: 300, dots: false,
    description: 'Building and evaluating predictive models, not just reporting results: train/test splits, cross-validation, and metrics that match the decision at hand — ROC AUC for the churn classifier, inertia and cluster stability for the Cooling Deserts k-means segmentation.' },
  { name: 'Geospatial Analysis', category: 'applied', length: 295, dots: false,
    description: 'Matching coordinates to county and census-tract boundaries. I used this to correctly place data centers and cooling sites, fixing 24 mis-mapped records in Grid Signal.' },
  { name: 'Cohort & Retention', category: 'applied', length: 265, dots: true,
    description: 'Signup-month cohorting and retention curves. I tracked a SaaS company’s users from 95% retention at month 3 down to 23% at month 24.' },
  { name: 'Policy Simulation', category: 'applied', length: 235, dots: false,
    description: 'Modeling “what-if” interventions, like rent-burden relief or AC retrofits, to see which levers actually move census tracts out of risk.' },
  { name: 'Data Engineering', category: 'engineering', length: 280, dots: false,
    description: 'Layered raw → staging → cleaned → marts pipelines with automated data-quality checks, built on ~1.4M rows of ecommerce transactions.' },
  { name: 'Financial Modeling', category: 'engineering', length: 250, dots: true,
    description: 'CAGR, EBITDA margin, leverage, and EV/EBITDA. This is the composite scoring logic behind the PE acquisition scorecard.' },
  { name: 'Data Visualization', category: 'engineering', length: 225, dots: false,
    description: 'Turning SQL output and model results into charts people actually read — static charts in most projects here, and a full interactive Tableau dashboard tracing interstate shelter-dog transport.' },
  { name: 'Automation', category: 'engineering', length: 235, dots: false,
    description: 'Automated checks and repeatable runs instead of one-off scripts — the data-quality validations that fire on every run of the Ecommerce ETL pipeline, so a bad batch gets flagged instead of silently loaded.' },
];

const PROJECTS = [
  {
    title: 'Cooling Deserts for Renters',
    repoUrl: 'https://github.com/tashraf-745/Cooling-Desert-Thesis-Project',
    liveUrl: 'https://tashraf-745.github.io/Cooling-Desert-Thesis-Project/',
    description: 'A heat-equity thesis mapping 557 NYC census tracts where renters are both heat-vulnerable and rent-burdened, then testing which policy levers (cooling sites, AC retrofits, rent relief) actually move tracts out of risk.',
    stat: { value: '557', label: 'tracts mapped' },
    tags: ['Python', 'K-Means', 'Policy Simulation', 'Geospatial'],
  },
  {
    title: 'Grid Signal',
    repoUrl: 'https://github.com/tashraf-745/grid-signal',
    liveUrl: 'https://tashraf-745.github.io/grid-signal/',
    description: 'Matches 1,621 US data-center projects to county-level 2024 election results to test whether community opposition tracks geography, politics, or project size, and whether it predicts cancellation.',
    stat: { value: '4×', label: 'more likely cancelled' },
    tags: ['Python', 'SQL', 'JavaScript', 'Geospatial'],
  },
  {
    title: 'SaaS Churn & Cohort Analysis',
    repoUrl: 'https://github.com/tashraf-745/saas-churn-cohort-analysis',
    description: 'Cohort retention, an onboarding A/B test, and a logistic-regression churn model for a subscription business, from signup-month cohorts down to a 90-day churn forecast.',
    stat: { value: '0.80', label: 'ROC AUC' },
    tags: ['PostgreSQL', 'Python', 'Logistic Regression', 'Cohort Analysis'],
  },
  {
    title: 'PE Acquisition Scorecard',
    repoUrl: 'https://github.com/tashraf-745/pe-acquisition-scorecard',
    description: 'A SQL-only pipeline that screens and ranks 50 mid-market acquisition targets on growth, margin, leverage and valuation, producing a Strong Buy / Consider / Watch / Pass recommendation.',
    stat: { value: '50', label: 'targets ranked' },
    tags: ['PostgreSQL', 'SQL', 'Window Functions', 'Financial Modeling'],
  },
  {
    title: 'Ecommerce ETL Pipeline',
    repoUrl: 'https://github.com/tashraf-745/ecommerce-etl-pipeline',
    description: 'A four-layer SQL pipeline (raw → staging → cleaned → marts) that turns ~1.4M rows of the Olist Brazilian ecommerce dataset into dashboard-ready tables, with automated data-quality checks on every run.',
    stat: { value: '1.4M', label: 'rows processed' },
    tags: ['PostgreSQL', 'SQL', 'ETL', 'Data Quality'],
  },
  {
    title: 'The Journey Home: Shelter Dog Transport',
    liveUrl: 'https://public.tableau.com/app/profile/tahreem.ashraf/viz/DogTransport/FinalDraft',
    description: 'A Tableau dashboard built on the PetFinder API tracing interstate shelter-dog transport: origin–destination routes, which states and countries send and receive the most dogs, and the breed, age, and size of the dogs making the trip.',
    stat: { value: '8.9%', label: 'transported across states' },
    tags: ['Tableau', 'Geospatial', 'Data Visualization', 'API'],
  },
];
