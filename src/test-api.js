// Simple API test script
// Run this in browser console to test API directly

import api from './api';

console.log('🧪 Testing API endpoints...');

async function testAPI() {
  try {
    console.log('\n1️⃣ Testing /get-years...');
    const yearsRes = await api.get('/malaysia-application-stats/get-years');
    console.log('✓ Years:', yearsRes.data);

    console.log('\n2️⃣ Testing /get-categories...');
    const categoriesRes = await api.get('/malaysia-application-stats/get-categories');
    console.log('✓ Categories:', categoriesRes.data);

    console.log('\n3️⃣ Testing /stats/years...');
    const statsRes = await api.get('/malaysia-application-stats/stats/years');
    console.log('✓ Stats:', statsRes.data);

    console.log('\n✅ All API endpoints working!');
  } catch (error) {
    console.error('\n❌ API Test Failed:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    });
  }
}

testAPI();
