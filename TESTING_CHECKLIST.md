# Testing Checklist: Visual Proposal Generator

Use this checklist to verify each feature of the new local-first visual proposal system.

---

## 1. Quick Access & Setup

- [ ] Open the admin builder in your browser:  
  `studio-proposals-admin.html` (e.g., via your local development server or direct file path).
- [ ] Verify the header shows the **LMP Studio** logo, **"Proposal Builder"** label, drafts counter, and dark/light mode toggle.
- [ ] Toggle dark/light mode and confirm colors adapt cleanly according to the Lumina Noir design palette.

---

## 2. Admin Form / Builder Testing (`studio-proposals-admin.html`)

### 2.1 Metadata & Scope
- [ ] **Client & Project Fields**:
  - [ ] Enter a **Client Name** (e.g. `Elena Rostova`).
  - [ ] Enter an optional **Company** (e.g. `Vogue Editorial`).
  - [ ] Enter a **Project Title** (e.g. `Spring Dance & Portrait Portfolio`).
  - [ ] Change the **Proposal Date** and **Expiration Date** (set expiry 14 days in the future).
  - [ ] Select initial client language (`English` or `Español`).
- [ ] **Scope & Creative Direction (Single Field)**:
  - [ ] Type creative notes with Markdown: `**Creative Direction:** Studio session.\n- Look changes\n- Lighting setup`.
  - [ ] Confirm there is only 1 unified field (whatever is typed here will display as is on the proposal, regardless of language toggle).

### 2.2 Packages & Add-ons
- [ ] **Package Selection**:
  - [ ] Click **"1 Hour Studio Session"** (150 €) → Confirm sidebar reflects 150 €.
  - [ ] Switch to **"2 Hour Studio Session"** (250 €) → Confirm sidebar updates to 250 €.
  - [ ] Switch to **"Dance Video Sessions (Base Pack)"** (120 €) → Confirm sidebar updates to 120 €.
  - [ ] Select **"Custom Tailored Package"** → Confirm custom name and custom price fields appear.
- [ ] **Extra Shooting Time (1h vs 30 min)**:
  - [ ] Locate **"Extra Shooting Time (30 min)"** (+25 € / 30 min).
  - [ ] Set Qty to `2` → Confirm sidebar adds `+50 €` (2 × 25 €).
  - [ ] Locate **"Extra Shooting Time (1 hour)"** (+40 € / hour).
  - [ ] Set Qty to `1` → Confirm sidebar adds `+40 €`.
- [ ] **Other Add-ons**:
  - [ ] Test checking/unchecking other photo/video add-ons (Video Clip, Location, Extra Photos, etc.).
- [ ] **Custom Line Items**:
  - [ ] Click **"Add Item"** under section 5.
  - [ ] Enter description `Studio assistant fee` and price `60` → Confirm sidebar adds +60 €.

### 2.3 Included Deliverables (View & Edit)
- [ ] Verify section 6 lists the auto-generated deliverables for the selected package and add-ons.
- [ ] Click into any deliverable line and edit the text (e.g., change "Up to 3 outfits" to "Up to 4 outfits").
- [ ] Click **"Add Item"** → Enter a custom bullet point (e.g. "Includes backstage BTS clip").
- [ ] Click the delete trash icon next to a deliverable item → Confirm it is removed.
- [ ] Click **"Reset to Defaults"** → Confirm the deliverables list resets back to the catalog defaults.

### 2.5 Section Visibility Toggles (Show / Hide per Section)
- [ ] In the admin builder, test the **"Show Section"** checkbox for each section:
  - [ ] **2. Scope & Creative Direction**: Toggle OFF → Controls dim, proposal omits the Scope card.
  - [ ] **4. Optional Add-ons**: Toggle OFF → Controls dim.
  - [ ] **5. Custom Line Items**: Toggle OFF → Controls dim.
  - [ ] **6. Included Deliverables**: Toggle OFF → Controls dim, proposal omits Deliverables card.
  - [ ] **7. Hero Preview Images**: Toggle OFF → Gallery preview dims, proposal omits the Hero Gallery.
  - [ ] **8. Financial Breakdown**: Toggle OFF → Money controls dim, proposal omits the Financial Breakdown table.
- [ ] Verify that toggling any section back ON re-enables its controls and restores it on the proposal preview.

---

## 3. Money & Calculation Panel Testing

Test each row's toggle, mode switch (`%` vs `€`), and calculation order:

- [ ] **Subtotal Baseline**:
  - Select **1h Session (150 €)** + **Video Clip (+50 €)** = **200 € Subtotal**.
- [ ] **Discount**:
  - [ ] Toggle **Apply Discount** ON.
  - [ ] Leave at **Percent (%) = 10%** → Confirm discount is `- 20 €`, Net is `180 €`.
  - [ ] Switch to **Fixed (€)** and set `25` → Confirm discount is `- 25 €`, Net is `175 €`.
  - [ ] Toggle Discount OFF → Confirm line disappears from the summary.
- [ ] **VAT / IVA**:
  - [ ] Toggle **Apply VAT / IVA** ON.
  - [ ] Set **Percent (%) = 21%** on Net `180 €` → Confirm VAT is `+ 37.80 €`, Total is `217.80 €`.
  - [ ] Switch to **Fixed (€)** and set `50` → Confirm VAT is `+ 50 €`.
  - [ ] Toggle VAT OFF → Confirm line disappears.
- [ ] **Deposit & Balance**:
  - [ ] Toggle **Require Deposit** ON.
  - [ ] Set **Percent (%) = 30%** on Total `200 €` → Confirm Deposit is `60 €`, Balance due is `140 €`.
  - [ ] Switch to **Fixed (€)** and set `50` → Confirm Deposit is `50 €`, Balance due is `150 €`.
  - [ ] Toggle Deposit OFF → Confirm both Deposit and Balance rows disappear from the summary.

---

## 4. Local-First Drafts & URL Link Generation

- [ ] Click **"Save to Drafts"**:
  - [ ] Verify the toast notification appears (`Proposal saved to local drafts!`).
  - [ ] Verify the **Drafts (count)** button counter increases.
- [ ] Click **"Drafts"**:
  - [ ] Verify the modal opens and displays the saved proposal with its ID, client name, and total.
  - [ ] Click **"Load"** on a draft → Confirm form fields repopulate accurately.
  - [ ] Click the delete icon on a draft → Confirm it is removed from localStorage.
- [ ] Click **"Copy Direct Link"**:
  - [ ] Verify the link is copied to the clipboard.
  - [ ] Inspect the link: ensure it points to `proposal.html#p=...` with a compressed base64 string.
- [ ] Click **"Open Preview in New Tab"**:
  - [ ] Confirm `proposal.html` opens in a new tab with the proposal loaded from the URL hash.

---

## 5. Client View Testing (`proposal.html`)

### 5.1 Presentation & Gallery
- [ ] Open the generated link in a new incognito window.
- [ ] Verify the **Header & Layout**:
  - Sticky website navbar is **removed** to avoid header duplication.
  - Clean top document bar: **LMP Studio logo** on the left, localized **"PROJECT PROPOSAL" / "PROPUESTA DE PROYECTO"** label on the right.
  - Redundant brand names and sub-bars inside the project card are removed.
  - Project card cleanly leads with the project title and client name.
  - Single streamlined footer at the bottom without repeating brand name.
  - The document renders consistently on screen and in the PDF export.
- [ ] Verify the **Metadata Block**:
  - Displays the single scope text as entered with Markdown rendering (`**bold**`, `- list`).
- [ ] Verify the **Included Deliverables**:
  - Shows custom/edited deliverables list with icons.
- [ ] Verify the **Hero Gallery**:
  - Positioned directly **between Deliverables and the Financial Breakdown**.
  - Displays as a balanced **3-column grid of vertical (3:4 ratio) images**.
  - If gallery toggle was set to OFF, the gallery section is completely omitted.
- [ ] Verify the **Financial Table**:
  - Itemized rows display correct quantities, unit rates, and totals.
  - Only active rows (Discount, VAT, Deposit, Balance) are visible.

### 5.2 Expiration Testing
- [ ] In the admin builder, set the **Expiration Date** to a date in the past (e.g. yesterday).
- [ ] Copy and open the new link in `proposal.html`:
  - [ ] Verify the red **"This proposal has expired"** banner appears at the top.
  - [ ] Verify the proposal details remain readable and printable.
  - [ ] Verify the primary action button changes from **"Accept via WhatsApp"** to **"Request Updated Quote"**.

### 5.3 WhatsApp CTA Integration
- [ ] Click the **WhatsApp** button:
  - [ ] Verify it opens `https://wa.me/34634518666` with a pre-filled message.
  - [ ] **Active Proposal**: Confirm the message contains the project title, reference ID, and total amount.
  - [ ] **Expired Proposal**: Confirm the message requests an updated quote referencing the project and ID.

---

## 6. PDF Print Testing (`window.print()`)

- [ ] On `proposal.html`, click **"Download PDF"** (or press `Ctrl+P` / `Cmd+P`):
  - [ ] In the browser print dialog:
    - [ ] Destination: **Save as PDF**.
    - [ ] Layout: **A4 Portrait**.
  - [ ] **Visual inspection in print preview**:
    - [ ] Navigation header and interactive action buttons are hidden (`.no-print`).
    - [ ] Branded document header is clearly visible with **LMP Studio logo**, "Project Proposal" label, and location subtitle.
    - [ ] Clean white background with crisp dark text.
    - [ ] 3-column vertical hero images (3:4 portrait aspect ratio) print cleanly without dominating vertical space.
    - [ ] Tight vertical padding and compact line spacing allow standard proposals to fit on a **single A4 page**.
    - [ ] Save the PDF and open it to verify layout fidelity.

---

## 7. Edge Cases & Error Handling

- [ ] Open `proposal.html` with an empty hash (`proposal.html`) or invalid hash (`proposal.html#p=invalid123`):
  - [ ] Verify the user-friendly **"Proposal Not Found"** error screen displays with a link back to the homepage.
- [ ] Check `robots.txt` in the root:
  - [ ] Verify `Disallow: /studio-proposals-admin.html` is present.
