# NTech Digital — Dental landing page (strategy & copy standards)

**Audience:** Dental practice owners (GP / multi-doctor), risk-averse, time-poor, burned by generic agencies.  
**North star:** One primary conversion — **Free Patient Flow Audit** — then diagnose → prescribe (packages **after** intent is earned).  
**Voice:** Closer, not strategist. Premium, calm, direct. **Pain > comfort = action** (polite loses).

---

## Issue 1 — External framing (closer, not strategist)

**Do not say on-page:** “curiosity → named audit request” (internal funnel language only).

**Do say (examples of emotional hooks):**

- “Your website should be **booking patients**, not **leaking** them.”
- “Traffic without booked new patients is **not growth** — it’s **noise**.”
- “Most practices don’t have a ‘lead problem.’ They have a **patient-flow problem**.”

**Rule:** Every section headline or opener must pass: **Would a tired owner feel that in the gut, not the head?**

---

## Issue 2 — Pain amplification (harder, not polite)

**Retire soft language** (“empty chairs” alone is too weak).

**Use and stack (pick 4–6 on-page, rotate in body):**

- **Missed high-value cases** (implants, ortho, full-arch — the revenue that doesn’t show up on a generic “leads” dashboard).
- **Competitors stealing local patients** (same ZIP, same searches — someone is winning the click and the call).
- **Silent revenue leaks** (calls, forms, chats that die between “interest” and “scheduled”).
- **Front desk follow-up gaps** (speed-to-lead, after-hours, recall handoffs — where intent cools).
- **Expensive traffic going nowhere** (ads and SEO spend that never ties to **booked new patients**).
- **PPO dependence pressure** (optional if tone stays respectful — frame as economics, not shame).

**Rule:** Name **mechanisms** of loss (where it breaks), not vibes.

---

## Issue 3 — Offer sequence (critical — no early package ladder)

**Do not:** Present four packages high on the page or as an “offer ladder” in the hero band.

**Why:** Decision fatigue, premature pricing, “pick a plan” friction before diagnosis.

**Do:**

1. **Hero + first scroll:** One offer — **Get My Free Patient Flow Audit** (lead magnet / call path).
2. **Mechanism + proof + objection handling:** Build the case for the audit.
3. **Only after** “why us / how it works / no BS trust”: **then** packages as *prescription* (“What we typically recommend after your audit”) — not a menu.

**Homepage ≠ price menu.** Diagnose first. Prescribe second.

---

## Issue 4 — Financial math (explicit, aggressive, still defensible)

**Ban vague:** “booked new patients / month” without numbers.

**Use concrete illustrative math** (label clearly as **example** so it stays honest):

> If **one implant case** averages **$4,500+**  
> and your patient flow leaks **just 2** of those a month you never see on the schedule…  
> that’s **$108,000+/year** walking out the side door.

Add 1–2 more **tight** examples (same pattern):

- High-value procedure + missed count/month × 12  
- Optional: cost of **one extra hygienist day** vs **one fixed leak** (only if accurate to your market positioning)

**Rule:** Math closes dentists. **Show the multiplication.** Always mark assumptions (“example math — your numbers in the audit”).

---

## Issue 5 — “Why us” as **us vs them** (required section)

### Section title (working)

**“Why Most Agencies Fail Dentists”**

**Purpose:** Transfer doubt from *marketing* to *wrong partner* — not “you’re bad at business.”

**Content beats (bullets, not fluff):**

- They optimize for **vanity metrics**, not **booked new patients**.
- They don’t map **PMS / scheduling / phone / forms** as one system.
- They ship **templates** instead of **patient intent** (procedure + geography + trust).
- They disappear into **black-box retainers** with no operational accountability.

**Bridge line:** “We built NTech Digital around **patient flow** — because that’s what actually pays the lab bill.”

---

## Issue 6 — “No BS” trust section (required)

### Section title (working)

**“No BS. Here’s What You Won’t Get.”** (or positive flip: **“What You Get — And What We Refuse To Sell”**)

**Must include (your list, tightened for scan):**

- **No long-term contracts** (or define plainly if you use short agreements — don’t lie).
- **No vague retainers** (“we’ll do SEO” with no tied outcome narrative).
- **No vanity reports** (rankings without appointments are theater).
- **No fake lead promises** (“100 leads” that never pick up the phone).

**Pair each with the positive opposite** in one line (e.g. “Instead: weekly patient-flow snapshot tied to calls & bookings you can verify”).

---

## Issue 7 — Package naming (premium perception)

**Do not use generic tier names on this funnel.**

**Use (trademark styling on-site as you legally can — confirm registration/mark usage with counsel):**

| Tier | Name |
|------|------|
| 1 | **PatientFlow Foundation™** |
| 2 | **PatientFlow Lead Machine™** |
| 3 | **Growth System™** |
| 4 | **Premium Growth Partner™** |

**Note:** Live site `pricing.tsx` still uses older labels — this doc is the **target naming** for dental LP + eventual product alignment.

---

## Issue 8 — Primary CTA + friction killers (required under button)

### Primary CTA (button)

**Get My Free Patient Flow Audit**

### Friction-reduction stack (subcopy under CTA — always visible near primary CTA)

- **Takes ~10 minutes**
- **No obligation**
- **No PHI required** for the initial audit request (word precisely per your compliance review)
- **No pressure sales call** (define what happens next: e.g. “If we’re not a fit, we’ll tell you.”)

**Secondary CTA:** **See How It Works** → scroll to process / mechanism section (same label everywhere for analytics).

---

## Page block order (revised for conversion)

1. **Hero** — emotional hook + primary CTA + friction stack + secondary CTA  
2. **Pain amplification** — hard, specific, dental-native  
3. **Financial math** — 1–2 example multiplications + “your numbers in the audit”  
4. **Mechanism** — what the Patient Flow Audit is / isn’t (deliverable preview)  
5. **Why Most Agencies Fail Dentists** — us vs them  
6. **No BS trust** — refusal list + positive counterpart  
7. **How it works** — steps, timeline, what they receive  
8. **Proof** — testimonials / outcomes (structured, credible)  
9. **FAQ** — objections (HIPAA framing, timeline, “we already have a vendor,” etc.)  
10. **Packages** — *only here*, framed as prescription after diagnosis (“typical paths”)  
11. **Final CTA** — repeat primary + friction stack  

---

## QA gate (before any build)

- [ ] Sounds like a **closer**, not a consultant deck  
- [ ] Pain section makes an owner **uncomfortable in 10 seconds**  
- [ ] Packages appear **after** audit story + trust + us-vs-them  
- [ ] Math is **explicit** (multiplication visible)  
- [ ] “Why agencies fail dentists” + “No BS” are **present and scannable**  
- [ ] CTA block always shows **friction killers**  

---

## Next step (implementation)

When you approve this doc, we translate it into: route + components + metadata + schema + `llms.txt` entry — and we **align** `PACKAGES-AND-PRICING.md` / `pricing.tsx` naming in a separate, explicit change (legal + brand review for ™).
