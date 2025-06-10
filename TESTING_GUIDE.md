# Testing Guide - Indian Matrimonial Platform

## 🧪 How to Test the Application

### Quick Start Testing

1. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The server will start on an available port (usually 3000, 3001, or 3002)

2. **Open in Browser**
   - Visit the URL shown in terminal (e.g., `http://localhost:3000`)
   - The homepage should load with the matrimonial platform

### 🏠 Homepage Testing

**What to Test:**
- Hero section with call-to-action buttons
- Features showcase
- How it works section
- Success stories
- Pricing plans

**Expected Behavior:**
- Responsive design on different screen sizes
- Smooth scrolling and animations
- Working navigation links

### 🔐 Authentication Testing

**Sign Up Flow:**
1. Click "Join Free" button
2. Clerk modal should open
3. Create account with email/password
4. Should redirect to onboarding/dashboard

**Sign In Flow:**
1. Click "Sign In" button
2. Use existing credentials
3. Should redirect to dashboard

### 👤 Profile System Testing

**Multi-step Registration:**
1. After signup, go to `/profile/edit`
2. Test all form sections:
   - Basic Information
   - Family Details
   - Education & Career
   - Lifestyle & Preferences
   - Horoscope Information

**Expected Features:**
- Form validation
- Image upload placeholders
- Progress indicators
- Save functionality

### 🔍 Search & Discovery Testing

**Advanced Search:**
1. Go to `/search`
2. Test various filters:
   - Age range
   - Location
   - Education
   - Profession
   - Caste/Community
   - Horoscope preferences

**Discovery Page:**
1. Visit `/discover`
2. Browse recommended profiles
3. Test interest sending functionality

### 💫 Horoscope Matching Testing

**Kundli Matching:**
1. Go to `/horoscope`
2. View compatibility results
3. Test different tabs:
   - Compatibility scores
   - My Horoscope
   - Upload Kundli
   - Consult Astrologer

**Expected Features:**
- Guna Milan scoring (36-point system)
- Compatibility breakdown
- Manglik analysis
- Dosha information

### 💬 Communication Testing

**Messaging System:**
1. Go to `/messages`
2. Test chat interface
3. Send messages
4. View conversation history

**Interest System:**
1. Send interests from profile pages
2. View sent/received interests
3. Accept/decline interests

### 🎯 Services Testing

**Astrology Consultation:**
1. Visit `/astrology`
2. Browse astrologers
3. Test booking system
4. View consultation packages

**Wedding Services:**
1. Go to `/services`
2. Browse different service categories
3. Test service provider profiles
4. Add services to cart

### 📱 Mobile Responsiveness Testing

**Test on Different Devices:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Key Areas to Test:**
- Navigation menu (hamburger on mobile)
- Form layouts
- Card grids
- Image galleries

### 🎨 UI Components Testing

**Test All Interactive Elements:**
- Buttons (hover states, disabled states)
- Forms (validation, error messages)
- Modals and dialogs
- Dropdown menus
- Tabs and accordions

### 🔒 Security Testing

**Authentication:**
- Try accessing protected routes without login
- Test logout functionality
- Verify session persistence

**Form Security:**
- Test input validation
- Try submitting empty forms
- Test with invalid data

### 📊 Dashboard Testing

**User Dashboard:**
1. Go to `/dashboard`
2. Test all dashboard sections:
   - Profile completion
   - Recent activities
   - Interests received/sent
   - Messages
   - Profile views

### 💳 Pricing & Plans Testing

**Pricing Page:**
1. Visit `/pricing`
2. Test plan comparison
3. View feature differences
4. Test billing toggle (monthly/yearly)

### 🎪 Additional Features Testing

**PWA Features:**
- Test offline functionality
- Check if app can be installed
- Test push notifications (if implemented)

**Performance:**
- Check page load times
- Test image loading
- Verify smooth animations

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill processes on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit
```

## 📝 Test Scenarios

### User Registration Journey
1. Visit homepage
2. Click "Join Free"
3. Complete registration
4. Fill profile information
5. Upload photos
6. Set preferences
7. Start searching

### Matchmaking Journey
1. Complete profile
2. Use advanced search
3. View compatible profiles
4. Check horoscope compatibility
5. Send interests
6. Start conversations
7. Book consultation

### Service Booking Journey
1. Browse services
2. Select service provider
3. Add to cart
4. Proceed to booking
5. Schedule appointment
6. Complete payment flow

## 🎯 Success Criteria

**The application is working correctly if:**
- All pages load without errors
- Authentication flow works smoothly
- Forms submit and validate properly
- Search and filtering work
- Responsive design functions on all devices
- No console errors in browser
- Navigation works correctly
- All interactive elements respond

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure environment variables are set
4. Try clearing browser cache
5. Restart development server

The platform is designed to be fully functional even with mock data, so you can test all features without external service dependencies.
