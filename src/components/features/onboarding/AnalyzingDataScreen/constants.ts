import { Database, Network, Cpu, GitBranch, Zap } from 'lucide-react';

export const ANALYSIS_STEP_DATA = [
  {
    icon: Database,
    title: "Initializing Data Pipeline",
    subtitle: "Establishing secure connection to career database",
    metrics: "50K+ data points",
    duration: 2000
  },
  {
    icon: Network,
    title: "Neural Network Processing", 
    subtitle: "Analyzing patterns across 10,000+ nursing profiles",
    metrics: "98.5% accuracy",
    duration: 2500
  },
  {
    icon: Cpu,
    title: "AI Model Computation",
    subtitle: "Running predictive algorithms on compensation data",
    metrics: "ML confidence: 94%",
    duration: 2000
  },
  {
    icon: GitBranch,
    title: "Cross-referencing Market Data",
    subtitle: "Comparing with real-time healthcare job market",
    metrics: "Processing complete",
    duration: 2000
  },
  {
    icon: Zap,
    title: "Deploying Dashboard",
    subtitle: "Initializing your personalized interface", 
    metrics: "Ready to launch",
    duration: 1500
  }
];

export const PARTICLE_COUNT = 20;
export const TOTAL_ANALYSIS_TIME = ANALYSIS_STEP_DATA.reduce((total, step) => total + step.duration, 0);

export const TECH_KEYWORDS = [
  'Analyzing...', 'Processing...', 'Computing...', 'Optimizing...', 
  'Loading...', 'Initializing...', 'Calibrating...', 'Finalizing...'
];