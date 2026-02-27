# Global Real Estate (NY/London) Development & Fractional Sale — RWA Listing Pack v1.0
## 글로벌 부동산 개발 및 분할 투자 토큰화 상장 패키지

---

> **면책 고지 / Disclaimer**
> 본 문서는 법률 자문, 투자 권유, 수익 보장을 구성하지 않습니다. 모든 수치는 가정(assumption)에 기반합니다. 부동산 투자는 유동성 제한, 가치 하락, 시장 리스크가 존재합니다. 실제 수익은 보장되지 않습니다.
>
> This document does not constitute legal advice, an investment solicitation, or a guarantee of returns. All figures are assumption-based. Real estate investments carry liquidity constraints, depreciation risk, and market risk. Actual returns are not guaranteed.

---

# 1. 구조적 옵션 / Structural Options

---

## (KR) 구조적 옵션

### Option 1: SPV 지분 토큰 (Income + Appreciation)

| 항목 | 내용 |
|---|---|
| **토큰화 대상** | 부동산 보유 SPV의 지분 (Equity Interest) |
| **수익 구조** | 임대 수익(Income) + 부동산 가치 상승분(Appreciation) |
| **투자자 권리** | SPV 지분 보유 → 간접적 부동산 소유권 |
| **배분** | 월간 임대 수익 배분 + 매각 시 잔여 가치 배분 |
| **만기** | 3–7년 (개발 완료 후 안정화 기간 포함) |
| **리스크** | 공실, 임대료 하락, 부동산 가치 하락, 유동성 제한 |
| **장점** | 임대 수익 + 시세 차익 동시 추구, 전통적 부동산 투자와 유사 |
| **단점** | 높은 변동성, 매각 타이밍 불확실, 긴 보유 기간 |

### Option 2: 모기지/브릿지론 노트 토큰 (Fixed Coupon)

| 항목 | 내용 |
|---|---|
| **토큰화 대상** | 부동산 개발/취득을 위한 대출채권 (Mortgage/Bridge Loan Note) |
| **수익 구조** | 고정 쿠폰 (Fixed Coupon) — 부동산 자체가 담보 |
| **투자자 권리** | 대출채권 보유자 → 부동산에 대한 담보권(Lien) |
| **배분** | 월간/분기 고정 쿠폰 지급 |
| **만기** | 18–36개월 (개발/브릿지론 특성) |
| **리스크** | 차입자 부도, 담보 가치 하락, 금리 변동 |
| **장점** | 예측 가능한 고정 수익, 부동산 담보로 원금 보호 강화 |
| **단점** | 부동산 가치 상승 수익 없음, 차입자 리스크 |

### Option 3: 하이브리드 (Dev Note + Income Token + Equity Upside)

| 항목 | 내용 |
|---|---|
| **토큰화 대상** | 3단계 복합 구조 |
| **Phase 1 — Dev Note** | 개발 기간 대출 토큰 (고정 쿠폰, 18–24개월, 건설 완료 시 상환) |
| **Phase 2 — Income Token** | 개발 완료 후 임대 수익 토큰 (월간 배분, 3–7년) |
| **Phase 3 — Equity Upside** | 매각/리파이낸싱 시 잔여 가치 배분 (워터폴에 따라) |
| **투자자 선택** | 투자자가 Phase별로 다른 토큰에 투자 가능 (리스크 선호도별) |
| **장점** | 개발~운영~매각 전체 라이프사이클 커버, 투자자 선택권 최대화 |
| **단점** | 구조 복잡, 스마트 컨트랙트 복잡도 증가, 관리 비용 |

## (EN) Structural Options

### Option 1: SPV Equity Token (Income + Appreciation)

| Item | Details |
|---|---|
| **What is tokenized** | Equity interest in property-holding SPV |
| **Income structure** | Rental income + property appreciation |
| **Investor rights** | SPV equity holder → indirect property ownership |
| **Distributions** | Monthly rental distributions + residual value on sale |
| **Tenor** | 3–7 years (including post-development stabilization) |
| **Risks** | Vacancy, rent decline, property depreciation, liquidity constraints |
| **Pros** | Pursues both income and capital gains; mirrors traditional RE investment |
| **Cons** | Higher volatility, uncertain sale timing, long hold period |

### Option 2: Mortgage/Bridge-Loan Note Token (Fixed Coupon)

| Item | Details |
|---|---|
| **What is tokenized** | Loan notes for property development/acquisition (mortgage/bridge) |
| **Income structure** | Fixed coupon — property serves as collateral |
| **Investor rights** | Note holder → lien on underlying property |
| **Distributions** | Monthly/quarterly fixed coupon |
| **Tenor** | 18–36 months (development/bridge loan nature) |
| **Risks** | Borrower default, collateral value decline, interest rate changes |
| **Pros** | Predictable fixed income, enhanced principal protection via RE collateral |
| **Cons** | No property appreciation upside, borrower risk |

### Option 3: Hybrid (Dev Note + Income Token + Equity Upside)

| Item | Details |
|---|---|
| **What is tokenized** | 3-phase composite structure |
| **Phase 1 — Dev Note** | Development-period loan token (fixed coupon, 18–24m, repaid at construction completion) |
| **Phase 2 — Income Token** | Post-development rental income token (monthly distribution, 3–7yr) |
| **Phase 3 — Equity Upside** | Residual value distribution upon sale/refinancing (per waterfall) |
| **Investor choice** | Investors can invest in different phase tokens based on risk preference |
| **Pros** | Covers full lifecycle (dev → operations → exit), maximizes investor choice |
| **Cons** | Complex structure, higher smart contract complexity, management costs |

---

# 2. 2026 추천 아키텍처 / Recommended Base Architecture for 2026

---

## (KR) 추천 아키텍처

> **추천: Option 3 — 하이브리드 (Dev Note + Income Token + Equity Upside)**

### 2.1 추천 근거

**2026 Web3 트렌드와의 정합성:**

1. **모듈형 투자 상품**: 2026년 Web3 시장은 단일 구조보다 모듈형(composable) 상품을 선호합니다. 투자자가 자신의 리스크 선호도에 따라 Dev Note(안전), Income Token(중간), Equity Upside(공격적)를 선택할 수 있어 시장 접근성이 극대화됩니다.

2. **라이프사이클 전체 커버**: 개발(18–24개월) → 안정화(6–12개월) → 운영(3–5년) → 매각까지 전체 부동산 가치 사슬을 하나의 플랫폼에서 토큰화. Securitize-style 규제 인프라 위에 RealT-style 유동성을 결합.

3. **구조적 유연성**: 뉴욕과 런던 등 Tier-1 도시의 부동산은 개발 기간이 길고 규제가 복잡합니다. 하이브리드 구조는 각 단계에 맞는 최적의 토큰을 제공하여 규제 적합성을 극대화합니다.

4. **투자자 기반 확대**: Dev Note는 보수적 투자자(고정 쿠폰), Income Token은 수익 투자자(월간 배분), Equity Upside는 성장 투자자를 각각 타겟하여 총 투자자 풀을 극대화합니다.

### 2.2 왜 Option 1/2만으로는 부족한가

- **Option 1 단독**: 개발 기간 중 수익 없음, 긴 보유 기간 → 투자자 이탈 리스크
- **Option 2 단독**: 고정 쿠폰만 제공, 부동산 가치 상승 수익 없음 → 상승장에서 기회비용
- **Option 3 하이브리드**: 두 옵션의 장점을 결합하되, 각 Phase를 독립 토큰으로 분리하여 투자자 선택권 보장

## (EN) Recommended Architecture

> **Recommendation: Option 3 — Hybrid (Dev Note + Income Token + Equity Upside)**

### 2.1 Rationale

**Alignment with 2026 Web3 Trends:**

1. **Modular investment products**: The 2026 Web3 market favors composable products over monolithic structures. Investors choose Dev Note (safe), Income Token (moderate), or Equity Upside (aggressive) based on risk preference, maximizing market accessibility.

2. **Full lifecycle coverage**: Development (18–24m) → stabilization (6–12m) → operations (3–5yr) → exit — the entire real estate value chain tokenized on one platform. Combines Securitize-style regulated rails with RealT-style liquidity.

3. **Structural flexibility**: Tier-1 city properties (NY, London) have long development periods and complex regulations. The hybrid structure provides phase-appropriate tokens, maximizing regulatory fit.

4. **Broader investor base**: Dev Note targets conservative investors (fixed coupon), Income Token targets yield investors (monthly), Equity Upside targets growth investors — maximizing the total investor pool.

### 2.2 Why Options 1/2 Alone Are Insufficient

- **Option 1 alone**: No income during development, long hold → investor attrition risk
- **Option 2 alone**: Fixed coupon only, no appreciation upside → opportunity cost in bull markets
- **Option 3 hybrid**: Combines advantages of both, with independent phase tokens preserving investor choice

---

# 3. 상세 텀시트 / Detailed Term Sheet

---

## (KR) 텀시트

### 3.1 전체 구조 요약

| 항목 | Dev Note | Income Token | Equity Upside |
|---|---|---|---|
| **토큰명** | RE-DEV | RE-INC | RE-EQ |
| **성격** | 개발 대출 토큰 | 임대 수익 토큰 | 지분 수익 토큰 |
| **만기** | 18–36개월 | 3–7년 | 매각/리파이낸싱 시 |
| **쿠폰/수익** | 연 8–12% 고정 (가정) | 연 5–8% (임대 수익 기반, 가정) | 가변 (매각 차익 연동) |
| **지급 주기** | 분기 | 월간 | 이벤트 기반 (매각 시) |
| **담보** | 개발 중 부동산 1순위 담보 | 완공 부동산 임대 수익 | 매각 잔여 가치 |
| **우선순위** | 최우선 | Dev Note 상환 후 2순위 | 최후순위 |
| **리스크** | 건설 리스크, 차입자 부도 | 공실, 임대료 하락 | 매각 가격 불확실 |

### 3.2 공통 조건

| 항목 | 내용 |
|---|---|
| **발행자** | Global RE SPV Ltd. (가칭, 부동산별 SPV 설립) |
| **대상 도시** | 뉴욕, 런던 (및 기타 Tier-1 도시 확장 가능) |
| **소프트캡** | USD 2,000,000 (가정, 부동산별 상이) |
| **하드캡** | USD 50,000,000 (가정, 부동산별 상이) |
| **최소 투자금** | USD 500 (가정) |
| **결제 통화** | USDC |
| **화이트리스트** | KYC/AML 완료 투자자 한정 |
| **록업 기간** | Dev Note: 6개월, Income: 12개월, Equity: 매각까지 (가정) |
| **환매 창구** | 분기별 환매 창구 (Income Token, 유동성 한도 내) |

### 3.3 수수료 구조 (Fee Stack)

| 수수료 유형 | 비율 (가정) | 설명 |
|---|---|---|
| **취득 수수료 (Acquisition Fee)** | 1.0–2.0% | 부동산 취득 시 일회성 |
| **자산 관리 수수료 (Asset Mgmt Fee)** | 1.0–1.5% 연간 | 자산 운용 보수 (AUM 기준) |
| **매각 수수료 (Disposition Fee)** | 1.0–2.0% | 매각 시 일회성 |
| **성과 수수료 (Performance Fee)** | 목표 수익률 초과분의 15–20% | IRR이 목표 수익률(가정: 8%) 초과 시 |
| **플랫폼 수수료** | 0.5% 연간 | 토큰 발행·관리 플랫폼 보수 |

> **주의**: 모든 수수료는 가정이며, 실제 수수료는 부동산별·관할권별로 다를 수 있습니다. 투자 전 수수료 구조를 반드시 확인하시기 바랍니다.

## (EN) Term Sheet

### 3.1 Overall Structure Summary

| Item | Dev Note | Income Token | Equity Upside |
|---|---|---|---|
| **Token name** | RE-DEV | RE-INC | RE-EQ |
| **Nature** | Development loan token | Rental income token | Equity return token |
| **Tenor** | 18–36 months | 3–7 years | Upon sale/refinancing |
| **Coupon/return** | 8–12% fixed ann. (assumption) | 5–8% ann. (rental-based, assumption) | Variable (sale proceeds linked) |
| **Payout cadence** | Quarterly | Monthly | Event-based (upon sale) |
| **Collateral** | First lien on dev property | Rental income from completed property | Residual sale value |
| **Priority** | Highest | Second (after Dev Note repaid) | Last |
| **Risk** | Construction risk, borrower default | Vacancy, rent decline | Sale price uncertainty |

### 3.2 Common Terms

| Item | Details |
|---|---|
| **Issuer** | Global RE SPV Ltd. (working title, per-property SPV) |
| **Target cities** | New York, London (expandable to other Tier-1 cities) |
| **Soft cap** | USD 2,000,000 (assumption, varies by property) |
| **Hard cap** | USD 50,000,000 (assumption, varies by property) |
| **Min ticket** | USD 500 (assumption) |
| **Settlement** | USDC |
| **Whitelist** | KYC/AML-verified investors only |
| **Lock-up** | Dev Note: 6m, Income: 12m, Equity: until sale (assumption) |
| **Redemption window** | Quarterly (Income Token, subject to liquidity limits) |

### 3.3 Fee Stack

| Fee Type | Rate (assumption) | Description |
|---|---|---|
| **Acquisition fee** | 1.0–2.0% | One-time upon property acquisition |
| **Asset management fee** | 1.0–1.5% annual | Asset management compensation (AUM-based) |
| **Disposition fee** | 1.0–2.0% | One-time upon sale |
| **Performance fee** | 15–20% of excess above target | When IRR exceeds target return (assumption: 8%) |
| **Platform fee** | 0.5% annual | Token issuance & management platform fee |

> **Note**: All fees are assumptions. Actual fees may vary by property and jurisdiction. Verify fee structure before investing.

## (EN) YAML Term Sheet

```yaml
term_sheet:
  project_name: "Global Real Estate Development & Fractional Investment"
  project_type: "Real Estate Development + Income + Fractional Sale"
  target_cities: ["New York", "London", "Other Tier-1 (expandable)"]
  architecture: "Hybrid — Option 3"
  issuer: "Global RE SPV Ltd. (per-property SPV)"
  token_types:
    dev_note:
      name: "RE-DEV"
      description: "Development Loan Token — fixed coupon, first lien"
      coupon_annualized: "8–12%"  # assumption
      payout_cadence: "quarterly"
      tenor_months: "18–36"
      collateral: "First lien on development property"
      priority: "Highest"
      lockup_months: 6  # assumption
    income_token:
      name: "RE-INC"
      description: "Rental Income Token — monthly distributions"
      target_yield: "5–8% annualized"  # assumption
      payout_cadence: "monthly"
      tenor_years: "3–7"
      source: "Net rental income after expenses"
      priority: "Second (after Dev Note repaid)"
      lockup_months: 12  # assumption
      redemption_window: "quarterly (subject to liquidity)"
    equity_upside:
      name: "RE-EQ"
      description: "Equity Upside Token — sale/refinancing proceeds"
      target_return: "variable, scenario-based"
      payout: "event-based (upon sale/refinancing)"
      priority: "Last in waterfall"
      lockup: "until sale"
  soft_cap_usd: 2000000  # assumption, per property
  hard_cap_usd: 50000000  # assumption, per property
  min_ticket_usd: 500  # assumption
  settlement_currency: "USDC"
  whitelist_required: true
  kyc_aml_required: true
  fees:  # assumption
    acquisition: "1.0–2.0%"
    asset_management: "1.0–1.5% annual"
    disposition: "1.0–2.0%"
    performance: "15–20% of excess above 8% IRR target"
    platform: "0.5% annual"
  reporting:
    monthly: ["rental income", "occupancy rate", "expense breakdown", "NAV estimate"]
    quarterly: ["audited financials", "independent appraisal", "investor distribution details"]
    annual: ["comprehensive property report", "NAV audit", "tax reporting package"]
  legal_disclaimer: "All figures are assumptions. Returns not guaranteed. Real estate investments are illiquid."
```

---

# 4. 지급 체계 / Payout Scheme

---

## (KR) 지급 체계

### 4.1 월간 임대 수익 배분 (Income Token — RE-INC)

**배분 워터폴:**

| 순위 | 항목 | 설명 |
|---|---|---|
| 1 | 부동산 운영 비용 | 관리비, 유지보수, 보험, 세금, 관리 수수료 |
| 2 | 준비금 적립 | 공실 준비금(3%), 유지보수 준비금(2%), 운전자금(3%) (가정) |
| 3 | Dev Note 쿠폰 (활성 시) | RE-DEV 보유자 분기 쿠폰 (개발 기간 중) |
| 4 | Income Token 배분 | RE-INC 보유자 월간 배분 |
| 5 | 성과 수수료 | 목표 초과 시 관리자 성과 보수 |
| 6 | 잔여 | Equity Upside 준비금 또는 재투자 |

### 4.2 마일스톤 기반 배분 (Dev Note — RE-DEV)

| 이벤트 | 배분 내용 |
|---|---|
| 분기별 | 고정 쿠폰 지급 (연 8–12% 기준 분기 배분) |
| 건설 완료 시 | Dev Note 원금 상환 (임대 수익 또는 리파이낸싱 자금으로) |
| 연체 시 | 담보 부동산에 대한 1순위 청구권 행사 |

### 4.3 매각 시 최종 워터폴 (Final Sale Waterfall)

| 순위 | 항목 | 설명 |
|---|---|---|
| 1 | 매각 비용 | 중개 수수료, 법률 비용, 매각 수수료 |
| 2 | Dev Note 잔액 상환 | 미상환 Dev Note 원금 + 미지급 쿠폰 |
| 3 | Income Token 미지급분 | 미배분 임대 수익 정산 |
| 4 | 원금 반환 | 모든 토큰 보유자에게 투자 원금 반환 |
| 5 | 성과 수수료 | 관리자 성과 보수 (목표 IRR 초과분의 15–20%) |
| 6 | Equity Upside 배분 | RE-EQ 보유자에게 잔여 매각 차익 배분 |

### 4.4 예시 시나리오 (가정)

**부동산: 뉴욕 멀티패밀리, 취득가 $20M, 연 임대 수입 $1.5M, 5년 후 매각**

| 시나리오 | 매각가 | Dev Note IRR | Income Yield | Equity Return |
|---|---|---|---|---|
| **Base** | $24M (+20%) | 10% (고정) | 6% 연간 | 15–20% 총 수익 |
| **Bull** | $28M (+40%) | 10% (고정) | 7% 연간 | 35–45% 총 수익 |
| **Bear** | $18M (-10%) | 10% (고정) | 4% 연간 | 원금 손실 가능 |

> **주의**: 모든 수치는 전적으로 가정입니다. 실제 부동산 성과는 시장·위치·관리·거시 경제 상황에 따라 크게 달라집니다. 수익은 보장되지 않습니다.

## (EN) Payout Scheme

### 4.1 Monthly Rental Distributions (Income Token — RE-INC)

**Distribution Waterfall:**

| Priority | Item | Description |
|---|---|---|
| 1 | Property operating expenses | Management, maintenance, insurance, taxes, management fees |
| 2 | Reserve allocation | Vacancy reserve (3%), maintenance reserve (2%), working capital (3%) (assumption) |
| 3 | Dev Note coupon (if active) | RE-DEV holders quarterly coupon (during development) |
| 4 | Income Token distribution | RE-INC holders monthly distribution |
| 5 | Performance fee | Manager performance fee if target exceeded |
| 6 | Residual | Equity Upside reserve or reinvestment |

### 4.2 Milestone-Based Distributions (Dev Note — RE-DEV)

| Event | Distribution |
|---|---|
| Quarterly | Fixed coupon payment (8–12% annualized, quarterly) |
| Construction completion | Dev Note principal repayment (from rental income or refinancing) |
| Delinquency | First-priority claim on collateral property |

### 4.3 Final Sale Waterfall

| Priority | Item | Description |
|---|---|---|
| 1 | Sale costs | Brokerage, legal fees, disposition fee |
| 2 | Dev Note balance | Outstanding principal + unpaid coupons |
| 3 | Income Token arrears | Unpaid rental distributions settlement |
| 4 | Principal return | Return invested principal to all token holders |
| 5 | Performance fee | Manager performance fee (15–20% of excess above target IRR) |
| 6 | Equity Upside distribution | RE-EQ holders receive residual sale proceeds |

### 4.4 Example Scenarios (Assumption)

**Property: NYC Multifamily, Acquisition $20M, Annual Rent $1.5M, Sale after 5 years**

| Scenario | Sale Price | Dev Note IRR | Income Yield | Equity Return |
|---|---|---|---|---|
| **Base** | $24M (+20%) | 10% (fixed) | 6% annual | 15–20% total |
| **Bull** | $28M (+40%) | 10% (fixed) | 7% annual | 35–45% total |
| **Bear** | $18M (-10%) | 10% (fixed) | 4% annual | Potential principal loss |

> **Note**: All figures are entirely hypothetical. Actual property performance varies significantly based on market, location, management, and macroeconomic conditions. Returns are not guaranteed.

---

# 5. 유동성 설계 / Liquidity Design

---

## (KR) 유동성 설계

### 5.1 화이트리스트 OTC/이차 시장

| 항목 | 내용 |
|---|---|
| **이차 거래** | 화이트리스트 투자자 간 P2P OTC 거래 허용 |
| **거래 제한** | 모든 양도는 KYC/AML 검증 완료 투자자 간에만 가능 |
| **규제 채널** | Securitize Markets, tZERO 등 규제 이차 시장 활용 가능 (가정) |
| **거래 수수료** | 거래 금액의 0.5–1.0% (가정) |
| **거래 빈도** | 록업 기간 종료 후 상시 가능 (규제 채널 운영 시간 내) |

### 5.2 환매 창구 정책 (Redemption Window)

| 항목 | Dev Note | Income Token | Equity Upside |
|---|---|---|---|
| **록업** | 6개월 | 12개월 | 매각까지 |
| **환매 창구** | 해당 없음 (만기 상환) | 분기별 (매 분기 말 10영업일) | 해당 없음 |
| **환매 한도** | N/A | 분기당 유통 토큰의 최대 5% (가정) | N/A |
| **환매 가격** | N/A | 직전 NAV 기준 (가정: 3% 환매 할인) | N/A |
| **환매 대기열** | N/A | 초과 신청 시 선착순 또는 비례 배분 | N/A |

### 5.3 유동성 리스크 경고

> **중요**: 부동산 토큰은 주식이나 암호화폐와 달리 **유동성이 매우 제한적**입니다.
>
> - 이차 시장이 존재하더라도, 원하는 가격에 즉시 매도할 수 있다는 보장이 없습니다
> - 환매 창구는 유동성 한도 내에서만 가능하며, 초과 시 대기가 발생합니다
> - 부동산 시장 침체 시 환매 창구가 축소되거나 일시 중단될 수 있습니다
> - Equity Upside 토큰은 부동산 매각 전까지 환금이 불가능합니다
> - **투자금 전액을 장기간 회수하지 못할 수 있습니다**

## (EN) Liquidity Design

### 5.1 Whitelisted OTC/Secondary Market

| Item | Details |
|---|---|
| **Secondary trading** | P2P OTC trading permitted among whitelisted investors |
| **Transfer restrictions** | All transfers only between KYC/AML-verified investors |
| **Regulated channels** | Potential use of Securitize Markets, tZERO, or similar regulated ATS (assumption) |
| **Trading fee** | 0.5–1.0% of trade value (assumption) |
| **Trading frequency** | Anytime post-lock-up (within regulated channel operating hours) |

### 5.2 Redemption Window Policy

| Item | Dev Note | Income Token | Equity Upside |
|---|---|---|---|
| **Lock-up** | 6 months | 12 months | Until sale |
| **Redemption window** | N/A (maturity repayment) | Quarterly (10 business days each quarter-end) | N/A |
| **Redemption limit** | N/A | Max 5% of outstanding tokens per quarter (assumption) | N/A |
| **Redemption price** | N/A | Based on latest NAV (assumption: 3% redemption discount) | N/A |
| **Redemption queue** | N/A | Excess requests: FIFO or pro-rata | N/A |

### 5.3 Liquidity Risk Warnings

> **Important**: Real estate tokens have **very limited liquidity** compared to stocks or cryptocurrencies.
>
> - Even with a secondary market, there is no guarantee of immediate sale at desired price
> - Redemption windows operate within liquidity limits; excess requests result in queuing
> - Market downturns may reduce or suspend redemption windows
> - Equity Upside tokens are illiquid until property sale
> - **You may be unable to recover your full investment for an extended period**

---

# 6. 밸류에이션 및 NAV 보고 / Valuation & NAV Reporting

---

## (KR) 밸류에이션 및 NAV 보고

### 6.1 독립 감정 평가 (Independent Appraisal)

| 항목 | 내용 |
|---|---|
| **감정 주기** | 연 1회 독립 감정 평가 (가정), 중대 이벤트 시 수시 |
| **감정 기관** | RICS 또는 MAI 인증 독립 감정 평가사 |
| **감정 방법** | 수익환원법(Income Approach), 비교 거래법(Sales Comparison), 원가법(Cost Approach) 병행 |
| **NAV 업데이트** | 감정 결과 반영하여 분기별 NAV 업데이트 |

### 6.2 비용 투명성

| 항목 | 보고 주기 | 내용 |
|---|---|---|
| 유지보수 비용 | 월간 | 정기/비정기 유지보수 상세 |
| 공실률 | 월간 | 현재 공실 유닛 수, 입주율 |
| 세금 | 분기 | 재산세, 부가세 등 |
| 보험 비용 | 연간 | 건물 보험, 배상 보험 |
| 관리 수수료 | 월간 | 자산 관리 보수 상세 |
| 수선충당금 | 분기 | 대규모 수선을 위한 적립금 현황 |

### 6.3 NAV 계산 방식

```
NAV = 부동산 감정가 - 부채(Dev Note 잔액 등) - 미지급 비용 - 준비금 부족분
NAV per Token = NAV / 유통 토큰 총 수량
```

- 분기별 NAV 보고서 투자자 공개
- 감정가와 시장 거래가의 괴리 발생 시 설명 첨부
- NAV 하락 시 투자자 즉시 통보

## (EN) Valuation & NAV Reporting

### 6.1 Independent Appraisal

| Item | Details |
|---|---|
| **Appraisal cadence** | Annual independent appraisal (assumption); ad-hoc upon material events |
| **Appraiser** | RICS or MAI certified independent appraiser |
| **Methodology** | Income Approach, Sales Comparison, Cost Approach (combined) |
| **NAV update** | Quarterly NAV update reflecting appraisal results |

### 6.2 Expense Transparency

| Item | Frequency | Content |
|---|---|---|
| Maintenance costs | Monthly | Regular and ad-hoc maintenance detail |
| Vacancy rate | Monthly | Current vacant units, occupancy rate |
| Taxes | Quarterly | Property tax, VAT, etc. |
| Insurance costs | Annual | Building insurance, liability insurance |
| Management fees | Monthly | Asset management fee detail |
| Capital reserves | Quarterly | Major repair reserve fund status |

### 6.3 NAV Calculation

```
NAV = Property Appraised Value - Liabilities (Dev Note balance, etc.) - Accrued Expenses - Reserve Shortfalls
NAV per Token = NAV / Total Outstanding Tokens
```

- Quarterly NAV reports disclosed to investors
- Explanation provided if appraisal value diverges from market transactions
- Immediate investor notification upon NAV decline

---

# 7. 법률/컴플라이언스 노트 / Legal/Compliance Notes

---

> **면책 고지**: 본 섹션은 법률 자문이 아닙니다. 모든 법률 사항은 해당 관할권 전문 법률 자문을 받으시기 바랍니다.
> **Disclaimer**: This section does not constitute legal advice. Consult jurisdiction-specific legal counsel.

## (KR) 법률/컴플라이언스

### 7.1 투자자 자격 (Investor Eligibility)

| 관할권 | 요건 (가정) |
|---|---|
| **미국** | Regulation D 506(c) — Accredited Investors Only, 또는 Regulation S (해외 투자자) |
| **영국** | FCA 규제 하 Professional/High Net Worth Investor 분류 (가정) |
| **기타** | 해당국 증권법에 따른 적격 투자자 기준 충족 필요 |
| **공통** | KYC/AML 완료 필수, 제재 대상국 투자자 제외 |

### 7.2 AML/KYC

- 모든 투자자: 정부 발행 신분증, 주소 증빙, 자금 출처 확인
- 법인 투자자: 법인 등기, 최종 수익 소유자(UBO) 확인, 법인 결의서
- 제재 리스트(OFAC, EU, UN) 스크리닝 필수
- KYC 유효 기간: 12개월 (갱신 필요)

### 7.3 국경간 투자 제한 (Cross-Border Constraints)

| 리스크 | 설명 |
|---|---|
| 증권법 차이 | 미국·영국·EU 각각 상이한 증권 규제 적용 |
| 세무 | 부동산 소재국 원천세, 투자자 거주국 세무 의무 이중 과세 가능 |
| FATCA/CRS | 미국 FATCA, 글로벌 CRS 보고 의무 준수 |
| 외국인 부동산 투자 제한 | 일부 국가에서 외국인의 부동산(SPV 포함) 투자 제한 가능 |

### 7.4 토큰 법적 분류

- 대부분의 관할권에서 증권(Security)으로 분류될 가능성 높음
- Securitize-style 규제 채널을 통한 발행 및 거래 권장
- 법률 의견서(Legal Opinion) 취득 필수

## (EN) Legal/Compliance Notes

### 7.1 Investor Eligibility (Assumptions)

| Jurisdiction | Requirements (assumption) |
|---|---|
| **US** | Regulation D 506(c) — Accredited Investors Only, or Regulation S (non-US investors) |
| **UK** | FCA-regulated Professional/High Net Worth Investor classification (assumption) |
| **Other** | Applicable securities law qualified investor criteria |
| **Common** | KYC/AML mandatory; sanctioned country investors excluded |

### 7.2 AML/KYC

- All investors: government-issued ID, address proof, source of funds verification
- Institutional investors: corporate registration, UBO identification, board resolution
- Sanctions list screening (OFAC, EU, UN) mandatory
- KYC validity: 12 months (renewal required)

### 7.3 Cross-Border Constraints

| Risk | Description |
|---|---|
| Securities law differences | US, UK, EU each have distinct securities regulations |
| Taxation | Property-country withholding tax + investor-country tax obligations; double taxation possible |
| FATCA/CRS | US FATCA and global CRS reporting compliance required |
| Foreign RE investment restrictions | Some jurisdictions restrict foreign investment in real estate (including SPVs) |

### 7.4 Token Legal Classification

- Likely classified as securities in most jurisdictions
- Issuance and trading through Securitize-style regulated channels recommended
- Legal opinion (token classification) mandatory

---

# 8. 스마트 컨트랙트 스펙 / Smart Contract Spec (EN)

---

## 8.1 Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│             Global Real Estate RWA Protocol                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Whitelist    │  │  Token          │  │  Payout         │  │
│  │  Registry     │  │  Contracts      │  │  Module         │  │
│  │              │  │                 │  │                 │  │
│  │  - KYC gate  │  │  - RE-DEV       │  │  - Monthly      │  │
│  │  - AML check │  │  - RE-INC       │  │    rental dist. │  │
│  │  - Investor  │  │  - RE-EQ        │  │  - Quarterly    │  │
│  │    class     │  │  - ERC-1400     │  │    Dev coupon   │  │
│  │  - Transfer  │  │  - Snapshot     │  │  - Final sale   │  │
│  │    restrict  │  │                 │  │    waterfall    │  │
│  └──────┬───────┘  └────────┬────────┘  └────────┬────────┘  │
│         │                   │                     │           │
│  ┌──────┴───────────────────┴─────────────────────┴────────┐  │
│  │              Admin / Governance Module                    │  │
│  │  - Multi-sig property operations                         │  │
│  │  - NAV oracle (from independent appraisal)               │  │
│  │  - Redemption window management                          │  │
│  │  - Emergency pause                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Audit Trail Module                           │  │
│  │  - All distributions logged on-chain                     │  │
│  │  - NAV snapshots per period                              │  │
│  │  - Redemption records                                    │  │
│  │  - Fee deduction transparency                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## 8.2 Whitelist & Transfer Restrictions

```solidity
// Pseudocode — not audited
contract REWhitelistRegistry {
    mapping(address => bool) public isWhitelisted;
    mapping(address => InvestorClass) public investorClass; // ACCREDITED, PROFESSIONAL, etc.
    mapping(address => uint256) public kycExpiry;
    mapping(address => uint256) public lockupExpiry; // per-token-type lock-up

    function canTransfer(address from, address to, bytes32 tokenType) public view returns (bool) {
        return isWhitelisted[from]
            && isWhitelisted[to]
            && block.timestamp >= lockupExpiry[from]
            && block.timestamp < kycExpiry[from]
            && block.timestamp < kycExpiry[to]
            && meetsInvestorClassRequirement(to, tokenType);
    }
}
```

## 8.3 Snapshot Logic for Distributions

```solidity
// Pseudocode
contract REIncomeToken is ERC1400 {
    function snapshot() external onlyAdmin returns (uint256) {
        return _snapshot(); // Captures balances at point-in-time for distribution calc
    }

    // Monthly rental distribution based on snapshot
    function claimRentalDistribution(uint256 snapshotId) external onlyWhitelisted(msg.sender) {
        uint256 balance = balanceOfAt(msg.sender, snapshotId);
        uint256 totalSupply = totalSupplyAt(snapshotId);
        uint256 share = (balance * distributionAmount[snapshotId]) / totalSupply;
        stablecoin.transfer(msg.sender, share);
    }
}
```

## 8.4 Payout Module

- Monthly rental distribution: snapshot → calculate pro-rata → push to claim contracts
- Quarterly Dev Note coupon: fixed amount calculation → claim
- Final sale waterfall: multi-step execution with governance approval
- All distributions logged on-chain with full parameter transparency

## 8.5 Emergency Controls

- **Pause**: Multi-sig freezes all transfers and distributions
- **NAV emergency**: Automatic notification if NAV drops > 20% (oracle-fed)
- **Upgrade**: Proxy pattern, governance vote required

---

# 9. 리스팅 페이지 카피 / Listing Page Copy

---

## (KR) 리스팅 페이지 — 글로벌 부동산

### 헤드라인
**뉴욕·런던 프리미엄 부동산 분할 투자 토큰**

### 서브 헤드라인
Tier-1 글로벌 도시의 부동산에 소액부터 투자하세요. 개발 수익, 임대 수익, 매각 차익 — 세 가지 수익 채널에 선택적으로 참여할 수 있습니다.

### "어떻게 수익을 받나요?" (How Do I Get Paid?)

- **RE-DEV (개발 토큰)**: 건설 기간 동안 분기별 고정 쿠폰(가정: 연 8–12%)을 USDC로 수령합니다. 건설 완료 시 원금이 상환됩니다.
- **RE-INC (임대 수익 토큰)**: 매월 임대 수익에서 비용을 제한 후 USDC로 배분됩니다. 예상 수익률 연 5–8% (가정).
- **RE-EQ (지분 토큰)**: 부동산 매각 시 잔여 차익이 배분됩니다. 가장 높은 잠재 수익과 가장 높은 리스크를 가집니다.

### "어떻게 빠져나갈 수 있나요?" (How Do I Exit?)

- RE-DEV: 만기(18–36개월) 시 자동 상환
- RE-INC: 록업(12개월) 후 분기별 환매 창구 이용 가능 (유동성 한도 내)
- RE-EQ: 부동산 매각 시 배분 (중간 매도는 화이트리스트 이차 시장에서만 가능)
- **중요**: 모든 토큰은 유동성이 제한적이며, 원하는 시기에 매각이 보장되지 않습니다.

### "수수료는 어떻게 되나요?" (What Fees Exist?)

- 취득 수수료: 1.0–2.0% (가정)
- 자산 관리 수수료: 연 1.0–1.5% (가정)
- 매각 수수료: 1.0–2.0% (가정)
- 성과 수수료: 목표 수익률 초과분의 15–20% (가정)
- 플랫폼 수수료: 연 0.5% (가정)

### "무엇이 잘못될 수 있나요?" (What Can Go Wrong?)

- 건설 지연·비용 초과 가능
- 공실이 발생하여 임대 수익이 줄어들 수 있음
- 부동산 가치가 하락할 수 있음
- 유동성이 매우 제한적이며, 투자금 회수가 지연될 수 있음
- 금리 변동, 경기 침체가 부동산 시장에 영향을 줄 수 있음
- 규제 변경으로 투자 구조가 영향받을 수 있음

> **수익은 보장되지 않습니다.** 부동산 투자는 본질적으로 비유동적이며, 원금 손실 가능성이 있습니다.

## (EN) Listing Page — Global Real Estate

### Headline
**NYC & London Premium Real Estate Fractional Investment Tokens**

### Subheadline
Invest in Tier-1 global city real estate from small amounts. Selectively participate in three return channels: development returns, rental income, and sale proceeds.

### "How Do I Get Paid?"

- **RE-DEV (Development Token)**: Receive quarterly fixed coupon (assumption: 8–12% annualized) in USDC during construction. Principal repaid upon completion.
- **RE-INC (Income Token)**: Monthly distribution from rental income after expenses in USDC. Target yield: 5–8% annualized (assumption).
- **RE-EQ (Equity Token)**: Residual sale proceeds distributed upon property sale. Highest potential return and highest risk.

### "How Do I Exit?"

- RE-DEV: Automatic repayment at maturity (18–36 months)
- RE-INC: Quarterly redemption window after 12-month lock-up (within liquidity limits)
- RE-EQ: Distribution upon property sale (interim sale only via whitelisted secondary market)
- **Important**: All tokens have limited liquidity. Sale at your desired timing is not guaranteed.

### "What Fees Exist?"

- Acquisition fee: 1.0–2.0% (assumption)
- Asset management fee: 1.0–1.5% annual (assumption)
- Disposition fee: 1.0–2.0% (assumption)
- Performance fee: 15–20% of excess above target return (assumption)
- Platform fee: 0.5% annual (assumption)

### "What Can Go Wrong?"

- Construction delays and cost overruns
- Vacancy may reduce rental income
- Property value may decline
- Liquidity is very limited; investment recovery may be delayed
- Interest rate changes and economic downturns affect RE markets
- Regulatory changes may impact investment structure

> **Returns are not guaranteed.** Real estate investments are inherently illiquid with potential for principal loss.

---

# 10. 데이터룸 체크리스트 / Data Room Checklist

---

## (KR) 데이터룸 체크리스트

### SPV 및 법인 문서
- [ ] SPV 설립 문서 (정관, 등기부등본)
- [ ] SPV 운영 계약서 / 주주 계약서
- [ ] 투자자 구독 계약서 템플릿
- [ ] 수수료 일람표 (Fee Schedule)

### 부동산 권원 (Title)
- [ ] 부동산 권원 보고서 (Title Report)
- [ ] 소유권 보험 증서 (Title Insurance)
- [ ] 측량 보고서 (Survey)
- [ ] 환경 평가 보고서 (Phase I/II Environmental)
- [ ] 구역 지정 확인서 (Zoning Confirmation)

### 감정 평가 (Appraisal)
- [ ] 독립 감정 평가서 (RICS/MAI 인증)
- [ ] 비교 거래 분석 (Comparable Sales Analysis)
- [ ] Pro forma 재무 모델

### 임대 계약 (Leases)
- [ ] 주요 임차인 리스트 및 임대 계약서 요약
- [ ] 임대료 일람표 (Rent Roll)
- [ ] 임차인 신용 정보 (가용 시)
- [ ] 공실 이력 및 시장 공실률

### 건설 문서 (개발 프로젝트)
- [ ] 건설 계약서 (GC/EPC)
- [ ] 건설 일정 및 예산
- [ ] 건축 허가
- [ ] 독립 엔지니어 보고서

### 보험
- [ ] 건물 보험 증서
- [ ] 배상 책임 보험
- [ ] 건설 올리스크 보험 (개발 시)
- [ ] 타이틀 보험

### 재무
- [ ] 과거 3년 운영 실적 (기존 건물)
- [ ] SPV 재무제표
- [ ] 세무 보고서 / 세무 의견서
- [ ] 운영 예산

### 감사 보고서
- [ ] SPV 감사 재무제표
- [ ] 스마트 컨트랙트 감사 보고서 (제3자)

### 법률
- [ ] 토큰 법적 분류 의견서
- [ ] 규제 적합성 의견서 (미국 Reg D/S, 영국 FCA 등)
- [ ] 세무 의견서 (원천세, 이중 과세 분석)
- [ ] KYC/AML 프로세스 문서

## (EN) Data Room Checklist

### SPV & Corporate Documents
- [ ] SPV incorporation documents (articles, registration)
- [ ] SPV operating agreement / shareholders agreement
- [ ] Investor subscription agreement template
- [ ] Fee schedule

### Title
- [ ] Title report
- [ ] Title insurance policy
- [ ] Survey
- [ ] Environmental assessment (Phase I/II)
- [ ] Zoning confirmation

### Appraisal
- [ ] Independent appraisal report (RICS/MAI certified)
- [ ] Comparable sales analysis
- [ ] Pro forma financial model

### Leases
- [ ] Key tenant list and lease summary
- [ ] Rent roll
- [ ] Tenant credit information (if available)
- [ ] Vacancy history and market vacancy rate

### Construction Documents (Development Projects)
- [ ] Construction contract (GC/EPC)
- [ ] Construction schedule and budget
- [ ] Building permits
- [ ] Independent engineer report

### Insurance
- [ ] Building insurance policy
- [ ] Liability insurance
- [ ] Construction all-risk insurance (for development)
- [ ] Title insurance

### Financial
- [ ] Historical 3-year operating performance (existing buildings)
- [ ] SPV financial statements
- [ ] Tax returns / tax opinion
- [ ] Operating budget

### Audit Reports
- [ ] SPV audited financial statements
- [ ] Smart contract audit report (third-party)

### Legal
- [ ] Token classification legal opinion
- [ ] Regulatory compliance opinion (US Reg D/S, UK FCA, etc.)
- [ ] Tax opinion (withholding tax, double taxation analysis)
- [ ] KYC/AML process documentation

---

> **문서 끝 / End of Document**
> Global Real Estate (NY/London) Development & Fractional Sale — RWA Listing Pack v1.0
> 본 문서의 모든 수치와 구조는 가정에 기반하며, 법률·회계·부동산·세무 전문가의 검토 후 최종 확정되어야 합니다. 부동산 투자는 비유동적이며 원금 손실 가능성이 있습니다.
> All figures and structures are assumption-based and must be finalized after review by legal, accounting, real estate, and tax professionals. Real estate investments are illiquid and carry principal loss risk.
