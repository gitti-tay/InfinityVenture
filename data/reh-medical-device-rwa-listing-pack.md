# re:H Medical Device — RWA Listing Pack v1.0
## 의료기기 실물자산 토큰화 상장 패키지 | Medical Device RWA Listing Pack

---

> **면책 고지 / Disclaimer**
> 본 문서는 법률 자문, 투자 권유, 수익 보장을 구성하지 않습니다. 모든 수치는 가정(assumption)에 기반하며, 실제 결과는 시장 상황·규제·운영 리스크에 따라 상이할 수 있습니다.
>
> This document does not constitute legal advice, an investment solicitation, or a guarantee of returns. All figures are assumption-based and actual results may vary depending on market conditions, regulations, and operational risks.

---

# 1. 두 가지 대안적 RWA 구조 / Two Alternative RWA Structures

---

## 구조 A: 매출채권 풀 (Receivables Pool)
### Structure A: Receivables Pool

**토큰화 대상 / What Is Tokenized:**

(KR) re:H 의료기기의 B2B 판매에서 발생하는 매출채권(Accounts Receivable)을 풀 형태로 집합하여 토큰화합니다. 각 매출채권은 병원·유통사·정부 조달 계약 등에서 발생하는 확정 미수금으로, 납품 완료 후 대금 수령까지의 기간(통상 30~120일)이 존재합니다. 투자자는 이 매출채권 풀에 대한 우선 청구권(Senior) 또는 후순위 청구권(Junior)을 보유합니다.

(EN) Accounts receivable generated from re:H medical device B2B sales are aggregated into a pool and tokenized. Each receivable represents a confirmed amount owed by hospitals, distributors, or government procurement contracts post-delivery, with typical payment terms of 30–120 days. Investors hold either Senior or Junior claims against this receivable pool.

**현금흐름 구조 / How Cashflows Flow:**

(KR)
1. re:H가 의료기기를 B2B 바이어(병원, 유통사)에 납품 → 매출채권 발생
2. 매출채권이 SPV(특수목적법인)에 양도 → SPV가 토큰 발행
3. 바이어가 대금 지급 → SPV 에스크로 계좌로 입금
4. 워터폴 순서에 따라 배분:
   - 1순위: 서비서(Servicer) 수수료 (가정: 매출채권 잔액의 0.5–1.0%)
   - 2순위: Senior 토큰 홀더에게 쿠폰 지급 (가정: 연 8–10%, 월별 지급)
   - 3순위: Junior 토큰 홀더에게 잔여 수익 배분
   - 4순위: 초과 수익은 준비금(Reserve) 적립 후 re:H에 반환

(EN)
1. re:H delivers medical devices to B2B buyers (hospitals, distributors) → receivable generated
2. Receivable assigned to SPV → SPV issues tokens
3. Buyer pays invoice → funds flow to SPV escrow account
4. Waterfall distribution:
   - Priority 1: Servicer fee (assumption: 0.5–1.0% of outstanding receivables)
   - Priority 2: Senior token holders receive coupon (assumption: 8–10% annualized, paid monthly)
   - Priority 3: Junior token holders receive residual income
   - Priority 4: Excess returns accrue to reserve, then returned to re:H

**채무 불이행 처리 / Default Handling:**

(KR)
- 바이어 미지급 60일 초과 시 → 서비서가 추심 절차 개시
- 90일 초과 시 → 해당 매출채권은 "부실채권(NPL)"으로 분류, Junior 토큰에서 우선 손실 흡수
- Senior 토큰 보호 장치: Junior 트랜치가 풀 총액의 15–20%를 구성하여 첫 손실 완충(first-loss buffer) 역할
- 신용보험(Credit Insurance) 가입 가능: 바이어 부도 시 보험 청구로 Senior 추가 보호
- 준비금 적립: 풀 잔액의 3–5%를 상시 유지하여 일시적 연체에 대응

(EN)
- Buyer non-payment exceeding 60 days → Servicer initiates collection procedures
- Exceeding 90 days → Receivable classified as NPL; Junior tranche absorbs losses first
- Senior protection: Junior tranche constitutes 15–20% of total pool as first-loss buffer
- Credit insurance available: Claims filed upon buyer insolvency for additional Senior protection
- Reserve maintained at 3–5% of outstanding pool to cover temporary delinquencies

---

## 구조 B: 리스 현금흐름 (Leasing Cashflow)
### Structure B: Leasing Cashflow

**토큰화 대상 / What Is Tokenized:**

(KR) re:H 의료기기를 병원·클리닉에 직접 판매하는 대신, 장기 리스(24–60개월) 또는 사용량 기반 과금(Pay-Per-Use) 방식으로 배치하고, 여기서 발생하는 예측 가능한 리스료 및 소모품 매출 현금흐름을 토큰화합니다.

(EN) Instead of direct sales, re:H medical devices are placed at hospitals/clinics via long-term leases (24–60 months) or pay-per-use models. The predictable lease payments and consumable revenue streams are tokenized.

**현금흐름 구조 / How Cashflows Flow:**

(KR)
1. re:H가 의료기기를 병원에 리스 배치 → 월간 리스료 발생
2. 소모품(필터, 카트리지, 센서 등) 주기적 공급 → 추가 월간 매출
3. 전체 현금흐름이 SPV로 유입
4. 워터폴:
   - 1순위: 기기 유지보수·보험 비용 (가정: 리스료의 8–12%)
   - 2순위: Senior 토큰 쿠폰 (가정: 연 7–9%, 월별)
   - 3순위: Junior 토큰 참여 수익
   - 4순위: 잔여 현금 → 준비금 + re:H 반환

(EN)
1. re:H places devices at hospitals via lease → monthly lease payments generated
2. Consumables (filters, cartridges, sensors) supplied periodically → additional monthly revenue
3. All cashflows flow into SPV
4. Waterfall:
   - Priority 1: Device maintenance & insurance costs (assumption: 8–12% of lease revenue)
   - Priority 2: Senior token coupon (assumption: 7–9% annualized, monthly)
   - Priority 3: Junior token participation income
   - Priority 4: Residual cash → reserve + re:H return

**채무 불이행 처리 / Default Handling:**

(KR)
- 리스료 미납 60일 초과 → 기기 회수 절차 개시 (re:H가 물리적 자산 보유)
- 회수된 기기는 재배치(re-lease) 또는 중고 매각 → 회수 자금은 워터폴에 따라 배분
- 장점: 물리적 담보(기기 자체)가 존재하여 잔존가치(Residual Value) 회수 가능
- Junior 트랜치가 첫 손실 흡수, Senior 보호
- 기기 감가상각 리스크: 기술 진부화로 잔존가치 하락 가능 (리스크 요소)

(EN)
- Lease non-payment exceeding 60 days → Device repossession initiated (re:H retains physical asset)
- Repossessed devices re-leased or sold on secondary market → recovery funds distributed per waterfall
- Advantage: Physical collateral (device itself) provides residual value recovery
- Junior tranche absorbs first losses, protecting Senior
- Depreciation risk: Technological obsolescence may reduce residual value (risk factor)

---

# 2. 추천 구조 선정 로직 / Recommended Structure Selection Logic

---

(KR)

| 판단 기준 | 구조 A (매출채권 풀) 선택 조건 | 구조 B (리스 현금흐름) 선택 조건 |
|---|---|---|
| 매출 성숙도 | B2B 매출이 이미 반복 발생 중, 다수의 바이어 확보 | 매출 초기 단계, 장기 관계 기반 배치 필요 |
| 현금흐름 예측성 | 바이어 신용등급 높고 결제 이력 확인 가능 | 리스 계약으로 24–60개월 현금흐름 확정 |
| 토큰 만기 | 단기(6–12개월) 선호 투자자 타겟 | 중기(12–36개월) 이상 선호 투자자 타겟 |
| 담보 구조 | 매출채권(무형 자산) + 신용보험 | 물리적 기기(유형 자산) + 잔존가치 |
| 규제 단순성 | 매출채권 양도 법률이 명확한 관할권 | 리스 관련 규제가 명확한 관할권 |
| 스케일링 | 매출 증가에 따라 풀 확대 용이 | 기기 배치 수 증가에 따라 확장 |

**추천 / Recommendation:**

(KR) re:H가 현재 B2B 매출을 활발히 발생시키고 있고, 다수의 바이어(병원/유통사)로부터 반복적 주문이 확인되는 경우 → **구조 A (매출채권 풀)**을 우선 권장합니다. 이유:

1. **단기 텐어 (6–12개월)**: 매출채권 회전 속도가 빨라 투자자에게 빠른 원금 회수 + 수익 제공 가능
2. **검증 용이**: 개별 인보이스·납품 증빙으로 현금흐름을 실시간 검증 가능
3. **Centrifuge 모델과의 정합성**: Centrifuge Tinlake가 정확히 이 모델을 검증, 업계 표준으로 인정

단, re:H가 아직 초기 단계이거나 소수 대형 바이어 의존도가 높은 경우 → **구조 B (리스 현금흐름)**이 더 안전합니다. 물리적 담보가 존재하며, 장기 리스 계약이 현금흐름 안정성을 제공합니다.

(EN)

| Criterion | Choose Structure A (Receivables Pool) | Choose Structure B (Leasing Cashflow) |
|---|---|---|
| Revenue maturity | Active recurring B2B sales, multiple buyers | Early-stage revenue, relationship-based placement needed |
| Cashflow predictability | High buyer credit ratings, verifiable payment history | Lease contracts lock in 24–60 month cashflows |
| Token tenor | Short-term (6–12m) investor target | Medium-term (12–36m) investor target |
| Collateral structure | Receivables (intangible) + credit insurance | Physical devices (tangible) + residual value |
| Regulatory simplicity | Jurisdictions with clear receivables assignment law | Jurisdictions with clear leasing regulations |
| Scaling | Pool expands with revenue growth | Scales with device deployment count |

**Recommendation:**

If re:H currently generates active B2B sales with recurring orders from multiple buyers (hospitals/distributors) → **Structure A (Receivables Pool)** is recommended. Reasons:

1. **Short tenor (6–12 months)**: Fast receivable turnover enables quick principal recovery + returns for investors
2. **Easy verification**: Individual invoices and delivery proofs allow real-time cashflow verification
3. **Centrifuge alignment**: Centrifuge Tinlake validated exactly this model; recognized as industry standard

However, if re:H is early-stage or highly dependent on few large buyers → **Structure B (Leasing Cashflow)** is safer. Physical collateral exists, and long-term lease contracts provide cashflow stability.

---

# 3. 텀시트 / Term Sheet

---

## (KR) 텀시트 — 구조 A 기반 (매출채권 풀)

| 항목 | 내용 |
|---|---|
| **발행자 / Issuer** | re:H Medical Device SPV Ltd. (가칭) |
| **토큰 유형** | Senior 수익권 토큰 / Junior 수익권 토큰 |
| **기초 자산** | re:H 의료기기 B2B 매출채권 풀 |
| **소프트캡** | USD 500,000 (가정) |
| **하드캡** | USD 5,000,000 (가정) |
| **최소 투자금** | USD 1,000 (가정) |
| **토큰 만기** | 6–12개월 (리볼빙 풀 구조, 만기 시 원금 상환 또는 연장 선택) |
| **쿠폰 / 수익률** | Senior: 연 8–10% (가정, 월별 지급) / Junior: 잔여 수익 참여 |
| **지급 주기** | 월간 (매월 말 기준, 익월 10일 이내 배분) |
| **트랜치 비율** | Senior 80–85% / Junior 15–20% (가정) |
| **첫 손실 완충** | Junior 트랜치가 풀 손실의 첫 15–20% 흡수 |
| **준비금** | 풀 잔액의 3–5% 상시 유지 |
| **결제 통화** | USDC 또는 USDT (스테이블코인) |
| **화이트리스트** | KYC/AML 완료 투자자만 토큰 보유·이전 가능 |
| **보고** | 월간: AR 에이징, 수금률, 준비금 수준 / 분기: 감사보고서 |
| **조기 상환** | 차입자(바이어) 조기 지급 시 → 투자자에게 원금 조기 반환 가능 |
| **해지 사유** | 수금률 70% 미만 2개월 연속 시 풀 청산 트리거 발동 |

## (EN) Term Sheet — Structure A Based (Receivables Pool)

| Item | Details |
|---|---|
| **Issuer** | re:H Medical Device SPV Ltd. (working title) |
| **Token type** | Senior Income Token / Junior Income Token |
| **Underlying asset** | re:H medical device B2B receivables pool |
| **Soft cap** | USD 500,000 (assumption) |
| **Hard cap** | USD 5,000,000 (assumption) |
| **Min ticket** | USD 1,000 (assumption) |
| **Tenor** | 6–12 months (revolving pool; at maturity: redemption or rollover) |
| **Coupon / yield** | Senior: 8–10% annualized (assumption, monthly) / Junior: residual participation |
| **Payout cadence** | Monthly (based on month-end, distributed within 10 days of following month) |
| **Tranche split** | Senior 80–85% / Junior 15–20% (assumption) |
| **First-loss buffer** | Junior tranche absorbs first 15–20% of pool losses |
| **Reserve** | 3–5% of outstanding pool maintained at all times |
| **Settlement currency** | USDC or USDT (stablecoin) |
| **Whitelist** | Only KYC/AML-verified investors may hold or transfer tokens |
| **Reporting** | Monthly: AR aging, collection rate, reserve levels / Quarterly: audit report |
| **Early redemption** | Buyer early payment → possible early principal return to investors |
| **Termination trigger** | Collection rate below 70% for 2 consecutive months triggers pool liquidation |

## (EN) YAML Term Sheet

```yaml
term_sheet:
  project_name: "re:H Medical Device"
  structure: "Receivables Pool (Structure A)"
  issuer: "re:H Medical Device SPV Ltd."
  token_types:
    senior:
      name: "reH-SR"
      description: "Senior Income Token — priority receivables claim"
      target_coupon_annualized: "8–10%"  # assumption
      payout_cadence: "monthly"
      first_loss_protection: "Junior tranche (15–20% of pool)"
    junior:
      name: "reH-JR"
      description: "Junior Income Token — residual income + first-loss"
      target_return: "variable, residual after Senior coupon"
      payout_cadence: "monthly"
  underlying_asset: "B2B medical device accounts receivable"
  soft_cap_usd: 500000  # assumption
  hard_cap_usd: 5000000  # assumption
  min_ticket_usd: 1000  # assumption
  tenor_months: "6–12 (revolving, rollover optional)"
  tranche_split:
    senior_pct: "80–85%"  # assumption
    junior_pct: "15–20%"  # assumption
  reserve_pct: "3–5% of outstanding pool"  # assumption
  settlement_currency: "USDC or USDT"
  whitelist_required: true
  kyc_aml_required: true
  reporting:
    monthly: ["AR aging report", "collection rate", "reserve level", "new receivables added"]
    quarterly: ["audited financials", "pool performance summary"]
  early_redemption: "Allowed upon buyer early payment"
  termination_triggers:
    - "Collection rate < 70% for 2 consecutive months"
    - "Issuer insolvency event"
    - "Regulatory prohibition"
  governance:
    investor_vote_threshold: "66% of token-weighted vote for material changes"
  legal_disclaimer: "All figures are assumptions. Not a guarantee of returns."
```

---

# 4. 지급 워터폴 및 예시 타임라인 / Payout Waterfall & Example Timeline

---

## (KR) 지급 워터폴

**월간 배분 순서:**

| 순위 | 항목 | 설명 |
|---|---|---|
| 1 | 서비서 수수료 | 풀 관리·추심 비용 (가정: 월 잔액의 0.08%) |
| 2 | 준비금 보충 | 준비금이 목표 수준(3–5%) 미달 시 보충 |
| 3 | Senior 쿠폰 지급 | 연 8–10% 기준 월별 배분 (가정) |
| 4 | Junior 수익 배분 | Senior 이후 잔여 현금 배분 |
| 5 | 초과 수익 | 준비금 한도 초과분 → re:H로 반환 |

**예시 타임라인 (가정: 풀 규모 USD 2,000,000, Senior 80%, Junior 20%):**

| 월 | 수금액 (가정) | 서비서 수수료 | 준비금 보충 | Senior 배분 | Junior 배분 | 초과 수익 |
|---|---|---|---|---|---|---|
| M1 | $180,000 | $1,600 | $10,000 | $13,333 | $5,067 | $150,000 |
| M2 | $190,000 | $1,600 | $0 | $13,333 | $5,067 | $170,000 |
| M3 | $175,000 | $1,600 | $0 | $13,333 | $5,067 | $155,000 |
| M6 | $200,000 | $1,600 | $0 | $13,333 | $5,067 | $180,000 |
| M12 | $210,000 | $1,600 | $0 | $13,333 | $5,067 | $190,000 |

> **주의**: 상기 수금액은 전적으로 가정치입니다. 실제 수금액은 바이어 결제 패턴, 시장 상황에 따라 변동됩니다.

## (EN) Payout Waterfall

**Monthly Distribution Order:**

| Priority | Item | Description |
|---|---|---|
| 1 | Servicer fee | Pool management & collection costs (assumption: 0.08% of monthly balance) |
| 2 | Reserve replenishment | Top up if reserve falls below target (3–5%) |
| 3 | Senior coupon | 8–10% annualized, distributed monthly (assumption) |
| 4 | Junior distribution | Residual cash after Senior coupon |
| 5 | Excess returns | Above reserve cap → returned to re:H |

**Example Timeline (Assumption: Pool size USD 2,000,000, Senior 80%, Junior 20%):**

| Month | Collections (assumption) | Servicer Fee | Reserve Top-up | Senior Distribution | Junior Distribution | Excess |
|---|---|---|---|---|---|---|
| M1 | $180,000 | $1,600 | $10,000 | $13,333 | $5,067 | $150,000 |
| M2 | $190,000 | $1,600 | $0 | $13,333 | $5,067 | $170,000 |
| M3 | $175,000 | $1,600 | $0 | $13,333 | $5,067 | $155,000 |
| M6 | $200,000 | $1,600 | $0 | $13,333 | $5,067 | $180,000 |
| M12 | $210,000 | $1,600 | $0 | $13,333 | $5,067 | $190,000 |

> **Note**: All collection amounts are purely assumptions. Actual collections vary based on buyer payment patterns and market conditions.

---

# 5. 신용 및 거래상대방 리스크 프레임워크 / Credit & Counterparty Risk Framework

---

## (KR) 신용 및 거래상대방 리스크

### 5.1 바이어 집중도 리스크 (Buyer Concentration)

| 리스크 요소 | 설명 | 완화 방안 |
|---|---|---|
| 단일 바이어 의존 | 상위 1개 바이어가 풀의 30%+ 차지 시 위험 | 단일 바이어 한도: 풀 총액의 25% 이하로 제한 (가정) |
| 산업 집중 | 특정 병원 체인·유통사 의존 | 최소 3개 이상 독립 바이어로 분산 권장 |
| 지역 집중 | 단일 국가/지역 의존 | 다국가 바이어 믹스 목표 (가정) |

### 5.2 결제 조건 및 연체 관리

| 항목 | 기준 |
|---|---|
| 표준 결제 조건 | 납품 후 30–90일 (가정) |
| 연체 경고 | 30일 초과 → 서비서가 바이어에 독촉 |
| 부실 분류 | 90일 초과 → NPL 분류, Junior에서 손실 인식 |
| 추심 절차 | 120일 초과 → 법적 추심 또는 채권추심 에이전시 위탁 |

### 5.3 보험 및 보호 장치

- **신용보험 (Credit Insurance)**: 주요 바이어 부도 시 매출채권의 80–90% 보전 (가정: 보험료 연 풀 잔액의 0.3–0.7%)
- **Purchase Order 확인**: PO(발주서)가 확인된 채권만 풀에 편입
- **납품 증빙 필수**: 선하증권(B/L), 수령 확인서 없는 채권은 풀 편입 불가
- **준비금**: 풀 잔액의 3–5% 상시 유지

### 5.4 상환 청구권 (Recourse)

- **제한적 상환 청구권 (Limited Recourse)**: re:H가 매출채권의 진정 양도(True Sale)를 수행하되, 품질 하자로 인한 바이어 반품/클레임 발생 시 re:H가 해당 채권 교체 의무 부담
- **비상환 청구권 (Non-Recourse)**: 바이어 부도에 대해서는 SPV 및 투자자가 리스크 부담 (Junior 트랜치가 완충)

## (EN) Credit & Counterparty Risk Framework

### 5.1 Buyer Concentration Risk

| Risk Factor | Description | Mitigation |
|---|---|---|
| Single buyer dependency | Risk if top 1 buyer > 30% of pool | Single buyer limit: max 25% of total pool (assumption) |
| Industry concentration | Dependency on specific hospital chains/distributors | Minimum 3 independent buyers recommended |
| Geographic concentration | Single country/region dependency | Multi-country buyer mix target (assumption) |

### 5.2 Payment Terms & Delinquency Management

| Item | Standard |
|---|---|
| Standard payment terms | 30–90 days post-delivery (assumption) |
| Delinquency warning | 30+ days → Servicer sends buyer reminder |
| NPL classification | 90+ days → NPL classification, loss recognized in Junior |
| Collection procedure | 120+ days → Legal collection or agency referral |

### 5.3 Insurance & Protections

- **Credit insurance**: Covers 80–90% of receivable upon major buyer insolvency (assumption: premium 0.3–0.7% of pool balance annually)
- **PO confirmation**: Only receivables backed by confirmed purchase orders enter the pool
- **Delivery proof required**: No receivable enters pool without B/L, delivery receipt
- **Reserve**: 3–5% of pool balance maintained at all times

### 5.4 Recourse Options

- **Limited recourse**: re:H performs true sale of receivables but retains obligation to replace receivables returned due to quality defects
- **Non-recourse**: Buyer insolvency risk borne by SPV and investors (Junior tranche acts as buffer)

---

# 6. 컴플라이언스 및 의료기기 리스크 공시 / Compliance & Medical Risk Disclosure

---

> **면책 고지**: 본 섹션은 법률 자문이 아닙니다. 모든 규제 사항은 해당 관할권 전문 법률 자문을 받으시기 바랍니다.
> **Disclaimer**: This section does not constitute legal advice. Consult jurisdiction-specific legal counsel for all regulatory matters.

## (KR) 컴플라이언스 및 의료기기 리스크

### 6.1 제품 인허가 (Product Approvals)

| 항목 | 설명 |
|---|---|
| 의료기기 등급 | 해당 기기의 규제 등급 확인 필수 (Class I/II/III) |
| 인허가 현황 | FDA 510(k), CE 마킹, 또는 해당국 인허가 보유 여부 확인 |
| 인허가 갱신 | 인허가 만료일 관리, 갱신 실패 시 매출 중단 리스크 |
| 임상 데이터 | 필요 시 임상시험 결과·문헌 데이터 제공 |

### 6.2 제품 보증 및 리콜 리스크

- **보증 책임 (Warranty Liability)**: 납품 후 기기 결함으로 인한 보증 수리/교체 비용은 re:H 부담
- **리콜 리스크**: 안전성 문제 발생 시 대규모 리콜 가능 → 매출채권 수금 중단 위험
- **리콜 준비금**: 풀의 별도 리콜 준비금 설정 권장 (가정: 풀 잔액의 1–2%)
- **제조물 책임 보험 (Product Liability Insurance)**: 필수 가입 권장

### 6.3 유통 계약 리스크

- 독점 유통 계약 종료 시 매출 단절 위험
- 유통사 부도 시 재고·매출채권 회수 복잡성
- 교차 담보(Cross-collateralization) 여부 확인

### 6.4 투자자 자격 (Investor Eligibility)

- KYC/AML 완료 필수
- 관할권별 적격 투자자(Accredited/Qualified Investor) 기준 충족 필요 가능
- 증권형 토큰 해당 시 해당국 증권법 준수 필요

## (EN) Compliance & Medical Risk Disclosure

### 6.1 Product Approvals

| Item | Description |
|---|---|
| Device classification | Confirm regulatory classification (Class I/II/III) |
| Approval status | Verify FDA 510(k), CE marking, or local regulatory approval |
| Approval renewal | Manage expiry dates; renewal failure = revenue halt risk |
| Clinical data | Provide clinical trial results/literature data where required |

### 6.2 Warranty & Recall Risk

- **Warranty liability**: Post-delivery defect repair/replacement costs borne by re:H
- **Recall risk**: Safety issues may trigger large-scale recall → receivable collection halt risk
- **Recall reserve**: Separate recall reserve recommended (assumption: 1–2% of pool balance)
- **Product liability insurance**: Strongly recommended

### 6.3 Distributor Contract Risk

- Exclusive distribution contract termination may halt revenue
- Distributor insolvency complicates inventory/receivable recovery
- Verify cross-collateralization provisions

### 6.4 Investor Eligibility

- KYC/AML completion mandatory
- May require accredited/qualified investor status per jurisdiction
- Securities token classification requires compliance with applicable securities laws

---

# 7. 리포팅 스펙 / Reporting Spec

---

## (KR) 리포팅 사양

### 7.1 월간 보고 항목

| 보고 항목 | 설명 | 형식 |
|---|---|---|
| AR 에이징 리포트 | 매출채권 연령 분석 (0–30일, 31–60일, 61–90일, 90일+) | 표 형식 |
| 인보이스 목록 | 신규 발행 인보이스 및 수금 완료 인보이스 | CSV/PDF |
| 선적 증빙 | 납품 완료 증빙 (B/L, 수령 확인서) | PDF |
| 수금 성과 | 당월 수금률, 누적 수금률, NPL 비율 | 대시보드 |
| 준비금 수준 | 현재 준비금 잔액 vs 목표 수준 | 수치 |
| 바이어 집중도 | 상위 5개 바이어 비중 | 파이 차트 |

### 7.2 분기 보고 항목

| 보고 항목 | 설명 |
|---|---|
| 감사보고서 | 독립 감사인의 SPV 재무제표 감사 |
| 풀 성과 요약 | 분기 수금률, 손실률, 수익률 실적 |
| 바이어 신용 업데이트 | 주요 바이어 신용등급 변동 사항 |
| 준비금 적정성 | 준비금 목표 대비 실적 분석 |

### 7.3 이벤트 기반 보고

- NPL 발생 시 → 즉시 공시 (24시간 이내)
- 리콜·안전성 이슈 발생 시 → 즉시 공시
- 주요 바이어 부도/계약 해지 시 → 즉시 공시

## (EN) Reporting Specification

### 7.1 Monthly Reports

| Report Item | Description | Format |
|---|---|---|
| AR aging report | Receivable age analysis (0–30d, 31–60d, 61–90d, 90d+) | Table |
| Invoice list | Newly issued invoices and collected invoices | CSV/PDF |
| Shipment proof | Delivery completion evidence (B/L, delivery receipt) | PDF |
| Collection performance | Monthly collection rate, cumulative rate, NPL ratio | Dashboard |
| Reserve level | Current reserve balance vs target | Numeric |
| Buyer concentration | Top 5 buyer proportion | Pie chart |

### 7.2 Quarterly Reports

| Report Item | Description |
|---|---|
| Audit report | Independent auditor review of SPV financials |
| Pool performance summary | Quarterly collection rate, loss rate, yield performance |
| Buyer credit update | Credit rating changes for major buyers |
| Reserve adequacy | Reserve target vs actual analysis |

### 7.3 Event-Based Reporting

- NPL occurrence → immediate disclosure (within 24 hours)
- Recall/safety issue → immediate disclosure
- Major buyer insolvency/contract termination → immediate disclosure

---

# 8. 스마트 컨트랙트 스펙 / Smart Contract Spec (EN)

---

## 8.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   re:H RWA Protocol                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Whitelist    │  │  Token       │  │  Payout      │  │
│  │  Registry     │  │  Contracts   │  │  Module      │  │
│  │              │  │              │  │              │  │
│  │  - KYC gate  │  │  - reH-SR    │  │  - Waterfall │  │
│  │  - AML check │  │  - reH-JR    │  │  - Escrow    │  │
│  │  - Transfer  │  │  - ERC-1400  │  │  - Monthly   │  │
│  │    restrict  │  │    compliant │  │    dist.     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │          │
│  ┌──────┴─────────────────┴─────────────────┴───────┐  │
│  │              Admin / Governance Module             │  │
│  │  - Pool parameter updates (multi-sig)             │  │
│  │  - Emergency pause                                │  │
│  │  - Oracle data feed (off-chain AR data)           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Audit Trail Module                    │  │
│  │  - All distributions logged on-chain              │  │
│  │  - Invoice hash anchoring                         │  │
│  │  - Reserve level snapshots                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 8.2 Whitelist Registry

```solidity
// SPDX-License-Identifier: MIT
// Pseudocode — not audited, for specification purposes only

contract WhitelistRegistry {
    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public kycExpiry;

    address public complianceAdmin; // multi-sig

    modifier onlyWhitelisted(address _addr) {
        require(isWhitelisted[_addr] && block.timestamp < kycExpiry[_addr], "Not whitelisted or KYC expired");
        _;
    }

    function addToWhitelist(address _investor, uint256 _expiry) external onlyComplianceAdmin {
        isWhitelisted[_investor] = true;
        kycExpiry[_investor] = _expiry;
        emit InvestorWhitelisted(_investor, _expiry);
    }

    function removeFromWhitelist(address _investor) external onlyComplianceAdmin {
        isWhitelisted[_investor] = false;
        emit InvestorRemoved(_investor);
    }
}
```

**Key Rules:**
- Token transfers revert if sender OR receiver is not whitelisted
- KYC expiry enforced; expired investors cannot send or receive tokens
- Compliance admin is a multi-sig wallet (2-of-3 minimum recommended)

## 8.3 Token Contracts (ERC-1400 Compatible)

```solidity
// Pseudocode
contract ReHSeniorToken is ERC1400 {
    WhitelistRegistry public whitelist;

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        require(whitelist.isWhitelisted(from) || from == address(0), "Sender not whitelisted");
        require(whitelist.isWhitelisted(to) || to == address(0), "Receiver not whitelisted");
    }

    // Snapshot for monthly distribution calculation
    function snapshot() external onlyAdmin returns (uint256 snapshotId) {
        return _snapshot();
    }
}
```

**Features:**
- ERC-1400 for security token compliance (partitioned balances, document management)
- Snapshot mechanism for accurate monthly distribution calculation
- Transfer restrictions enforced at contract level

## 8.4 Payout Module

```solidity
// Pseudocode
contract PayoutModule {
    IERC20 public stablecoin; // USDC
    ReHSeniorToken public seniorToken;
    ReHJuniorToken public juniorToken;

    struct Distribution {
        uint256 snapshotId;
        uint256 totalCollected;
        uint256 servicerFee;
        uint256 reserveTopUp;
        uint256 seniorPayout;
        uint256 juniorPayout;
        uint256 timestamp;
    }

    Distribution[] public distributions;

    function executeMonthlyDistribution(
        uint256 _totalCollected,
        uint256 _servicerFee,
        uint256 _reserveTopUp
    ) external onlyAdmin {
        uint256 snapshotId = seniorToken.snapshot();

        uint256 seniorPayout = calculateSeniorCoupon();
        uint256 remaining = _totalCollected - _servicerFee - _reserveTopUp - seniorPayout;
        uint256 juniorPayout = remaining > 0 ? remaining : 0;

        // Transfer to claim contracts
        stablecoin.transfer(seniorClaimContract, seniorPayout);
        stablecoin.transfer(juniorClaimContract, juniorPayout);

        distributions.push(Distribution({
            snapshotId: snapshotId,
            totalCollected: _totalCollected,
            servicerFee: _servicerFee,
            reserveTopUp: _reserveTopUp,
            seniorPayout: seniorPayout,
            juniorPayout: juniorPayout,
            timestamp: block.timestamp
        }));

        emit DistributionExecuted(snapshotId, seniorPayout, juniorPayout);
    }

    // Investors claim their share based on snapshot balance
    function claim(uint256 _distributionId) external onlyWhitelisted(msg.sender) {
        // Calculate pro-rata share based on snapshot balance
        // Transfer stablecoin to investor
    }
}
```

## 8.5 Audit Trail

- Every distribution is recorded on-chain with full parameter details
- Invoice hashes (SHA-256) anchored on-chain for tamper-proof verification
- Reserve level snapshots stored per distribution cycle
- All admin actions (whitelist changes, parameter updates) emit events for transparency

## 8.6 Emergency Controls

- **Pause mechanism**: Multi-sig can pause all transfers and distributions in emergency
- **Liquidation trigger**: Automated trigger if collection rate < 70% for 2 consecutive months (Oracle-fed)
- **Upgrade pattern**: Proxy contract pattern for future upgrades (requires governance vote)

---

# 9. 리스팅 페이지 카피 / Listing Page Copy

---

## (KR) 리스팅 페이지 — re:H Medical Device

### 헤드라인
**re:H 의료기기 매출채권 수익 토큰**

### 서브 헤드라인
검증된 B2B 의료기기 매출에서 발생하는 안정적 현금흐름에 투자하세요.

### "어떻게 수익을 받나요?" (How Do I Get Paid?)

re:H가 병원과 의료 유통사에 의료기기를 납품하면, 바이어는 30~90일 내에 대금을 지급합니다. 이 매출채권이 SPV(특수목적법인)에 모이면, 매월 수금된 금액에서 운영 비용과 준비금을 제한 후, 투자자에게 스테이블코인(USDC)으로 수익이 배분됩니다.

- **Senior 토큰 보유자**: 매월 우선적으로 쿠폰(가정: 연 8–10%)을 수령합니다.
- **Junior 토큰 보유자**: Senior 배분 후 잔여 수익을 수령하며, 풀 손실 발생 시 먼저 손실을 흡수합니다.

### "리스크는 무엇인가요?" (What Can Go Wrong?)

- 바이어가 대금을 지급하지 않을 수 있습니다 (연체·부도 리스크)
- 의료기기 리콜 발생 시 매출이 중단될 수 있습니다
- 규제 변경으로 인허가가 영향받을 수 있습니다
- Junior 트랜치는 첫 번째로 손실을 흡수합니다

> 수익이 보장되지 않습니다. 투자 전 리스크를 충분히 이해하시기 바랍니다.

### 핵심 수치 (가정)

| 항목 | 수치 |
|---|---|
| 목표 수익률 (Senior) | 연 8–10% (가정) |
| 지급 주기 | 월간 |
| 토큰 만기 | 6–12개월 |
| 최소 투자금 | USD 1,000 (가정) |
| 결제 통화 | USDC |

## (EN) Listing Page — re:H Medical Device

### Headline
**re:H Medical Device Receivables Income Token**

### Subheadline
Invest in stable cashflows from verified B2B medical device sales.

### "How Do I Get Paid?"

When re:H delivers medical devices to hospitals and medical distributors, buyers pay within 30–90 days. These receivables are pooled in an SPV. Each month, after deducting operating costs and reserves from collected funds, returns are distributed to investors in stablecoin (USDC).

- **Senior token holders**: Receive priority monthly coupon (assumption: 8–10% annualized).
- **Junior token holders**: Receive residual income after Senior distribution; absorb pool losses first.

### "What Can Go Wrong?"

- Buyers may fail to pay (delinquency/default risk)
- Device recalls may halt revenue
- Regulatory changes may affect product approvals
- Junior tranche absorbs losses first

> Returns are not guaranteed. Please fully understand the risks before investing.

### Key Figures (Assumptions)

| Item | Figure |
|---|---|
| Target yield (Senior) | 8–10% annualized (assumption) |
| Payout cadence | Monthly |
| Token tenor | 6–12 months |
| Min investment | USD 1,000 (assumption) |
| Settlement currency | USDC |

---

# 10. 데이터룸 체크리스트 / Data Room Checklist

---

## (KR) 데이터룸 체크리스트

### 법인 및 구조
- [ ] SPV 설립 문서 (정관, 법인 등기부등본)
- [ ] SPV 운영 계약서
- [ ] re:H ↔ SPV 간 매출채권 양도 계약서 (True Sale Agreement)
- [ ] 서비서 계약서 (Servicing Agreement)
- [ ] 투자자 구독 계약서 (Subscription Agreement) 템플릿

### 의료기기 인허가
- [ ] FDA 510(k) 승인서 또는 동등 인허가 문서
- [ ] CE 마킹 인증서 (해당 시)
- [ ] 해당국 의료기기 등록 증명
- [ ] 임상 데이터 / 성능 시험 결과
- [ ] 제조물 책임 보험 증서

### 매출 및 채권
- [ ] 최근 12개월 매출 실적 (감사 또는 경영진 확인)
- [ ] 주요 바이어 목록 및 계약서 (기밀 처리)
- [ ] 샘플 인보이스 및 발주서 (PO)
- [ ] AR 에이징 리포트 (최근 6개월)
- [ ] 역사적 수금률 데이터
- [ ] 신용보험 증서 (가입 시)

### 재무
- [ ] re:H 최근 2년 재무제표 (감사보고서 포함)
- [ ] SPV 재무제표
- [ ] 운영 예산 및 현금흐름 전망
- [ ] 준비금 정책 문서

### 기술 및 운영
- [ ] 스마트 컨트랙트 감사 보고서 (제3자)
- [ ] 토큰 발행 플랫폼 기술 문서
- [ ] KYC/AML 프로세스 문서
- [ ] 데이터 보안 및 개인정보보호 정책

### 법률 의견서
- [ ] 토큰의 법적 성격에 대한 법률 의견서 (해당 관할권)
- [ ] 매출채권 진정 양도(True Sale) 법률 의견서
- [ ] 규제 적합성 의견서

## (EN) Data Room Checklist

### Corporate & Structure
- [ ] SPV incorporation documents (articles, registration)
- [ ] SPV operating agreement
- [ ] re:H ↔ SPV receivables assignment agreement (True Sale Agreement)
- [ ] Servicing agreement
- [ ] Investor subscription agreement template

### Medical Device Approvals
- [ ] FDA 510(k) clearance letter or equivalent regulatory approval
- [ ] CE marking certificate (if applicable)
- [ ] Local medical device registration certificate
- [ ] Clinical data / performance test results
- [ ] Product liability insurance certificate

### Sales & Receivables
- [ ] Last 12 months sales performance (audited or management-certified)
- [ ] Key buyer list and contracts (under NDA)
- [ ] Sample invoices and purchase orders (PO)
- [ ] AR aging report (last 6 months)
- [ ] Historical collection rate data
- [ ] Credit insurance certificate (if applicable)

### Financial
- [ ] re:H audited financial statements (last 2 years)
- [ ] SPV financial statements
- [ ] Operating budget and cashflow projections
- [ ] Reserve policy document

### Technical & Operational
- [ ] Smart contract audit report (third-party)
- [ ] Token issuance platform technical documentation
- [ ] KYC/AML process documentation
- [ ] Data security and privacy policy

### Legal Opinions
- [ ] Legal opinion on token classification (applicable jurisdiction)
- [ ] True sale legal opinion for receivables assignment
- [ ] Regulatory compliance opinion

---

> **문서 끝 / End of Document**
> re:H Medical Device RWA Listing Pack v1.0
> 본 문서의 모든 수치와 구조는 가정에 기반하며, 법률·회계·규제 전문가의 검토 후 최종 확정되어야 합니다.
> All figures and structures in this document are assumption-based and must be finalized after review by legal, accounting, and regulatory professionals.
