<!-- ======================================================= -->
<!--                  ISOMETRICAL GAME COMPANY                -->
<!--                DIVISIÓN DE SISTEMAS INTELIGENTES         -->
<!-- ======================================================= -->
<!--                      ARASAKA CORE                        -->
<!-- ======================================================= -->

# ISOMETRICAL | HYPERION CORE  
**Versión:** 1.0.1 (Alpha)  
**Estado:** En desarrollo activo  
**Autor:** miguelacaceresrios

---

## 1. Descripción General

**HYPERION CORE** es el sistema de datos e inteligencia central desarrollado.  
Se presenta como la solucion al desorden dentro del proyecto gestionando y organizando.

El sistema coordina los proyectos activos, registra tareas, mantiene puntajes globales de productividad y sirve como base de comunicación entre el equipo humano y los bots individuales asociados a cada miembro del equipo.

---

## 2. Objetivos del Sistema

1. Centralizar la gestión de proyectos y tareas de la empresa.  
2. Proveer una capa de comunicación estandarizada para bots personalizados (por empleado).  
3. Mantener un ranking dinámico de desempeño basado en tareas completadas.  
4. Permitir el registro, consulta y actualización de tareas mediante comandos en chat (Discord o Telegram).  
5. Establecer una API modular para conectar bots, paneles o integraciones futuras.

---

## 3. Características Técnicas

| Componente | Descripción |
|-------------|-------------|
| Núcleo de datos | Base de datos central de proyectos, tareas y usuarios. |
| API REST | Comunicación entre bots y el sistema central. |
| WebSocket opcional | Sincronización en tiempo real para eventos o actualizaciones. |
| Módulo de ranking | Calcula puntajes globales por tareas completadas. |
| Integración multi-bot | Cada empleado puede tener su propio bot con identidad personalizada. |
| Canal de proyectos | Espacio donde los bots pueden registrar tareas automáticamente según formato definido. |

---

## 4. Arquitectura del Proyecto

```bash
src/
├─ commands/ # Comandos principales del bot
│ ├─ alert.js # Envía alertas internas
│ ├─ completar.js # Marca tareas como completadas
│ ├─ help.js # Muestra comandos disponibles
│ ├─ ping.js # Verifica el estado del bot
│ ├─ registrar.js # Crea una nueva tarea
│ └─ tareas.js # Lista tareas por estado
│
├─ data/ # Persistencia en archivos JSON
│ ├─ proyectos.json
│ ├─ ranking.json
│ └─ tareas.json
│
├─ utils/ # Funciones auxiliares
│ └─ jsonHandler.js
│
├─ deploy-commands.js # Registro de comandos en Discord
└─ index.js # Punto de entrada principal
