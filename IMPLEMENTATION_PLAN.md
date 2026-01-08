# Game Industry Resources Platform 🎮

Un hub de recursos **divertido y gamer** para desarrolladores de videojuegos en LATAM, enfocado en ayudarles a crecer profesionalmente, **conseguir chamba**, y fundar estudios rentables.

---

## Decisiones Confirmadas ✅

| Aspecto | Decisión |
|---------|----------|
| **Hosting** | GitHub Pages (gratis, auto-deploy con cada push) |
| **Dominio** | `gamedev.jorgesuarez.com.mx` (bajo tu control total) |
| **Idioma** | Bilingüe con **español default** |
| **Diseño** | Temática **gamer y divertida**, no corporativa |
| **Orden** | Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 (nuevo: Jobs) |

---

## 🎨 Nuevo Concepto de Diseño: Gamer & Divertido

### Cambios al Diseño Actual
```diff
- Dark mode corporativo serio
+ Dark mode GAMER con personalidad

+ Elementos a agregar:
  + Pixel art accents / iconos retro
  + Easter eggs y micro-interacciones divertidas
  + Emojis estratégicos (🎮 🕹️ 👾 🚀 💎)
  + Glow effects estilo neón arcade
  + Animaciones jugetonas en hover
  + Frases/quotes de devs famosos
  + Achievements/badges visuales
  + Referencias a gaming culture
```

### Paleta de Colores Actualizada
```css
/* Mantenemos el dark pero más arcade/retro */
--accent-neon-pink: #ff2d95;    /* Neón arcade */
--accent-neon-green: #39ff14;   /* Retro gaming */
--accent-electric-blue: #00d4ff; /* Sci-fi */
--accent-gold: #ffd700;          /* Achievement gold */
```

---

## 🌐 Dominio y Hosting

### Configuración GitHub Pages + Subdominio

1. **Repositorio**: `jorgefsb/game-industry-resources`
2. **GitHub Pages**: Habilitado desde `main` branch
3. **Subdominio recomendado**: `gamedev.jorgesuarez.com.mx`

**Alternativas de subdominio:**
- `gamedev.jorgesuarez.com.mx` ← **Recomendado**
- `recursos.jorgesuarez.com.mx`
- `devs.jorgesuarez.com.mx`
- `studio.jorgesuarez.com.mx`

### Configuración DNS (en tu panel de jorgesuarez.com.mx)
```
CNAME   gamedev   jorgefsb.github.io
```

### Auto-deploy
✅ **Sí, igual que Vercel** - cada push a `main` actualiza el sitio automáticamente.

---

## 🔗 Integración con Ecosistema Jorge Suárez

### Funnel Estratégico Actualizado
```
┌─────────────────────────────────────────────────────────────────┐
│  🌐 TRÁFICO ORGÁNICO (SEO)                                      │
│  "conseguir trabajo gamedev" "ofertas empleo videojuegos"       │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  📚 GAME INDUSTRY RESOURCES                                     │
│  gamedev.jorgesuarez.com.mx                                     │
│  Recursos gratuitos + OFERTAS DE EMPLEO diarias                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  🐦 TWITTER/X @jorgefsb                                         │
│  10 ofertas diarias + tips de la industria                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎮 EGDC - Elite Game Dev Club                                  │
│  comunidad.uetc.mx                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎓 Cursos VIP + UETC                                           │
│  vip.jorgesuarez.com.mx / uetc.mx                               │
└─────────────────────────────────────────────────────────────────┘
```

### Links Permanentes (Footer + Sidebar)
- **🏠 Nexus**: jorgesuarez.com.mx ← **AGREGADO**
- **🎮 EGDC Club**: comunidad.uetc.mx
- **🎓 Cursos VIP**: vip.jorgesuarez.com.mx
- **🏫 UETC**: uetc.mx
- **🏢 Amber Studio**: amberstudio.com
- **🎯 PlayPitch**: playpitch.games
- **🐦 Twitter/X**: x.com/jorgefsb

---

## 🔍 Estrategia SEO Actualizada

### Keywords Objetivo (Español) - ACTUALIZADOS
**High Intent (lo que más tráfico trae):**
- ⭐ conseguir trabajo en videojuegos
- ⭐ ofertas de empleo game dev
- ⭐ trabajar en estudio de videojuegos
- ⭐ vacantes desarrollador de juegos
- ⭐ cómo entrar a la industria de videojuegos

**Long-tail Keywords:**
- cómo conseguir chamba en game dev
- empresas de videojuegos contratando en méxico
- ofertas de trabajo para programadores de juegos
- portfolio para conseguir trabajo en videojuegos
- tips para entrevista en estudio de videojuegos

**Otros Keywords Importantes:**
- crear estudio de videojuegos
- publishers de videojuegos latam
- grants para desarrolladores de juegos
- acuerdo entre socios game studio

---

## 📚 Contenido: No Solo Autopromoción

### Nueva Sección: Recursos Externos Curados

Para que el sitio tenga valor real y no parezca solo promoción:

#### 🎬 Canales de YouTube & Comunidades
| Categoría | Recursos a Curar |
|-----------|------------------|
| Game Design | GDC, Game Maker's Toolkit, **Extra Credits** (Priority), Masahiro Sakurai on Creating Games |
| Programming | Sebastian Lague, Code Monkey, Brackeys, Jason Weimann |
| Art | Pixel Pete, Brandon James Greer, AdamCYounis, MinionsArt |
| Business | Noclip, Game Dev Underground, Ask Gamedev, Sergei Vasuk (LinkedIn) |
| LATAM/Local | **Game Conference MX**, **Pixelatl**, **Karaokulta** (Legacy Group), Videojuegos MX |
| Career/Jobs | **Amir Satvat (ASGC)**, Reddit r/gameDevClassifieds, LinkedIn Game Dev Jobs |

#### 🌎 LATAM Studios Database (Indi-es Integration)
- **Fuente**: [indi-es.com/estudios](https://indi-es.com/estudios)
- **Acción**: Importar base de datos y *curar manualmente*:
    - Marcar estudios "Activos" vs "Inactivos".
    - **Destacar** estudios que están contratando (Hiring Now).
    - Agregar links a sus páginas de carreras.

---

## 📋 Fases de Desarrollo Actualizadas

### 🔵 Phase 1: Core Platform ✅ COMPLETADO
- [x] Landing page
- [x] Design system
- [x] Ecosystem integration
- [ ] Actualizar diseño a temática gamer
- [ ] Deploy a GitHub Pages + configurar subdominio

---

### 🟡 Phase 2: Studio Templates
Templates descargables + Preview

---

### 🟠 Phase 3: Founder's Wizard 🚀
**Mini-SaaS Potential**

---

### 🟢 Phase 4: LATAM Database
Publishers, Grants, Events, Studios

---

### 🔴 Phase 5: Zero to Studio Guide
Roadmap visual interactivo

---

### 🟣 Phase 6: Marketing Playbook
Integración con PlayPitch

---

### 💼 Phase 7: Jobs & Career (ALTA PRIORIDAD)
**Inspiración & Fuente Principal**: [Amir Satvat (ASGC)](https://asgc.gg)
*Objetivo*: Adaptar los recursos de clase mundial de Amir Satvat al español y contexto LATAM.

- [ ] **Industry Job Ticker**: (Ya implementado v1) - Mejorar con fuentes reales.
- [ ] **Job Board Aggregator**:
    - Curar ofertas de LinkedIn (posts de Sergei Vasuk, Mirko Minenza).
    - Sección "Remote Friendly" para LATAM.
- [ ] **Career Guides (Adaptadas de ASGC):**
    - "Cómo hacer un CV de la industria" (Templates).
    - "Networking en LinkedIn" (Guide).
    - "Interview Prep" (Common questions).
- [ ] **Sección "Realidad del Mercado":** Datos duros sobre salarios y expectativas (Layoffs vs Hiring).
- [ ] **Mentorship Directory**: Linkear a mentores de EGDC y externos.
4. **Realidad del Mercado**
   - "Siempre estamos reclutando pero no siempre contratando"
   - Cómo funciona el ciclo de hiring en la industria
   - Qué skills están en demanda
5. **Links a Job Boards**
   - Hitmarker
   - Games Jobs Direct
   - Work With Indies
   - Remote Game Jobs

---

### 🎬 Phase 8: External Resources Hub (NUEVO)

#### YouTube Channels Curados
Por disciplina, investigados y organizados

#### Top 10 Lists
Recursos externos de alta calidad

#### Blogs & Newsletters
Los mejores de la industria

---

### 🔑 Phase 9: User Authentication & Database (NUEVO)
**Objetivo**: Capturar datos de usuarios (Leads) y personalizar la experiencia gamer.

- **Campos a capturar**:
    - Nombre
    - Apellido
    - Email
    - Teléfono / WhatsApp
- **Features de Gamificación**:
    - Login/Password para guardar progreso de XP y nivel.
    - Registro obligatorio para acceder a recursos premium (Templates GDD, Budgets).
    - Perfil de usuario con logros y progreso guardado.
- **Tech Stack Sugerido**:
    - **Supabase**: Autenticación (Email/Password, Google, GitHub) + Database.
    - Integración con el sistema de XP actual (`gamification.js`).

---

## Bilingüe: Implementación

### Estructura
```
game-industry-resources/
├── index.html          # Español (default)
├── en/
│   └── index.html      # English version
├── styles/
├── scripts/
│   └── i18n.js         # Language switcher
└── data/
    ├── content-es.json
    └── content-en.json
```

### Language Switcher
Toggle visible en navbar: 🇲🇽 ES | 🇺🇸 EN

---

## Verificación

### Para actualizaciones de diseño:
1. Aplicar temática gamer
2. Test en mobile
3. Verificar que se sienta divertido, no corporativo

### Para GitHub Pages:
1. Enable Pages en repo settings
2. Configurar CNAME con `gamedev.jorgesuarez.com.mx`
3. Agregar registro DNS en panel de dominio
4. Verificar HTTPS automático

---

## Timeline Actualizado

| Phase | Descripción | Prioridad |
|-------|-------------|-----------|
| 1.5 | Actualizar diseño gamer + Deploy | ⭐ Ahora |
| 7 | Jobs & Career section | ⭐ Alta (tráfico) |
| 2 | Templates | Media |
| 3 | Founder's Wizard | Media |
| 8 | External Resources | Media |
| 4-6 | Database, Guide, Playbook | Normal |
