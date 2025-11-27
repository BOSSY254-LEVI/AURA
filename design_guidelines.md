# AURA Design Guidelines

## Design Approach

**Framework**: Trauma-Informed Design System based on Material Design principles, specifically adapted for safety-critical applications serving vulnerable African women and girls.

**Core Principles**:
- Safety First: Every design decision prioritizes user emotional and physical safety
- Clarity Over Cleverness: Scannable information hierarchy
- Trust Through Transparency: Clear communication of actions and consequences
- Empowerment Through Control: Users maintain full agency over features and data

## Color System

**Primary Palette**:
- Primary Purple: #8B5CF6 (Interactive elements, primary actions)
- Light Purple: #C4B5FD (Backgrounds, hover states)
- Deep Purple: #6D28D9 (Headers, important text)
- Primary Teal: #14B8A6 (Success states, progress indicators)
- Light Teal: #5EEAD4 (Accents, highlights)
- Deep Teal: #0F766E (Secondary actions)

**Supporting Colors**:
- Warm Amber: #F59E0B (Warnings, important alerts - never red)
- Soft Gray: #6B7280 (Secondary text, borders)
- Light Gray: #F3F4F6 (Backgrounds, cards)
- White: #FFFFFF (Primary backgrounds)

**Gradients**:
- Hero Background: Purple to Teal diagonal (from-purple-500 to-teal-400)
- Card Highlights: Subtle purple to light purple (from-purple-50 to-purple-100)
- Emergency Button: Amber to orange gentle pulse (from-amber-500 to-orange-500)
- Success States: Teal gradient (from-teal-400 to-teal-600)

**Application Rules**:
- Primary actions: Purple fill, white text
- Secondary actions: Teal outline, teal text
- Backgrounds: White base with light purple/gray accents
- Never use harsh reds - use warm amber for warnings
- Maintain 4.5:1 contrast ratio minimum

## Typography

**Font System**: Google Fonts via CDN
- Primary: Inter (400, 500, 600) - Body text, UI elements
- Accent: Poppins (500, 600) - Headers, emphasis
- Monospace: JetBrains Mono (400) - Timestamps, technical data

**Type Scale**:
- Hero Titles: text-4xl md:text-5xl font-semibold (Deep Purple)
- Section Headers: text-2xl md:text-3xl font-semibold (Deep Purple)
- Card Titles: text-lg md:text-xl font-medium (Primary Purple)
- Body Text: text-base leading-relaxed (Gray-800)
- Helper Text: text-sm (Soft Gray)
- Labels: text-xs uppercase tracking-wide (Soft Gray)

**Critical Rules**:
- Minimum 16px body text for trauma-sensitive readability
- Line height: 1.6-1.8
- Never all-caps for warnings (feels aggressive)
- Sentence case for conversational UI copy

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Section spacing: py-12 md:py-16 lg:py-20
- Card gaps: gap-4 md:gap-6
- Major section margins: mb-12 md:mb-16

**Grid System**:
- Dashboard Widgets: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Main Content: max-w-7xl mx-auto px-4 md:px-6
- Forms/Focused: max-w-2xl mx-auto
- Learning Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Safe Zones**:
- Bottom 80px: Reserved for emergency panic button (fixed)
- Top 64px: Persistent navigation
- All touch targets: Minimum 44x44px

## Component Library

### Navigation
**Desktop**: Soft-edged sidebar with purple accent, Heroicons (outline inactive, solid active)
**Mobile**: Bottom tab bar with teal active indicators
**Structure**: Dashboard, Vault, Guardian, Learn, Community, Emergency
**Active State**: Light purple background fill, no harsh borders

### Cards & Containers
**Standard Card**: rounded-xl, shadow-md, p-6, white background with subtle purple border on hover
- Threat Detection: Severity badge (amber/teal), timestamp, clear action button
- Evidence Vault: Thumbnail, metadata, "Encrypted" badge with lock icon
- Learning Modules: Progress bar (teal), time estimate, difficulty indicator
- Dashboard Widgets: Large purple circular progress, recent alerts list, 2x3 quick actions grid

### Forms & Inputs
**All Fields**:
- Labels above (never floating)
- Helper text below in soft gray
- Generous spacing (mb-6)
- Amber validation with constructive guidance
- Purple focus rings (ring-2 ring-purple-500)

**Evidence Collection**: Multi-step wizard with teal progress bar, auto-save with purple confirmation, drag-drop zones

### Buttons
**Primary**: rounded-lg px-6 py-3 font-medium, purple background, white text
**Secondary**: Teal outline, teal text, transparent background
**Emergency**: Larger (py-4), amber-orange gradient, white text with icon
**On Images**: backdrop-blur-md with semi-transparent purple/teal fill

**Grouping**: Stack mobile (w-full), horizontal desktop (gap-4), primary rightmost

### Data Visualization
**Charts** (Chart.js via CDN):
- Threat Timeline: Smooth purple line charts
- Category Breakdown: Teal donut charts with accessible legends
- Comparative Data: Purple/teal bar charts
- Heatmaps: Purple-to-teal gentle gradients
- All charts include text summaries for screen readers

### Modals & Overlays
**Structure**: Centered, backdrop-blur, max-w-lg to max-w-2xl, clear X button (top-right), actions bottom-right
**Emergency Mode**: Full-screen purple overlay with limited clear options

### Icons
**Library**: Heroicons (w-5 h-5 inline, w-6 h-6 standalone)
- Safety: shield-check, Vault: lock-closed, Emergency: exclamation-circle
- Learning: academic-cap, Community: user-group, AI: sparkles
- Consistent purple/teal coloring based on context

## Images

**Hero Section**: 
- Full-width abstract geometric pattern suggesting protection (interlocking shields, flowing curves)
- Purple-to-teal diagonal gradient overlay ensuring text legibility
- Hero buttons with backdrop-blur-md and semi-transparent purple fill
- NO photographic imagery to avoid triggers
- Height: min-h-[500px] md:min-h-[600px]

**Feature Sections**:
- Learning Center: Illustrations of diverse African women in empowered, safe contexts
- Community: Abstract network diagrams showing connection (purple/teal nodes)
- Evidence Vault: Abstract lock/security iconography with purple accents
- AI Companion: Friendly geometric AI visualization (purple/teal palette)
- Threat Dashboard: Minimal shield iconography in empty states

**Guidelines**:
- Avoid triggering imagery (confrontation, distress, violence)
- Illustrations over photography
- Diverse representation across African skin tones and regions
- All images with meaningful alt text
- Purple/teal color palette maintained in all illustrations

## Special Patterns

### Trauma-Informed Features
- Safe Mode Toggle: Quick disguise with calendar/weather app appearance
- Gentle Notifications: Subtle teal slide-ins from top-right
- Confirmation Steps: All irreversible actions require modal confirmation
- Clear Exits: Every flow allows exit without data loss

### Accessibility
- High Contrast Mode: User-selectable option
- Large Text: 1.5x scaling option
- Full keyboard navigation with visible purple focus indicators
- Screen reader optimized labels
- Voice command visual indicators

### Emergency UI
- Panic Button: Fixed bottom-right, amber-orange pulsing gradient, shadow-xl
- Quick Exit: Top-left discrete icon, clears sensitive data instantly
- Emergency Mode: Darkened purple overlay, simplified options

### Responsive Breakpoints
- Mobile: 320-767px (primary focus, bottom navigation)
- Tablet: 768-1023px (hybrid layout)
- Desktop: 1024px+ (sidebar navigation)

This system creates a digital sanctuary—calming purple/teal aesthetics combined with trauma-informed patterns that prioritize safety, clarity, and user empowerment at every interaction.