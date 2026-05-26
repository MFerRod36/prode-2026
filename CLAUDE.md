# PRODE 2026 — Instrucciones para Claude Code

## Qué es este proyecto

App de prode para el Mundial 2026. Cinco usuarias fijas (grupo cerrado de amigas) que predicen resultados de cada partido, acumulan puntos y compiten en un ranking. Sin registro público. El dueño de la app es el único admin.

**Stack**:

| Capa          | Tecnología                              |
| ------------- | --------------------------------------- |
| UI            | React 19 + JSX (sin TypeScript)         |
| Estilos       | Tailwind CSS 4                          |
| Bundler       | Vite 8                                  |
| Backend / DB  | Supabase (auth + postgres + realtime)   |
| Routing       | React Router DOM v7                     |
| Forms         | React Hook Form                         |
| Utils         | date-fns, lucide-react                  |
| APIs externas | API-Football                            |

---

## Estructura de carpetas

```
src/
  assets/                   # imágenes, iconos estáticos
  components/
    ui/                     # primitivos reutilizables (Button, Input, Badge, etc.)
    layout/                 # Header, BottomNav, PageWrapper
  features/
    auth/                   # login, lógica de sesión
    fixture/                # lista de partidos, detalle de partido
    ranking/                # tabla general, detalle por usuaria
    predictions/            # mis predicciones
    admin/                  # panel del admin
  hooks/                    # custom hooks compartidos (useUser, useSupabase, etc.)
  lib/
    supabase.js             # cliente Supabase (singleton)
    api-football.js         # wrapper de API-Football
  pages/                    # componentes de ruta — thin, solo componen features
  router/
    index.jsx               # definición de rutas con createBrowserRouter
  utils/                    # helpers puros (formatDate, calcPoints, etc.)
```

Regla: las `pages/` son delgadas — solo importan features y pasan props. La lógica vive en `features/` y `hooks/`.

---

## Convenciones de código

### React 19

- No usar `useMemo`, `useCallback` ni `memo` — el React Compiler los maneja.
- Preferir componentes de función simples.
- Custom hooks para encapsular lógica de Supabase — no llamar al cliente directamente desde componentes.
- Server components no aplican — es Vite, no Next.js.

### Tailwind CSS 4

- Variables de tema con `@theme` en el CSS global, no en `tailwind.config.js` (no existe en v4).
- Usar la función utilitaria `cn()` (clsx + tailwind-merge) para clases condicionales.
- Nunca usar `var(--algo)` dentro de `className` — usar tokens de Tailwind directamente.
- No usar `@apply` salvo para resets o casos muy puntuales.

### Supabase

- El cliente se instancia UNA sola vez en `src/lib/supabase.js` y se exporta.
- Auth: usar `supabase.auth.signInWithPassword()` — las 5 usuarias tienen email + password en Supabase Auth.
- RLS activo en todas las tablas — nunca asumir que el cliente tiene acceso irrestricto.
- Queries complejas (joins, agregaciones) van en `hooks/` o en funciones de `features/`.
- Usar `useEffect` + `supabase.auth.onAuthStateChange` para manejar sesión.

### React Router DOM v7

- Rutas definidas en `src/router/index.jsx` con `createBrowserRouter`.
- Usar `loader` para data fetching donde sea natural — evita cascadas de `useEffect`.
- Proteger rutas con un wrapper `<PrivateRoute>` que verifica la sesión de Supabase.

### Formularios

- React Hook Form para todos los formularios — `register`, `handleSubmit`, `formState.errors`.
- Validación con las opciones de `register` (no necesita Zod para un MVP así de simple).

---

## Reglas de negocio críticas

Estas reglas deben respetarse siempre — son el corazón del producto:

1. **Cierre de predicciones**: 60 minutos antes del inicio del partido. Campo `cierre_prediccion` en la tabla `partidos`.
2. **Predicciones visibles**: las predicciones de OTRAS usuarias solo se muestran una vez que el partido está `finished`.
3. **Cálculo de puntos**:
   - +1 por acertar ganador o empate
   - +3 por marcador exacto (reemplaza el +1, no se suman)
   - +1 por acertar goleador
   - Máximo 4 puntos por partido
   - Sin predicción = 0 puntos
4. **5 usuarias fijas**: no hay registro público. Las cuentas se crean directamente en Supabase.
5. **Admin único**: solo el dueño puede cargar resultados reales. El resto no tiene acceso al panel admin.

---

## Modelo de datos (referencia rápida)

| Tabla        | Descripción                                           |
| ------------ | ----------------------------------------------------- |
| usuarios     | id, username, password_hash, created_at               |
| partidos     | equipos, fase, estado, goles, goleador, cierre_prediccion |
| formaciones  | jugadores por partido (titular/suplente/dt, pos_x, pos_y) |
| predicciones | usuario_id + partido_id + goles + goleador             |
| puntos       | puntos_resultado + puntos_goleador + puntos_total     |

---

## Páginas y rutas

| Ruta               | Acceso     | Descripción                          |
| ------------------ | ---------- | ------------------------------------ |
| /login             | público    | Formulario de acceso                 |
| /home              | autenticado | Puntos, partidos del día, recientes |
| /fixture           | autenticado | Lista completa con filtro por fase  |
| /fixture/:id       | autenticado | Detalle del partido (3 estados)     |
| /ranking           | autenticado | Tabla general                       |
| /ranking/:usuario  | autenticado | Detalle por usuaria                 |
| /mis-predicciones  | autenticado | Fixture propio con estado           |
| /admin             | solo admin  | Carga de resultados reales          |

---

## Lo que NO hacer

- No agregar TypeScript — el proyecto es JSX puro.
- No instalar librerías de UI externas (shadcn, MUI, etc.) — construir con Tailwind y primitivos propios.
- No llamar directamente a Supabase desde JSX — siempre a través de hooks o loaders.
- No buildear después de cambios — `npm run dev` es suficiente para verificar.
- No agregar comentarios que describan qué hace el código — solo si el WHY no es obvio.
- No crear archivos de planificación ni análisis — el contexto vive en la conversación.

---

## Skills — carga automática por contexto

| Contexto                        | Skill                   |
| ------------------------------- | ----------------------- |
| Componentes React, JSX, hooks   | react-19                |
| Tailwind CSS, estilos           | tailwind-4              |
| Formularios con React Hook Form | react-hook-form         |
| Animaciones con Framer Motion   | framer-motion           |
| Accesibilidad, ARIA             | a11y                    |
| Tests con pytest                | pytest (no aplica aquí) |

---

## Figma

- Sistema de marca: `https://www.figma.com/design/Vs93PJ3B87uMsyLmaC3qc8/FIFA-World-Cup-2026--Community-?node-id=94-19028`
- Componentes: `https://www.figma.com/design/Vs93PJ3B87uMsyLmaC3qc8/FIFA-World-Cup-2026--Community-?node-id=217-107936`

Consultar Figma antes de definir colores, tipografía o componentes visuales.
