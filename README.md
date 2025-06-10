# Jeevanik Platform

A comprehensive online matrimony platform tailored for Indian users, built with Next.js 15, TypeScript, and Tailwind CSS. This platform provides all the essential features needed for a modern matrimony service including user profiles, advanced search, messaging, and premium subscriptions.

## 🌟 Features

### Core User Management

- **Multi-step Registration** with email/phone verification
- **Detailed Profile Creation** for self or family members
- **Document Verification** for authenticity
- **Social Media Login** (Google, Facebook)
- **Multi-factor Authentication** for security

### Profile Management

- **Comprehensive Personal Details** (height, weight, complexion, etc.)
- **Family Information** (type, values, parents' details, siblings)
- **Educational & Professional Details**
- **Lifestyle Preferences** (diet, smoking, drinking, hobbies)
- **Partner Preferences** with detailed criteria
- **Photo Gallery** with privacy controls

### Indian-Specific Features

- **Horoscope & Kundli Matching** with astrological compatibility
- **Caste & Community Filters** respecting traditional preferences
- **Regional Language Support** for better accessibility
- **Manglik Status** indication and matching
- **Traditional & Modern** lifestyle choices

### Search & Matching

- **Advanced Search Filters** (age, location, education, profession, etc.)
- **AI-Powered Smart Matching** with compatibility scoring
- **Recently Joined** and verified profile filters
- **Location-based Search** with radius options
- **Saved Searches** and profile bookmarking

### Communication Features

- **Interest Management** (send, accept, decline interests)
- **Secure Messaging System** between matched profiles
- **Photo & Voice Message** sharing
- **Contact Information Exchange** after mutual interest
- **Video Call Integration** for virtual meetings

### Premium Features

- **Subscription Plans** (Free, Premium, Elite)
- **Priority Profile Listing** in search results
- **Advanced Search Filters** for premium users
- **Direct Messaging** without mutual interest
- **Profile View Analytics** and visitor tracking
- **Dedicated Relationship Manager** for elite users

### Safety & Verification

- **Profile Verification** through document uploads
- **Photo Verification** to prevent fake profiles
- **Report & Block** functionality
- **Background Checks** for premium users
- **Privacy Controls** for profile visibility

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: NextAuth.js with multiple providers
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Cloudinary integration
- **Payment**: Razorpay integration
- **Email**: Nodemailer with SMTP
- **SMS**: Twilio integration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile management
│   ├── search/            # Search and discovery
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── home/              # Homepage components
│   └── forms/             # Form components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── database/          # Database operations
│   └── utils.ts           # General utilities
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── styles/                # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Google OAuth credentials (optional)
- Cloudinary account (for file uploads)
- Razorpay account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd matrimonial
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up the database**

   - Create a new Supabase project
   - Run the SQL schema from `src/lib/database/schema.sql`
   - Set up Row Level Security (RLS) policies

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main tables:

- **users** - Authentication and basic user info
- **user_profiles** - Detailed profile information
- **family_details** - Family background information
- **education_details** - Educational qualifications
- **professional_details** - Career information
- **lifestyle_preferences** - Personal preferences and hobbies
- **partner_preferences** - Desired partner criteria
- **horoscope_details** - Astrological information
- **user_interests** - Interest management between users
- **messages** - Communication between matched users
- **subscription_plans** - Premium plan definitions
- **user_subscriptions** - User subscription tracking

## 🔐 Authentication & Security

- **NextAuth.js** for secure authentication
- **JWT tokens** for session management
- **Rate limiting** for API endpoints
- **Input validation** with Zod schemas
- **SQL injection protection** with parameterized queries
- **XSS protection** with content sanitization
- **CSRF protection** built into Next.js

## 💳 Payment Integration

- **Razorpay** for Indian payment processing
- **Subscription management** with automatic renewals
- **Invoice generation** and email notifications
- **Refund handling** for customer satisfaction

## 📱 Mobile Responsiveness

- **Fully responsive design** for all screen sizes
- **Touch-friendly interface** for mobile users
- **Progressive Web App (PWA)** capabilities
- **Offline functionality** for basic features

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic CI/CD

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

## 📈 Performance Optimization

- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Caching strategies** for API responses
- **Database indexing** for fast queries
- **CDN integration** for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@indianmatrimony.com
- **Documentation**: [docs.indianmatrimony.com](https://docs.indianmatrimony.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Supabase** for the backend-as-a-service platform
