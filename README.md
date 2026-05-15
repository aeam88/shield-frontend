# 🛡️ Shield API Dashboard

A high-performance, professional dashboard for managing and monitoring API Rate Limiting. Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**, this dashboard provides a sleek interface for developers to provision API keys and monitor real-time traffic.

## ✨ Features

- **📊 Real-time Analytics**: Monitor total requests, blocked (429) events, and service success rates with interactive charts.
- **🔑 API Key Management**: Create, edit, and revoke API keys with custom rate limits.
- **📈 Usage Insights**: Visualize traffic patterns and identify top-performing endpoints.
- **📜 Audit Logs**: Detailed history of API request events for security and debugging.
- **🎨 Premium UI/UX**: Modern glassmorphism aesthetic with smooth Framer Motion animations and responsive design.
- **🔐 Secure Auth**: Built-in authentication flow using JWT tokens.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.steventey.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- A running instance of the [Shield Rate Limit API](https://github.com/your-repo/rate-limit-api)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aeam/ratelimit-dashboard.git
   cd ratelimit-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## 📖 How to use API Keys

Once you generate a key in the dashboard, you can use it in your applications by including it in the HTTP headers:

```bash
curl -X GET http://localhost:3000/api/your-endpoint \
  -H "x-api-key: your_generated_key_here"
```

The API will respond with rate limit status headers:
- `X-RateLimit-Limit`: Total requests allowed in the current window.
- `X-RateLimit-Remaining`: Remaining requests available.

## 🏗️ Project Structure

- `/src/app`: Application routes and layouts.
- `/src/components`: Reusable UI components (Cards, Modals, Charts).
- `/src/lib`: Core logic including API client and Auth Context.
- `/public`: Static assets and icons.

## 🎥 Video

https://github.com/user-attachments/assets/8dc01ab5-c3e7-4cb1-b580-eb4405fff4f7

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built by [AEAM88](https://github.com/aeam88)
