# Testing Flow: localStorage Unified System

## Overview
This document describes how to test the end-to-end flow of the unified localStorage-based system.

## Prerequisites
- Clear all localStorage data before testing (or use incognito mode)
- Have two browser windows/profiles: one for Seller, one for Worker

## Test Scenario: Complete Order → Job → Claim → Review → Payout Flow

### Step 1: Setup (Seller)
1. Navigate to `/login`
2. Login as Seller (Demo mode or with credentials)
3. Should redirect to `/seller`

### Step 2: Create Service (Seller)
1. Go to `/seller/services/new`
2. Choose "งานกดมือ" (Manual/Human service)
3. Fill in service details:
   - Name: "ไลค์ Facebook คนจริง"
   - Platform: Facebook
   - Type: Like
   - Cost: 0.5 บาท
   - Sell Price: 1.0 บาท
   - Min: 100, Max: 1000
4. Click "เพิ่มบริการ"
5. Verify service appears in `/seller/services`

### Step 3: Create Team (Seller)
1. Go to `/seller/team`
2. Click "สร้างทีมใหม่"
3. Enter team name: "Test Team"
4. Click "สร้างทีม"
5. Verify team appears in list with invite code

### Step 4: Create Order (Seller)
1. Go to `/seller/orders/new`
2. Fill customer info:
   - Name: "ลูกค้าทดสอบ"
   - Contact: LINE
   - Value: "@testcustomer"
3. Add service item:
   - Select the service created in Step 2
   - URL: https://facebook.com/test
   - Quantity: 200
4. Click "เพิ่มลงรายการ"
5. Click "สร้างออเดอร์"
6. Should redirect to order detail page

### Step 5: Assign Job to Team (Seller)
1. On order detail page (should auto-redirect from Step 4)
2. Click "ยืนยันชำระเงิน" first
3. For the human service item, click "มอบหมายงานให้ทีม"
4. Select team: "Test Team" (created in Step 3)
5. Quantity: 200
6. Pay rate: 0.3 บาท/หน่วย
7. Click "มอบหมายงาน"
8. Verify job appears in localStorage under `meelike_team_jobs`

### Step 6: Worker Joins Team
1. In separate window/profile, login as Worker
2. Go to `/hub`
3. (Optional) Create a recruit post from seller profile
4. Or navigate directly to `/work/teams`
5. For demo: Worker should automatically see teams (uses mock teams in workerApi.getTeams())
6. Navigate to team detail page

### Step 7: Worker Claims Job
1. Go to `/work/teams/{team-id}/jobs`
2. Should see the job created in Step 5 under "งานว่าง" tab
3. Click "จองงาน"
4. Enter quantity: 200
5. Click "ยืนยันจองงาน"
6. Verify:
   - Job appears in `/work/jobs` under "กำลังทำ"
   - `meelike_job_claims` has new entry with status "claimed"

### Step 8: Worker Submits Job
1. Go to `/work/jobs/{claim-id}` (from Step 7)
2. Click "ส่งงานทันที"
3. (Optional) Add proof images/notes
4. Click "ส่งงาน"
5. Verify:
   - Job moves to "รอตรวจสอบ" tab
   - JobClaim status changes to "submitted" in localStorage

### Step 9: Seller Reviews Job
1. Back in Seller window
2. Go to `/seller/team/{team-id}/review`
3. Should see the submitted job
4. Click "อนุมัติ"
5. Click "ยืนยันอนุมัติ"
6. Verify:
   - JobClaim status → "approved"
   - TeamJob completedQuantity updated
   - New TeamPayout created with status "pending"
   - Job disappears from review page

### Step 10: Seller Processes Payout
1. Go to `/seller/team/{team-id}/payouts`
2. Should see pending payout for worker
3. Click "แจ้งโอนเงิน"
4. Click "ยืนยันโอนเงิน"
5. Verify:
   - TeamPayout status → "completed"
   - New Transaction created (type: "expense", category: "payout")
   - Transaction visible in `/seller/finance`

### Step 11: Verify Finance & Analytics
1. Go to `/seller/finance`
2. Verify:
   - Transaction appears in list
   - Balance decreased by payout amount
3. Go to `/seller/analytics`
4. Verify:
   - Revenue reflects order income
   - Orders count updated
   - Team stats updated (if displayed)

### Step 12: Worker Checks Earnings
1. In Worker window
2. Go to `/work/earnings`
3. Verify:
   - Completed job shows earnings
   - Balance updated (would need worker-side balance calculation)

## Expected localStorage Keys After Full Flow
```
meelike_services       → 1+ services
meelike_orders         → 1+ orders
meelike_team_jobs      → 1+ jobs (status: completed)
meelike_job_claims     → 1+ claims (status: approved)
meelike_payouts        → 1+ payouts (status: completed)
meelike_transactions   → 2+ transactions (order income + payout expense)
meelike_teams          → 1+ teams (memberCount updated)
meelike_team_members   → 1+ members (totalEarned updated)
```

## Quick Debug Commands (Browser Console)
```javascript
// View all stored data
Object.keys(localStorage).filter(k => k.startsWith('meelike_')).forEach(key => {
  console.log(key, JSON.parse(localStorage.getItem(key)));
});

// Clear all test data
Object.keys(localStorage).filter(k => k.startsWith('meelike_')).forEach(key => {
  if (key !== 'meelike-auth' && key !== 'meelike-app') {
    localStorage.removeItem(key);
  }
});

// Check specific key
console.log('TEAM_JOBS:', JSON.parse(localStorage.getItem('meelike_team_jobs')));
console.log('JOB_CLAIMS:', JSON.parse(localStorage.getItem('meelike_job_claims')));
console.log('PAYOUTS:', JSON.parse(localStorage.getItem('meelike_payouts')));
console.log('TRANSACTIONS:', JSON.parse(localStorage.getItem('meelike_transactions')));
```

## Known Limitations (Prototype)
- Worker must already be a team member to see jobs (manual membership required for now)
- Team linking in some places uses temporary workarounds
- Some UI pages still have partial mock data (e.g., team earnings calculations in team list)
- Real-time updates require page refresh (no websocket)
- No multi-device sync (localStorage is per-browser)

## Next Steps for Production
1. Replace localStorage with backend API calls
2. Add WebSocket for real-time updates
3. Add proper authentication/authorization
4. Add data validation and error boundaries
5. Implement proper team-job linking (currently uses orderIds temporarily)
