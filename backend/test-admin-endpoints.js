// Test script for admin endpoints
// Run this after starting your server to test the admin endpoints

const testAdminEndpoints = async () => {
  const baseUrl = 'http://localhost:4000';
  
  // You'll need to replace this with a valid admin token
  const adminToken = 'your-admin-token-here';
  
  try {
    console.log('Testing admin endpoints...\n');
    
    // Test admin stats endpoint
    console.log('1. Testing /api/admin/stats endpoint...');
    const statsResponse = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats endpoint working:', statsData);
    } else {
      console.log('❌ Stats endpoint failed:', statsResponse.status);
    }
    
    // Test admin analytics endpoint
    console.log('\n2. Testing /api/admin/analytics endpoint...');
    const analyticsResponse = await fetch(`${baseUrl}/api/admin/analytics?period=7d`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics endpoint working:', analyticsData);
    } else {
      console.log('❌ Analytics endpoint failed:', analyticsResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Uncomment the line below to run the test
// testAdminEndpoints();

export default testAdminEndpoints; 