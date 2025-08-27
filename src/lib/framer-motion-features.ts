// Optimized framer-motion features configuration
// Using domAnimation for smaller bundle size
import { domAnimation } from 'framer-motion';

const motionFeatures = domAnimation;

export default motionFeatures;

// For maximum optimization, we could use domMax which includes all features
// import { domMax } from 'framer-motion';
// export const motionFeatures = domMax;