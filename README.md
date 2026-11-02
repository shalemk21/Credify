# Credify — SkillPassport

> **"Your Skills. Our Recognition."**  
> *The Invisible Workforce: Bridging the Gap Between Skills and Opportunities for Blue-Collar and Grey-Collar Workers in India.*

---

## 1. Project Overview

Blue-collar and grey-collar workers in India (electricians, plumbers, technicians) possess deep practical expertise but **lack verifiable proof**. Conversely, contractors and homeowners struggle with unreliable hiring, fraudulent claims, and lack of trust.

**SkillPassport** by **Credify** is an evidence-backed trust layer:
1. **Worker App (Mobile-First PWA):** Non-intrusive, voice-first onboarding in Indian English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ), audio-read accessibility assistance on every screen, timestamped photo evidence capture, and visual scenario skill checks.
2. **Skill Passport:** A cryptographically shareable digital passport featuring a 0–100 Trust Score, verified skill badges (Gold, Silver, Bronze), Safety Aware certification, and public QR code that works with zero login.
3. **Employer Dashboard:** Explainable multi-factor talent search, ranking workers by trade, Bengaluru locality distance, experience, language, and trust score, accompanied by real-time match justification bars and instant WhatsApp direct hiring.

---

## 2. Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with custom design tokens matching the UI/UX showcase
- **PWA:** Web App Manifest (`manifest.json`) + Service Worker (`sw.js`) + Offline IndexedDB/LocalStorage queue
- **Voice & Speech:** Web Speech API (`SpeechRecognition`) + SpeechSynthesis (`speechSynthesis`) for regional audio playback
- **QR Code:** Client-rendered SVG/Canvas via `qrcode`
- **PDF Export:** Client-side vector PDF generation via `jspdf`
- **Analytics:** Interactive data visualizations via `recharts`
- **AI Layer (`lib/ai.ts`):** Rule-based multilingual NLP extraction with seamless fallback to OpenAI/Anthropic when keys are provided

---

## 3. Quickstart & Local Setup

```bash
# 1. Navigate to project directory
cd D:\credify

# 2. Install dependencies (if not already installed)
npm install

# 3. Run unit tests (verifies trust & matching safeguards)
npm test

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. 3-Minute Demo Walkthrough Script

Follow these steps for an end-to-end evaluation:

### Minute 1: Public Landing Page & Worker Onboarding
1. Open `http://localhost:3000/`. Observe the top navigation, hero shield illustration of skilled workers, and bottom live metrics strip.
2. Click **"Explore Talent →"** or navigate to `http://localhost:3000/worker/onboarding`.
3. **Language Selection:** Tap **हिन्दी** or **ಕನ್ನಡ**. Notice how interface labels and audio prompts translate. Tap the speaker icon in the top right to hear speech synthesis.
4. **Phone Verification:** Tap **Send OTP**. Notice the helper card `Demo OTP: 1234` and tap **Verify & Continue**.
5. **Voice Skill Capture:** Tap the circular Navy microphone button. Speak or type in English, Hindi, or Kannada (e.g. *"I fix house wiring, fans and inverters for 8 years"*). Notice the green pill chips with checkmarks detected automatically.
6. **Work Evidence:** Observe the featured distribution board wiring photo with the green verified tick. Toggle the "Offline Mode" switch to see evidence queued with the offline sync pill.

### Minute 2: Skill Check, Passport & Instant Vouch Recalculation
7. **Skill Check:** Answer the 5 scenario diagnostic questions. Earn a **Gold Badge** and review the growth recommendation and mandatory Safety Checklist.
8. **Skill Passport:** View the generated SkillPassport with the 92 Trust Score ring, verified skill pills, and public QR code. Tap **Download PDF** to export a clean vector credential.
9. **Instant Vouch Flow:** Open `http://localhost:3000/vouch/token-worker-ramesh-k`. As a homeowner, tap **👍 Yes**, give a 5-star rating, and submit with Demo OTP `1234`. Observe the confetti celebration and watch Ramesh's trust score recalculate live from 92 → 100.
10. **Public Passport (No Login):** Open `http://localhost:3000/passport/worker-ramesh-k` in an incognito window. On desktop, notice the two-column view (profile + QR on left, evidence gallery and vouches on right).

### Minute 3: Employer Dashboard & Hire Requests
11. Navigate to `http://localhost:3000/employer`.
12. **Filters & Ranked Cards:** Filter by **Electrician** in **Whitefield**. Observe **Ramesh K.** ranked at the top with a **96% Match Ring** and 3 km distance.
13. **Explainable Match Breakdown:** On the right column (or bottom sheet on mobile), review the progress bars for *Skills Match (95%)*, *Experience (90%)*, *Location (85%)*, and *Trust Score (88%)* plus the verified profile card.
14. **Compare:** Click the Compare button on Ramesh K. and Shankar M., then click **"Compare Side-by-Side"** to inspect verified signals without bias.
15. **Hire Request:** Click **Hire** on Ramesh K., enter wage offer (₹1,200/day), and send. Now switch to the worker's view at `http://localhost:3000/worker/jobs` to see the job offer live with **Accept** and **Not Available** buttons.
16. **Admin Panel:** Visit `http://localhost:3000/admin` to toggle assessor verification or simulate instant vouches.

---

## 5. Trust Score & Merit Matching Algorithms

### Trust Score Formula (`lib/trust.ts`, 0–100)
- **Self-declared skills:** 10 points
- **Work evidence (timestamped media):** up to 20 points
- **Vouches (phone-verified & star weighted):** up to 30 points
- **Practical assessment:** up to 30 points
- **Assessor / Training partner audit:** up to 10 points
- **Badge Tiers:** Bronze (0–39), Silver (40–69), Gold (70–100)

### Matching Safeguard (`lib/match.ts`)
Multi-factor matching strictly weights skills, verified level, experience, distance in km, availability, and language preference.  
**Strict Ethical Guardrail:** Match calculation **never** factors in name, photo, gender, caste, or religion.
