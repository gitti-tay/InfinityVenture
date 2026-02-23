# 🚀 Infinity Ventures — Investment Platform

Full-stack investment platform built with React + Express + SQLite.  
**Monorepo**: Frontend and backend in a single repository for easy deployment.

---

## 📁 Architecture

```
infinity_ventures/
├── server/                 # Express.js Backend
│   ├── index.js            # Server entry — serves API + built frontend
│   ├── db.js               # SQLite database + schema (auto-creates tables)
│   ├── scheduler.js        # Yield payouts, maturity checks, session cleanup
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication + role-based access
│   │   └── security.js     # Rate limiting, CSRF, sanitization, audit
│   └── routes/
│       ├── auth.js         # Signup, Login, Logout, Profile, KYC
│       ├── wallet.js       # Connect, Disconnect, Balance
│       ├── transactions.js # Deposit, Withdraw, History (with approval flow)
│       ├── investments.js  # Invest, Portfolio, Detail (with legal checks)
│       ├── projects.js     # Project listing (seed data)
│       ├── notifications.js# In-app notifications
│       ├── legal.js        # Terms, Privacy, Risk Disclosure acceptance
│       ├── compliance.js   # AML monitoring, withdrawal whitelist
│       ├── admin.js        # Full admin panel (dashboard, users, KYC, etc.)
│       └── support.js      # Support ticket system
│
├── src/                    # React Frontend (Vite)
│   ├── app/
│   │   ├── api/client.ts   # Centralized API client → calls /api/*
│   │   ├── contexts/       # AuthContext, WalletContext, NotificationContext
│   │   ├── guards/         # ProtectedRoute, GuestRoute, AdminRoute
│   │   ├── screens/        # All app screens (40+ screens)
│   │   │   └── admin/      # Admin panel screens (13 screens)
│   │   ├── components/     # UI components (Radix, shadcn)
│   │   ├── data/           # Static project data
│   │   └── App.tsx         # Router configuration
│   └── main.tsx
│
├── test/simulate.mjs       # API simulation tests (30 suites)
├── railway.json            # Railway deployment config
├── nixpacks.toml           # Nixpacks build config (native deps)
├── package.json            # Monorepo scripts
└── vite.config.ts          # Vite config with API proxy
```

---

## 🛠 Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React 18, TypeScript, Tailwind CSS   |
| UI        | Radix UI, shadcn/ui, Lucide Icons    |
| Backend   | Express.js (Node 18+)               |
| Database  | SQLite (better-sqlite3)              |
| Auth      | JWT (jsonwebtoken + bcryptjs)        |
| Build     | Vite 6                               |
| Deploy    | Railway (Nixpacks)                   |

---

## 🏃 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/infinity-ventures.git
cd infinity-ventures

# 2. Install dependencies
npm install

# 3. Create .env from example
cp .env.example .env

# 4. Start development (frontend + backend concurrently)
npm run dev
```

This runs:
- **Frontend** (Vite): `http://localhost:3000` — auto-proxies `/api` → backend
- **Backend** (Express): `http://localhost:5000` — API server with SQLite

---

## 🚀 Deploy to Railway (GitHub 연동)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Infinity Ventures full-stack"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/infinity-ventures.git
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **"Deploy from GitHub Repo"**
3. Choose your `infinity-ventures` repository
4. Railway auto-detects `railway.json` + `nixpacks.toml`

### Step 3: Set Environment Variables

In Railway dashboard → **Variables** tab, add:

| Variable        | Value                          | Required |
|-----------------|--------------------------------|----------|
| `JWT_SECRET`    | (generate a strong random key) | ✅ Yes    |
| `NODE_ENV`      | `production`                   | ✅ Yes    |
| `DATABASE_PATH` | `/data/infinity.db`            | ⚡ If using volume |
| `CORS_ORIGIN`   | `https://your-app.up.railway.app` | Optional |

> **Generate JWT_SECRET**: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Step 4: (Optional) Add Persistent Volume

For data persistence across deploys:

1. Railway dashboard → **Volumes** → **Add Volume**
2. Mount path: `/data`
3. Set `DATABASE_PATH=/data/infinity.db` in variables

> ⚠️ Without a volume, the SQLite database resets on each deploy. For soft launch testing this is fine.

### Step 5: Deploy

Railway auto-deploys on every `git push` to `main`.

```bash
git add .
git commit -m "Update feature"
git push
# → Railway auto-builds and deploys
```

### Step 6: Access Your App

Railway provides a URL like: `https://infinity-ventures-production.up.railway.app`

- Frontend: `https://your-app.up.railway.app/`
- API Health: `https://your-app.up.railway.app/api/health`

---

## 📡 API Endpoints

### Auth
| Method | Path                    | Auth | Description           |
|--------|-------------------------|------|-----------------------|
| POST   | `/api/auth/signup`      | No   | Create account        |
| POST   | `/api/auth/login`       | No   | Login                 |
| POST   | `/api/auth/logout`      | Yes  | Logout                |
| GET    | `/api/auth/me`          | Yes  | Get current user      |
| PUT    | `/api/auth/me`          | Yes  | Update profile        |
| POST   | `/api/auth/verify-email`| Yes  | Verify email code     |
| POST   | `/api/auth/forgot-password` | No | Request password reset |
| POST   | `/api/auth/change-password` | Yes | Change password    |
| POST   | `/api/auth/kyc/start`   | Yes  | Start KYC             |
| POST   | `/api/auth/kyc/approve` | Yes  | Auto-approve KYC      |

### Wallet
| Method | Path                    | Auth | Description           |
|--------|-------------------------|------|-----------------------|
| GET    | `/api/wallet`           | Yes  | Get wallet info       |
| POST   | `/api/wallet/connect`   | Yes  | Connect wallet        |
| POST   | `/api/wallet/disconnect`| Yes  | Disconnect wallet     |
| GET    | `/api/wallet/balance`   | Yes  | Get balance           |

### Transactions
| Method | Path                        | Auth | Description       |
|--------|-----------------------------|------|-------------------|
| GET    | `/api/transactions`         | Yes  | List transactions |
| POST   | `/api/transactions/deposit` | Yes  | Make deposit      |
| POST   | `/api/transactions/withdraw`| Yes  | Make withdrawal   |

### Investments
| Method | Path                          | Auth | Description         |
|--------|-------------------------------|------|---------------------|
| GET    | `/api/investments`            | Yes  | List investments    |
| GET    | `/api/investments/portfolio`  | Yes  | Portfolio summary   |
| POST   | `/api/investments`            | Yes  | Make investment     |
| GET    | `/api/investments/:id`        | Yes  | Investment detail   |

### Projects
| Method | Path                 | Auth | Description     |
|--------|----------------------|------|-----------------|
| GET    | `/api/projects`      | No   | List projects   |
| GET    | `/api/projects/:id`  | No   | Project detail  |

### Notifications
| Method | Path                            | Auth | Description         |
|--------|---------------------------------|------|---------------------|
| GET    | `/api/notifications`            | Yes  | List notifications  |
| PUT    | `/api/notifications/:id/read`   | Yes  | Mark as read        |
| PUT    | `/api/notifications/read-all`   | Yes  | Mark all as read    |
| DELETE | `/api/notifications/clear`      | Yes  | Clear all           |

---

## 👤 User Flow

```
Welcome → Signup → Email Verification → Connect Wallet → Home
                                                          ↓
                          Deposit → Invest → Portfolio → Reports
                                                          ↓
                                                     Settings → Logout
```

1. **회원가입** — 이름, 이메일, 비밀번호 입력
2. **이메일 인증** — 6자리 코드 입력 (소프트 런치: 아무 6자리 허용)
3. **지갑 연결** — MetaMask, WalletConnect 등 (시뮬레이션)
4. **입금** — USDT, USDC, 은행 이체, 카드 (시뮬레이션)
5. **투자** — 프로젝트 선택 → 플랜 선택 → 금액 입력 → 확인
6. **포트폴리오** — 투자 현황, 수익률, 월별 수익 확인

---

## 🔒 Security Notes (Soft Launch)

- JWT tokens expire in 30 days
- Passwords hashed with bcrypt (12 rounds)
- Email verification accepts any 6-digit code (soft launch mode)
- KYC auto-approves (soft launch mode)
- Wallet addresses are simulated (not real blockchain)
- All financial transactions are simulated

---

## 📝 License

Private — Infinity Ventures © 2024
