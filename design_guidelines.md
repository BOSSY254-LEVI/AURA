# AURA Design Guidelines

## Design Approach

**Framework**: Trauma-Informed Design System based on Material Design principles, adapted specifically for safety-critical applications serving vulnerable populations. This approach prioritizes psychological safety, accessibility, and trust-building over visual novelty.

**Core Principles**:
- Safety First: Every design decision prioritizes user emotional and physical safety
- Clarity Over Cleverness: Information hierarchy must be immediately scannable
- Trust Through Transparency: Actions and consequences are always clearly communicated
- Empowerment Through Control: Users maintain agency over all features and data

## Typography

**Font System**: Google Fonts via CDN
- Primary: Inter (400, 500, 600) - exceptional legibility, professional, calming
- Accent: Poppins (500, 600) - for section headers, warm and approachable
- Monospace: JetBrains Mono (400) - for evidence vault timestamps and technical data

**Type Scale**:
- Hero/Page Titles: text-4xl md:text-5xl font-semibold
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-lg md:text-xl font-medium
- Body: text-base leading-relaxed
- Helper/Meta: text-sm
- Labels: text-xs uppercase tracking-wide

**Critical Typography Rules**:
- Never use all-caps for warnings or alerts (feels aggressive)
- Minimum body text size: 16px for trauma-sensitive readability
- Line height: 1.6-1.8 for comfortable reading
- Use sentence case for UI copy to feel conversational

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Section spacing: py-12 md:py-16
- Card gaps: gap-4 to gap-6
- Margin between major sections: mb-12 to mb-20

**Grid System**:
- Dashboard: 12-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Main content areas: max-w-7xl mx-auto px-4 md:px-6
- Forms and focused content: max-w-2xl mx-auto
- Learning cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Safe Zones**:
- Bottom 80px reserved for emergency panic button (fixed position)
- Top 64px for persistent navigation
- All interactive elements minimum 44x44px touch targets

## Component Library

### Navigation
**Primary Navigation**: Soft-edged sidebar (desktop) / bottom tab bar (mobile)
- Icons: Heroicons (outline for inactive, solid for active states)
- Labels always visible (no icon-only states that confuse)
- Active state: gentle background fill, not harsh borders
- Structure: Dashboard, Vault, Guardian, Learn, Community, Emergency

### Cards & Containers
**Standard Card**: Rounded corners (rounded-xl), subtle elevation (shadow-md), generous padding (p-6)
- Threat Detection Cards: Include severity indicator (not alarming color), timestamp, action button
- Evidence Vault Items: Thumbnail preview, metadata, encrypted badge
- Learning Module Cards: Progress indicator, estimated time, difficulty level

**Dashboard Widgets**:
- Safety Score Display: Large circular progress indicator with reassuring messaging
- Recent Alerts Panel: List view with clear visual hierarchy
- Quick Actions Grid: 2x2 or 3x2 grid of primary feature access points

### Forms & Inputs
**All Form Fields**:
- Labels above inputs (not floating, less cognitive load)
- Helper text below in muted style
- Clear validation states with supportive language
- Generous spacing between fields (mb-6)
- Optional fields clearly marked
- Never use red for errors - use amber tones with constructive guidance

**Evidence Collection Forms**:
- Multi-step wizard with clear progress indicator
- Auto-save functionality with visible confirmation
- Upload zones with drag-and-drop and browse options
- Preview capability before submission

### Buttons
**Primary Action**: Rounded-lg, px-6 py-3, font-medium
- Emergency actions: Slightly larger (py-4) with icon
- Destructive actions: Require confirmation modal, use amber warning tone

**Secondary Actions**: Ghost style with subtle border
**Tertiary**: Text-only with underline on hover

**Button Groupings**: 
- Stack vertically on mobile (w-full)
- Horizontal on desktop with gap-4
- Primary always rightmost in groups

### Data Visualization
**Analytics Dashboard**:
- Line charts for threat timeline (smooth curves, not jagged)
- Donut charts for threat categories (accessible legends)
- Heatmaps with gentle gradients (never alarming reds)
- Bar charts for comparative data

**Chart Library**: Chart.js via CDN with custom trauma-informed color palette
- All charts include text summaries for screen readers
- Data points clearly labeled
- Interactive tooltips with additional context

### Modals & Overlays
**Modal Structure**: 
- Centered overlay with backdrop blur
- max-w-lg to max-w-2xl depending on content
- Clear close button (top-right)
- Action buttons at bottom-right
- Never auto-close on critical information

**Emergency Overlays**: Full-screen takeover when panic mode activated

### Icons
**Icon Library**: Heroicons (outline and solid variants)
- Safety/Guardian: shield-check
- Vault: lock-closed
- Emergency: exclamation-circle (not exclamation-triangle)
- Learning: academic-cap
- Community: user-group
- AI Companion: sparkles
- Consistent sizing: w-5 h-5 for inline, w-6 h-6 for standalone

## Images

**Hero Section** (Dashboard Landing):
- Background: Abstract geometric pattern suggesting safety/protection (interlocking shapes, shield motifs)
- Overlay: Semi-transparent gradient overlay ensuring text legibility
- NO photographic imagery in hero to avoid triggering associations
- Buttons on hero: Background blur (backdrop-blur-md) with semi-transparent fill

**Feature Sections**:
- Learning Center: Illustrations of diverse African women in safe, empowered contexts
- Community Protection: Abstract network diagrams showing connection and support
- Evidence Vault: Lock/security iconography, no realistic imagery
- AI Companion: Friendly, abstract AI assistant visualization

**General Image Guidelines**:
- Avoid any imagery that could be triggering (confrontation, distress, violence)
- Use illustrations over photography where possible
- Ensure diverse representation of African women across skin tones and regions
- All images must have meaningful alt text

**Image Placement**:
- Dashboard: Small illustrative icons in empty states
- Learning modules: Header illustrations for each course
- Success states: Celebratory but calm illustrations
- No large hero image due to trauma-informed approach

## Special Considerations

### Trauma-Informed Design Patterns
- **Safe Mode Toggle**: Discrete icon that quickly disguises app appearance
- **Gentle Notifications**: Use subtle slide-ins, never jarring pop-ups
- **Confirmation Steps**: All irreversible actions require explicit confirmation
- **Escape Routes**: Every flow has a clear exit without losing progress

### Accessibility Features
- **High Contrast Mode**: User-selectable increased contrast option
- **Large Text Mode**: 1.5x scale option throughout
- **Screen Reader Optimization**: All interactive elements properly labeled
- **Keyboard Navigation**: Full app usable without mouse/touch
- **Voice Commands**: Visual indicators for voice-activated features

### Multi-Language Support
- **Text Expansion**: Layouts accommodate 40% text expansion for translations
- **RTL Support**: Arabic interface fully supports right-to-left reading
- **Language Switcher**: Persistent access in navigation, flags + native language names

### Responsive Breakpoints
- Mobile: 320px - 767px (primary focus)
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Large Desktop: 1440px+

### Emergency UI Patterns
- **Panic Button**: Fixed bottom-right, red-amber gradient, pulsing shadow
- **Emergency Mode**: Darkened interface, limited options, clear exit instructions
- **Quick Exit**: Persistent escape route that clears sensitive data from view

This design system creates a sanctuary of digital safety—professional yet compassionate, powerful yet approachable, technically sophisticated yet human-centered. Every element reinforces trust, clarity, and user empowerment.