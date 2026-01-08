# 🎮 Game Industry Resources - Brand Guidelines

**Version:** 1.0  
**Last Updated:** 2026-01-08  
**Status:** Living Document

---

## 🎯 Brand Essence

### Mission
Empoderar a game developers en LATAM con recursos profesionales, gratuitos y divertidos para conseguir trabajo y fundar estudios rentables.

### Personality
- **Profesional** pero no corporativo
- **Divertido** pero no infantil  
- **Gamer** pero no amateur
- **Accesible** pero no simplista

### Voice & Tone
- **Tú/Vos**: Cercano y directo
- **Jerga gamer**: Moderada y contextual
- **Spanglish técnico**: Permitido cuando es natural
- **Emojis**: Estratégicos, no excesivos

---

## 🎨 Visual Identity

### Concept: "Retro Arcade Terminal"
Un sistema de diseño que combina:
- Estética arcade de los 80s/90s
- Terminales de comando cyberpunk
- UI de videojuegos modernos
- Profesionalismo tech startup

### Color Palette

#### Primary Colors
```css
--neon-cyan: #00ffff;      /* Color principal - Acciones, links, borders */
--neon-pink: #ff2d95;      /* Secundario - Badges, highlights */
--neon-green: #39ff14;     /* Success - XP, achievements */
--neon-orange: #ff6b00;    /* Warning/Hot - Jobs, urgency */
--neon-purple: #b026ff;    /* Special - Premium features */
--gold: #ffd700;           /* Achievements - Badges, rewards */
```

#### Background Colors
```css
--bg-primary: #0d0d1a;     /* Fondo principal */
--bg-secondary: #1a1a2e;   /* Cards, elevated elements */
--bg-card: #16213e;        /* Cards específicas */
--bg-glass: rgba(26, 26, 46, 0.8); /* Overlays con blur */
```

#### Text Colors
```css
--text-primary: #ffffff;   /* Headings, important text */
--text-secondary: #a8b2d1; /* Body text, descriptions */
--text-muted: #6b7280;     /* Subtle text, hints */
```

### Typography

#### Font Families
```css
/* Headings principales SOLAMENTE */
--font-heading: 'Press Start 2P', monospace;

/* Todo lo demás */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code snippets */
--font-mono: 'Courier New', monospace;
```

#### Usage Rules
1. **Press Start 2P**: SOLO para:
   - H1 de hero sections
   - Títulos principales de página
   - XP/Level badges
   - Elementos retro específicos

2. **Inter**: Para TODO lo demás:
   - H2, H3, H4, H5, H6
   - Body text
   - Buttons
   - Navigation
   - Cards
   - Forms

3. **Courier New**: Solo para:
   - Code blocks
   - Terminal-style sections
   - Technical snippets

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-xl: 1.25rem;    /* 20px - H4 */
--text-2xl: 1.5rem;    /* 24px - H3 */
--text-3xl: 1.875rem;  /* 30px - H2 */
--text-4xl: 2.25rem;   /* 36px - H1 secondary */
--text-5xl: 3rem;      /* 48px - H1 hero */
```

### Spacing System
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
```

**Regla de oro**: Usar SIEMPRE variables, nunca valores hardcoded.

---

## 🧩 Component Library

### Hero Section

#### Estructura Estándar
```html
<header class="hero hero--[variant]">
  <div class="container">
    <div class="hero__content">
      <div class="hero__badge">
        <span class="hero__badge-dot"></span>
        <span>[Badge Text]</span>
      </div>
      <h1 class="hero__title">[Title]</h1>
      <p class="hero__subtitle">[Subtitle]</p>
      <div class="hero__actions">
        <a href="#" class="btn btn-primary">[CTA Primary]</a>
        <a href="#" class="btn btn-secondary">[CTA Secondary]</a>
      </div>
    </div>
  </div>
</header>
```

#### Variantes
- `hero` (default) - Cyan gradient
- `hero--tools` - Cyan accent (Production)
- `hero--marketing` - Pink accent (Marketing)
- `hero--database` - Green accent (Database)

#### Reglas
- ✅ Usar gradientes CSS, NO imágenes de fondo
- ✅ Máximo 2 CTAs
- ✅ Badge siempre presente
- ✅ Subtitle máximo 2 líneas
- ❌ NO usar imágenes generadas
- ❌ NO más de 3 colores en un hero

### Cards

#### Estructura Estándar
```html
<article class="card">
  <div class="card__icon">[Emoji]</div>
  <span class="card__badge card__badge--[type]">[Badge]</span>
  <h3 class="card__title">[Title]</h3>
  <p class="card__description">[Description]</p>
  <div class="card__actions">
    <a href="#" class="btn btn-ghost">[Action]</a>
  </div>
</article>
```

#### Badge Types
- `card__badge--new` - Gold, para features nuevas
- `card__badge--hot` - Orange, para contenido urgente
- `card__badge--coming` - Gray, para "Coming Soon"

#### Reglas
- ✅ Icono siempre emoji (consistente, rápido)
- ✅ Título máximo 3 palabras
- ✅ Descripción máximo 2 líneas
- ✅ Hover effect SIEMPRE
- ❌ NO iconos SVG custom (usar emojis)
- ❌ NO más de 1 badge por card

### Buttons

#### Jerarquía
```html
<!-- Primary: Acción principal -->
<button class="btn btn-primary">[Text]</button>

<!-- Secondary: Acción secundaria -->
<button class="btn btn-secondary">[Text]</button>

<!-- Ghost: Acción terciaria -->
<button class="btn btn-ghost">[Text]</button>
```

#### Sizes
```html
<button class="btn btn-sm">[Small]</button>
<button class="btn">[Default]</button>
<button class="btn btn-lg">[Large]</button>
```

#### Reglas
- ✅ Máximo 2-3 palabras
- ✅ Emoji al inicio (opcional pero recomendado)
- ✅ Hover effect con glow
- ❌ NO más de 2 botones primary en una sección
- ❌ NO texto muy largo

### Navigation

#### Estructura Estándar
```html
<nav class="nav">
  <div class="nav__container container">
    <a href="/" class="nav__logo">
      <span class="nav__logo-icon">🎮</span>
      <span>Game<span class="text-neon-pink">Dev</span> Resources</span>
    </a>
    <ul class="nav__menu">
      <li><a href="#" class="nav__link nav__link--active">[Link]</a></li>
      <li><a href="#" class="nav__link">[Link]</a></li>
    </ul>
    <div class="nav__cta">
      <div class="lang-switch">
        <a href="/" class="active">🇲🇽 ES</a>
        <a href="/en/">🇺🇸 EN</a>
      </div>
      <a href="#" class="btn btn-primary">[CTA]</a>
    </div>
  </div>
</nav>
```

#### Reglas
- ✅ Sticky en todas las páginas
- ✅ Logo SIEMPRE igual
- ✅ Máximo 5 links en nav__menu
- ✅ Language switcher SIEMPRE visible
- ❌ NO cambiar orden de elementos
- ❌ NO más de 1 CTA button

---

## 🎮 Gamification Elements

### XP Container
**Posición**: Fixed, top-left (80px from top, 20px from left)
**Presente en**: TODAS las páginas
**Estructura**:
```html
<div class="xp-container">
  <div class="level-badge">LVL <span id="level-display">1</span></div>
  <div class="xp-bar-bg">
    <div class="xp-bar-fill" id="xp-bar-fill"></div>
  </div>
</div>
```

### Guide Bot
**Posición**: Fixed, bottom-right (20px from bottom, 20px from right)
**Presente en**: TODAS las páginas
**Estructura**:
```html
<div class="guide-bot-container" id="guideBot">
  <div class="guide-bot"></div>
  <div class="guide-speech-bubble" id="guideBubble">
    [Mensaje contextual]
  </div>
</div>
```

### Sound Toggle
**Posición**: Fixed, bottom-right (100px from bottom, 20px from right)
**Presente en**: TODAS las páginas
**Estructura**:
```html
<button class="sound-toggle" id="soundToggle">
  <span class="sound-icon sound-on">🔊</span>
  <span class="sound-icon sound-off" style="display: none;">🔇</span>
</button>
```

### Reglas de Gamificación
- ✅ XP Bar, Guide Bot y Sound Toggle en TODAS las páginas
- ✅ Sonidos en hover/click de elementos interactivos
- ✅ Konami Code funcional en todas las páginas
- ✅ Guide Bot con mensajes contextuales por página
- ❌ NO ocultar elementos de gamificación
- ❌ NO cambiar posiciones fijas

---

## 📐 Layout Patterns

### Grid System
```css
.grid { display: grid; gap: var(--space-xl); }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
```

### Stats Grid (Específico)
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
}
```

### Container
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
```

### Reglas de Layout
- ✅ Usar grid para layouts de 2+ columnas
- ✅ Usar flexbox para alineación de elementos
- ✅ Container SIEMPRE con max-width: 1200px
- ✅ Responsive: mobile-first approach
- ❌ NO usar floats
- ❌ NO usar position: absolute para layouts
- ❌ NO dejar grandes espacios vacíos en desktop

---

## ✨ Effects & Animations

### Hover Effects
```css
/* Cards */
.card:hover {
  border-color: var(--border-glow);
  box-shadow: var(--glow-cyan);
  transform: translateY(-4px);
}

/* Buttons */
.btn:hover {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* Links */
a:hover {
  color: var(--neon-pink);
  text-shadow: var(--glow-pink);
}
```

### Animations
```css
/* Float (para iconos) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Pulse (para badges) */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* FadeInUp (para contenido) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Reglas de Animaciones
- ✅ Duración: 300-500ms para interacciones
- ✅ Easing: cubic-bezier para bounce effects
- ✅ Usar CSS animations, no JS cuando sea posible
- ✅ Respetar prefers-reduced-motion
- ❌ NO animaciones mayores a 1s
- ❌ NO más de 3 animaciones simultáneas
- ❌ NO animaciones que distraigan del contenido

---

## 🎨 Page-Specific Variants

### Index (Home)
- **Hero**: Default (cyan gradient)
- **Accent Color**: Cyan
- **Guide Bot Message**: "¡Hola! Explora recursos y gana XP 🎮"

### Jobs & Career
- **Hero**: Default
- **Accent Color**: Orange (jobs theme)
- **Guide Bot Message**: "¡Consigue chamba! Click para tips 💼"

### Tools (Production)
- **Hero**: `hero--tools` (cyan/blueprint)
- **Accent Color**: Cyan
- **Guide Bot Message**: "Descarga templates probados en AAA 🛠️"

### Marketing
- **Hero**: `hero--marketing` (pink accent)
- **Accent Color**: Pink
- **Guide Bot Message**: "Promociona tu juego sin presupuesto 📢"

### Database
- **Hero**: `hero--database` (green/terminal)
- **Accent Color**: Green
- **Guide Bot Message**: "Explora estudios LATAM 🌎"

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 480px) {
  /* Smartphones */
}

@media (max-width: 768px) {
  /* Tablets portrait */
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
}

@media (max-width: 1024px) {
  /* Tablets landscape */
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  /* Desktop */
  /* Layout óptimo */
}
```

### Reglas Responsive
- ✅ Mobile-first approach
- ✅ Touch targets mínimo 44x44px
- ✅ Font sizes con clamp() para fluidez
- ✅ Imágenes con max-width: 100%
- ❌ NO ocultar contenido importante en mobile
- ❌ NO asumir hover en mobile
- ❌ NO layouts que requieran scroll horizontal

---

## ♿ Accessibility

### Contraste
- **Text on dark bg**: Mínimo 4.5:1
- **Large text**: Mínimo 3:1
- **Interactive elements**: Mínimo 3:1

### Focus States
```css
*:focus {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Labels
```html
<!-- Buttons con iconos -->
<button aria-label="Toggle sound">🔊</button>

<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">

<!-- Sections -->
<section aria-labelledby="section-title">
  <h2 id="section-title">Title</h2>
</section>
```

### Reglas de Accesibilidad
- ✅ Headings jerárquicos (h1 > h2 > h3)
- ✅ Alt text en todas las imágenes
- ✅ Labels en todos los inputs
- ✅ Keyboard navigation funcional
- ✅ Screen reader friendly
- ❌ NO usar solo color para transmitir info
- ❌ NO elementos clickeables sin feedback
- ❌ NO skip heading levels

---

## 📝 Content Guidelines

### Headings
- **H1**: 1 por página, título principal
- **H2**: Secciones principales
- **H3**: Subsecciones, card titles
- **H4**: Elementos menores

### Copy
- **Tono**: Casual pero profesional
- **Longitud**: Conciso, escaneable
- **Bullets**: Máximo 5 items
- **Párrafos**: Máximo 3-4 líneas

### Emojis
**Uso estratégico**:
- ✅ Iconos de cards (1 por card)
- ✅ CTAs (opcional, al inicio)
- ✅ Badges (contextual)
- ✅ Navigation items (opcional)
- ❌ NO más de 2 emojis por frase
- ❌ NO emojis en body text largo

---

## 🔧 Implementation Checklist

### Toda Nueva Página Debe Tener:
- [ ] `<link rel="stylesheet" href="styles/design-system.css">`
- [ ] XP Container (top-left)
- [ ] Guide Bot (bottom-right)
- [ ] Sound Toggle (bottom-right, above bot)
- [ ] `<script src="gamification.js"></script>`
- [ ] `<script src="i18n.js"></script>`
- [ ] Navigation con estructura estándar
- [ ] Hero con variante apropiada
- [ ] Meta tags SEO (bilingüe)
- [ ] Responsive testing (mobile, tablet, desktop)

### Toda Card Debe Tener:
- [ ] Emoji icon
- [ ] Badge (si aplica)
- [ ] Title (máx 3 palabras)
- [ ] Description (máx 2 líneas)
- [ ] Hover effect
- [ ] CTA button (si aplica)

### Todo Button Debe Tener:
- [ ] Clase apropiada (primary/secondary/ghost)
- [ ] Hover effect
- [ ] Active state
- [ ] Aria-label (si es solo icono)
- [ ] Sound effect (via gamification.js)

---

## 🚫 Common Mistakes to Avoid

### ❌ NO HACER:
1. **Usar diferentes fonts** entre páginas
2. **Hardcodear colores** (usar variables CSS)
3. **Imágenes de fondo** en heroes (usar gradientes)
4. **Layouts centrados** con mucho espacio vacío
5. **Omitir gamificación** en alguna página
6. **Cambiar posiciones** de XP Bar o Guide Bot
7. **Más de 2 CTAs** en un hero
8. **Cards sin hover** effects
9. **Buttons sin sonido** al click
10. **Olvidar responsive** testing

### ✅ SIEMPRE HACER:
1. **Usar design-system.css** en todas las páginas
2. **Incluir gamificación** completa
3. **Grid layouts** para stats/cards
4. **Variables CSS** para colores/spacing
5. **Hover effects** en elementos interactivos
6. **Responsive testing** antes de commit
7. **SEO meta tags** bilingües
8. **Aria labels** en elementos interactivos
9. **Consistent spacing** con variables
10. **Git commit** después de cada feature

---

## 📚 Resources

### Design System Files
- `styles/design-system.css` - Sistema completo
- `styles/main.css` - Legacy (deprecated)
- `gamification.js` - Lógica de XP/sounds
- `i18n.js` - Traducciones

### Reference Pages
- `index.html` - Homepage (reference completa)
- `tools.html` - Hero variant example
- `marketing.html` - Pink accent example
- `database.html` - Green accent example

### External References
- [Press Start 2P Font](https://fonts.google.com/specimen/Press+Start+2P)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 🔄 Version History

### v1.0 (2026-01-08)
- Initial brand guidelines
- Design system documentation
- Component library
- Accessibility standards
- Implementation checklist

---

**Mantenido por**: Jorge Suarez  
**Última revisión**: 2026-01-08  
**Próxima revisión**: Cada vez que se agregue un componente nuevo

---

## 📞 Questions?

Si tienes dudas sobre cómo implementar algo:
1. Revisa este documento primero
2. Checa `index.html` como referencia
3. Usa `design-system.css` como source of truth
4. Mantén la coherencia visual

**Regla de oro**: Si no estás seguro, copia la estructura de `index.html` y adapta el contenido.
