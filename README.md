# Gym Management System

A comprehensive gym management system built with Next.js, TypeScript, and modern web technologies. This system provides a complete solution for managing gym operations including member management, payment processing, membership plans, and more.

## 🏋️ Features

### 👥 Member Management

- Complete member registration and profile management
- Membership number generation and tracking
- Member search and filtering capabilities
- Member status tracking and management

### 💳 Payment Processing

- Multiple payment methods (Cash, Card, Bank Transfer, M-Pesa)
- Professional PDF receipt generation
- Payment history and tracking
- Bulk payment operations
- Real-time M-Pesa integration with STK Push
- CSV export functionality

### 📋 Membership Plans

- Flexible membership plan creation and management
- Duration-based pricing
- Plan features and descriptions
- Auto-fill payment amounts from selected plans

### 📊 Dashboard & Analytics

- Comprehensive dashboard with key metrics
- Payment analytics and reporting
- Member statistics and insights
- Real-time data updates

### 🔧 System Features

- Modern, responsive UI with clean design
- Advanced filtering and search capabilities
- Bulk operations with confirmation dialogs
- Professional receipt generation
- Data export functionality
- Type-safe development with TypeScript

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **TanStack Table** - Powerful table component
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database

- **Next.js API Routes** - Server-side API
- **Prisma** - Database ORM
- **PostgreSQL/MySQL** - Database (configurable)

### External Integrations

- **M-Pesa API** - Mobile money payments
- **jsPDF** - PDF generation
- **date-fns** - Date manipulation

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm/bun
- Database (PostgreSQL or MySQL)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd gym_system
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-database-connection-string"

# M-Pesa Configuration (Optional)
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_SHORTCODE="your-business-shortcode"
MPESA_PASSKEY="your-mpesa-passkey"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
gym_system/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── payments/       # Payment management
│   │   │   ├── members/        # Member management
│   │   │   └── plans/          # Membership plans
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── payments/           # Payment-related components
│   │   │   ├── new/            # New payment form components
│   │   │   └── payments-table/ # Payment table components
│   │   └── members/            # Member-related components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   │   ├── validations/        # Zod schemas
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
└── docs/                       # Documentation
```

## 🏗️ Architecture

### Component Architecture

The application follows a modular component architecture with:

- **Atomic Design Principles** - Components are broken down into atoms, molecules, and organisms
- **Clean Separation of Concerns** - Each component has a single responsibility
- **Type Safety** - Strict TypeScript with no `any` types
- **Reusability** - Components are designed to be reused across the application

### Example: Payment Table Refactoring

The payment table was refactored from a monolithic 950-line component into 11 focused components:

```
src/components/payments/payments-table/
├── payments-table.tsx        # Main orchestrator (242 lines)
├── payment-badges.tsx        # Status & method badges (50 lines)
├── table-filters.tsx         # Search & filtering (71 lines)
├── table-header.tsx          # Header with actions (54 lines)
├── table-columns.tsx         # Column definitions (257 lines)
├── table-pagination.tsx      # Pagination controls (74 lines)
├── receipt-generator.tsx     # PDF receipt generation (235 lines)
├── data-export.tsx           # CSV export (35 lines)
├── payment-operations.tsx    # CRUD operations (66 lines)
├── types.ts                  # TypeScript interfaces (60 lines)
└── index.ts                  # Barrel exports (16 lines)
```

### State Management

- **React Hook Form** - Form state management
- **TanStack Query** - Server state management
- **React useState/useReducer** - Local component state
- **Context API** - Global state when needed

## 📱 Key Features Walkthrough

### Payment Management

1. **Record Payments** - Support for multiple payment methods
2. **M-Pesa Integration** - Real-time STK Push payments
3. **Receipt Generation** - Professional PDF receipts with gym branding
4. **Payment Tracking** - Complete payment history and status tracking

### Member Management

1. **Member Registration** - Complete member onboarding
2. **Profile Management** - Update member information
3. **Search & Filter** - Advanced member search capabilities
4. **Membership Tracking** - Track membership status and history

### Dashboard Analytics

1. **Key Metrics** - Revenue, member count, payment statistics
2. **Visual Charts** - Payment trends and member analytics
3. **Real-time Updates** - Live data synchronization

## 🔧 Development

### Code Quality

- **ESLint** - Enforces coding standards
- **TypeScript** - Strict type checking with no `any` types
- **Prettier** - Consistent code formatting
- **Component Testing** - Jest and React Testing Library

### Performance

- **Memoization** - Optimized re-renders with useMemo and useCallback
- **Lazy Loading** - Dynamic imports for heavy components
- **Efficient Filtering** - Optimized table filtering and search
- **Image Optimization** - Next.js automatic image optimization

### Best Practices

- Clean folder structure with logical grouping
- Consistent naming conventions
- Modular component architecture
- Type-safe API development
- Comprehensive error handling

## 📚 Documentation

- [Payment Components Documentation](src/components/payments/payments-table/README.md)
- [New Payment Form Documentation](src/components/payments/new/README.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

- **Netlify** - Static site deployment
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Shadcn** - For the beautiful UI components
- **TanStack** - For the powerful table component
- **Vercel** - For the deployment platform

---

Built with ❤️ for modern gym management
