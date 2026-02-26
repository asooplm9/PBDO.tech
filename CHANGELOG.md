# Changelog

All notable changes to PBDO.tech will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-26

### Added — Professional Platform Overhaul
- **monitoring.html** — Province-by-province monitoring page with all 31 provinces, sortable/filterable table, threat level badges, detail modal, and canvas charts
- **radar.html** — Full-screen animated radar with rotating sweep, contact blips, mode switching (biological/aerial/water), speed control, Web Audio API beep alerts, fullscreen mode
- **report.html** — Public reporting system with anonymous option, GPS location, file upload, math captcha, tracking code generation, and report status tracking
- **about.html** — Professional organization about page with timeline, org chart, leadership cards, achievements, and partner organizations
- **styles.css** — Shared stylesheet with RTL layout, dark theme, glassmorphism effects, component classes, and animations
- **scripts.js** — Shared JavaScript with Jalali calendar, sample data initialization, province data, tracking code generation
- **Mini radar section** in `index.html` — Animated radar canvas in dashboard with live stats panel
- **Full navigation** updated across all pages — all 7 pages linked in every nav bar
- **Alerts management section** in `admin.html` — CRUD for alerts/news with level selection and active toggle
- **Emergency banner** in `index.html` — Slot for critical national alerts
- **Jalali date/time display** in `index.html` — Live Persian calendar display
- **Leaflet map** in `contact.html` — Interactive map showing headquarters location
- **Emergency hotline** in `contact.html` — Prominent emergency number display
- **Service worker** updated (v2) — Added caching for all new pages and shared assets
- **sitemap.xml** updated — Added monitoring.html, radar.html, report.html, about.html

## [2.0.0] - 2026-02-26

### Added
- **README.md** — Professional README with badges, features list, project structure, contributing guide, and contact info
- **manifest.json** — PWA manifest with name "PBDO.tech", theme_color "#00ff88", display "standalone", icon placeholders
- **sw.js** — Service Worker with cache-first strategy for static assets and network-first for API calls (cache name: pbdo-v1)
- **privacy.html** — Privacy policy page in Persian/Farsi with RTL layout and dark theme
- **terms.html** — Terms of service page in Persian/Farsi with RTL layout and dark theme
- **contact.html** — Contact page with validated form (Name, Email, Subject, Message) and contact info section
- **faq.html** — FAQ page with 10 accordion-style questions about PBDO, bio-defense, and laser defense
- **status.html** — System status page with operational indicators for Website, Monitoring, Laser Defense, API, Database
- **print.css** — Print-friendly stylesheet hiding nav/footer/decorations, showing URLs, black on white
- **CHANGELOG.md** — This file
- **Back-to-Top button** in `index.html` — Floating button appearing after 300px scroll with smooth scroll and fade animation
- **Cookie Consent banner** in `index.html` — Slide-up banner with Accept/Learn More buttons, persisted in localStorage
- **PWA support** in `index.html` — manifest link and service worker registration script
- **Toast notification system** in `admin.html` — 4 types (success/error/warning/info), auto-dismiss 5s, top-right position
- **CSV export** in `admin.html` — Export reports table as downloadable CSV file
- **Print-to-PDF button** in `admin.html` — Opens browser print dialog
- **Backup Data** in `admin.html` — Exports all localStorage data as JSON download
- **Restore Data** in `admin.html` — File input to restore localStorage from JSON backup with confirmation
- **Global Search** in `admin.html` — Real-time search with text highlight, Ctrl+K/slash keyboard shortcut

### Changed
- **sitemap.xml** — Updated to include all pages (index, admin, privacy, terms, contact, faq, status, 404) with proper lastmod, changefreq, priority
- **README.md** — Replaced 2-line placeholder with comprehensive professional README

### Security
- **404.html** — Added Content-Security-Policy, X-Content-Type-Options, and Referrer-Policy meta headers
- **privacy.html**, **terms.html**, **contact.html**, **faq.html**, **status.html** — All new pages include full security meta headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- All new pages use `sanitizeHTML()` for XSS protection on user-generated content
