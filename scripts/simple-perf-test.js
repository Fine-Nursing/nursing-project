#!/usr/bin/env node

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3002';

async function measurePageLoad(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let firstByteTime = null;
    let totalSize = 0;
    
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      if (!firstByteTime) {
        firstByteTime = Date.now() - startTime;
      }
      
      res.on('data', (chunk) => {
        totalSize += chunk.length;
      });
      
      res.on('end', () => {
        const totalTime = Date.now() - startTime;
        resolve({
          url,
          statusCode: res.statusCode,
          firstByteTime,
          totalTime,
          totalSize,
          headers: res.headers
        });
      });
    }).on('error', reject);
  });
}

async function analyzeOnboarding() {
  console.log('🚀 Starting Onboarding Performance Analysis\n');
  console.log('=' .repeat(50));
  
  try {
    // Test main onboarding page
    console.log('\n📊 Testing /onboarding page...');
    const onboardingMetrics = await measurePageLoad(`${BASE_URL}/onboarding`);
    
    console.log(`✅ Status Code: ${onboardingMetrics.statusCode}`);
    console.log(`⏱️  Time to First Byte: ${onboardingMetrics.firstByteTime}ms`);
    console.log(`⏱️  Total Load Time: ${onboardingMetrics.totalTime}ms`);
    console.log(`📦 Page Size: ${(onboardingMetrics.totalSize / 1024).toFixed(2)}KB`);
    console.log(`🔍 Content-Type: ${onboardingMetrics.headers['content-type']}`);
    
    // Test static assets
    console.log('\n📊 Testing static assets...');
    const staticTests = [
      '/_next/static/css/app/layout.css',
      '/_next/static/chunks/main.js',
      '/_next/static/chunks/pages/_app.js'
    ];
    
    for (const path of staticTests) {
      try {
        const metrics = await measurePageLoad(`${BASE_URL}${path}`);
        if (metrics.statusCode === 200) {
          console.log(`  ✅ ${path}: ${metrics.totalTime}ms (${(metrics.totalSize / 1024).toFixed(2)}KB)`);
        }
      } catch (err) {
        // Static path might not exist in dev mode
      }
    }
    
    // Test API endpoint
    console.log('\n📊 Testing API endpoints...');
    try {
      const apiMetrics = await measurePageLoad(`${BASE_URL}/api/health`);
      if (apiMetrics.statusCode === 200 || apiMetrics.statusCode === 404) {
        console.log(`  API Response: ${apiMetrics.statusCode} in ${apiMetrics.totalTime}ms`);
      }
    } catch (err) {
      console.log('  API endpoint not available');
    }
    
    // Performance recommendations
    console.log('\n💡 Performance Analysis:');
    console.log('=' .repeat(50));
    
    if (onboardingMetrics.totalTime > 1000) {
      console.log('⚠️  Page load time exceeds 1 second');
      console.log('   Recommendation: Enable production mode for accurate metrics');
    } else {
      console.log('✅ Page load time is acceptable');
    }
    
    if (onboardingMetrics.totalSize > 100 * 1024) {
      console.log('⚠️  Page size exceeds 100KB');
      console.log('   Recommendation: Consider code splitting');
    } else {
      console.log('✅ Page size is reasonable');
    }
    
    console.log('\n📌 Note: This is a basic measurement in dev mode.');
    console.log('   For accurate metrics, run production build and use Lighthouse.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure the dev server is running on port 3002');
  }
}

// Run the analysis
analyzeOnboarding().catch(console.error);