/**
 * Test Utilities for localStorage System
 * 
 * Open browser console and paste these functions to help debug and test
 */

// View all MeeLike data
function viewAllData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('meelike_'));
  const data = {};
  
  keys.forEach(key => {
    try {
      data[key] = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      data[key] = localStorage.getItem(key);
    }
  });
  
  console.table(
    keys.map(key => ({
      Key: key,
      Count: Array.isArray(data[key]) ? data[key].length : typeof data[key] === 'object' ? Object.keys(data[key]).length : 1,
      Type: typeof data[key]
    }))
  );
  
  return data;
}

// Clear all business data (keep auth)
function clearBusinessData() {
  const keys = Object.keys(localStorage).filter(k => 
    k.startsWith('meelike_') && 
    k !== 'meelike-auth' && 
    k !== 'meelike-app'
  );
  
  keys.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keys.length} keys:`, keys);
  console.log('Please refresh the page to reseed with fresh mock data');
}

// View specific data
function view(keyName) {
  const fullKey = keyName.startsWith('meelike_') ? keyName : `meelike_${keyName}`;
  const data = localStorage.getItem(fullKey);
  
  if (!data) {
    console.log(`Key "${fullKey}" not found`);
    return null;
  }
  
  try {
    const parsed = JSON.parse(data);
    console.log(`${fullKey}:`, parsed);
    return parsed;
  } catch (e) {
    console.log(`${fullKey}:`, data);
    return data;
  }
}

// Quick views for main entities
const viewOrders = () => view('orders');
const viewServices = () => view('services');
const viewTeams = () => view('teams');
const viewTeamMembers = () => view('team_members');
const viewTeamJobs = () => view('team_jobs');
const viewJobClaims = () => view('job_claims');
const viewPayouts = () => view('payouts');
const viewTransactions = () => view('transactions');
const viewHubPosts = () => view('hub_posts');
const viewTeamApplications = () => view('team_applications');

// Test flow helpers
function getCurrentUser() {
  const authData = localStorage.getItem('meelike-auth');
  if (!authData) return null;
  
  try {
    const parsed = JSON.parse(authData);
    const user = parsed?.state?.user;
    console.log('Current User:', {
      role: user?.role,
      id: user?.id,
      sellerId: user?.seller?.id,
      workerId: user?.worker?.id,
      displayName: user?.seller?.displayName || user?.worker?.displayName,
    });
    return user;
  } catch (e) {
    return null;
  }
}

// Simulate worker claiming a job
function simulateClaimJob(jobId, quantity = 100) {
  const user = getCurrentUser();
  if (!user || user.role !== 'worker') {
    console.error('Must be logged in as worker');
    return;
  }
  
  const teamJobs = view('team_jobs');
  const job = teamJobs?.find(j => j.id === jobId);
  
  if (!job) {
    console.error('Job not found:', jobId);
    return;
  }
  
  console.log('Would claim:', {
    job: job.serviceName,
    quantity,
    earnAmount: quantity * job.pricePerUnit,
  });
  
  console.log('Go to UI and use the "จองงาน" button to actually claim');
}

// Export to window for easy access
if (typeof window !== 'undefined') {
  window.testUtils = {
    viewAllData,
    clearBusinessData,
    view,
    viewOrders,
    viewServices,
    viewTeams,
    viewTeamMembers,
    viewTeamJobs,
    viewJobClaims,
    viewPayouts,
    viewTransactions,
    viewHubPosts,
    viewTeamApplications,
    getCurrentUser,
    simulateClaimJob,
  };
  
  console.log('Test utilities loaded! Use window.testUtils or:');
  console.log('  viewAllData() - view all data');
  console.log('  clearBusinessData() - clear all business data');
  console.log('  viewTeamJobs() - view team jobs');
  console.log('  viewJobClaims() - view job claims');
  console.log('  getCurrentUser() - view current user');
}
