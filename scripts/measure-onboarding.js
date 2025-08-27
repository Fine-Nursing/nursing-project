#!/usr/bin/env node

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const RESULTS_DIR = path.join(__dirname, '../performance-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Performance metrics collector
class OnboardingPerformanceAnalyzer {
  constructor() {
    this.browser = null;
    this.page = null;
    this.metrics = {
      timestamp: new Date().toISOString(),
      initialLoad: {},
      stepTransitions: {},
      apiCalls: [],
      memoryUsage: [],
      bundleAnalysis: {},
      interactionMetrics: {}
    };
  }

  async initialize() {
    console.log('🚀 Starting Onboarding Performance Analysis...\n');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Enable performance monitoring
    await this.page.evaluateOnNewDocument(() => {
      window.__PERFORMANCE_METRICS__ = {
        marks: [],
        measures: [],
        resources: [],
        interactions: []
      };
      
      // Override performance.mark
      const originalMark = performance.mark.bind(performance);
      performance.mark = function(name) {
        window.__PERFORMANCE_METRICS__.marks.push({
          name,
          time: performance.now()
        });
        return originalMark(name);
      };
      
      // Monitor API calls
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const startTime = performance.now();
        const response = await originalFetch.apply(this, args);
        const endTime = performance.now();
        
        window.__PERFORMANCE_METRICS__.resources.push({
          url: args[0],
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          status: response.status
        });
        
        return response;
      };
    });
    
    // Monitor console for errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('❌ Console Error:', msg.text());
      }
    });
    
    // Monitor page errors
    this.page.on('pageerror', error => {
      console.error('❌ Page Error:', error.message);
    });
  }

  async measureInitialLoad() {
    console.log('📊 Measuring initial page load...');
    
    const startTime = Date.now();
    
    // Navigate to onboarding page
    await this.page.goto(`${BASE_URL}/onboarding`, {
      waitUntil: 'networkidle0'
    });
    
    // Wait for content to be visible
    await this.page.waitForSelector('[class*="onboarding"]', {
      timeout: 30000
    });
    
    const loadTime = Date.now() - startTime;
    
    // Get performance metrics
    const perfMetrics = await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintMetrics = performance.getEntriesByType('paint');
      
      return {
        navigation: perfData ? {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          domInteractive: perfData.domInteractive,
          fetchStart: perfData.fetchStart,
          responseEnd: perfData.responseEnd
        } : {},
        paint: paintMetrics.map(p => ({
          name: p.name,
          startTime: p.startTime
        })),
        resources: performance.getEntriesByType('resource').map(r => ({
          name: r.name,
          duration: r.duration,
          size: r.transferSize || 0,
          type: r.initiatorType
        }))
      };
    });
    
    // Get memory usage
    const memoryUsage = await this.page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        };
      }
      return null;
    });
    
    this.metrics.initialLoad = {
      totalLoadTime: loadTime,
      ...perfMetrics,
      memory: memoryUsage
    };
    
    console.log(`✅ Initial load completed in ${loadTime}ms`);
    console.log(`   - First Paint: ${perfMetrics.paint.find(p => p.name === 'first-paint')?.startTime.toFixed(2)}ms`);
    console.log(`   - First Contentful Paint: ${perfMetrics.paint.find(p => p.name === 'first-contentful-paint')?.startTime.toFixed(2)}ms`);
    if (memoryUsage) {
      console.log(`   - Memory Usage: ${memoryUsage.usedJSHeapSize}MB / ${memoryUsage.totalJSHeapSize}MB`);
    }
    console.log('');
  }

  async measureStepTransition(fromStep, toStep, actionSelector) {
    console.log(`📊 Measuring transition: ${fromStep} → ${toStep}`);
    
    const startTime = Date.now();
    
    try {
      // Click the action button
      await this.page.click(actionSelector);
      
      // Wait for next step to appear
      await this.page.waitForFunction(
        (step) => {
          const elements = document.querySelectorAll('h1, h2, h3');
          return Array.from(elements).some(el => 
            el.textContent.toLowerCase().includes(step.toLowerCase())
          );
        },
        { timeout: 10000 },
        toStep
      );
      
      const transitionTime = Date.now() - startTime;
      
      // Get any API calls made during transition
      const apiCalls = await this.page.evaluate(() => {
        return window.__PERFORMANCE_METRICS__.resources.filter(r => 
          r.url.includes('/api/')
        );
      });
      
      this.metrics.stepTransitions[`${fromStep}_to_${toStep}`] = {
        duration: transitionTime,
        apiCalls: apiCalls.length,
        apiDuration: apiCalls.reduce((sum, call) => sum + call.duration, 0)
      };
      
      console.log(`✅ Transition completed in ${transitionTime}ms`);
      console.log(`   - API Calls: ${apiCalls.length}`);
      if (apiCalls.length > 0) {
        console.log(`   - Total API Time: ${apiCalls.reduce((sum, call) => sum + call.duration, 0).toFixed(2)}ms`);
      }
      console.log('');
      
    } catch (error) {
      console.error(`❌ Failed to measure transition: ${error.message}`);
      this.metrics.stepTransitions[`${fromStep}_to_${toStep}`] = {
        error: error.message
      };
    }
  }

  async measureFormInteraction(formName) {
    console.log(`📊 Measuring form interaction: ${formName}`);
    
    const interactionMetrics = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea');
      return {
        inputCount: inputs.length,
        visibleInputs: Array.from(inputs).filter(i => i.offsetParent !== null).length
      };
    });
    
    // Measure input latency
    const inputLatency = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const input = document.querySelector('input[type="text"]');
        if (!input) {
          resolve(null);
          return;
        }
        
        const startTime = performance.now();
        input.focus();
        input.value = 'Test';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        requestAnimationFrame(() => {
          const endTime = performance.now();
          resolve(endTime - startTime);
        });
      });
    });
    
    this.metrics.interactionMetrics[formName] = {
      ...interactionMetrics,
      inputLatency
    };
    
    console.log(`✅ Form analysis completed`);
    console.log(`   - Total Inputs: ${interactionMetrics.inputCount}`);
    console.log(`   - Visible Inputs: ${interactionMetrics.visibleInputs}`);
    if (inputLatency) {
      console.log(`   - Input Latency: ${inputLatency.toFixed(2)}ms`);
    }
    console.log('');
  }

  async analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...');
    
    const coverage = await this.page.coverage.startJSCoverage();
    await this.page.reload({ waitUntil: 'networkidle0' });
    const jsCoverage = await this.page.coverage.stopJSCoverage();
    
    let totalBytes = 0;
    let usedBytes = 0;
    
    for (const entry of jsCoverage) {
      totalBytes += entry.text.length;
      for (const range of entry.ranges) {
        usedBytes += range.end - range.start - 1;
      }
    }
    
    this.metrics.bundleAnalysis = {
      totalJS: Math.round(totalBytes / 1024),
      usedJS: Math.round(usedBytes / 1024),
      unusedJS: Math.round((totalBytes - usedBytes) / 1024),
      coveragePercent: ((usedBytes / totalBytes) * 100).toFixed(2)
    };
    
    console.log(`✅ Bundle analysis completed`);
    console.log(`   - Total JS: ${this.metrics.bundleAnalysis.totalJS}KB`);
    console.log(`   - Used JS: ${this.metrics.bundleAnalysis.usedJS}KB`);
    console.log(`   - Unused JS: ${this.metrics.bundleAnalysis.unusedJS}KB`);
    console.log(`   - Coverage: ${this.metrics.bundleAnalysis.coveragePercent}%`);
    console.log('');
  }

  async runLighthouseAnalysis() {
    console.log('📊 Running Lighthouse analysis...');
    
    const result = await lighthouse(`${BASE_URL}/onboarding`, {
      port: new URL(this.browser.wsEndpoint()).port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      throttlingMethod: 'devtools'
    });
    
    const { lhr } = result;
    
    this.metrics.lighthouse = {
      performanceScore: lhr.categories.performance.score * 100,
      metrics: {
        FCP: lhr.audits['first-contentful-paint'].numericValue,
        LCP: lhr.audits['largest-contentful-paint'].numericValue,
        TTI: lhr.audits['interactive'].numericValue,
        TBT: lhr.audits['total-blocking-time'].numericValue,
        CLS: lhr.audits['cumulative-layout-shift'].numericValue,
        SpeedIndex: lhr.audits['speed-index'].numericValue
      }
    };
    
    console.log(`✅ Lighthouse analysis completed`);
    console.log(`   - Performance Score: ${this.metrics.lighthouse.performanceScore}/100`);
    console.log(`   - FCP: ${this.metrics.lighthouse.metrics.FCP.toFixed(0)}ms`);
    console.log(`   - LCP: ${this.metrics.lighthouse.metrics.LCP.toFixed(0)}ms`);
    console.log(`   - TTI: ${this.metrics.lighthouse.metrics.TTI.toFixed(0)}ms`);
    console.log(`   - TBT: ${this.metrics.lighthouse.metrics.TBT.toFixed(0)}ms`);
    console.log(`   - CLS: ${this.metrics.lighthouse.metrics.CLS.toFixed(3)}`);
    console.log('');
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(RESULTS_DIR, `onboarding-metrics-${timestamp}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(this.metrics, null, 2));
    console.log(`\n💾 Results saved to: ${filePath}`);
    
    // Create summary report
    const summaryPath = path.join(RESULTS_DIR, `onboarding-summary-${timestamp}.md`);
    const summary = this.generateSummaryReport();
    fs.writeFileSync(summaryPath, summary);
    console.log(`📄 Summary report saved to: ${summaryPath}`);
  }

  generateSummaryReport() {
    return `# Onboarding Performance Analysis Report
Generated: ${this.metrics.timestamp}

## 🎯 Key Metrics

### Initial Load Performance
- **Total Load Time**: ${this.metrics.initialLoad.totalLoadTime}ms
- **First Paint**: ${this.metrics.initialLoad.paint?.find(p => p.name === 'first-paint')?.startTime?.toFixed(2)}ms
- **First Contentful Paint**: ${this.metrics.initialLoad.paint?.find(p => p.name === 'first-contentful-paint')?.startTime?.toFixed(2)}ms
- **Memory Usage**: ${this.metrics.initialLoad.memory?.usedJSHeapSize}MB / ${this.metrics.initialLoad.memory?.totalJSHeapSize}MB

### Lighthouse Scores
- **Performance Score**: ${this.metrics.lighthouse?.performanceScore}/100
- **LCP**: ${this.metrics.lighthouse?.metrics.LCP?.toFixed(0)}ms
- **TBT**: ${this.metrics.lighthouse?.metrics.TBT?.toFixed(0)}ms
- **CLS**: ${this.metrics.lighthouse?.metrics.CLS?.toFixed(3)}

### Bundle Analysis
- **Total JavaScript**: ${this.metrics.bundleAnalysis?.totalJS}KB
- **Used JavaScript**: ${this.metrics.bundleAnalysis?.usedJS}KB
- **Unused JavaScript**: ${this.metrics.bundleAnalysis?.unusedJS}KB
- **Code Coverage**: ${this.metrics.bundleAnalysis?.coveragePercent}%

### Step Transitions
${Object.entries(this.metrics.stepTransitions).map(([key, value]) => 
  `- **${key.replace(/_/g, ' ')}**: ${value.duration}ms (${value.apiCalls} API calls)`
).join('\n')}

## 📊 Recommendations

${this.generateRecommendations()}
`;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Check load time
    if (this.metrics.initialLoad.totalLoadTime > 3000) {
      recommendations.push('- ⚠️ Initial load time exceeds 3 seconds. Consider code splitting and lazy loading.');
    }
    
    // Check bundle size
    if (this.metrics.bundleAnalysis?.unusedJS > 100) {
      recommendations.push(`- ⚠️ ${this.metrics.bundleAnalysis.unusedJS}KB of unused JavaScript. Consider tree shaking and dynamic imports.`);
    }
    
    // Check Lighthouse score
    if (this.metrics.lighthouse?.performanceScore < 90) {
      recommendations.push('- ⚠️ Lighthouse performance score below 90. Focus on Core Web Vitals optimization.');
    }
    
    // Check LCP
    if (this.metrics.lighthouse?.metrics.LCP > 2500) {
      recommendations.push('- ⚠️ LCP exceeds 2.5s. Optimize largest content paint element.');
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '✅ Performance is within acceptable ranges.';
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.measureInitialLoad();
      await this.analyzeBundleSize();
      await this.runLighthouseAnalysis();
      
      // Measure form interactions for basic info step
      await this.measureFormInteraction('basicInfo');
      
      await this.saveResults();
      
      console.log('\n✨ Performance analysis completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the analyzer
const analyzer = new OnboardingPerformanceAnalyzer();
analyzer.run().catch(console.error);