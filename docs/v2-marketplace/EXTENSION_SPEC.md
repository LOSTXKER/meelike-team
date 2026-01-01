# Browser Extension Technical Specification

> Technical Spec for MeeLike Extension
> 
> **UI Guidelines:** Minimal, Clean, Modern - NO EMOJI, Icons Only (Lucide)

---

## 📋 สารบัญ

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Supported Platforms](#supported-platforms)
4. [Core Features](#core-features)
5. [Technical Implementation](#technical-implementation)
6. [Anti-Cheat System](#anti-cheat-system)
7. [Anti-Unlike System](#anti-unlike-system)
8. [API Specification](#api-specification)
9. [Security](#security)
10. [Development Roadmap](#development-roadmap)

---

## Overview

### What is MeeLike Extension?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  MeeLike Extension                                                          │
│                                                                              │
│  Browser Extension Features:                                                │
│  ├── [target] Display jobs on Social Media pages                           │
│  ├── [activity] Track actions (Like, Follow, Comment)                      │
│  ├── [check-circle] Auto-verify completed jobs                             │
│  ├── [wallet] Real-time earnings display                                   │
│  └── [bell] New job notifications                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Supported Browsers

| Browser | Support | Store |
|---------|---------|-------|
| Google Chrome | ✅ Phase 1 | Chrome Web Store |
| Microsoft Edge | ✅ Phase 1 | Edge Add-ons |
| Brave | ✅ Phase 1 | Chrome Web Store |
| Firefox | ⚠️ Phase 2 | Firefox Add-ons |
| Safari | ❌ Not planned | - |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Extension Architecture                                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         BROWSER                                      │    │
│  │                                                                      │    │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │    │
│  │  │   Popup UI   │    │  Background  │    │   Content    │           │    │
│  │  │              │<-->│   Service    │<-->│   Scripts    │           │    │
│  │  │  - My Jobs   │    │   Worker     │    │              │           │    │
│  │  │  - Earnings  │    │              │    │  - FB Script │           │    │
│  │  │  - Settings  │    │  - Auth      │    │  - IG Script │           │    │
│  │  └──────────────┘    │  - API calls │    │  - TikTok    │           │    │
│  │                      │  - Storage   │    │  - Twitter   │           │    │
│  │                      └──────┬───────┘    └──────┬───────┘           │    │
│  │                             │                   │                    │    │
│  └─────────────────────────────┼───────────────────┼────────────────────┘    │
│                                │                   │                         │
│                                v                   v                         │
│                       ┌────────────────────────────────────┐                │
│                       │         MeeLike API Server         │                │
│                       │                                    │                │
│                       │  - Authentication                  │                │
│                       │  - Job Management                  │                │
│                       │  - Action Verification             │                │
│                       │  - Payment Processing              │                │
│                       └────────────────────────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Extension Components                                                       │
│                                                                              │
│  [1] Popup UI (popup.html + popup.js)                                       │
│      ├── Display claimed jobs                                              │
│      ├── Show today/total earnings                                         │
│      ├── Quick actions (open job, view history)                            │
│      └── Settings & Account                                                │
│                                                                              │
│  [2] Background Service Worker (background.js)                              │
│      ├── Handle authentication                                             │
│      ├── API communication                                                 │
│      ├── Manage extension state                                            │
│      ├── Push notifications                                                │
│      └── Periodic job sync                                                 │
│                                                                              │
│  [3] Content Scripts (content/*.js)                                         │
│      ├── Inject into Social Media pages                                    │
│      ├── Detect Like/Follow/Comment actions                                │
│      ├── Show job overlay UI                                               │
│      └── Report actions to background                                      │
│                                                                              │
│  [4] Options Page (options.html)                                            │
│      ├── Login/Logout                                                      │
│      ├── Notification settings                                             │
│      └── Platform preferences                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Supported Platforms

### Phase 1 Platforms

| Platform | Actions | Priority |
|----------|---------|----------|
| **Facebook** | Like, Follow Page, Follow Profile, Comment, Share | 🔴 High |
| **Instagram** | Like, Follow, Comment | 🔴 High |
| **TikTok** | Like, Follow, Comment | 🔴 High |
| **Twitter/X** | Like, Follow, Retweet, Comment | 🟡 Medium |

### Platform-Specific Selectors

```javascript
// Facebook Selectors (อาจเปลี่ยนตาม UI update)
const FB_SELECTORS = {
  likeButton: '[aria-label="Like"]',
  likeButtonActive: '[aria-label="Remove Like"]',
  followButton: '[aria-label="Follow"]',
  commentInput: '[aria-label="Write a comment"]',
  shareButton: '[aria-label="Share"]',
  postContainer: '[data-pagelet^="FeedUnit"]',
};

// Instagram Selectors
const IG_SELECTORS = {
  likeButton: 'svg[aria-label="Like"]',
  likeButtonActive: 'svg[aria-label="Unlike"]',
  followButton: 'button:contains("Follow")',
  commentInput: 'textarea[aria-label="Add a comment…"]',
};

// TikTok Selectors
const TIKTOK_SELECTORS = {
  likeButton: '[data-e2e="like-icon"]',
  followButton: '[data-e2e="follow-button"]',
  commentInput: '[data-e2e="comment-input"]',
};
```

---

## Core Features

### Feature 1: Job Detection & Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🎯 Job Detection Flow:                                                     │
│                                                                              │
│  1. Worker เปิดหน้า Facebook                                               │
│       ↓                                                                     │
│  2. Content Script ตรวจสอบ URL                                             │
│       ↓                                                                     │
│  3. ถ้าตรงกับงานที่รับไว้ → แสดง Overlay                                   │
│       ↓                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  🎯 MeeLike Job                                    [x]        │  │    │
│  │  │  ───────────────────────────────────────────────────────────  │  │    │
│  │  │  📋 กด Like โพสต์นี้                                          │  │    │
│  │  │  💰 รางวัล: ฿0.25                                             │  │    │
│  │  │                                                               │  │    │
│  │  │  [👍 กด Like เพื่อรับเงิน]                                    │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature 1.5: Pre-Check (ตรวจสอบก่อนทำงาน)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔍 Pre-Check Flow: ป้องกัน Like/Follow ซ้ำ                                 │
│                                                                              │
│  ปัญหา:                                                                     │
│  ├── Worker อาจเคย Like โพสต์นี้ไปแล้ว (ก่อนรับงาน)                        │
│  ├── Worker อาจเป็น Fan อยู่แล้ว (Follow ไปนานแล้ว)                        │
│  └── ❌ ถ้าปล่อยผ่าน = ได้เงินฟรีโดยไม่ต้องทำอะไร!                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📋 Pre-Check Logic:                                                │    │
│  │                                                                      │    │
│  │  1. Worker เปิดหน้างาน                                              │    │
│  │       ↓                                                              │    │
│  │  2. Extension ตรวจสถานะปุ่มทันที:                                   │    │
│  │       │                                                              │    │
│  │       ├── ปุ่ม = "Like" → ✅ ยังไม่ Like → ทำงานได้                 │    │
│  │       │   └── แสดง "กด Like เพื่อรับ ฿0.25"                        │    │
│  │       │                                                              │    │
│  │       └── ปุ่ม = "Unlike" → ❌ Like อยู่แล้ว → BLOCK!              │    │
│  │           └── แสดง Warning                                          │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  State Mapping:                                                      │    │
│  │                                                                      │    │
│  │  Action Type │ Before State │ After State  │ ผลลัพธ์                │    │
│  │  ────────────┼──────────────┼──────────────┼────────────────────     │    │
│  │  Like        │ "Like"       │ "Unlike"     │ ✅ สำเร็จ              │    │
│  │  Like        │ "Unlike"     │ "Unlike"     │ ❌ Like อยู่แล้ว       │    │
│  │  Follow      │ "Follow"     │ "Following"  │ ✅ สำเร็จ              │    │
│  │  Follow      │ "Following"  │ "Following"  │ ❌ Follow อยู่แล้ว     │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Warning UI (เมื่อ Like/Follow อยู่แล้ว)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │                    ┌─────────────────────────┐                       │    │
│  │                    │                         │                       │    │
│  │                    │     ⚠️ ไม่สามารถ        │                       │    │
│  │                    │     รับเงินได้          │                       │    │
│  │                    │                         │                       │    │
│  │                    │  คุณ Like โพสต์นี้       │                       │    │
│  │                    │  ไปแล้วก่อนหน้านี้       │                       │    │
│  │                    │                         │                       │    │
│  │                    │  เฉพาะการกระทำใหม่       │                       │    │
│  │                    │  เท่านั้นที่จะได้รับเงิน │                       │    │
│  │                    │                         │                       │    │
│  │                    │  [ดูงานอื่น] [ยกเลิก]   │                       │    │
│  │                    │                         │                       │    │
│  │                    └─────────────────────────┘                       │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Pre-Check Implementation

```javascript
// Content Script: Pre-check before allowing job
class JobValidator {
  constructor() {
    this.initialState = null;
  }
  
  async validateJobOnPageLoad(job) {
    // 1. หาปุ่ม Like/Follow
    const actionButton = this.findActionButton(job.actionType);
    
    if (!actionButton) {
      return { valid: false, reason: 'button_not_found' };
    }
    
    // 2. ตรวจสถานะปัจจุบัน
    const currentState = this.getButtonState(actionButton);
    
    // 3. ตรวจว่าทำไปแล้วหรือยัง
    const alreadyDone = this.isAlreadyActioned(currentState, job.actionType);
    
    if (alreadyDone) {
      // แสดง Warning
      this.showAlreadyDoneWarning(job);
      return { valid: false, reason: 'already_actioned', state: currentState };
    }
    
    // 4. บันทึก Initial State (สำหรับเทียบทีหลัง)
    this.initialState = currentState;
    
    return { valid: true, initialState: currentState };
  }
  
  getButtonState(button) {
    // Facebook
    const label = button.getAttribute('aria-label');
    if (label) return label;
    
    // Instagram
    const svg = button.querySelector('svg');
    if (svg) return svg.getAttribute('aria-label');
    
    // TikTok
    return button.textContent?.trim();
  }
  
  isAlreadyActioned(state, actionType) {
    const alreadyDoneStates = {
      'like': ['Unlike', 'Liked', 'Remove Like'],
      'follow': ['Following', 'Unfollow', 'แกะติดตาม'],
      'subscribe': ['Subscribed', 'ยกเลิกการติดตาม']
    };
    
    const doneStates = alreadyDoneStates[actionType] || [];
    return doneStates.some(s => 
      state?.toLowerCase().includes(s.toLowerCase())
    );
  }
  
  async verifyStateChange(actionButton) {
    const newState = this.getButtonState(actionButton);
    
    // ต้องมีการเปลี่ยนแปลง
    if (newState === this.initialState) {
      return { verified: false, reason: 'no_state_change' };
    }
    
    // ต้องเปลี่ยนไปสถานะที่ถูกต้อง
    const expectedTransitions = {
      'Like': ['Unlike', 'Remove Like'],
      'Follow': ['Following', 'Unfollow'],
      'Subscribe': ['Subscribed']
    };
    
    const validNextStates = expectedTransitions[this.initialState] || [];
    const isValidTransition = validNextStates.some(s => 
      newState?.toLowerCase().includes(s.toLowerCase())
    );
    
    if (!isValidTransition) {
      return { 
        verified: false, 
        reason: 'unexpected_state',
        details: { from: this.initialState, to: newState }
      };
    }
    
    return { 
      verified: true, 
      stateBefore: this.initialState, 
      stateAfter: newState 
    };
  }
  
  showAlreadyDoneWarning(job) {
    const actionName = {
      'like': 'Like',
      'follow': 'Follow',
      'subscribe': 'Subscribe'
    }[job.actionType] || job.actionType;
    
    const overlay = document.createElement('div');
    overlay.id = 'meelike-already-done-overlay';
    overlay.innerHTML = `
      <div class="meelike-overlay-backdrop"></div>
      <div class="meelike-warning-box">
        <div class="warning-icon">⚠️</div>
        <h3>ไม่สามารถรับเงินได้</h3>
        <p>คุณ ${actionName} ไปแล้วก่อนหน้านี้</p>
        <p class="hint">เฉพาะการกระทำใหม่เท่านั้นที่จะได้รับเงิน</p>
        <div class="buttons">
          <button class="btn-secondary" onclick="meelike.cancelJob('${job.id}')">
            ยกเลิกงาน
          </button>
          <button class="btn-primary" onclick="meelike.findOtherJobs()">
            ดูงานอื่น
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  findActionButton(actionType) {
    const selectors = {
      'like': [
        '[aria-label="Like"]',
        '[aria-label="Unlike"]',
        'svg[aria-label="Like"]',
        'svg[aria-label="Unlike"]',
        '[data-e2e="like-icon"]'
      ],
      'follow': [
        '[aria-label="Follow"]',
        '[aria-label="Following"]',
        'button:contains("Follow")',
        '[data-e2e="follow-button"]'
      ]
    };
    
    const buttonSelectors = selectors[actionType] || [];
    for (const selector of buttonSelectors) {
      const button = document.querySelector(selector);
      if (button) return button;
    }
    return null;
  }
}

// Export for use
window.MeeLikeValidator = new JobValidator();
```

### Feature 2: Action Tracking

```javascript
// Simplified Action Tracking Logic
class ActionTracker {
  constructor(platform) {
    this.platform = platform;
    this.selectors = PLATFORM_SELECTORS[platform];
  }

  init() {
    // Listen for clicks on Like buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest(this.selectors.likeButton);
      if (target) {
        this.handleLikeClick(target);
      }
    });
  }

  async handleLikeClick(element) {
    // Wait for UI to update
    await this.waitForStateChange(element);

    // Check if Like was successful
    const isLiked = this.checkIfLiked(element);
    
    if (isLiked) {
      // Get post info
      const postInfo = this.extractPostInfo(element);
      
      // Report to background script
      chrome.runtime.sendMessage({
        type: 'ACTION_COMPLETED',
        action: 'like',
        platform: this.platform,
        postId: postInfo.id,
        postUrl: postInfo.url,
        timestamp: Date.now()
      });
    }
  }

  extractPostInfo(element) {
    const postContainer = element.closest(this.selectors.postContainer);
    return {
      id: this.extractPostId(postContainer),
      url: window.location.href,
    };
  }
}
```

### Feature 3: Real-time Earnings Display

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Earnings Popup UI                                                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  ┌───────────────────────────────────────────────────────────────┐  │    │
│  │  │  MEELIKE                                       [settings]     │  │    │
│  │  │                                                               │  │    │
│  │  │  ┌─────────────────┐  ┌─────────────────┐                    │  │    │
│  │  │  │ Today           │  │ Total           │                    │  │    │
│  │  │  │ B 127.50        │  │ B 3,450.00      │                    │  │    │
│  │  │  │ +B 0.25         │  │ Level: Gold     │                    │  │    │
│  │  │  └─────────────────┘  └─────────────────┘                    │  │    │
│  │  │                                                               │  │    │
│  │  │  My Jobs (3)                                                  │  │    │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │  │    │
│  │  │  │ [check] FB Like @post123 - B 0.25         Completed     │ │  │    │
│  │  │  │ [clock] IG Follow @user456 - B 0.30       0/1           │ │  │    │
│  │  │  │ [clock] TikTok Like @video789 - B 0.20    0/1           │ │  │    │
│  │  │  └─────────────────────────────────────────────────────────┘ │  │    │
│  │  │                                                               │  │    │
│  │  │  [View All Jobs]              [Withdraw]                     │  │    │
│  │  └───────────────────────────────────────────────────────────────┘  │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Manifest V3 Structure

```json
{
  "manifest_version": 3,
  "name": "MeeLike - รับงาน Social Media",
  "version": "1.0.0",
  "description": "รับงาน Like, Follow, Comment และรับเงินทันที",
  
  "permissions": [
    "storage",
    "notifications",
    "alarms"
  ],
  
  "host_permissions": [
    "https://www.facebook.com/*",
    "https://www.instagram.com/*",
    "https://www.tiktok.com/*",
    "https://twitter.com/*",
    "https://x.com/*",
    "https://api.meelike.me/*"
  ],
  
  "background": {
    "service_worker": "background.js"
  },
  
  "content_scripts": [
    {
      "matches": ["https://www.facebook.com/*"],
      "js": ["content/facebook.js"],
      "css": ["content/overlay.css"]
    },
    {
      "matches": ["https://www.instagram.com/*"],
      "js": ["content/instagram.js"],
      "css": ["content/overlay.css"]
    },
    {
      "matches": ["https://www.tiktok.com/*"],
      "js": ["content/tiktok.js"],
      "css": ["content/overlay.css"]
    },
    {
      "matches": ["https://twitter.com/*", "https://x.com/*"],
      "js": ["content/twitter.js"],
      "css": ["content/overlay.css"]
    }
  ],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  
  "options_page": "options.html",
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### Background Service Worker

```javascript
// background.js
class MeeLikeBackground {
  constructor() {
    this.authToken = null;
    this.currentJobs = [];
    this.init();
  }

  init() {
    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });

    // Periodic job sync
    chrome.alarms.create('syncJobs', { periodInMinutes: 5 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'syncJobs') {
        this.syncJobs();
      }
    });
  }

  async handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'LOGIN':
        await this.login(message.credentials);
        sendResponse({ success: true });
        break;

      case 'GET_JOBS':
        const jobs = await this.getJobs();
        sendResponse({ jobs });
        break;

      case 'ACTION_COMPLETED':
        const result = await this.reportAction(message);
        sendResponse(result);
        break;

      case 'GET_EARNINGS':
        const earnings = await this.getEarnings();
        sendResponse({ earnings });
        break;
    }
  }

  async reportAction(actionData) {
    try {
      const response = await fetch('https://api.meelike.me/v1/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          action: actionData.action,
          platform: actionData.platform,
          postId: actionData.postId,
          postUrl: actionData.postUrl,
          timestamp: actionData.timestamp,
          metadata: {
            browserFingerprint: await this.getFingerprint(),
            tabId: actionData.tabId
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'งานสำเร็จ! 🎉',
          message: `ได้รับ ฿${result.reward} แล้ว`
        });

        // Update badge
        this.updateBadge(result.todayEarnings);
      }

      return result;
    } catch (error) {
      console.error('Report action failed:', error);
      return { success: false, error: error.message };
    }
  }

  updateBadge(earnings) {
    chrome.action.setBadgeText({ text: `฿${Math.floor(earnings)}` });
    chrome.action.setBadgeBackgroundColor({ color: '#10B981' });
  }
}

new MeeLikeBackground();
```

### Content Script (Facebook Example)

```javascript
// content/facebook.js
class FacebookTracker {
  constructor() {
    this.activeJobs = [];
    this.processedPosts = new Set();
    this.init();
  }

  async init() {
    // Get active jobs from background
    const response = await chrome.runtime.sendMessage({ type: 'GET_JOBS' });
    this.activeJobs = response.jobs.filter(j => j.platform === 'facebook');

    // Watch for DOM changes (infinite scroll)
    this.observeDOM();

    // Initial scan
    this.scanPage();
  }

  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      this.scanPage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  scanPage() {
    // Find all posts
    const posts = document.querySelectorAll('[data-pagelet^="FeedUnit"]');

    posts.forEach(post => {
      const postId = this.extractPostId(post);
      
      if (this.processedPosts.has(postId)) return;
      this.processedPosts.add(postId);

      // Check if this post has a job
      const job = this.activeJobs.find(j => j.postId === postId);
      if (job) {
        this.attachJobOverlay(post, job);
      }
    });
  }

  extractPostId(postElement) {
    // Extract post ID from various sources
    const link = postElement.querySelector('a[href*="/posts/"]');
    if (link) {
      const match = link.href.match(/\/posts\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  attachJobOverlay(postElement, job) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'meelike-job-overlay';
    overlay.innerHTML = `
      <div class="meelike-job-card">
        <div class="meelike-job-header">
          <span>🎯 MeeLike Job</span>
          <button class="meelike-close">×</button>
        </div>
        <div class="meelike-job-body">
          <p>📋 ${job.description}</p>
          <p>💰 รางวัล: <strong>฿${job.reward}</strong></p>
        </div>
        <button class="meelike-action-btn">
          ${this.getActionIcon(job.action)} ${this.getActionText(job.action)}
        </button>
      </div>
    `;

    // Position overlay
    postElement.style.position = 'relative';
    postElement.appendChild(overlay);

    // Listen for action
    this.attachActionListener(postElement, job);
  }

  attachActionListener(postElement, job) {
    const actionButton = postElement.querySelector('[aria-label="Like"]');
    
    if (actionButton) {
      actionButton.addEventListener('click', async () => {
        // Wait for Facebook to process
        await this.sleep(500);

        // Check if action was successful
        const isLiked = postElement.querySelector('[aria-label="Remove Like"]');
        
        if (isLiked) {
          // Report success
          const result = await chrome.runtime.sendMessage({
            type: 'ACTION_COMPLETED',
            action: 'like',
            platform: 'facebook',
            postId: job.postId,
            postUrl: window.location.href,
            jobId: job.id,
            timestamp: Date.now()
          });

          if (result.success) {
            // Update overlay to show success
            const overlay = postElement.querySelector('.meelike-job-overlay');
            overlay.innerHTML = `
              <div class="meelike-success">
                ✅ สำเร็จ! ได้รับ ฿${job.reward}
              </div>
            `;

            // Remove after 3 seconds
            setTimeout(() => overlay.remove(), 3000);
          }
        }
      });
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getActionIcon(action) {
    const icons = { like: '👍', follow: '➕', comment: '💬', share: '🔄' };
    return icons[action] || '📋';
  }

  getActionText(action) {
    const texts = { 
      like: 'กด Like เพื่อรับเงิน', 
      follow: 'กด Follow เพื่อรับเงิน',
      comment: 'คอมเมนต์เพื่อรับเงิน',
      share: 'แชร์เพื่อรับเงิน'
    };
    return texts[action] || 'ทำงานนี้';
  }
}

new FacebookTracker();
```

---

## Anti-Cheat System

### Detection Methods

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Anti-Cheat Measures                                                        │
│                                                                              │
│  [1] Browser Fingerprinting                                                 │
│      ├── Canvas fingerprint                                                │
│      ├── WebGL fingerprint                                                 │
│      ├── Audio fingerprint                                                 │
│      └── VM/Emulator detection                                             │
│                                                                              │
│  [2] Action Validation                                                      │
│      ├── Verify actual DOM state (Like button state)                       │
│      ├── Validate timestamp reasonability                                  │
│      ├── Rate limiting (max 1 action/5 seconds)                            │
│      └── Sequence check (must open page before click)                      │
│                                                                              │
│  [3] Spot Check                                                             │
│      ├── Random verify 10% of jobs                                         │
│      ├── Use API to check actual like count                                │
│      └── Compare with baseline                                             │
│                                                                              │
│  [4] Behavioral Analysis                                                    │
│      ├── Click patterns (non bot-like)                                     │
│      ├── Time between actions                                              │
│      ├── Mouse movement patterns                                           │
│      └── ML-based anomaly detection                                        │
│                                                                              │
│  [5] Penalty System                                                         │
│      ├── Warning + Score reduction                                         │
│      ├── Temp Ban (3 days)                                                 │
│      └── Permanent Ban                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Trust Score System

```javascript
// Trust Score Calculation
const calculateTrustScore = (worker) => {
  let score = 100; // Start at 100

  // Deductions
  score -= worker.disputeCount * 5;           // -5 per dispute
  score -= worker.rejectedJobs * 2;           // -2 per rejected job
  score -= worker.suspiciousActions * 10;     // -10 per suspicious action

  // Bonuses
  score += Math.min(worker.completedJobs / 10, 20);  // +1 per 10 jobs, max +20
  score += worker.accountAge > 30 ? 5 : 0;           // +5 if account > 30 days
  score += worker.verifiedPhone ? 5 : 0;             // +5 if phone verified

  return Math.max(0, Math.min(100, score));
};

// Trust Level mapping
const getTrustLevel = (score) => {
  if (score >= 90) return 'excellent';   // ตรวจ 5%
  if (score >= 70) return 'good';        // ตรวจ 10%
  if (score >= 50) return 'moderate';    // ตรวจ 30%
  if (score >= 30) return 'low';         // ตรวจ 50%
  return 'suspicious';                    // ตรวจ 100% + review
};
```

---

## Anti-Unlike System

### Problem: Unlike/Unfollow After Payment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Scenario to prevent:                                                       │
│                                                                              │
│  1. Worker claims job "Like Post X"                                        │
│  2. Worker clicks Like -> Extension verifies -> Gets B 0.25                │
│  3. Worker clicks Unlike immediately (or 5 min later)                      │
│  4. [x] Employer loses money but doesn't get the Like!                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Strategy: Trust-based Payment + Spot Check + Heavy Penalty

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Hybrid Approach                                                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Level     │ Immediate │ Hold    │ Check After │ Penalty           │    │
│  │  ──────────┼───────────┼─────────┼─────────────┼─────────────────   │    │
│  │  New       │    0%     │  100%   │  48 hrs     │ Instant Ban       │    │
│  │  Bronze    │   50%     │   50%   │  24 hrs     │ -20 Score         │    │
│  │  Silver    │   75%     │   25%   │  24 hrs     │ -15 Score         │    │
│  │  Gold      │   90%     │   10%   │  48 hrs     │ -10 Score         │    │
│  │  Platinum  │  100%     │    0%   │ Spot Check  │ -5 Score          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  [check] New workers: Must prove themselves (Hold 100%, verify all)        │
│  [check] Old workers: Trusted, pay immediately (Spot Check only)           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Payment Flow by Level

```javascript
// Payment calculation based on trust level
const calculatePayment = (worker, reward) => {
  const levels = {
    'new': { immediate: 0, hold: 1, holdDays: 2 },
    'bronze': { immediate: 0.5, hold: 0.5, holdDays: 1 },
    'silver': { immediate: 0.75, hold: 0.25, holdDays: 1 },
    'gold': { immediate: 0.9, hold: 0.1, holdDays: 2 },
    'platinum': { immediate: 1, hold: 0, holdDays: 0 }
  };

  const config = levels[worker.level] || levels['new'];
  
  return {
    immediatePayment: reward * config.immediate,
    holdAmount: reward * config.hold,
    holdReleaseDays: config.holdDays,
    releaseAt: config.holdDays > 0 
      ? new Date(Date.now() + config.holdDays * 24 * 60 * 60 * 1000)
      : null
  };
};

// Example:
// Bronze worker completes ฿0.25 job
// → Immediate: ฿0.125 (50%)
// → Hold: ฿0.125 (50%) - released after 24h if still liked
```

### Primary: Screenshot + Freeze + Auto-Close System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Primary System: Screenshot + AI Verify + Auto Close                        │
│                                                                              │
│  Flow:                                                                       │
│  ┌─────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│  │Click│ -> │ Freeze  │ -> │ Capture │ -> │ AI/DOM  │ -> │ Close   │       │
│  │Like │    │ Screen  │    │ Screen  │    │ Verify  │    │ Tab     │       │
│  └─────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                              │
│  Benefits:                                                                   │
│  ├── [check] Worker has no chance to Unlike (Tab closes immediately)       │
│  ├── [check] Screenshot as evidence                                        │
│  ├── [check] AI can detect fakes                                           │
│  └── [check] Good UX (only 1-2 seconds wait)                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Freeze Overlay UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Verifying State - Full screen overlay:                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │                    ┌─────────────────────────┐                       │    │
│  │                    │                         │                       │    │
│  │                    │     [loader-icon]       │                       │    │
│  │                    │     Verifying...        │                       │    │
│  │                    │                         │                       │    │
│  │                    │   [progressbar] 85%     │                       │    │
│  │                    │                         │                       │    │
│  │                    │   Please wait           │                       │    │
│  │                    │                         │                       │    │
│  │                    └─────────────────────────┘                       │    │
│  │                                                                      │    │
│  │  (Background: Facebook page - blurred/darkened)                     │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Success State:                                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ┌─────────────────────────┐                       │    │
│  │                    │                         │                       │    │
│  │                    │     [check-circle]      │                       │    │
│  │                    │     Success!            │                       │    │
│  │                    │                         │                       │    │
│  │                    │       +B 0.25           │                       │    │
│  │                    │                         │                       │    │
│  │                    │  Closing in 2s...       │                       │    │
│  │                    │                         │                       │    │
│  │                    └─────────────────────────┘                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Implementation Code

```javascript
// Content Script: Screenshot + Freeze + Auto-Close
class LikeVerifier {
  constructor() {
    this.isProcessing = false;
  }

  async onLikeDetected(likeButton, jobId, validator) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // 1. รอให้ Like animation เสร็จ
      await this.sleep(300);

      // 2. ตรวจ State Change (สำคัญมาก!)
      const stateCheck = await validator.verifyStateChange(likeButton);
      
      if (!stateCheck.verified) {
        // ไม่มีการเปลี่ยนแปลง หรือ Like อยู่แล้ว
        this.showError(stateCheck.reason === 'no_state_change' 
          ? 'ไม่พบการเปลี่ยนแปลง กรุณาลองใหม่'
          : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        return;
      }

      // 3. Freeze หน้าจอทันที!
      this.showLoadingOverlay();

      // 4. แคปหน้าจอ
      const screenshot = await this.captureScreenshot();

      // 5. รวบรวมข้อมูลสำหรับ Verify (รวม State Change)
      const verifyData = {
        screenshot: screenshot,
        jobId: jobId,
        postUrl: window.location.href,
        postId: this.extractPostId(),
        workerAccount: this.getLoggedInAccount(),
        domState: this.captureDomState(likeButton),
        // ⭐ เพิ่ม State Change Data
        stateChange: {
          before: stateCheck.stateBefore,
          after: stateCheck.stateAfter
        },
        timestamp: Date.now()
      };

      // 6. ส่งไป Verify
      const result = await this.verifyAction(verifyData);

      // 7. แสดงผลและปิด Tab
      if (result.verified) {
        await this.showSuccess(result.reward);
        await this.sleep(1500);
        this.closeTab();
      } else {
        this.hideOverlay();
        this.showError(result.reason);
      }
    } catch (error) {
      this.hideOverlay();
      this.showError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      this.isProcessing = false;
    }
  }

  showLoadingOverlay() {
    // สร้าง Overlay ทับหน้าจอ
    const overlay = document.createElement('div');
    overlay.id = 'meelike-verify-overlay';
    overlay.innerHTML = `
      <div class="meelike-overlay-backdrop"></div>
      <div class="meelike-overlay-content">
        <div class="meelike-spinner"></div>
        <p class="meelike-status">⏳ กำลังตรวจสอบ...</p>
        <div class="meelike-progress">
          <div class="meelike-progress-bar"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Block ทุก interaction
    document.body.style.pointerEvents = 'none';
    document.body.style.userSelect = 'none';
    
    // Animate progress bar
    this.animateProgress();
  }

  async captureScreenshot() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'CAPTURE_SCREENSHOT' },
        (response) => resolve(response.screenshot)
      );
    });
  }

  captureDomState(likeButton) {
    return {
      buttonLabel: likeButton.getAttribute('aria-label'),
      buttonPressed: likeButton.getAttribute('aria-pressed'),
      isLiked: likeButton.getAttribute('aria-label') === 'Unlike',
      parentHtml: likeButton.parentElement?.outerHTML?.substring(0, 500)
    };
  }

  async verifyAction(data) {
    // ส่งไป Background script → Server
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'VERIFY_ACTION', data: data },
        (response) => resolve(response)
      );
    });
  }

  async showSuccess(reward) {
    const overlay = document.getElementById('meelike-verify-overlay');
    const content = overlay.querySelector('.meelike-overlay-content');
    content.innerHTML = `
      <div class="meelike-success-icon">✅</div>
      <p class="meelike-status">งานสำเร็จ!</p>
      <p class="meelike-reward">+฿${reward.toFixed(2)}</p>
      <p class="meelike-countdown">ปิดหน้านี้ใน 2 วินาที...</p>
    `;
  }

  closeTab() {
    chrome.runtime.sendMessage({ action: 'CLOSE_TAB' });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize
const verifier = new LikeVerifier();
```

#### Background Script

```javascript
// Background Service Worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'CAPTURE_SCREENSHOT':
      chrome.tabs.captureVisibleTab(
        sender.tab.windowId,
        { format: 'jpeg', quality: 80 },
        (dataUrl) => sendResponse({ screenshot: dataUrl })
      );
      return true; // Keep channel open for async response

    case 'VERIFY_ACTION':
      verifyWithServer(message.data, sender.tab.id)
        .then(result => sendResponse(result));
      return true;

    case 'CLOSE_TAB':
      chrome.tabs.remove(sender.tab.id);
      break;
  }
});

async function verifyWithServer(data, tabId) {
  try {
    const response = await fetch('https://api.meelike.com/v1/verify-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    return { verified: false, reason: 'Network error' };
  }
}
```

#### Server-side Verification

```javascript
// API: POST /v1/verify-action
async function verifyAction(req, res) {
  const { screenshot, jobId, postUrl, domState, workerAccount, stateChange, timestamp } = req.body;
  const workerId = req.user.id;
  const worker = await getWorker(workerId);
  const job = await getJob(jobId);

  // 0. ⭐ State Change Check (ต้องผ่านก่อน!)
  if (!stateChange || !stateChange.before || !stateChange.after) {
    return res.json({ 
      verified: false, 
      reason: 'missing_state_change_proof' 
    });
  }

  // ตรวจว่า state change ถูกต้อง
  const validTransitions = {
    'like': { 
      validBefore: ['Like'], 
      validAfter: ['Unlike', 'Remove Like', 'Liked'] 
    },
    'follow': { 
      validBefore: ['Follow'], 
      validAfter: ['Following', 'Unfollow'] 
    },
  };

  const expected = validTransitions[job.actionType];
  const isValidBefore = expected.validBefore.some(s => 
    stateChange.before?.toLowerCase().includes(s.toLowerCase())
  );
  const isValidAfter = expected.validAfter.some(s => 
    stateChange.after?.toLowerCase().includes(s.toLowerCase())
  );

  if (!isValidBefore || !isValidAfter) {
    await flagSuspiciousAction(workerId, jobId, 'invalid_state_transition');
    return res.json({ 
      verified: false, 
      reason: 'invalid_state_transition',
      details: {
        expected: expected,
        received: stateChange
      }
    });
  }

  // 1. DOM Check (ทุกงาน - ฟรี)
  const domValid = verifyDomState(domState, jobId);
  if (!domValid.valid) {
    return res.json({ verified: false, reason: domValid.reason });
  }

  // 2. AI Verify (ตาม Trust Level)
  const needsAiVerify = shouldUseAiVerify(worker.level);
  
  if (needsAiVerify) {
    const aiResult = await verifyWithAI(screenshot, {
      expectedPostUrl: postUrl,
      expectedAction: job.actionType,
      workerName: workerAccount.name,
      expectedStateAfter: stateChange.after  // ตรวจว่า screenshot แสดงสถานะที่ถูกต้อง
    });

    if (!aiResult.verified) {
      await flagSuspiciousAction(workerId, jobId, aiResult.reason);
      return res.json({ verified: false, reason: aiResult.reason });
    }
  }

  // 3. บันทึกงานสำเร็จ + Screenshot + State Change
  const claim = await completeJob(workerId, jobId, {
    screenshot: screenshot,
    domState: domState,
    stateBefore: stateChange.before,
    stateAfter: stateChange.after,
    verifiedAt: new Date()
  });

  // 4. จ่ายเงิน
  const payment = await processPayment(worker, claim);

  return res.json({
    verified: true,
    reward: payment.immediatePayment,
    message: 'งานสำเร็จ!'
  });
}

function shouldUseAiVerify(workerLevel) {
  const aiVerifyRate = {
    'new': 1.0,      // 100% - ตรวจทุกงาน
    'bronze': 0.3,   // 30%
    'silver': 0.1,   // 10%
    'gold': 0.05,    // 5%
    'platinum': 0.01 // 1% (random spot check)
  };
  return Math.random() < (aiVerifyRate[workerLevel] || 1.0);
}
```

#### AI Verification Service

```javascript
// AI Verify using Gemini Flash (ถูกที่สุด)
async function verifyWithAI(screenshot, expected) {
  const prompt = `
    Analyze this screenshot and verify:
    1. Is there a "Like" or "Unlike" button visible?
    2. Is the button in "Liked" state (showing "Unlike")?
    3. Does the URL contain the expected post?
    4. Is the logged-in account name visible?

    Expected:
    - Post URL should contain: ${expected.expectedPostUrl}
    - Action: ${expected.expectedAction}
    - Account name: ${expected.workerName}

    Return JSON only:
    {
      "verified": true/false,
      "confidence": 0.0-1.0,
      "reason": "explanation if not verified",
      "details": {
        "buttonState": "liked/not_liked/not_found",
        "urlMatch": true/false,
        "accountMatch": true/false
      }
    }
  `;

  const response = await gemini.generateContent([
    { text: prompt },
    { inlineData: { mimeType: 'image/jpeg', data: screenshot.split(',')[1] } }
  ]);

  return JSON.parse(response.text());
}
```

#### Verification Cost Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  💰 ค่าใช้จ่าย AI Verification:                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Worker Level │ AI Rate │ งาน 1,000 │ AI Cost    │ Total Cost      │    │
│  │  ─────────────┼─────────┼───────────┼────────────┼───────────────   │    │
│  │  🆕 New       │ 100%    │ 100       │ 100 calls  │ ฿1.00           │    │
│  │  🥉 Bronze    │ 30%     │ 300       │ 90 calls   │ ฿0.90           │    │
│  │  🥈 Silver    │ 10%     │ 300       │ 30 calls   │ ฿0.30           │    │
│  │  🥇 Gold      │ 5%      │ 200       │ 10 calls   │ ฿0.10           │    │
│  │  💎 Platinum  │ 1%      │ 100       │ 1 call     │ ฿0.01           │    │
│  │  ─────────────┼─────────┼───────────┼────────────┼───────────────   │    │
│  │  Total       │ -       │ 1,000     │ 231 calls  │ ฿2.31           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  📊 สรุป: ~฿0.002/งาน (เฉลี่ย) ใช้ Gemini Flash                            │
│                                                                              │
│  Scale:                                                                      │
│  ├── 10,000 งาน/วัน = ฿23/วัน = ฿700/เดือน                                 │
│  ├── 100,000 งาน/วัน = ฿230/วัน = ฿7,000/เดือน                             │
│  └── 1,000,000 งาน/วัน = ฿2,300/วัน = ฿70,000/เดือน                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Secondary: Unlike Detection (Backup Methods)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔍 วิธีสำรอง (กรณี Screenshot ไม่พอ):                                      │
│                                                                              │
│  1️⃣ Block URL (ป้องกันกลับมา Unlike)                                       │
│     ├── เก็บ List โพสต์ที่ทำแล้ว                                           │
│     ├── ถ้าพยายามเปิดอีก → Redirect ออก                                    │
│     └── แสดง "คุณทำงานนี้แล้ว"                                              │
│                                                                              │
│  2️⃣ Extension Heartbeat                                                    │
│     ├── ส่ง Heartbeat ทุก 5 นาที                                           │
│     ├── ถ้า offline นาน → Flag account                                     │
│     └── สงสัยว่าปิด Extension ไป Unlike                                    │
│                                                                              │
│  3️⃣ Statistical Monitoring                                                 │
│     ├── ตรวจยอด Like รวมของโพสต์หลัง 7 วัน                                 │
│     ├── ถ้า Drop > 30% → Flag Workers ที่ทำงานนั้น                         │
│     └── ลด Trust Score                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Extension Unlike Detector

```javascript
// Content script: Unlike detection
class UnlikeDetector {
  constructor() {
    this.completedJobs = []; // Jobs completed in this session
    this.init();
  }

  async init() {
    // Load completed jobs from storage
    const stored = await chrome.storage.local.get('completedJobs');
    this.completedJobs = stored.completedJobs || [];
    
    // Watch for Unlike actions
    this.watchForUnlike();
  }

  watchForUnlike() {
    // Listen for clicks on Like buttons
    document.addEventListener('click', async (e) => {
      const likeButton = e.target.closest('[aria-label="Like"], [aria-label="Unlike"]');
      if (!likeButton) return;

      const postId = this.extractPostId(likeButton);
      const completedJob = this.completedJobs.find(j => j.postId === postId);

      if (completedJob) {
        // Check if this is an Unlike action
        await this.sleep(500); // Wait for UI to update
        const isNowUnliked = this.checkIfUnliked(likeButton);

        if (isNowUnliked) {
          // Report Unlike!
          await this.reportUnlike(completedJob);
        }
      }
    });
  }

  async reportUnlike(job) {
    // Show warning to user
    this.showWarning();

    // Report to server
    await chrome.runtime.sendMessage({
      type: 'UNLIKE_DETECTED',
      jobId: job.id,
      postId: job.postId,
      timestamp: Date.now()
    });
  }

  showWarning() {
    const warning = document.createElement('div');
    warning.className = 'meelike-unlike-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">
          คุณกำลัง Unlike งานที่ทำไปแล้ว!<br>
          การกระทำนี้จะถูกบันทึกและอาจถูกหักเงินคืน
        </span>
      </div>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => warning.remove(), 5000);
  }

  checkIfUnliked(element) {
    // Check if the like button shows "Unlike" (meaning it's currently liked)
    // If it shows "Like", the user has unliked
    const label = element.getAttribute('aria-label');
    return label === 'Like'; // Shows "Like" = currently NOT liked
  }

  extractPostId(element) {
    // Implementation depends on platform
    const postContainer = element.closest('[data-pagelet^="FeedUnit"]');
    // ... extract post ID logic
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Penalty System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔨 Penalty สำหรับ Unlike:                                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ครั้งที่ │ Penalty                                                 │    │
│  │  ─────────┼────────────────────────────────────────────────────────  │    │
│  │     1     │ ⚠️ Warning + หักเงินคืน + Trust Score -10               │    │
│  │     2     │ 🚫 Ban 3 วัน + หักเงินคืน + Trust Score -20             │    │
│  │     3     │ 🚫 Ban 7 วัน + หักเงินคืน + Level ลด 1 ขั้น             │    │
│  │    4+     │ ❌ Ban ถาวร + ยึดเงินคงเหลือ                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  📋 เงื่อนไขเพิ่มเติม:                                                      │
│  ├── Unlike ภายใน 24 ชม. = โทษหนักกว่า                                    │
│  ├── Unlike หลัง 7 วัน = โทษเบากว่า (อาจเป็น organic)                     │
│  └── Unlike หลาย Job พร้อมกัน = สงสัย fraud → Review ทันที                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### API: Unlike Report

```
POST /api/v1/extension/unlike-report
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "jobId": "job_123",
  "postId": "post_456",
  "actionId": "action_789",
  "detectedBy": "extension", // or "spot_check", "scheduled"
  "timestamp": 1705312345678
}

Response:
{
  "success": true,
  "action": "penalty_applied",
  "penalty": {
    "type": "warning",
    "amountDeducted": 0.25,
    "newTrustScore": 90,
    "message": "คุณถูกหักเงิน ฿0.25 และ Trust Score ลด 10 คะแนน"
  }
}
```

### Hold Release Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  💰 Flow การปล่อยเงิน Hold:                                                 │
│                                                                              │
│  1. Worker ทำงานสำเร็จ                                                      │
│     ├── จ่าย Immediate: X%                                                 │
│     └── Hold: Y% (รอตรวจสอบ)                                               │
│                                                                              │
│  2. หลังผ่านไป N วัน                                                        │
│     │                                                                       │
│     ├── ✅ ยัง Like อยู่ → ปล่อยเงิน Hold                                  │
│     │   └── Hold → Available Balance                                       │
│     │                                                                       │
│     └── ❌ Unlike แล้ว → ยึดเงิน Hold                                      │
│         ├── Hold → Platform                                                │
│         ├── Trust Score ลด                                                 │
│         └── แจ้งเตือน Worker                                               │
│                                                                              │
│  3. Worker ถอนเงิน                                                          │
│     └── ถอนได้เฉพาะ Available Balance                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema Addition

```sql
-- Add to job_claims table
ALTER TABLE job_claims ADD COLUMN payment_status VARCHAR(20) 
  DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'full', 'revoked'));

ALTER TABLE job_claims ADD COLUMN immediate_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE job_claims ADD COLUMN hold_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE job_claims ADD COLUMN hold_release_at TIMESTAMP;
ALTER TABLE job_claims ADD COLUMN hold_released BOOLEAN DEFAULT FALSE;

-- Unlike tracking table
CREATE TABLE unlike_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id       UUID NOT NULL REFERENCES users(id),
  job_id          UUID NOT NULL REFERENCES jobs(id),
  claim_id        UUID NOT NULL REFERENCES job_claims(id),
  
  detected_by     VARCHAR(50) NOT NULL, -- 'extension', 'spot_check', 'scheduled'
  detected_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Penalty applied
  penalty_type    VARCHAR(50), -- 'warning', 'ban_3d', 'ban_7d', 'ban_permanent'
  amount_deducted DECIMAL(10,2),
  score_deducted  INTEGER,
  
  -- Status
  status          VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('reported', 'confirmed', 'disputed', 'resolved')),
  
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unlike_worker ON unlike_reports(worker_id);
CREATE INDEX idx_unlike_detected ON unlike_reports(detected_at DESC);
```

### สรุป Anti-Unlike System

| Component | วิธีการ |
|-----------|--------|
| **Prevention** | Trust-based Payment (Hold เงิน Worker ใหม่) |
| **Detection** | Extension Re-check + Scheduled Verification + Spot Check |
| **Penalty** | Progressive: Warning → Ban 3d → Ban 7d → Ban ถาวร |
| **Incentive** | Worker Level สูง = จ่ายเร็วกว่า + Hold น้อยกว่า |

---

## API Specification

### Authentication

```
POST /api/v1/extension/auth
Content-Type: application/json

Request:
{
  "email": "worker@example.com",
  "password": "xxx",
  "extensionVersion": "1.0.0",
  "browserInfo": {
    "name": "Chrome",
    "version": "120.0"
  }
}

Response:
{
  "success": true,
  "token": "eyJhbG...",
  "worker": {
    "id": "w_123",
    "name": "Worker123",
    "level": "gold",
    "trustScore": 85
  }
}
```

### Get Active Jobs

```
GET /api/v1/extension/jobs
Authorization: Bearer <token>

Response:
{
  "jobs": [
    {
      "id": "job_123",
      "platform": "facebook",
      "action": "like",
      "postId": "123456789",
      "postUrl": "https://facebook.com/...",
      "description": "กด Like โพสต์นี้",
      "reward": 0.25,
      "expiresAt": "2024-01-15T23:59:59Z"
    }
  ]
}
```

### Report Action

```
POST /api/v1/extension/actions
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "jobId": "job_123",
  "action": "like",
  "platform": "facebook",
  "postId": "123456789",
  "postUrl": "https://facebook.com/...",
  "timestamp": 1705312345678,
  "metadata": {
    "browserFingerprint": "abc123",
    "domState": {
      "likeButtonActive": true,
      "likeCount": 1234
    }
  }
}

Response:
{
  "success": true,
  "reward": 0.25,
  "newBalance": 127.50,
  "todayEarnings": 15.75,
  "message": "งานสำเร็จ! ได้รับ ฿0.25"
}
```

---

## Security

### Data Protection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔐 Security Measures:                                                      │
│                                                                              │
│  1️⃣ Data We Collect:                                                       │
│     ├── ✅ Action events (Like, Follow, etc.)                              │
│     ├── ✅ Post URLs ที่เกี่ยวข้องกับงาน                                   │
│     ├── ✅ Browser fingerprint (for anti-cheat)                            │
│     └── ❌ ไม่เก็บ: Messages, Friends list, Password                       │
│                                                                              │
│  2️⃣ Data Transmission:                                                     │
│     ├── HTTPS only                                                         │
│     ├── JWT authentication                                                 │
│     └── Request signing                                                    │
│                                                                              │
│  3️⃣ Storage:                                                               │
│     ├── Token stored in chrome.storage.local                               │
│     ├── No sensitive data in localStorage                                  │
│     └── Auto-logout after 30 days                                          │
│                                                                              │
│  4️⃣ Privacy Policy:                                                        │
│     ├── Clear disclosure of data collection                                │
│     ├── User consent before tracking                                       │
│     └── Easy opt-out/deletion                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Development Roadmap

### Phase 1: MVP (2 สัปดาห์)

- [ ] Chrome Extension boilerplate
- [ ] Authentication flow
- [ ] Facebook Like tracking
- [ ] Basic popup UI
- [ ] API integration

### Phase 2: Core Features (2 สัปดาห์)

- [ ] Instagram support
- [ ] TikTok support
- [ ] Twitter support
- [ ] Job overlay UI
- [ ] Real-time earnings display

### Phase 3: Anti-Cheat (1 สัปดาห์)

- [ ] Browser fingerprinting
- [ ] Action validation
- [ ] Trust score system
- [ ] Spot check integration

### Phase 4: Polish (1 สัปดาห์)

- [ ] Notifications
- [ ] Settings page
- [ ] Error handling
- [ ] Chrome Web Store submission

---

## Related Documents

- [USER_FLOWS.md](./USER_FLOWS.md) - Worker Flow with Extension
- [DATABASE.md](./DATABASE.md) - Action Logs Schema
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) - Revenue from Extension
