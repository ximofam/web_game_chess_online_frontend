# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Chess Online
**Category:** Modern Chess Platform

---

## 1. Product/Design Direction

This is a **serious, modern online chess platform**. It is a place for focus, strategy, and deep thinking.
The design should **NOT** feel like a generic SaaS dashboard (e.g., avoid over-nested cards, generic sidebar metrics, or bubbly graphics).
Instead, it should feel like an elegant, distraction-free environment for playing and studying chess.
- **Tone:** Focused, premium, tactile, intelligent.
- **Theme:** Default Dark Mode to reduce eye strain during long gaming sessions.

## 2. Visual Style

- **Minimalist & Content-First:** The chess board and game state are the undisputed heroes of the UI.
- **Classic meets Modern:** We use classic serif typography for headlines to evoke the rich history of chess, paired with a highly legible modern sans-serif for UI elements and game data.
- **Tactile but Flat:** Avoid heavy 3D effects or skeuomorphism. Depth is established through subtle shadows, strict z-index layers (background -> surface -> board), and precise border treatments.

## 3. Color Palette

Based on the core brand tokens:

| Role | Hex / rgba | CSS Variable | Usage |
|------|------------|--------------|-------|
| Background | `#0d0e12` | `--color-chess-dark` | App background, deep canvas |
| Surface | `#1a1d24` | `--color-chess-surface`| Cards, sidebars, modals |
| Accent (Gold) | `#d4af37` | `--color-chess-gold` | Primary buttons, winner highlights, current turn |
| Accent Hover | `#f3cd57` | `--color-chess-gold-hover` | Button hover states |
| Text Primary | `#f3f4f6` | `--color-chess-text` | Main body text, headings |
| Text Muted | `#9ca3af` | `--color-chess-muted` | Secondary text, timestamps, notation |
| Border | `#2d323f` | `--color-chess-border` | Dividers, card borders, input borders |
| Danger/Check | `#ef4444` | (Tailwind red-500) | King in check, error states |
| Success | `#10b981` | (Tailwind emerald-500) | Victory, correct puzzle moves |

## 4. Typography

- **Headings (Signature):** `Playfair Display`, serif. Used for page titles, player names, and major victory/defeat announcements.
- **UI & Data (Utility):** `Inter`, sans-serif. Used for notation (e4, Nf3), timers, chat, navigation, and buttons.
- **Monospace:** `ui-monospace, Consolas`. Used for PGN (Portable Game Notation) copying, FEN strings.

## 5. Spacing

We use an 8px baseline grid to keep the UI tight and dashboard-like where needed, but spacious in reading areas (like Learn/Forum).
- `xs`: 4px (tight gaps, notation items)
- `sm`: 8px (button padding, icon gaps)
- `md`: 16px (standard card padding, gaps between controls)
- `lg`: 24px (section padding)
- `xl`: 32px (margins between distinct functional areas)

## 6. Layout Principles

- **Board-Centric (Gameplay):** The chessboard must dominate the viewport. The sidebar (timers, notation, chat, controls) sits to the right on desktop, or stacks below on mobile.
- **Edge-to-Edge Canvas:** We use the full width of the screen. No constrained container widths for the main dashboard, to maximize space for lobbies and active games.
- **Restraint in Dividers:** Use 1px borders (`--color-chess-border`) to separate distinct areas, rather than alternating background colors.

## 7. Buttons

- **Primary Action (Gold):** Background `--color-chess-gold`, text `#000`, bold. Used for "Play Now", "Resign", "Find Match".
- **Secondary Action (Ghost):** Transparent background, border `--color-chess-border`, text `--color-chess-text`. Hover changes border to Gold or slightly lighter surface. Used for "Analyze", "Flip Board".
- **Danger Action:** Subdued red background. Hover intensifies red. For destructive actions (e.g., abandoning a tournament).

## 8. Cards

- **Style:** Background `--color-chess-surface`, border 1px solid `--color-chess-border`, border-radius `8px`.
- **Shadows:** Minimal (`shadow-md`). Rely more on border contrast against the dark background.
- **Usage:** Player profile summaries, active tournaments, lesson modules.

## 9. Forms

- **Inputs:** Background `#13161c` (darker than surface), border `--color-chess-border`, text `--color-chess-text`.
- **Focus State:** Outline `2px solid --color-chess-gold` with a 2px offset.
- **Labels:** Small, uppercase, `--color-chess-muted`, `Inter` font, `letter-spacing: 0.05em`.

## 10. Navigation

- **Primary Nav:** A sleek, minimal sidebar or top bar that uses icons + text for clear routing (Play, Learn, Forum, Profile).
- **Active State:** Highlighted with `--color-chess-gold` text and a subtle left border or bottom border.

## 11. Chess-board Related UI

- **Board Theme:** Default should be high contrast (e.g., dark squares subdued slate/blue, light squares off-white).
- **Move Highlights:** Subtle yellow/gold tint on the "from" and "to" squares of the previous move.
- **Legal Move Indicators:** Small solid dot on empty squares, hollow ring on capture squares.
- **Premoves:** Highlighted in a distinct red/orange tint.

## 12. Game UI

- **Timers:** Must be the most legible element other than the board. Use `Inter`, tabular numbers (`tabular-nums`), large font size.
- **Active Turn:** High contrast indicator (e.g., Gold background on the active player's timer).
- **Notation Sheet (PGN):** Scrollable list of moves. Current move highlighted. Standard algebraic notation.
- **Captured Pieces:** Small, muted icons below the player's name showing material advantage (e.g., "+2").

## 13. Lobby UI

- **Data Tables:** Clean rows for active challenges. No vertical borders. Hover effect on rows.
- **Matchmaking:** Clear, pulsing visual indicator while searching for an opponent.

## 14. Status Indicators

- **Online/Offline:** Green dot for online, hollow gray circle for offline.
- **Game State:** "Waiting", "In Progress", "Checkmate", "Draw". Use bold typography for terminal states.

## 15. Responsive Behavior

- **Mobile Gameplay:** The board must take up exactly 100vw width to maximize size. Timers stack above and below the board. Notation/Chat are hidden behind tabs.
- **Touch Targets:** Minimum 44x44px for all game controls (draw offer, resign, arrows).
- **Hover States:** Must gracefully degrade on touch devices (rely on active/pressed states).

## 16. Accessibility Rules

- **Contrast:** Text must meet 4.5:1 contrast against its background. The Gold accent on dark gray passes, but ensure Gold text on white/light is avoided.
- **Screen Readers:** Game notation must be accessible (`aria-live="polite"` for new moves).
- **Focus Rings:** Visible focus rings (Gold) on all interactive elements.

## 17. Animation/Interaction Rules

- **Piece Movement:** 150-200ms ease-in-out. Fast, snappy, not floaty.
- **UI Transitions:** Fade in/out for modals and tooltips (100ms).
- **Reduced Motion:** Respect `prefers-reduced-motion` by instantly snapping pieces and disabling background pulses.

## 18. Icons

- **Library:** Use `lucide-react` (already in `package.json`).
- **Style:** Consistent stroke width (2px), no filled versions unless indicating an active toggle state.
- **Avoid:** Emojis as UI elements.

## 19. Visual Patterns to Avoid

- ❌ **Generic SaaS Dashboards:** Don't use dashboard widgets for things that aren't data metrics.
- ❌ **Gradients & Glows:** No cyberpunk neon glows or heavy CSS gradients. Keep it flat, serious, and matte.
- ❌ **Purple on Dark:** No purple/violet accents on dark theme (violates strict rule).
- ❌ **Huge Untracked Typefaces:** No massive headings without proper tracking.
- ❌ **Bento Boxes:** Don't stuff icons and unrelated widgets into a bento box layout for the sake of trends.
- ❌ **Colored Border Accents:** No glowing colored outlines unless it's the exact `--color-chess-gold` focus state.
