const BACKEND_URL = 'https://skillbridge-backend-flax.vercel.app/api';

const runTests = async () => {
  console.log('=== SKILLBRIDGE PRODUCTION INTEGRATION & SEED TESTS ===');
  
  // Test 0: Trigger Cloud Database Seeding
  try {
    console.log('0. Triggering cloud database seeding via secure endpoint...');
    const seedRes = await fetch(`${BACKEND_URL}/seed?key=sanjeev_seed_key_123`);
    const seedData = await seedRes.json();
    console.log('   Result:', seedRes.ok ? 'SUCCESS' : 'FAILED');
    console.log('   Response:', seedData);
  } catch (err) {
    console.error('   Result: FAILED');
    console.error('   Error Details:', err.message);
    return;
  }

  // Test 1: Health Check & Database Connection Verification
  try {
    console.log('\n1. Querying /api/health...');
    const res = await fetch(`${BACKEND_URL}/health`);
    const data = await res.json();
    console.log('   Result:', res.ok ? 'SUCCESS' : 'FAILED');
    console.log('   Response Data:', data);
  } catch (err) {
    console.error('   Result: FAILED');
    console.error('   Error Details:', err.message);
  }

  // Test 2: Database Course Records Fetch Verification
  try {
    console.log('\n2. Querying /api/courses...');
    const res = await fetch(`${BACKEND_URL}/courses`);
    const data = await res.json();
    console.log('   Result:', res.ok ? 'SUCCESS' : 'FAILED');
    console.log(`   Courses Found: ${data.length}`);
    if (res.ok && data.length > 0) {
      console.log('   First Course Entry:', {
        _id: data[0]._id,
        title: data[0].title,
        instructor: data[0].instructor
      });
    }
  } catch (err) {
    console.error('   Result: FAILED');
    console.error('   Error Details:', err.message);
  }

  // Test 3: Authentication and Login Endpoint Verification
  try {
    console.log('\n3. Testing POST /api/auth/login with student1@school.edu...');
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student1@school.edu',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('   Result:', res.ok ? 'SUCCESS' : 'FAILED');
    if (res.ok) {
      console.log('   Logged In User Profile:', {
        _id: data._id,
        name: data.name,
        role: data.role,
        tokenIssued: !!data.token
      });
    } else {
      console.error('   Error Message:', data.message);
    }
  } catch (err) {
    console.error('   Result: FAILED');
    console.error('   Error Details:', err.message);
  }
  
  console.log('\n=== INTEGRATION TESTS COMPLETE ===');
};

runTests();
