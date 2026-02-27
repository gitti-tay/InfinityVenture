# Zero Emission — Waste Recycle RWA Listing Pack v1.0
## 제로 에미션 폐기물 재활용 그린 프로젝트 파이낸스 토큰화 상장 패키지

---

> **면책 고지 / Disclaimer**
> 본 문서는 법률 자문, 투자 권유, 수익 보장을 구성하지 않습니다. 모든 수치는 가정(assumption)에 기반하며, 실제 결과는 인허가·건설·운영·시장 상황에 따라 상이할 수 있습니다. ESG 성과는 독립 검증 없이 보장되지 않습니다.
>
> This document does not constitute legal advice, an investment solicitation, or a guarantee of returns. All figures are assumption-based. Actual results may vary based on permitting, construction, operations, and market conditions. ESG outcomes are not guaranteed without independent verification.

---

# 1. 자금 조달 메카닉스 / Fundraising Mechanics

---

## (KR) 자금 조달 메카닉스

### 1.1 에스크로 구조

| 항목 | 내용 |
|---|---|
| **에스크로 방식** | 모든 투자 자금은 독립 에스크로 계좌(또는 스마트 컨트랙트 에스크로 볼트)에 예치 |
| **에스크로 관리자** | 독립 수탁 기관 또는 다중 서명(Multi-sig) 스마트 컨트랙트 |
| **자금 잠금** | 소프트캡 달성 전까지 모든 자금 잠금, 프로젝트 측 인출 불가 |
| **투명성** | 에스크로 잔액 실시간 대시보드 공개 |

### 1.2 소프트캡 / 하드캡

| 항목 | 금액 | 설명 |
|---|---|---|
| **소프트캡 (최소 모금액)** | USD 5,000,000 | 프로젝트 착수 최소 금액. 미달성 시 전액 환불 |
| **하드캡 (최대 모금액)** | USD 25,000,000 (가정) | 최대 모금 한도. 초과 시 추가 모금 중단 |

### 1.3 환불 규칙 (소프트캡 미달성 시)

> **"$5M이 모이지 않으면 어떻게 되나요?"**
> 모금 기간 종료 시 USD 5,000,000에 도달하지 못하면, 에스크로에 예치된 모든 자금은 투자자에게 **전액 자동 환불**됩니다. 프로젝트는 시작되지 않으며, 투자자에게 수수료가 부과되지 않습니다.

- 환불 시점: 모금 기간 종료 후 7영업일 이내 (가정)
- 환불 통화: 원래 투자 통화(USDC)로 반환
- 스마트 컨트랙트 자동 환불: 소프트캡 미달 시 `refund()` 함수 자동 실행

### 1.4 마일스톤 기반 자금 집행 (Milestone-Based Release)

소프트캡 달성 후에도 전체 자금이 일시에 프로젝트에 지급되지 않습니다. 사전 정의된 마일스톤 달성 시에만 단계별로 자금이 집행됩니다.

| 마일스톤 | 달성 조건 | 집행 금액 비율 (가정) |
|---|---|---|
| **M1: 인허가 완료** | 모든 환경·건설·운영 인허가 취득 확인 | 15% |
| **M2: EPC 계약 체결** | EPC(설계·조달·시공) 계약 서명 완료 | 20% |
| **M3: 건설 착공** | 현장 착공 확인 (독립 엔지니어 확인) | 20% |
| **M4: 건설 50% 완료** | 독립 엔지니어의 50% 완공 인증 | 20% |
| **M5: 시운전(Commissioning)** | 플랜트 시운전 완료 및 성능 테스트 통과 | 15% |
| **M6: 상업 운전 개시(COD)** | 상업 운전 개시 및 첫 수익 발생 확인 | 10% |

- 마일스톤 검증: 독립 엔지니어 + 다중 서명 승인
- 미달성 시: 잔여 에스크로 자금은 투자자에게 비례 환불 또는 거버넌스 투표로 결정

## (EN) Fundraising Mechanics

### 1.1 Escrow Structure

| Item | Details |
|---|---|
| **Escrow method** | All investment funds deposited in independent escrow account (or smart contract escrow vault) |
| **Escrow manager** | Independent custodian or multi-sig smart contract |
| **Fund lock** | All funds locked until soft cap reached; project cannot withdraw |
| **Transparency** | Real-time escrow balance dashboard publicly available |

### 1.2 Soft Cap / Hard Cap

| Item | Amount | Description |
|---|---|---|
| **Soft cap (minimum raise)** | USD 5,000,000 | Minimum to start project. Full refund if not reached |
| **Hard cap (maximum raise)** | USD 25,000,000 (assumption) | Maximum fundraise limit |

### 1.3 Refund Rules (If Soft Cap Not Met)

> **"If $5M is not reached, what happens?"**
> If the fundraising period ends without reaching USD 5,000,000, all funds in escrow are **automatically refunded in full** to investors. The project does not start, and no fees are charged to investors.

- Refund timing: Within 7 business days of fundraise period end (assumption)
- Refund currency: Returned in original investment currency (USDC)
- Smart contract auto-refund: `refund()` function executes automatically if soft cap not met

### 1.4 Milestone-Based Fund Release

Even after soft cap is reached, funds are NOT released to the project all at once. Funds are disbursed in stages only upon achievement of pre-defined milestones.

| Milestone | Achievement Criteria | Release % (assumption) |
|---|---|---|
| **M1: Permits complete** | All environmental, construction, and operating permits confirmed | 15% |
| **M2: EPC contract signed** | EPC (Engineering, Procurement, Construction) contract execution | 20% |
| **M3: Construction start** | Site construction commencement (independent engineer verification) | 20% |
| **M4: 50% construction** | Independent engineer 50% completion certification | 20% |
| **M5: Commissioning** | Plant commissioning complete and performance test passed | 15% |
| **M6: COD** | Commercial Operation Date and first revenue confirmed | 10% |

- Milestone verification: Independent engineer + multi-sig approval
- If not achieved: Remaining escrow funds refunded pro-rata to investors or determined by governance vote

---

# 2. 자본 구조 설계 / Capital Stack Design

---

## (KR) 자본 구조

### 2.1 3-Layer 자본 구조

| 트랜치 | 이름 | 비율 (가정) | 설명 |
|---|---|---|---|
| **Tier 1** | Pioneer Senior (첫 $5M) | 소프트캡 금액 | 최초 $5M 투자자 전용, +25% 프리미엄 혜택 |
| **Tier 2** | Standard Senior ($5M 이후) | 하드캡의 50–60% | 소프트캡 이후 참여 투자자, 표준 쿠폰 |
| **Tier 3** | Junior / Equity Upside | 하드캡의 20–30% | 성장 연동, 첫 손실 흡수, 높은 잠재 수익 |

### 2.2 각 트랜치 상세

**Pioneer Senior (Tier 1 — 첫 $5M)**

| 항목 | 내용 |
|---|---|
| 대상 | 소프트캡($5M) 달성에 기여한 초기 투자자 |
| 쿠폰 | 연 12.5% (가정) — Standard Senior 대비 +25% |
| 지급 주기 | 분기별 |
| 우선순위 | 모든 트랜치 중 최우선 배분 |
| 건설 기간 | 쿠폰 미지급 (그레이스 피리어드), 운전 개시 후 지급 시작 |

**Standard Senior (Tier 2)**

| 항목 | 내용 |
|---|---|
| 대상 | 소프트캡 이후 참여 투자자 |
| 쿠폰 | 연 10% (가정) |
| 지급 주기 | 분기별 |
| 우선순위 | Pioneer Senior 다음 순위 |
| 건설 기간 | 쿠폰 미지급, 운전 개시 후 지급 시작 |

**Junior / Equity Upside (Tier 3)**

| 항목 | 내용 |
|---|---|
| 대상 | 높은 리스크/높은 리턴 선호 투자자 |
| 수익 | 잔여 현금흐름 참여 (Senior 배분 후) + 카본 크레딧 수익 일부 |
| 첫 손실 | 프로젝트 손실 시 Junior가 먼저 손실 흡수 |
| 지급 주기 | 분기별 (운전 개시 후) |

## (EN) Capital Stack Design

### 2.1 Three-Layer Capital Stack

| Tranche | Name | Ratio (assumption) | Description |
|---|---|---|---|
| **Tier 1** | Pioneer Senior (first $5M) | Soft cap amount | Exclusive to first $5M investors, +25% premium benefit |
| **Tier 2** | Standard Senior (post-$5M) | 50–60% of hard cap | Post-soft-cap investors, standard coupon |
| **Tier 3** | Junior / Equity Upside | 20–30% of hard cap | Growth-linked, first-loss absorption, higher potential returns |

### 2.2 Tranche Details

**Pioneer Senior (Tier 1 — First $5M)**

| Item | Details |
|---|---|
| Eligibility | Early investors contributing to soft cap ($5M) |
| Coupon | 12.5% annualized (assumption) — +25% vs Standard Senior |
| Payout cadence | Quarterly |
| Priority | Highest priority among all tranches |
| Construction period | No coupon (grace period); payouts begin at COD |

**Standard Senior (Tier 2)**

| Item | Details |
|---|---|
| Eligibility | Post-soft-cap investors |
| Coupon | 10% annualized (assumption) |
| Payout cadence | Quarterly |
| Priority | Second priority after Pioneer Senior |
| Construction period | No coupon; payouts begin at COD |

**Junior / Equity Upside (Tier 3)**

| Item | Details |
|---|---|
| Eligibility | Higher risk/return preference investors |
| Returns | Residual cashflow participation (after Senior) + portion of carbon credit revenue |
| First loss | Junior absorbs project losses first |
| Payout cadence | Quarterly (post-COD) |

---

# 3. Pioneer +25% 혜택 / The +25% Pioneer Benefit

---

## (KR) Pioneer +25% 혜택 설계

### 3.1 두 가지 옵션

**Option A: 쿠폰/IRR 25% 상향**

| 항목 | Pioneer Senior | Standard Senior | 차이 |
|---|---|---|---|
| 연간 쿠폰 | 12.5% (가정) | 10% (가정) | +2.5%p = +25% |
| 5년 기준 누적 수익 | 62.5% | 50% | +12.5%p |
| 분기 지급 (기준: $100,000 투자) | $3,125 | $2,500 | +$625/분기 |

**Option B: 토큰 가격 할인 / 보너스 할당**

| 항목 | Pioneer | Standard | 차이 |
|---|---|---|---|
| 토큰 가격 | $0.80/토큰 (가정) | $1.00/토큰 | 20% 할인 |
| $100,000 투자 시 수량 | 125,000 토큰 | 100,000 토큰 | +25% 수량 |
| 연간 쿠폰 (같은 10%) | $12,500 | $10,000 | +$2,500 (= +25%) |

### 3.2 추천 및 근거

> **추천: Option A (쿠폰/IRR 25% 상향)**

**근거:**

1. **운영 단순성**: 모든 토큰이 동일 가격($1.00)으로 발행되어, 보너스 토큰 관리·회계 복잡성 회피
2. **투명성**: Pioneer와 Standard의 차이가 쿠폰율 하나로 명확하게 구분 — 투자자가 즉시 이해 가능
3. **스마트 컨트랙트 구현 용이**: 토큰 유형별 쿠폰율만 다르게 설정하면 되므로 컨트랙트 복잡도 최소화
4. **세무/회계 처리**: 토큰 발행 가격이 동일하여 할인 발행으로 인한 세무 이슈 회피
5. **수학적 명확성**:
   - Pioneer: 12.5% = Standard 10% × 1.25 → 정확히 +25%
   - 5년 만기 시 Pioneer 누적 수익 62.5% vs Standard 50% → 차이 12.5%p

**Option B를 선택하지 않는 이유:**
- 할인 발행 시 토큰 가격 차등으로 인한 회계 복잡성
- 보너스 토큰 발행으로 전체 토큰 공급량 증가 → 기존 투자자 희석 우려
- 이차 시장에서 Pioneer 토큰과 Standard 토큰이 서로 다른 가격으로 발행되어 혼란 가능

## (EN) Pioneer +25% Benefit Design

### 3.1 Two Options

**Option A: Coupon/IRR 25% Higher**

| Item | Pioneer Senior | Standard Senior | Difference |
|---|---|---|---|
| Annual coupon | 12.5% (assumption) | 10% (assumption) | +2.5%p = +25% |
| 5-year cumulative return | 62.5% | 50% | +12.5%p |
| Quarterly payout (based on $100K) | $3,125 | $2,500 | +$625/quarter |

**Option B: Token Price Discount / Bonus Allocation**

| Item | Pioneer | Standard | Difference |
|---|---|---|---|
| Token price | $0.80/token (assumption) | $1.00/token | 20% discount |
| Tokens per $100K | 125,000 | 100,000 | +25% quantity |
| Annual coupon (same 10%) | $12,500 | $10,000 | +$2,500 (= +25%) |

### 3.2 Recommendation & Rationale

> **Recommendation: Option A (Coupon/IRR 25% Higher)**

**Rationale:**

1. **Operational simplicity**: All tokens issued at same price ($1.00); avoids bonus token accounting complexity
2. **Transparency**: Pioneer vs Standard differentiated by single coupon rate — immediately understandable
3. **Smart contract simplicity**: Only coupon rate differs per token type; minimal contract complexity
4. **Tax/accounting**: Uniform issuance price avoids discount issuance tax complications
5. **Mathematical clarity**:
   - Pioneer: 12.5% = Standard 10% × 1.25 → exactly +25%
   - 5-year cumulative: Pioneer 62.5% vs Standard 50% → difference 12.5%p

**Why not Option B:**
- Discount issuance creates token price differential accounting complexity
- Bonus token issuance increases total supply → existing investor dilution concern
- Secondary market confusion from different issuance prices

---

# 4. 프로젝트 현금흐름 맵 / Project Cashflow Map

---

## (KR) 프로젝트 현금흐름

### 4.1 수익원 (Revenue Streams)

| 수익원 | 설명 | 예상 비중 (가정) |
|---|---|---|
| **처리 수수료 (Tipping Fees)** | 폐기물 반입 시 폐기물 발생원으로부터 수취하는 처리비 | 40–50% |
| **재활용 소재 판매** | 재활용된 금속, 플라스틱, 유리, 유기물 퇴비 등의 판매 | 25–35% |
| **에너지 수익** | 폐기물 처리 과정에서 생산되는 에너지(바이오가스, 전력) 판매 | 10–20% |
| **탄소 크레딧** | 탄소 배출 회피분에 대한 탄소 크레딧 판매 (해당 시) | 5–10% |

### 4.2 비용 구조

| 비용 항목 | 예상 비중 (가정) |
|---|---|
| EPC / 건설 비용 (Capex) | 투자금의 60–70% (건설 기간) |
| 운영 비용 (Opex) | 연 매출의 40–55% |
| - 인건비 | 15–20% |
| - 유지보수 | 10–15% |
| - 에너지/유틸리티 | 5–8% |
| - 보험/컴플라이언스 | 3–5% |
| - 관리/행정 | 3–5% |
| DSRA (부채 상환 준비금) | 분기 Senior 쿠폰의 6개월분 상시 유지 |

### 4.3 현금흐름 맵

```
[폐기물 발생원]                  [에너지 구매자]
  (지자체/기업)                  (전력회사/그리드)
      │                              │
      ├── 처리 수수료 ──┐    ┌── 에너지 판매 ──┤
      │                 ▼    ▼                 │
      │          [프로젝트 운영 계좌]           │
      │                 │                      │
[재활용 소재 바이어] ──┤    [탄소 크레딧 시장] ──┘
  재활용 소재 매출     │      크레딧 매출
                       │
              ┌────────┴────────┐
              ▼                 ▼
      [운영 비용 지급]    [SPV 에스크로]
      - 인건비                 │
      - 유지보수          ┌────┴────────┐
      - 에너지            ▼            ▼
      - 보험         [DSRA 준비금]  [투자자 배분]
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼            ▼
                    [Pioneer SR]  [Standard SR]  [Junior]
                    연 12.5%      연 10%        잔여 수익
```

## (EN) Project Cashflow Map

### 4.1 Revenue Streams

| Revenue Source | Description | Est. Share (assumption) |
|---|---|---|
| **Tipping fees** | Waste processing fees from waste generators upon delivery | 40–50% |
| **Recycled material sales** | Sales of recycled metals, plastics, glass, organic compost | 25–35% |
| **Energy revenue** | Energy produced from waste processing (biogas, electricity) sales | 10–20% |
| **Carbon credits** | Carbon credits from avoided emissions (if applicable) | 5–10% |

### 4.2 Cost Structure

| Cost Item | Est. Share (assumption) |
|---|---|
| EPC / Construction (Capex) | 60–70% of investment (during construction) |
| Operating costs (Opex) | 40–55% of annual revenue |
| - Labor | 15–20% |
| - Maintenance | 10–15% |
| - Energy/utilities | 5–8% |
| - Insurance/compliance | 3–5% |
| - Admin/overhead | 3–5% |
| DSRA (Debt Service Reserve) | 6-month Senior coupon equivalent maintained at all times |

### 4.3 Cashflow Map

```
[Waste Generators]              [Energy Buyers]
  (Municipalities/Corps)        (Utilities/Grid)
      │                              │
      ├── Tipping Fees ────┐   ┌── Energy Sales ──┤
      │                    ▼   ▼                   │
      │          [Project Operating Account]       │
      │                    │                       │
[Recycled Material] ──────┤    [Carbon Credit Mkt] ┘
  Material Sales          │      Credit Sales
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
         [OpEx Payments]    [SPV Escrow]
         - Labor                  │
         - Maintenance       ┌────┴──────────┐
         - Energy            ▼               ▼
         - Insurance     [DSRA Reserve]  [Investor Dist.]
                                             │
                            ┌────────────────┼────────────┐
                            ▼                ▼            ▼
                      [Pioneer SR]    [Standard SR]   [Junior]
                      12.5% ann.      10% ann.       Residual
```

---

# 5. 텀시트 / Term Sheet

---

## (KR) 텀시트

| 항목 | 내용 |
|---|---|
| **발행자** | Zero Emission Waste Recycle SPV Ltd. (가칭) |
| **프로젝트** | 제로 에미션 폐기물 재활용 플랜트 |
| **소프트캡** | USD 5,000,000 (프로젝트 착수 최소 금액) |
| **하드캡** | USD 25,000,000 (가정) |
| **최소 투자금** | USD 5,000 (가정, 인프라 프로젝트 특성상 상향) |
| **토큰 유형** | Pioneer Senior / Standard Senior / Junior Equity |
| **만기** | 5–7년 (가정: 건설 2년 + 운영 3–5년) |
| **건설 그레이스 피리어드** | 24개월 (가정, 건설 기간 동안 쿠폰 미지급) |
| **쿠폰** | Pioneer Senior: 연 12.5% / Standard Senior: 연 10% (가정) |
| **지급 주기** | 분기별 (COD 이후), 연간 정산(True-up) |
| **자금 집행** | 마일스톤 기반 6단계 집행 |
| **에스크로** | 소프트캡 미달 시 전액 환불 |
| **DSRA** | 분기 Senior 쿠폰의 6개월분 유지 |
| **보험** | 건설 올리스크, 운영 배상, 환경 배상 보험 |
| **결제 통화** | USDC |
| **화이트리스트** | KYC/AML 완료 투자자 한정 |
| **거버넌스** | 중대 변경 시 토큰 가중 투표 66% 필요 |

## (EN) Term Sheet

| Item | Details |
|---|---|
| **Issuer** | Zero Emission Waste Recycle SPV Ltd. (working title) |
| **Project** | Zero-emission waste recycling plant |
| **Soft cap** | USD 5,000,000 (minimum to start) |
| **Hard cap** | USD 25,000,000 (assumption) |
| **Min ticket** | USD 5,000 (assumption, higher for infrastructure) |
| **Token types** | Pioneer Senior / Standard Senior / Junior Equity |
| **Tenor** | 5–7 years (assumption: 2yr construction + 3–5yr operations) |
| **Construction grace** | 24 months (assumption, no coupon during construction) |
| **Coupon** | Pioneer Senior: 12.5% ann. / Standard Senior: 10% ann. (assumption) |
| **Payout cadence** | Quarterly (post-COD), annual true-up |
| **Fund release** | Milestone-based 6-stage release |
| **Escrow** | Full refund if soft cap not met |
| **DSRA** | 6-month Senior coupon equivalent maintained |
| **Insurance** | Construction all-risk, operational liability, environmental liability |
| **Settlement** | USDC |
| **Whitelist** | KYC/AML-verified investors only |
| **Governance** | 66% token-weighted vote for material changes |

## (EN) YAML Term Sheet

```yaml
term_sheet:
  project_name: "Zero Emission - Waste Recycle"
  project_type: "Green Infrastructure / Waste Recycling Plant"
  issuer: "Zero Emission Waste Recycle SPV Ltd."
  token_types:
    pioneer_senior:
      name: "ZE-PSR"
      description: "Pioneer Senior — first $5M investors, +25% coupon premium"
      coupon_annualized: "12.5%"  # assumption
      payout_cadence: "quarterly (post-COD)"
      priority: "Highest — first in waterfall"
      eligibility: "Investors contributing to soft cap ($5M)"
    standard_senior:
      name: "ZE-SSR"
      description: "Standard Senior — post-threshold investors"
      coupon_annualized: "10%"  # assumption
      payout_cadence: "quarterly (post-COD)"
      priority: "Second — after Pioneer Senior"
    junior:
      name: "ZE-JR"
      description: "Junior Equity Upside — residual cashflow + carbon credits"
      target_return: "variable, scenario-based"
      first_loss: true
      payout_cadence: "quarterly (post-COD)"
  soft_cap_usd: 5000000
  hard_cap_usd: 25000000  # assumption
  min_ticket_usd: 5000  # assumption
  tenor_years: "5–7"  # assumption
  construction_grace_months: 24  # assumption
  milestone_release:
    M1_permits: "15%"
    M2_epc_contract: "20%"
    M3_construction_start: "20%"
    M4_50pct_complete: "20%"
    M5_commissioning: "15%"
    M6_cod: "10%"
  escrow:
    type: "Smart contract vault + independent custodian"
    refund_if_softcap_not_met: true
    refund_timeline: "7 business days"
  dsra: "6-month Senior coupon equivalent"
  insurance: ["Construction all-risk", "Operational liability", "Environmental liability"]
  settlement_currency: "USDC"
  whitelist_required: true
  kyc_aml_required: true
  governance:
    material_change_vote: "66% token-weighted"
  annual_true_up: true
  legal_disclaimer: "All figures are assumptions. Returns not guaranteed. ESG outcomes require verification."
```

---

# 6. 리스크 및 완화 / Risk & Mitigation

---

## (KR) 리스크 및 완화

### 6.1 인허가 리스크

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 환경 인허가 지연/거부 | 프로젝트 착수 불가 | M1 마일스톤 전 자금 미집행, 인허가 전문 컨설턴트 고용 |
| 건설 인허가 변경 | 설계 변경, 비용 증가 | EPC 계약에 변경 조항 포함, 예비비 확보 |
| 운영 인허가 갱신 실패 | 운영 중단 리스크 | 인허가 만료 12개월 전 갱신 절차 착수 |

### 6.2 EPC (건설) 리스크

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 공기 지연 | COD 지연 → 수익 발생 지연 | 고정가 EPC 계약(Lump-sum Turnkey), 지연 배상금(LD) 조항 |
| 비용 초과 | 추가 자금 필요 | 예비비 10–15%, EPC 고정가 계약 |
| EPC 업체 부도 | 건설 중단 | 이행 보증(Performance Bond), 보험 |

### 6.3 폐기물 공급(Feedstock) 리스크

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 폐기물 반입량 부족 | 처리 수수료 매출 감소 | 지자체 장기 공급 계약(Put-or-Pay), 최소 반입량 보장 |
| 폐기물 성상 변화 | 처리 효율 저하, 품질 변동 | 반입 검사 프로토콜, 유연한 처리 기술 |

### 6.4 매출 계약(Offtake) 리스크

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 재활용 소재 가격 하락 | 매출 감소 | 장기 오프테이크 계약(최소 가격 보장), 소재 다변화 |
| 에너지 가격 변동 | 에너지 매출 변동 | 장기 PPA(전력구매계약), 고정가 조항 |

### 6.5 운영 리스크

| 리스크 | 영향 | 완화 방안 |
|---|---|---|
| 설비 고장/다운타임 | 처리량 감소, 매출 손실 | 예방 정비 프로그램, 여유 용량 설계, 기계 고장 보험 |
| 환경 사고 | 벌금, 운영 중단, 평판 리스크 | 환경 배상 보험, 비상 대응 계획, 실시간 모니터링 |

### 6.6 준비금 및 보호 장치

- **DSRA (부채 상환 준비금)**: Senior 분기 쿠폰 6개월분 상시 유지
- **유지보수 준비금**: 연간 Capex의 2–3% 적립
- **이행 보증**: EPC 업체로부터 계약금의 10% 이행 보증
- **보험**: 건설 올리스크, 기계 고장, 환경 배상, 제3자 배상

## (EN) Risk & Mitigation

### 6.1 Permitting Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Environmental permit delay/denial | Cannot start project | No funds released before M1; permit specialist engaged |
| Construction permit changes | Design changes, cost increase | EPC contract variation clauses, contingency budget |
| Operating license renewal failure | Operation halt risk | Start renewal 12 months before expiry |

### 6.2 EPC (Construction) Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Schedule delay | COD delay → revenue delay | Lump-sum turnkey EPC, liquidated damages (LD) clauses |
| Cost overrun | Additional funding needed | 10–15% contingency, fixed-price EPC |
| EPC contractor insolvency | Construction halt | Performance bond, insurance |

### 6.3 Feedstock Supply Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Insufficient waste volume | Tipping fee revenue shortfall | Long-term municipal supply contracts (Put-or-Pay), minimum volume guarantee |
| Waste composition changes | Processing efficiency loss, quality variance | Intake inspection protocol, flexible processing technology |

### 6.4 Offtake Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Recycled material price drop | Revenue decline | Long-term offtake agreements (minimum price guarantee), material diversification |
| Energy price volatility | Energy revenue fluctuation | Long-term PPA (Power Purchase Agreement), fixed-price clauses |

### 6.5 Operational Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Equipment failure/downtime | Throughput reduction, revenue loss | Preventive maintenance program, spare capacity design, machinery breakdown insurance |
| Environmental incident | Fines, operation halt, reputation risk | Environmental liability insurance, emergency response plan, real-time monitoring |

### 6.6 Reserves & Protections

- **DSRA**: 6-month Senior quarterly coupon equivalent maintained
- **Maintenance reserve**: 2–3% of annual Capex accrued
- **Performance bond**: 10% of contract value from EPC contractor
- **Insurance**: Construction all-risk, machinery breakdown, environmental liability, third-party liability

---

# 7. ESG / 제로 에미션 증명 계획 / ESG / Zero Emission Proof Plan

---

## (KR) ESG / 제로 에미션 증명 계획

### 7.1 측정·보고·검증 (MRV) 프레임워크

| 단계 | 내용 | 주기 |
|---|---|---|
| **측정 (Measurement)** | 폐기물 반입량, 처리량, 재활용률, 에너지 생산량, 배출량 실시간 계측 | 연속 (IoT 센서) |
| **보고 (Reporting)** | 월간 ESG 데이터 보고서, 분기 탄소 회피량 보고 | 월간/분기 |
| **검증 (Verification)** | 독립 제3자 환경 감사 기관에 의한 연간 검증 | 연간 |

### 7.2 주요 ESG 지표

| 지표 | 설명 | 목표 (가정) |
|---|---|---|
| 매립 전환율 (Landfill Diversion) | 반입 폐기물 중 매립이 아닌 재활용/에너지 회수 비율 | > 90% |
| 탄소 회피량 | 매립 대비 회피된 CO2e 배출량 | 연간 측정 후 보고 |
| 에너지 자급률 | 플랜트 운영에 필요한 에너지 대비 자체 생산 비율 | > 80% (가정) |
| 순 배출 (Net Emission) | 플랜트의 순 온실가스 배출 목표 | Net-Zero 또는 Net-Negative 목표 |
| 물 재활용률 | 공정수 재활용 비율 | > 70% (가정) |

### 7.3 탄소 크레딧

- **적용 가능 표준**: Verra (VCS), Gold Standard, 또는 해당국 ETS
- **크레딧 산정 방법론**: 매립 회피(Avoided Landfill Emissions) + 에너지 대체(Displaced Grid Electricity)
- **크레딧 발행**: 독립 검증 완료 후 빈티지별 크레딧 발행
- **수익 배분**: 탄소 크레딧 수익의 일부는 Junior 트랜치에 추가 배분, 일부는 ESG 준비금

### 7.4 투명성 보장

- 실시간 대시보드: 처리량, 배출량, 에너지 생산량 공개
- 제3자 검증 보고서 투자자 공개
- 연간 ESG 종합 보고서 발행

> **주의**: ESG 성과는 독립 검증 없이 보장되지 않습니다. 모든 목표치는 가정이며, 실제 운영 결과에 따라 달라질 수 있습니다.

## (EN) ESG / Zero Emission Proof Plan

### 7.1 Measurement, Reporting & Verification (MRV) Framework

| Stage | Content | Frequency |
|---|---|---|
| **Measurement** | Waste intake, processing volume, recycling rate, energy production, emissions — real-time monitoring | Continuous (IoT sensors) |
| **Reporting** | Monthly ESG data report, quarterly carbon avoidance report | Monthly/Quarterly |
| **Verification** | Annual verification by independent third-party environmental auditor | Annual |

### 7.2 Key ESG Metrics

| Metric | Description | Target (assumption) |
|---|---|---|
| Landfill diversion rate | % of intake diverted from landfill to recycling/energy recovery | > 90% |
| Carbon avoidance | CO2e emissions avoided vs landfill baseline | Measured and reported annually |
| Energy self-sufficiency | Plant energy self-generation vs consumption ratio | > 80% (assumption) |
| Net emission | Plant net GHG emission target | Net-Zero or Net-Negative |
| Water recycling rate | Process water recycling ratio | > 70% (assumption) |

### 7.3 Carbon Credits

- **Applicable standards**: Verra (VCS), Gold Standard, or local ETS
- **Methodology**: Avoided Landfill Emissions + Displaced Grid Electricity
- **Credit issuance**: Post-independent-verification, vintage-based credit issuance
- **Revenue allocation**: Portion of carbon credit revenue to Junior tranche, portion to ESG reserve

### 7.4 Transparency

- Real-time dashboard: processing volume, emissions, energy production publicly available
- Third-party verification reports shared with investors
- Annual comprehensive ESG report published

> **Note**: ESG outcomes are not guaranteed without independent verification. All targets are assumptions and may vary based on actual operations.

---

# 8. 보고 대시보드 스펙 / Reporting Dashboard Spec

---

## (KR) 보고 대시보드

### 8.1 실시간 대시보드 항목

| 항목 | 설명 | 업데이트 주기 |
|---|---|---|
| 일간 처리량 (Throughput) | 일일 폐기물 처리 톤수 | 일간 |
| 설비 가동률 (Uptime) | 플랜트 운영 시간 / 전체 시간 | 실시간 |
| 배출 회피량 | 누적 CO2e 회피 톤수 | 일간 |
| 에너지 생산량 | 일일/월간 전력·열에너지 생산량 | 일간 |

### 8.2 월간/분기 보고

| 항목 | 설명 | 주기 |
|---|---|---|
| 수익원별 매출 | 처리 수수료, 재활용 소재, 에너지, 탄소 크레딧별 매출 | 월간 |
| 운영 비용 상세 | 항목별 비용 분석 | 월간 |
| 준비금 잔액 | DSRA, 유지보수 준비금, ESG 준비금 잔액 | 월간 |
| 투자자 배분 내역 | Pioneer/Standard/Junior 각 트랜치별 배분 실적 | 분기 |
| ESG 성과 | 매립 전환율, 탄소 회피량, 에너지 자급률 | 분기 |
| 마일스톤 진행 | 건설 진행률, 다음 마일스톤 예상 일정 | 건설 기간 중 월간 |

### 8.3 연간 보고

| 항목 | 설명 |
|---|---|
| 감사 재무제표 | 독립 감사인에 의한 SPV 재무 감사 |
| ESG 검증 보고서 | 제3자 환경 감사 결과 |
| 연간 정산 (True-up) | 실적 기반 Junior 추가 배분 또는 준비금 조정 |

## (EN) Reporting Dashboard Spec

### 8.1 Real-Time Dashboard

| Item | Description | Update Frequency |
|---|---|---|
| Daily throughput | Daily waste processing tonnage | Daily |
| Uptime | Plant operating hours / total hours | Real-time |
| Emissions avoided | Cumulative CO2e avoidance tonnage | Daily |
| Energy production | Daily/monthly power and thermal energy output | Daily |

### 8.2 Monthly/Quarterly Reports

| Item | Description | Frequency |
|---|---|---|
| Revenue by stream | Tipping fees, recycled materials, energy, carbon credits | Monthly |
| Operating cost detail | Cost breakdown by category | Monthly |
| Reserve balances | DSRA, maintenance reserve, ESG reserve | Monthly |
| Investor distribution details | Distribution by Pioneer/Standard/Junior tranche | Quarterly |
| ESG performance | Landfill diversion, carbon avoidance, energy self-sufficiency | Quarterly |
| Milestone progress | Construction progress %, next milestone ETA | Monthly during construction |

### 8.3 Annual Reports

| Item | Description |
|---|---|
| Audited financials | Independent auditor SPV financial audit |
| ESG verification report | Third-party environmental audit results |
| Annual true-up | Performance-based Junior additional distribution or reserve adjustment |

---

# 9. 스마트 컨트랙트 스펙 / Smart Contract Spec (EN)

---

## 9.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│            Zero Emission Waste Recycle RWA Protocol           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Escrow Vault   │  │  Token         │  │  Payout        │ │
│  │                 │  │  Contracts     │  │  Waterfall     │ │
│  │  - Deposit      │  │               │  │               │ │
│  │  - Soft cap     │  │  - ZE-PSR     │  │  - Priority   │ │
│  │    check        │  │  - ZE-SSR     │  │    queue      │ │
│  │  - Milestone    │  │  - ZE-JR      │  │  - DSRA       │ │
│  │    release      │  │  - ERC-1400   │  │  - Quarterly  │ │
│  │  - Auto refund  │  │               │  │    dist.      │ │
│  └────────┬───────┘  └───────┬────────┘  └───────┬────────┘ │
│           │                  │                    │          │
│  ┌────────┴──────────────────┴────────────────────┴───────┐  │
│  │              Governance / Admin Module                   │  │
│  │  - Multi-sig milestone approval                         │  │
│  │  - Emergency pause                                      │  │
│  │  - Annual true-up execution                             │  │
│  │  - ESG oracle data feed                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Audit Trail Module                          │  │
│  │  - Milestone achievement records                        │  │
│  │  - All distributions logged on-chain                    │  │
│  │  - ESG data anchoring (hashes)                          │  │
│  │  - Reserve level snapshots                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## 9.2 Escrow Vault Logic

```solidity
// Pseudocode — not audited
contract EscrowVault {
    uint256 public constant SOFT_CAP = 5_000_000 * 1e6; // $5M USDC
    uint256 public fundraiseDeadline;
    bool public softCapReached;

    mapping(address => uint256) public deposits;
    uint256 public totalDeposited;

    // Deposit
    function deposit(uint256 amount) external onlyWhitelisted {
        stablecoin.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
        totalDeposited += amount;
        if (totalDeposited >= SOFT_CAP) softCapReached = true;
    }

    // Auto-refund if soft cap not reached
    function refund() external {
        require(block.timestamp > fundraiseDeadline && !softCapReached, "Refund not available");
        uint256 amount = deposits[msg.sender];
        deposits[msg.sender] = 0;
        stablecoin.transfer(msg.sender, amount);
        emit Refunded(msg.sender, amount);
    }

    // Milestone-based release (multi-sig)
    function releaseMilestone(uint256 milestoneId, uint256 amount) external onlyMultiSig {
        require(softCapReached, "Soft cap not reached");
        require(milestoneVerified[milestoneId], "Milestone not verified");
        stablecoin.transfer(projectWallet, amount);
        emit MilestoneReleased(milestoneId, amount);
    }
}
```

## 9.3 Payout Waterfall Contract

```solidity
// Pseudocode
contract PayoutWaterfall {
    function executeQuarterlyDistribution(uint256 _totalRevenue, uint256 _opex) external onlyAdmin {
        uint256 netCashflow = _totalRevenue - _opex;

        // 1. DSRA top-up
        uint256 dsraNeeded = calculateDSRATarget() - dsraBalance;
        if (dsraNeeded > 0) { dsraTopUp(min(netCashflow, dsraNeeded)); }

        // 2. Pioneer Senior coupon (highest priority)
        uint256 pioneerCoupon = calculatePioneerCoupon();
        distributeToClaim(pioneerClaimContract, min(remaining, pioneerCoupon));

        // 3. Standard Senior coupon
        uint256 standardCoupon = calculateStandardCoupon();
        distributeToClaim(standardClaimContract, min(remaining, standardCoupon));

        // 4. Junior residual
        if (remaining > 0) { distributeToClaim(juniorClaimContract, remaining); }

        emit QuarterlyDistribution(pioneerCoupon, standardCoupon, remaining);
    }
}
```

## 9.4 Whitelist & Transfer Restrictions

- ERC-1400 compliant security tokens
- All transfers require both sender and receiver to be whitelisted
- KYC expiry enforcement
- Compliance admin: multi-sig (2-of-3 minimum)
- Lock-up period during construction phase (no secondary transfers)

## 9.5 Emergency Controls

- **Pause**: Multi-sig freezes all operations
- **Escrow refund trigger**: Automatic if soft cap not reached by deadline
- **Liquidation**: Governance vote if project fundamentally impaired
- **Upgrade**: Proxy pattern with governance vote

---

# 10. 리스팅 페이지 카피 / Listing Page Copy

---

## (KR) 리스팅 페이지 — 제로 에미션 폐기물 재활용

### 헤드라인
**제로 에미션 폐기물 재활용 그린 인프라 수익 토큰**

### 서브 헤드라인
폐기물을 자원으로. 지속 가능한 인프라 프로젝트에서 발생하는 안정적 현금흐름에 참여하세요.

### "이 투자는 어떻게 작동하나요?"

제로 에미션 폐기물 재활용 플랜트를 건설하고 운영하여, 처리 수수료·재활용 소재 판매·에너지 매출·탄소 크레딧에서 수익을 창출합니다. 투자자는 이 현금흐름에 대한 배분 권리를 보유합니다.

### "초기 투자자 혜택은?"

최초 USD 5,000,000(소프트캡)에 참여하는 Pioneer 투자자는 Standard 투자자 대비 **+25% 높은 쿠폰**(연 12.5% vs 10%)을 수령합니다. 이는 프로젝트 초기 리스크를 부담하는 것에 대한 보상입니다.

### "$5M이 모이지 않으면?"

**전액 자동 환불됩니다.** 모금 기간 내 소프트캡($5M)에 도달하지 못하면, 에스크로에 예치된 모든 자금은 투자자에게 전액 반환되며, 수수료는 부과되지 않습니다.

### "리스크는 무엇인가요?"

- 인허가 취득에 실패할 수 있습니다
- 건설이 지연되거나 비용이 초과될 수 있습니다
- 폐기물 공급이 부족할 수 있습니다
- 재활용 소재·에너지 가격이 하락할 수 있습니다
- ESG 목표가 달성되지 않을 수 있습니다 (검증 필요)
- Junior 토큰은 손실 시 먼저 영향을 받습니다

> **수익이 보장되지 않습니다.** 인프라 프로젝트 특성상 건설·운영·시장 리스크가 존재합니다.

## (EN) Listing Page — Zero Emission Waste Recycle

### Headline
**Zero Emission Waste Recycling Green Infrastructure Income Token**

### Subheadline
Turning waste into resources. Participate in stable cashflows from a sustainable infrastructure project.

### "How Does This Investment Work?"

A zero-emission waste recycling plant is constructed and operated, generating revenue from tipping fees, recycled material sales, energy production, and carbon credits. Investors hold distribution rights to these cashflows.

### "What Are the Early Investor Benefits?"

Pioneer investors who participate in the first USD 5,000,000 (soft cap) receive **+25% higher coupon** (12.5% vs 10% annualized) compared to Standard investors. This compensates for bearing early-stage project risk.

### "If $5M Is Not Raised?"

**Full automatic refund.** If the soft cap ($5M) is not reached within the fundraising period, all funds in escrow are returned to investors in full with no fees charged.

### "What Can Go Wrong?"

- Permits may not be obtained
- Construction may be delayed or over budget
- Waste supply may be insufficient
- Recycled material and energy prices may decline
- ESG targets may not be achieved (verification required)
- Junior token absorbs losses first

> **Returns are not guaranteed.** Infrastructure projects carry construction, operational, and market risks.

---

# 데이터룸 체크리스트 / Data Room Checklist

---

## (KR) 데이터룸 체크리스트

### 법인 및 구조
- [ ] SPV 설립 문서
- [ ] SPV 운영 계약서
- [ ] 에스크로 계약서 / 스마트 컨트랙트 감사
- [ ] 투자자 구독 계약서 템플릿
- [ ] 마일스톤 정의 및 검증 절차 문서

### 인허가
- [ ] 환경 영향 평가서 (EIA)
- [ ] 환경 인허가
- [ ] 건설 인허가
- [ ] 운영 인허가 (또는 신청 현황)
- [ ] 폐기물 처리업 등록

### 건설 (EPC)
- [ ] EPC 계약서
- [ ] 독립 엔지니어(IE) 계약서
- [ ] 건설 일정 및 공정표
- [ ] 이행 보증서 (Performance Bond)
- [ ] 건설 올리스크 보험 증서

### 운영 및 수익
- [ ] 폐기물 공급 계약서 (지자체/기업)
- [ ] 재활용 소재 오프테이크 계약서
- [ ] 전력 구매 계약서 (PPA)
- [ ] 탄소 크레딧 등록 / 방법론 문서

### 재무
- [ ] 프로젝트 재무 모델 (Base/Bull/Bear 시나리오)
- [ ] 자금 사용 계획 상세
- [ ] DSRA 정책 문서
- [ ] 보험 증서 (건설, 운영, 환경, 제3자)

### ESG
- [ ] MRV 프레임워크 문서
- [ ] 탄소 크레딧 방법론 문서
- [ ] ESG 보고 정책

### 기술
- [ ] 스마트 컨트랙트 감사 보고서 (제3자)
- [ ] 에스크로 볼트 기술 문서
- [ ] KYC/AML 프로세스 문서

### 법률
- [ ] 토큰 법적 성격 의견서
- [ ] 규제 적합성 의견서
- [ ] 환경법 준수 의견서

## (EN) Data Room Checklist

### Corporate & Structure
- [ ] SPV incorporation documents
- [ ] SPV operating agreement
- [ ] Escrow agreement / smart contract audit
- [ ] Investor subscription agreement template
- [ ] Milestone definition and verification procedure document

### Permits
- [ ] Environmental Impact Assessment (EIA)
- [ ] Environmental permit
- [ ] Construction permit
- [ ] Operating permit (or application status)
- [ ] Waste processing business registration

### Construction (EPC)
- [ ] EPC contract
- [ ] Independent Engineer (IE) agreement
- [ ] Construction schedule and Gantt chart
- [ ] Performance bond
- [ ] Construction all-risk insurance certificate

### Operations & Revenue
- [ ] Waste supply contracts (municipal/corporate)
- [ ] Recycled material offtake agreements
- [ ] Power Purchase Agreement (PPA)
- [ ] Carbon credit registration / methodology documents

### Financial
- [ ] Project financial model (Base/Bull/Bear scenarios)
- [ ] Detailed use of funds plan
- [ ] DSRA policy document
- [ ] Insurance certificates (construction, operational, environmental, third-party)

### ESG
- [ ] MRV framework document
- [ ] Carbon credit methodology document
- [ ] ESG reporting policy

### Technical
- [ ] Smart contract audit report (third-party)
- [ ] Escrow vault technical documentation
- [ ] KYC/AML process documentation

### Legal
- [ ] Token classification legal opinion
- [ ] Regulatory compliance opinion
- [ ] Environmental law compliance opinion

---

> **문서 끝 / End of Document**
> Zero Emission — Waste Recycle RWA Listing Pack v1.0
> 본 문서의 모든 수치와 구조는 가정에 기반하며, 법률·회계·환경·엔지니어링 전문가의 검토 후 최종 확정되어야 합니다.
> All figures and structures are assumption-based and must be finalized after review by legal, accounting, environmental, and engineering professionals.
