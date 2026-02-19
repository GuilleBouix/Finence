<img width="2334" height="664" alt="FINENCE" src="https://github.com/user-attachments/assets/5a2b7784-8c88-4da9-a717-2e866d270680" />

# Finence - Control de Transacciones

Finence es una aplicacion web para gestionar tus finanzas personales. Controla tus ingresos y gastos de manera sencilla, visualiza tu historial financiero y mantien un registro detallado de todas tus transacciones.

## Caracteristicas

- **Gestion de transacciones**: Agrega, edita y elimina ingresos y gastos
- **Resumen financiero**: Visualiza tus ingresos totales, gastos y balance en tiempo real
- **Historial completo**: Consulta todas tus transacciones pasadas con detalles
- **Gráfico de tendencias**: Observa la evolución de tus finanzas con gráficos visuales
- **Autenticación segura**: Sistema de inicio de sesión con Supabase Auth
- **Diseño responsivo**: Interfaz adaptativa que funciona en dispositivos móviles y escritorio

## Capturas de Pantalla

<p>
   <img width="410" alt="1" src="https://github.com/user-attachments/assets/527c6fdb-f505-428f-97ee-84c98bb348ae" />
   <img width="410" alt="2" src="https://github.com/user-attachments/assets/d142a3f3-6837-4f4b-b1cc-5daa02293b62" />
   <img width="410" alt="3" src="https://github.com/user-attachments/assets/9c3345e9-bad6-4d3c-afb5-76226ccdea18" />
   <img width="410" alt="4" src="https://github.com/user-attachments/assets/08cd9203-6b0c-431c-acec-a59e2136afca" />
</p>

## Tecnologias

- **Frontend**: React 19 con TypeScript
- **Build**: Vite
- **Estilos**: TailwindCSS v4
- **Estado**: Zustand
- **Autenticacion**: Supabase Auth
- **Base de datos**: Supabase (PostgreSQL)
- **Graficos**: Recharts
- **Enrutamiento**: React Router DOM v7
- **Iconos**: React Icons
- **Notificaciones**: React Hot Toast

## Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuenta de Supabase (para la base de datos)

## Instalacion

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/finence.git
cd finence
```

2. Instala las dependencias:

```bash
npm install
# o si prefieres pnpm
pnpm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raiz del proyecto
   - Anade tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_KEY=tu_clave_anonima
```

## Configuracion de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea dos tablas: `ingresos` y `gastos` con las siguientes columnas:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `monto` (numeric)
   - `descripcion` (text)
   - `fecha` (timestamp with time zone)
   - `user_id` (uuid, foreign key referencing auth.users)
3. Configura las politicas RLS (Row Level Security) para permitir acceso solo al usuario propietario

## Uso

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`

### Navegación

- **Login**: Pagina de autenticacion para usuarios nuevos y existentes
- **Home**: Panel principal con resumen de finanzas y grafico de tendencias
- **Historial**: Lista completa de todas las transacciones
- **Opciones**: Configuracion de la cuenta y zona de peligro (reset de datos)

## Estructura del Proyecto

```
src/
├── components/           # Componentes de la aplicacion
│   ├── common/           # Componentes reutilizables
│   │   ├── ActivityList.tsx
│   │   ├── Header.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TrendChart.tsx
│   │   └── UserWidget.tsx
│   ├── forms/            # Formularios
│   │   └── TransactionForm.tsx
│   ├── modals/           # Modales
│   │   ├── ConfirmDeleteModal.tsx
│   │   └── EditTransactionModal.tsx
│   └── ui/               # Componentes de UI basica
│       ├── Skeleton.tsx
│       └── TitleUpdater.tsx
├── constants/            # Constantes de la aplicacion
│   └── index.ts
├── hooks/                # Hooks personalizados
│   ├── useAuth.ts
│   └── useUsuario.ts
├── lib/                  # Configuracion de librerias
│   └── supabaseClient.ts
├── pages/                # Paginas de la aplicacion
│   ├── History.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Options.tsx
├── routes/               # Configuracion de rutas
│   └── ProtectedRoute.tsx
├── services/            # Servicios externos
│   └── toastService.ts
├── store/               # Gestion de estado global (Zustand)
│   └── useFinanceStore.ts
├── types/               # Definiciones de TypeScript
│   └── finance.ts
├── App.tsx              # Componente principal con rutas
├── globals.css          # Estilos globales y Tailwind
└── main.tsx            # Punto de entrada
```

## Arquitectura

### Patron de diseño

La aplicacion sigue una arquitectura basada en:

- **Hooks personalizados**: Lógica de negocio encapsulada (useAuth, useUsuario)
- **Store centralizado**: Estado global con Zustand
- **Composicion de componentes**: Componentes pequeños y reutilizables
- **Separacion de preocupaciones**: Servicios, tipos, constantes y componentes separados

### Flujo de datos

1. El usuario se autentica mediante Supabase Auth
2. Los datos se almacenan en la store de Zustand
3. Los componentes consumen la store directamente
4. Las operaciones se realizan a traves de la store

## Scripts Disponibles

| Comando           | Descripcion                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo    |
| `npm run build`   | Compila para produccion             |
| `npm run lint`    | Ejecuta el linter                   |
| `npm run preview` | Previsualiza el build de produccion |

## Contribución

Las contribuciones son bienvenidas! Si deseas mejorar Finence:

1. Haz fork del repositorio
2. Crea una rama para tu caracteristica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y commitea (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto esta bajo la Licencia MIT. Consulta el archivo `LICENSE` para mas informacion.

---

Desarrollado como proyecto de práctica.
