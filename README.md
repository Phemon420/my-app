This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# Transaction Tracker

A comprehensive personal finance management application built with Next.js and React that helps users track expenses, manage budgets, and visualize spending patterns.

## Features

### Budget Management
- Set and manage monthly budgets by expense categories
- Flexible category creation and management
- Real-time budget tracking and notifications
- Automatic rollover options for unused budget amounts

### Transaction Tracking
- Quick and easy transaction entry for daily expenses
- Categorize transactions with custom labels
- Add notes and attachments to transactions
- Bulk import/export functionality for transactions
- Search and filter transactions by date, category, or amount

### Visual Analytics
- Interactive dashboard with three main visualization components:
  1. Budget vs Actual Comparison Chart: Track your spending against set budgets
  2. Category Distribution Pie Chart: Understand spending patterns across categories
  3. Annual Spending Trend: Monitor monthly expenses throughout the year

## Tech Stack

- **Frontend Framework**: Next.js 14+
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API
- **Database**: Your preferred database (MongoDB/PostgreSQL)
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transaction-tracker.git
cd transaction-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration settings.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)
