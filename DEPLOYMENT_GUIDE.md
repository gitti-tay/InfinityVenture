# 🚀 Infinity Ventures — 배포 완전 가이드

> GitHub 업로드부터 프로덕션 배포, 도메인 연결, 모니터링까지 전체 과정

---

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [GitHub 리포지토리 생성 및 업로드](#2-github-리포지토리-생성-및-업로드)
3. [환경변수 설정](#3-환경변수-설정)
4. [Railway 배포 (권장)](#4-railway-배포-권장)
5. [Vercel + Railway 분리 배포 (대안)](#5-vercel--railway-분리-배포-대안)
6. [도메인 연결](#6-도메인-연결)
7. [SSL 인증서](#7-ssl-인증서)
8. [배포 후 검증](#8-배포-후-검증)
9. [모니터링 및 유지보수](#9-모니터링-및-유지보수)
10. [프로덕션 보안 체크리스트](#10-프로덕션-보안-체크리스트)
11. [확장 및 마이그레이션](#11-확장-및-마이그레이션)
12. [문제 해결](#12-문제-해결)

---

## 1. 사전 준비

### 필수 계정 생성

| 서비스 | 용도 | URL |
|--------|------|-----|
| **GitHub** | 코드 저장소 | https://github.com |
| **Railway** | 서버 + DB 호스팅 | https://railway.app |
| **Namecheap / Cloudflare** | 도메인 구매 | https://namecheap.com |
| **Cloudflare** | DNS + CDN + SSL | https://cloudflare.com |
| **UptimeRobot** | 무료 모니터링 | https://uptimerobot.com |

### 로컬 환경 세팅

```bash
# 1. Node.js 18+ 설치 확인
node --version   # v18.0.0 이상

# 2. Git 설치 확인
git --version    # 2.x 이상

# 3. npm 확인
npm --version    # 9.x 이상
```

### 프로젝트 파일 다운로드

Claude에서 다운로드한 `infinity_ventures` 폴더를 로컬에 저장합니다.

```bash
# 다운로드한 폴더로 이동
cd ~/Downloads/infinity_ventures

# 의존성 설치
npm install

# 로컬 테스트 (터미널 2개 필요)
npm run dev
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:5000
```

---

## 2. GitHub 리포지토리 생성 및 업로드

### Step 2-1: GitHub에서 리포지토리 생성

1. https://github.com/new 접속
2. 설정값:
   - **Repository name**: `infinity-ventures`
   - **Description**: `RWA Investment Platform — Infinity Ventures MVP`
   - **Visibility**: `Private` (반드시 Private!)
   - **Initialize**: 아무것도 체크하지 않음 (No README, No .gitignore)
3. **Create repository** 클릭

### Step 2-2: .gitignore 생성

```bash
cd ~/Downloads/infinity_ventures
```

아래 내용으로 `.gitignore` 파일을 생성합니다:

```
# Dependencies
node_modules/
.npm

# Build output
dist/
build/

# Database (프로덕션 데이터 절대 커밋 금지!)
*.db
*.db-journal
*.db-wal
*.sqlite
*.sqlite3

# Environment (비밀키 절대 커밋 금지!)
.env
.env.local
.env.production
.env.staging

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Temp
tmp/
temp/
```

### Step 2-3: .env.example 생성 (팀원용 템플릿)

```bash
# .env.example — 실제 값은 .env에 넣으세요
NODE_ENV=production
PORT=5000

# 보안 (반드시 변경!)
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-chars
ADMIN_DEFAULT_PASSWORD=YourSecureAdminPassword123!
ADMIN_EMAIL=admin@yourdomain.com

# 선택사항
CORS_ORIGIN=https://yourdomain.com
SESSION_MAX_AGE_DAYS=7
```

### Step 2-4: Git 초기화 및 Push

```bash
# Git 초기화
git init
git branch -M main

# .gitignore 먼저 추가 (중요!)
git add .gitignore
git commit -m "chore: add .gitignore"

# 전체 파일 추가
git add .
git commit -m "feat: Infinity Ventures MVP v3.0 — Full-stack RWA platform

- User: signup, KYC, deposit, invest, portfolio, withdraw
- Admin: dashboard, users, KYC, transactions, wallets, projects, yield
- Security: JWT, rate limiting, AML monitoring, session management
- Legal: Terms, Privacy, Risk Disclosure acceptance tracking
- Compliance: withdrawal whitelist, AML flags, risk scoring
- Scheduler: yield payouts, maturity checks, session cleanup"

# GitHub 원격 저장소 연결 (본인 GitHub username으로 변경!)
git remote add origin https://github.com/YOUR_USERNAME/infinity-ventures.git

# Push
git push -u origin main
```

### Step 2-5: 업로드 확인

1. https://github.com/YOUR_USERNAME/infinity-ventures 접속
2. 파일 목록에 `server/`, `src/`, `package.json` 등이 보이는지 확인
3. **⚠️ 확인**: `.env`, `node_modules/`, `*.db` 파일이 **없는지** 반드시 확인!

---

## 3. 환경변수 설정

### 프로덕션 환경변수 (필수)

```env
# ─── 서버 ───
NODE_ENV=production
PORT=5000

# ─── 보안 (반드시 강력한 값으로!) ───
JWT_SECRET=xK9m$2pL#nR7vQ4wZ8yB6tE3jA5hF1cD0gI   # 최소 32자, 랜덤
ADMIN_DEFAULT_PASSWORD=Sv#k29Lm!pQ7xR4wZ   # 특수문자+대소문자+숫자
ADMIN_EMAIL=admin@infinityventures.com

# ─── CORS (프론트엔드 도메인) ───
CORS_ORIGIN=https://infinityventures.com

# ─── 선택사항 ───
SESSION_MAX_AGE_DAYS=7
LOG_LEVEL=info
```

### 강력한 JWT_SECRET 생성 방법

```bash
# 터미널에서 실행
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

# 출력 예시: xK9m2pLnR7vQ4wZ8yB6tE3jA5hF1cD0gIuN...
# → 이 값을 JWT_SECRET으로 사용
```

---

## 4. Railway 배포 (권장)

> Railway는 Frontend + Backend를 단일 서비스로 배포할 수 있어 가장 간단합니다.

### Step 4-1: Railway 계정 생성

1. https://railway.app 접속
2. **GitHub 계정으로 로그인** (권장)
3. Hobby Plan ($5/월) 또는 Pro Plan 선택

### Step 4-2: 새 프로젝트 생성

1. Railway 대시보드 → **+ New Project** 클릭
2. **Deploy from GitHub repo** 선택
3. `infinity-ventures` 리포지토리 선택
4. **Deploy Now** 클릭

### Step 4-3: 환경변수 설정

1. 배포된 서비스 클릭 → **Variables** 탭
2. **Raw Editor** 클릭 후 아래 붙여넣기:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=여기에_생성한_시크릿_키
ADMIN_DEFAULT_PASSWORD=여기에_관리자_비밀번호
ADMIN_EMAIL=admin@infinityventures.com
```

3. **Update Variables** 클릭 → 자동 재배포 시작

### Step 4-4: 영구 볼륨 연결 (SQLite 데이터 보존)

**⚠️ 이 단계를 건너뛰면 재배포 시 데이터가 초기화됩니다!**

1. Railway 서비스 → **Settings** → **Volumes**
2. **+ Add Volume** 클릭
3. **Mount Path**: `/data`
4. **Save**

그리고 `server/db.js` 상단에서 DB 경로를 수정합니다:

```javascript
// server/db.js 에서 DB 경로 변경
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/data/infinity.db'
  : './infinity.db';

const db = new Database(DB_PATH);
```

### Step 4-5: 빌드 설정 확인

Railway가 자동 감지하지만, 수동 확인:

1. **Settings** 탭 클릭
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. 확인 후 저장

### Step 4-6: 배포 확인

1. **Deployments** 탭에서 빌드 로그 확인
2. 성공 시 자동 URL 생성: `https://infinity-ventures-production-xxxx.up.railway.app`
3. URL 클릭하여 사이트 접속 확인
4. `https://your-url.up.railway.app/api/health` 접속하여 API 상태 확인

### Step 4-7: 헬스체크 확인

정상 응답 예시:
```json
{
  "status": "ok",
  "version": "2.1.0-mvp",
  "database": "ok",
  "features": ["legal", "compliance", "aml", "yield", "whitelist", "sessions"]
}
```

---

## 5. Vercel + Railway 분리 배포 (대안)

> 프론트엔드(Vercel) + 백엔드(Railway) 분리 시 성능은 좋지만 설정이 복잡합니다.

### Frontend → Vercel

1. https://vercel.com → GitHub 로그인
2. **Import Project** → `infinity-ventures` 선택
3. Framework: **Vite** 자동 감지
4. Environment Variables:
   ```
   VITE_API_URL=https://api.infinityventures.com
   ```
5. Deploy 클릭

### Backend → Railway

1. 같은 리포지토리에서 Railway 서비스 생성
2. Build Command: `npm install`
3. Start Command: `npm start`
4. 환경변수는 Section 3과 동일
5. CORS_ORIGIN에 Vercel URL 추가:
   ```
   CORS_ORIGIN=https://infinityventures.vercel.app
   ```

### CORS 주의사항

분리 배포 시 `server/index.js`의 CORS 설정을 확인:

```javascript
// server/index.js에서 CORS 설정 확인
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
```

---

## 6. 도메인 연결

### Step 6-1: 도메인 구매

**추천 도메인 예시:**
- `infinityventures.com`
- `infinityventures.io`
- `infinity-ventures.app`

**구매처:** Namecheap, Cloudflare, Google Domains

### Step 6-2: Cloudflare DNS 설정 (권장)

1. https://dash.cloudflare.com 접속
2. **Add a Site** → 도메인 입력
3. 네임서버를 Cloudflare로 변경 (도메인 구매처에서)

### Step 6-3: Railway에 도메인 연결

1. Railway 서비스 → **Settings** → **Networking**
2. **Custom Domain** → `infinityventures.com` 입력
3. Railway가 제공하는 CNAME 레코드 복사

### Step 6-4: Cloudflare에서 DNS 레코드 추가

```
타입: CNAME
이름: @  (또는 루트 도메인)
대상: xxxx.up.railway.app  (Railway에서 복사한 값)
프록시: ON (오렌지색 구름)

타입: CNAME
이름: www
대상: xxxx.up.railway.app
프록시: ON
```

### Step 6-5: www 리다이렉트

Cloudflare → **Rules** → **Redirect Rules**:
- `www.infinityventures.com/*` → `https://infinityventures.com/$1` (301 Redirect)

### Step 6-6: 전파 확인 (최대 48시간, 보통 5분)

```bash
# DNS 전파 확인
nslookup infinityventures.com
dig infinityventures.com CNAME

# 또는 온라인 도구
# https://dnschecker.org
```

---

## 7. SSL 인증서

### Railway 사용 시

- **자동 발급**: Railway가 Let's Encrypt SSL을 자동 발급 및 갱신합니다.
- 추가 작업 불필요!

### Cloudflare 사용 시

1. **SSL/TLS** → **Full (Strict)** 선택
2. **Edge Certificates** → **Always Use HTTPS** ON
3. **Automatic HTTPS Rewrites** ON
4. **Minimum TLS Version**: TLS 1.2

---

## 8. 배포 후 검증

### 8-1: API 헬스 체크

```bash
# 기본 헬스 체크
curl https://infinityventures.com/api/health

# 기대 응답:
# {"status":"ok","version":"2.1.0-mvp","database":"ok",...}
```

### 8-2: 시뮬레이션 테스트 실행

```bash
# 프로덕션 URL로 테스트
API_URL=https://infinityventures.com node test/simulate.mjs
```

### 8-3: 수동 검증 체크리스트

```
□ 홈페이지 로드 확인
□ 회원가입 → 이메일 → 비밀번호 → 성공
□ 로그인 성공
□ 약관동의 모달 표시 → 동의 → 진행
□ 지갑 연결 화면
□ 프로젝트 목록 표시
□ 입금 플로우 (테스트 금액)
□ 투자 플로우
□ 포트폴리오 표시
□ 출금 플로우
□ 설정 화면 (비밀번호 변경, 출금주소 관리)
□ 관리자 로그인 (/admin/login)
□ 관리자 대시보드 데이터 표시
□ KYC 승인 플로우
□ 거래 승인 플로우
□ 컴플라이언스 대시보드
□ 수익 배당 트리거
□ 비밀번호 재설정 플로우
```

### 8-4: 관리자 초기 로그인

```
URL:      https://infinityventures.com/admin/login
Email:    admin@infinityventures.com  (또는 ADMIN_EMAIL 값)
Password: ADMIN_DEFAULT_PASSWORD에 설정한 값
```

**⚠️ 중요: 첫 로그인 후 즉시 관리자 비밀번호를 변경하세요!**

---

## 9. 모니터링 및 유지보수

### 9-1: UptimeRobot 설정 (무료)

1. https://uptimerobot.com 가입
2. **+ Add New Monitor**:
   - Type: HTTP(S)
   - URL: `https://infinityventures.com/api/health`
   - Interval: 5 minutes
3. Alert Contact 추가 (이메일, Slack 등)

### 9-2: Railway 로그 모니터링

1. Railway 대시보드 → 서비스 클릭
2. **Logs** 탭 → 실시간 로그 확인
3. 에러 필터링: `error`, `fail`, `500` 검색

### 9-3: 일일 점검 항목

```
□ /api/health 응답 정상 확인
□ Railway 대시보드에서 CPU/메모리 사용량 확인
□ 에러 로그 확인
□ 미승인 거래 확인 (Admin → Transactions)
□ 미승인 KYC 확인 (Admin → KYC)
□ AML 플래그 확인 (Admin → Compliance)
```

### 9-4: 주간 점검 항목

```
□ 수익 배당 정상 실행 확인
□ 만기 투자 처리 확인
□ 감사 로그 이상 여부
□ 사용자 피드백/지원 티켓 확인
□ 시스템 설정 검토
```

### 9-5: 자동 백업 (중요!)

Railway SQLite는 서버 재시작 시 데이터가 유지되지만, 별도 백업을 권장합니다.

**방법 1: Admin API로 수동 백업**

관리자가 정기적으로 Admin → Reports에서 데이터 확인

**방법 2: PostgreSQL 마이그레이션 (권장 — 아래 Section 11 참고)**

프로덕션에서는 SQLite 대신 PostgreSQL 사용을 강력히 권장합니다.

---

## 10. 프로덕션 보안 체크리스트

### 배포 전 필수 확인

```
🔴 Critical (반드시!)
□ JWT_SECRET을 강력한 랜덤 문자열로 변경 (32자 이상)
□ ADMIN_DEFAULT_PASSWORD를 강력한 비밀번호로 변경
□ .env 파일이 GitHub에 올라가지 않았는지 확인
□ .db 파일이 GitHub에 올라가지 않았는지 확인
□ NODE_ENV=production 설정 확인

🟡 Important (강력 권장)
□ CORS_ORIGIN을 실제 도메인으로 제한
□ 관리자 첫 로그인 후 비밀번호 변경
□ Admin IP Whitelist 활성화 (Settings)
□ 출금 주소 화이트리스트 활성화 (Settings)
□ AML 임계값 검토 (Settings)
□ Cloudflare WAF 활성화
□ rate limiting 설정 확인

🟢 Nice to Have
□ 이메일 서비스 연동 (SendGrid/Resend)
□ 에러 추적 (Sentry)
□ 분석 도구 (Google Analytics/Mixpanel)
□ 로그 저장소 (Logtail/Papertrail)
```

### Cloudflare 보안 설정

1. **WAF** → Under Attack Mode: ON (공격 감지 시)
2. **Security** → Bot Fight Mode: ON
3. **Firewall Rules**:
   - `/api/admin/*` → 특정 IP만 허용
   - Rate Limiting: 100 req/min per IP

---

## 11. 확장 및 마이그레이션

### 11-1: SQLite → PostgreSQL 마이그레이션

프로덕션 서비스 성장 시 필수적인 단계입니다.

**Railway에서 PostgreSQL 추가:**

1. Railway 프로젝트 → **+ New** → **Database** → **PostgreSQL**
2. 자동 생성된 `DATABASE_URL` 환경변수 확인
3. 코드 변경:

```bash
npm install pg
# 또는
npm install postgres  # ESM 지원
```

`server/db.js`에서 `better-sqlite3` → `pg` 변경 작업이 필요합니다.

### 11-2: 이메일 서비스 연동

현재 비밀번호 재설정 토큰이 콘솔에만 출력됩니다. 실제 이메일 전송 연동:

**Resend (추천, 무료 100통/일):**

```bash
npm install resend
```

```javascript
// server/email.js
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
  return resend.emails.send({
    from: 'Infinity Ventures <noreply@infinityventures.com>',
    to, subject, html,
  });
}
```

### 11-3: 결제 게이트웨이 연동

실제 입출금 처리를 위한 연동:

| 서비스 | 용도 | 특징 |
|--------|------|------|
| **Stripe** | 법정화폐 입금 | 가장 보편적, 48개국 |
| **Circle (USDC)** | 스테이블코인 | 프로그래밍 가능 |
| **Fireblocks** | 기관급 지갑관리 | MPC 보안 |
| **Chainalysis** | 블록체인 컴플라이언스 | AML 모니터링 |

### 11-4: CI/CD 파이프라인 구성

**GitHub Actions 자동 배포 설정:**

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: infinity-ventures
```

**Railway 토큰 발급:**
1. Railway → Account Settings → Tokens
2. 토큰 복사 → GitHub Repo → Settings → Secrets → `RAILWAY_TOKEN`

---

## 12. 문제 해결

### 빌드 실패

```
Error: npm ERR! code ERESOLVE
→ 해결: npm install --legacy-peer-deps
→ Railway Build Command 변경: npm install --legacy-peer-deps && npm run build
```

```
Error: Cannot find module 'better-sqlite3'
→ Railway에서 Native Module 빌드 문제
→ 해결: Railway Settings → Build → Nixpacks 선택 확인
```

### 서버 시작 실패

```
Error: SQLITE_CANTOPEN
→ Railway의 파일시스템 접근 문제
→ 해결: 볼륨 마운트 후 DB 경로를 /data/infinity.db로 변경
→ 또는 PostgreSQL로 마이그레이션 (권장)
```

### 502 Bad Gateway

```
→ 서버가 아직 시작되지 않음
→ Railway Logs에서 에러 확인
→ PORT 환경변수가 설정되어 있는지 확인
→ app.listen에서 '0.0.0.0' 바인딩 확인
```

### CORS 에러

```
Access-Control-Allow-Origin 에러
→ CORS_ORIGIN 환경변수에 프론트엔드 URL 정확히 입력
→ https:// 포함, 마지막 / 제외
→ 예: CORS_ORIGIN=https://infinityventures.com
```

### 데이터베이스 초기화

```bash
# Railway에서 재배포하면 DB가 초기화될 수 있음
# 볼륨(Volume)을 연결하면 데이터 영구 보존 가능:
# Railway → Service → Settings → Volumes → Add Volume
# Mount Path: /data
# server/db.js에서 DB 경로 변경: /data/infinity.db
```

---

## 📅 배포 타임라인 (예상)

| 단계 | 소요 시간 | 비용 |
|------|----------|------|
| GitHub 업로드 | 15분 | 무료 |
| Railway 배포 | 30분 | $5/월~ |
| 도메인 구매 | 10분 | $10-15/년 |
| Cloudflare DNS 설정 | 20분 | 무료 |
| SSL 적용 | 자동 | 무료 |
| 검증 + 테스트 | 1시간 | - |
| 모니터링 설정 | 15분 | 무료 |
| **합계** | **약 2.5시간** | **$5/월 + $12/년** |

---

## 💰 월 운영 비용 (예상)

| 항목 | Starter | Growth | Scale |
|------|---------|--------|-------|
| Railway | $5 | $20 | $50+ |
| 도메인 | $1 | $1 | $1 |
| Cloudflare | 무료 | 무료 | $20 |
| 이메일 (Resend) | 무료 | $20 | $50 |
| 모니터링 | 무료 | 무료 | $15 |
| **합계** | **$6/월** | **$41/월** | **$136/월** |

---

## 🔄 업데이트 배포 순서

코드 변경 후 재배포:

```bash
# 1. 변경사항 커밋
git add .
git commit -m "fix: 버그 수정 또는 기능 추가"

# 2. Push (Railway 자동 재배포)
git push origin main

# 3. Railway에서 빌드 로그 확인
# 4. 헬스 체크 확인
curl https://infinityventures.com/api/health

# 5. 시뮬레이션 테스트
API_URL=https://infinityventures.com node test/simulate.mjs
```

---

## 📞 긴급 대응

### 서비스 다운 시

1. Railway 대시보드 → Logs 확인
2. 최근 배포 롤백: Deployments → 이전 버전 → **Redeploy**
3. 환경변수 변경 여부 확인
4. 헬스 체크: `curl /api/health`

### 보안 사고 시

1. Railway → 환경변수에서 JWT_SECRET 즉시 변경 (모든 세션 무효화)
2. Admin 비밀번호 변경
3. Admin → Compliance에서 AML 스캔 실행
4. 감사 로그 전체 검토
5. 필요시 서비스 유지보수 모드 전환 (Admin → Settings → maintenance_mode = true)

---

> 📌 이 가이드는 Infinity Ventures MVP v3.0 기준입니다.
> 질문이나 문제가 있으면 언제든 문의해주세요.
