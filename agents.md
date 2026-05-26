# Flujo de trabajo con agentes — PRODE 2026

## Cuándo usar SDD

Usar el flujo SDD (`/sdd-new`, `/sdd-ff`, `/sdd-continue`) para cualquier feature o cambio no trivial:

- Nueva página completa
- Integración con API externa (API-Football)
- Lógica de negocio compleja (cálculo de puntos, cierre de predicciones)
- Cambios al modelo de datos (migraciones Supabase)

No usar SDD para:
- Arreglos de CSS o ajustes visuales
- Renombrar variables o refactors mecánicos
- Cambios a un solo archivo sin impacto cross-feature

---

## Artifact store

Usar **engram** como artifact store por defecto. No crear archivos `openspec/` salvo que se pida explícitamente.

```
artifact_store.mode = engram
project = prode-2026
```

---

## Ejecución preferida

Modo **Interactive** — pausar entre fases para revisar y ajustar antes de continuar.

---

## Contexto del dominio para sub-agentes

Todo sub-agente que toque lógica de negocio debe conocer estas reglas:

### Reglas críticas

- Cierre de predicciones: 60 min antes del partido (`partidos.cierre_prediccion`)
- Predicciones ajenas: visibles solo cuando `partidos.estado = 'finished'`
- Puntos: +1 ganador/empate, +3 exacto (no acumulable con el +1), +1 goleador → máx 4 pts
- 5 usuarias fijas — sin registro público — cuentas en Supabase Auth

### Supabase

- Cliente singleton: `src/lib/supabase.js`
- Auth via `supabase.auth.signInWithPassword()`
- RLS activo — nunca bypassear
- Admin se identifica por `user.email === VITE_ADMIN_EMAIL` (env var)

### Tablas principales

```
partidos     → id, equipo_local, equipo_visitante, fecha, cierre_prediccion, estado, goles_local, goles_visitante, goleador
predicciones → id, usuario_id, partido_id, goles_local, goles_visitante, goleador
puntos       → id, usuario_id, partido_id, puntos_resultado, puntos_goleador, puntos_total
formaciones  → id, partido_id, equipo, tipo (titular|suplente|dt), nombre_jugador, pos_x, pos_y
```

---

## Asignación de modelos por fase

| Fase          | Modelo  |
| ------------- | ------- |
| orchestrator  | opus    |
| sdd-explore   | sonnet  |
| sdd-propose   | opus    |
| sdd-spec      | sonnet  |
| sdd-design    | opus    |
| sdd-tasks     | sonnet  |
| sdd-apply     | sonnet  |
| sdd-verify    | sonnet  |
| sdd-archive   | haiku   |
| default       | sonnet  |

---

## Convenciones que los sub-agentes deben respetar

- JSX puro — sin TypeScript
- React 19 — sin `useMemo`/`useCallback` manuales
- Tailwind CSS 4 — tokens con `@theme`, `cn()` para clases condicionales
- No instalar librerías de UI externas
- No llamar a Supabase directamente desde JSX — solo desde hooks o loaders
- No buildear para verificar — solo `npm run dev`
- No comentarios que describan qué hace el código

---

## Checklist antes de cerrar una sesión de trabajo

- [ ] ¿Se guardó el progreso en engram? (`mem_session_summary`)
- [ ] ¿Las nuevas decisiones de arquitectura están en `CLAUDE.md`?
- [ ] ¿Los cambios al modelo de datos están reflejados en `Brand/app-info.md`?
- [ ] ¿Los próximos pasos están claros para la próxima sesión?
