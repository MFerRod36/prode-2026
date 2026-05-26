## Funcionalidades MVP

### Funcionalidades requeridas — PRODE 2026 MVP

### Autenticación

- Login con usuario y contraseña
- Acceso restringido — solo las 5 usuarias registradas
- Sin registro público ni recuperación de contraseña en MVP

### Partidos

- Calendario completo del Mundial 2026 con fecha, hora, equipos y grupo/fase
- Estado del partido: próximo, en curso, finalizado
- Cierre automático de predicciones 1 hora antes del inicio

### Predicciones

- Cargar predicción por partido: resultado, goleador y figura
- Editar predicción hasta el cierre
- Ver predicciones propias por partido
- Ver predicciones de las demás usuarias una vez cerrado el partido

### Puntos

- Cálculo automático al cargar el resultado real
- +1 por acertar ganador/empate
- +3 por acertar marcador exacto
- +1 por acertar goleador
- +1 por acertar figura del partido

### Ranking

- Tabla general con puntos acumulados en tiempo real
- Posición de cada usuaria

### Panel de administración

- Solo accesible por vos
- Cargar resultado real de cada partido
- Cargar goleador y figura del partido
- Trigger automático de cálculo de puntos al guardar

### Historial

- Ver predicciones y puntos obtenidos por partido ya jugado

### Autenticación

- Login con usuario y contraseña
- Acceso restringido — solo las 5 usuarias registradas
- Sin registro público ni recuperación de contraseña en MVP

### Partidos

- Calendario completo del Mundial 2026 con fecha, hora, equipos, grupo/fase y estadio
- Jugadores citados por equipo
- 11 confirmado una vez disponible (vía API-Football)
- Estado del partido: próximo, en curso, finalizado
- Cierre automático de predicciones 1 hora antes del inicio

### Predicciones

- Cargar predicción por partido: resultado, goleador y figura
- Editar predicción hasta el cierre
- Ver predicciones propias por partido
- Ver predicciones de las demás usuarias una vez cerrado el partido

### Puntos

- Cálculo automático al cargar el resultado real
- +1 por acertar ganador/empate
- +3 por acertar marcador exacto
- +1 por acertar goleador

### Ranking

- Tabla general con puntos acumulados en tiempo real
- Posición de cada usuaria

### Historial

- Ver predicciones y puntos obtenidos por partido ya jugado

---

---

# Sitemap — PRODE 2026

## /login

- Formulario usuario + contraseña
- Cerrar sesión (disponible desde cualquier pantalla autenticada)

## /home

- Mis puntos acumulados + posición en el ranking
- Partidos del día
  - Fecha, hora, estadio
  - Estado: próximo / en curso / finalizado
  - → toca para ir a /fixture/[id]
- Últimos 3 partidos jugados
  - Resultado real + mi predicción + puntos obtenidos
  - → toca para ir a /fixture/[id]

## /fixture

- Lista de todos los partidos ordenados por fecha
- Filtro por fase: grupos / dieciseisavos / octavos / cuartos / semis / final
- Estado de cada partido: próximo / en curso / finalizado
- Estado de mi predicción: cargada / pendiente / cerrada
- → toca para ir a /fixture/[id]

### /fixture/[id] — Partido próximo

- Fecha, hora, estadio
- Formación inicial en cancha (22 puntos)
- Titulares + suplentes + DT por equipo
- Formulario de predicción
  - Resultado del partido
  - Goleador
- Confirmación de predicción guardada

### /fixture/[id] — Partido en curso

- Marcador en vivo
- Mi predicción cargada (bloqueada)
- Formación inicial en cancha (22 puntos)
- Titulares + suplentes + DT por equipo
- Fecha, hora, estadio

### /fixture/[id] — Partido finalizado

- Resultado final
- Mi predicción
- Puntos obtenidos en este partido
- Formación inicial en cancha (22 puntos)
- Titulares + suplentes + DT por equipo
- Fecha, hora, estadio

## /ranking

- Tabla general con puntos acumulados de cada usuaria
- Posición actual
- → toca el nombre de una usuaria para ir a /ranking/[usuario]

### /ranking/[usuario]

- Nombre de la usuaria
- Puntos totales
- Lista de partidos finalizados
  - Resultado real
  - Predicción de esa usuaria
  - Puntos obtenidos por partido

## /mis-predicciones

- Fixture completo con estado de cada predicción
  - Cargada: muestra lo que predijo
  - Pendiente: botón para cargar
  - Cerrada sin predicción: indica 0 puntos
  - Finalizada: resultado + predicción + puntos
- → toca para ir a /fixture/[id]

---

---

## Flujo 1 — Cargar predicción

INICIO
↓
[Pantalla] Login — ingresa usuario y contraseña
↓
¿Credenciales válidas?
├── NO → [Pantalla] Login — muestra error "Usuario o contraseña incorrectos"
└── SÍ ↓
[Pantalla] Home
↓
¿Quiere cargar una predicción?
├── NO → navega a otra sección
└── SÍ ↓
[Pantalla] Fixture o Home — toca un partido próximo
↓
[Pantalla] Fixture/[id] — ve info del partido
↓
¿Faltan más de 60 minutos para el inicio?
├── NO → predicción bloqueada, no puede cargar → 0 puntos ese partido → FIN
└── SÍ ↓
¿Ya tiene predicción cargada?
├── SÍ → puede editar
└── NO → carga nueva predicción
↓
[Acción] Completa resultado + goleador
↓
[Acción] Confirma
↓
[Sistema] Guarda predicción
↓
[Pantalla] Confirmación visual — predicción guardada
↓
FIN

---

## Flujo 2 — Ver resultado y puntos

INICIO
↓
[Sistema] Partido finaliza — API-Football actualiza resultado
↓
[Sistema] Calcula puntos automáticamente para cada usuaria
↓
[Pantalla] Fixture/[id] — partido finalizado
↓
Ve resultado real + su predicción + puntos obtenidos en este partido
↓
¿Quiere ver cómo impactó en el ranking?
├── NO → vuelve al Fixture → FIN
└── SÍ ↓
[Pantalla] Ranking — ve tabla general actualizada
↓
FIN

---

## Flujo 3 — Consultar ranking y espiar predicciones

INICIO
↓
[Pantalla] Ranking — ve tabla general con puntos de cada usuaria
↓
¿Quiere ver el detalle de una usuaria?
├── NO → FIN
└── SÍ ↓
[Acción] Toca el nombre de una usuaria
↓
[Pantalla] Ranking/[usuario] — ve predicciones y puntos por partido finalizado
↓
FIN

---

---

# Jerarquía de contenidos — PRODE 2026

## /login

1. Logo / nombre de la app
2. Campo usuario
3. Campo contraseña
4. Botón ingresar
5. Mensaje de error (condicional)

---

## /home

1. Header — nombre de usuaria + botón cerrar sesión
2. Mis puntos — puntos totales + posición en el ranking (destacado)
3. Partidos del día
   - Por cada partido: hora · equipos · estadio · estado
   - Si próximo: indicador de tiempo al cierre de predicción
   - Si en curso: marcador en vivo
   - Si finalizado: resultado final
4. Últimos 3 partidos jugados
   - Por cada partido: resultado real · mi predicción · puntos obtenidos
5. Navegación — Fixture · Ranking · Mis predicciones

---

## /fixture

1. Header — título + botón cerrar sesión
2. Filtro por fase (grupos / dieciseisavos / octavos / cuartos / semis / final)
3. Lista de partidos ordenados por fecha
   - Por cada partido: fecha · hora · equipos · estadio · estado · estado de mi predicción
4. Navegación

---

## /fixture/[id] — Partido próximo

1. Equipos + fecha + hora + estadio
2. Tiempo restante al cierre de predicción (cuenta regresiva)
3. Formación en cancha (22 puntos sobre cancha dibujada)
4. Titulares + suplentes + DT — equipo local
5. Titulares + suplentes + DT — equipo visitante
6. Formulario de predicción
   - Resultado (goles local — goles visitante)
   - Goleador del partido
   - Botón guardar predicción

## /fixture/[id] — Partido en curso

1. Equipos + marcador en vivo (destacado)
2. Minuto del partido
3. Mi predicción cargada (bloqueada, solo lectura)
4. Formación en cancha (22 puntos sobre cancha dibujada)
5. Titulares + suplentes + DT — equipo local
6. Titulares + suplentes + DT — equipo visitante
7. Fecha + hora + estadio

## /fixture/[id] — Partido finalizado

1. Equipos + resultado final (destacado)
2. Mi predicción
3. Puntos obtenidos en este partido
4. Formación en cancha (22 puntos sobre cancha dibujada)
5. Titulares + suplentes + DT — equipo local
6. Titulares + suplentes + DT — equipo visitante
7. Fecha + hora + estadio

---

## /ranking

1. Header — título + botón cerrar sesión
2. Tabla general
   - Posición · nombre · puntos totales · partidos jugados
   - Fila propia destacada visualmente
3. Navegación

## /ranking/[usuario]

1. Nombre de la usuaria + puntos totales
2. Lista de partidos finalizados ordenados por fecha
   - Equipos · resultado real · predicción · puntos obtenidos
3. Volver al ranking

---

## /mis-predicciones

1. Header — título + botón cerrar sesión
2. Filtro por estado: todas / pendientes / cargadas / finalizadas
3. Lista de partidos
   - Próximo con predicción pendiente: equipos · fecha · hora · botón cargar
   - Próximo con predicción cargada: equipos · fecha · hora · mi predicción · botón editar
   - Cerrado sin predicción: equipos · resultado · 0 puntos
   - Finalizado: equipos · resultado real · mi predicción · puntos obtenidos
4. Navegación

---

---

# Modelo de datos — PRODE 2026

## Tabla: usuarios

| Campo         | Tipo      | Descripción                  |
| ------------- | --------- | ---------------------------- |
| id            | uuid      | PK, generado automáticamente |
| username      | varchar   | Nombre de usuaria, único     |
| password_hash | varchar   | Contraseña hasheada          |
| created_at    | timestamp | Fecha de creación            |

---

## Tabla: partidos

| Campo             | Tipo      | Descripción                                                |
| ----------------- | --------- | ---------------------------------------------------------- |
| id                | uuid      | PK, generado automáticamente                               |
| api_football_id   | integer   | ID del partido en API-Football                             |
| fecha             | timestamp | Fecha y hora de inicio (UTC)                               |
| equipo_local      | varchar   | Nombre del equipo local                                    |
| equipo_visitante  | varchar   | Nombre del equipo visitante                                |
| estadio           | varchar   | Nombre del estadio                                         |
| fase              | varchar   | Grupos / Dieciseisavos / Octavos / Cuartos / Semis / Final |
| grupo             | varchar   | Letra del grupo (solo fase de grupos, nullable)            |
| estado            | varchar   | scheduled / in_play / finished                             |
| goles_local       | integer   | Resultado final local (nullable)                           |
| goles_visitante   | integer   | Resultado final visitante (nullable)                       |
| goleador          | varchar   | Nombre del goleador (nullable, desde API)                  |
| minuto_actual     | integer   | Minuto del partido si está en curso (nullable)             |
| cierre_prediccion | timestamp | fecha - 60 minutos                                         |
| created_at        | timestamp | Fecha de creación                                          |

---

## Tabla: formaciones

| Campo          | Tipo    | Descripción                                |
| -------------- | ------- | ------------------------------------------ |
| id             | uuid    | PK                                         |
| partido_id     | uuid    | FK → [partidos.id](http://partidos.id/)    |
| equipo         | varchar | local / visitante                          |
| tipo           | varchar | titular / suplente / dt                    |
| nombre_jugador | varchar | Nombre del jugador                         |
| numero         | integer | Número de camiseta (nullable)              |
| posicion       | varchar | Posición en la cancha (nullable)           |
| pos_x          | float   | Posición X en el dibujo de la cancha (0-1) |
| pos_y          | float   | Posición Y en el dibujo de la cancha (0-1) |

---

## Tabla: predicciones

| Campo           | Tipo      | Descripción                             |
| --------------- | --------- | --------------------------------------- |
| id              | uuid      | PK                                      |
| usuario_id      | uuid      | FK → [usuarios.id](http://usuarios.id/) |
| partido_id      | uuid      | FK → [partidos.id](http://partidos.id/) |
| goles_local     | integer   | Predicción goles local                  |
| goles_visitante | integer   | Predicción goles visitante              |
| goleador        | varchar   | Goleador predicho (nullable)            |
| created_at      | timestamp | Fecha de creación                       |
| updated_at      | timestamp | Última edición                          |

---

## Tabla: puntos

| Campo            | Tipo      | Descripción                             |
| ---------------- | --------- | --------------------------------------- |
| id               | uuid      | PK                                      |
| usuario_id       | uuid      | FK → [usuarios.id](http://usuarios.id/) |
| partido_id       | uuid      | FK → [partidos.id](http://partidos.id/) |
| puntos_resultado | integer   | 0 / 1 / 3                               |
| puntos_goleador  | integer   | 0 / 1                                   |
| puntos_total     | integer   | Suma total del partido                  |
| calculado_at     | timestamp | Cuándo se calculó                       |

---

## Relaciones

- Un usuario tiene muchas predicciones
- Un usuario tiene muchos registros de puntos
- Un partido tiene muchas predicciones (una por usuaria)
- Un partido tiene muchos registros de puntos (uno por usuaria)
- Un partido tiene una formación por equipo

---

## Lógica de puntos

- Acertás ganador/empate → +1
- Acertás marcador exacto → +3 (incluye el +1 anterior)
- Acertás goleador → +1
- Sin predicción → 0
- Máximo por partido → 4 puntos

---

---

## Mapa de contenidos MVP

# Mapa de contenido — PRODE 2026

## Contenido estático

Contenido fijo que no cambia durante el torneo.

- Nombre y logo de la app
- Nombres de las fases del torneo
- Reglas del sistema de puntos
- Nombres y datos de los estadios
- Nombres de las selecciones participantes

---

## Contenido dinámico — API-Football

Contenido que se actualiza automáticamente desde la API.

### Por partido

- Fecha y hora de inicio
- Estadio
- Estado del partido (scheduled / in_play / finished)
- Marcador en tiempo real (cuando está en curso)
- Resultado final
- Minuto actual del partido
- Goleador del partido

### Por equipo en cada partido

- Titulares (nombre + número + posición)
- Suplentes (nombre + número)
- Director técnico
- Formación táctica (posiciones en cancha)

---

## Contenido generado por usuarias

Contenido que producen las 5 usuarias al jugar.

- Predicción de resultado por partido
- Predicción de goleador por partido

---

## Contenido calculado por el sistema

Contenido que genera la app automáticamente.

- Puntos por partido (al finalizar cada partido)
- Puntos totales acumulados por usuaria
- Posición en el ranking
- Estado de predicción por partido (cargada / pendiente / cerrada / sin predicción)
- Tiempo restante al cierre de predicción

---

## Contenido visible según estado del partido

| Contenido                    | Próximo | En curso | Finalizado |
| ---------------------------- | ------- | -------- | ---------- |
| Fecha + hora + estadio       | ✅      | ✅       | ✅         |
| Formaciones en cancha        | ✅      | ✅       | ✅         |
| Titulares + suplentes + DT   | ✅      | ✅       | ✅         |
| Formulario de predicción     | ✅      | ❌       | ❌         |
| Marcador en vivo             | ❌      | ✅       | ❌         |
| Resultado final              | ❌      | ❌       | ✅         |
| Mi predicción (solo lectura) | ❌      | ✅       | ✅         |
| Puntos obtenidos             | ❌      | ❌       | ✅         |

---

## Contenido visible según rol

| Contenido                   | Usuaria             | Admin (vos) |
| --------------------------- | ------------------- | ----------- |
| Ver todos los partidos      | ✅                  | ✅          |
| Cargar predicción propia    | ✅                  | ✅          |
| Ver predicciones de otras   | ✅ solo tras cierre | ✅          |
| Ver ranking completo        | ✅                  | ✅          |
| Modificar datos en Supabase | ❌                  | ✅ directo  |
