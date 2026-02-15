<img width="2334" height="664" alt="550028003-5ed2d96f-e42e-4b7d-b68a-d961166bed1e" src="https://github.com/user-attachments/assets/5a2b7784-8c88-4da9-a717-2e866d270680" />

# Finence - Control de Transacciones

Finence es una aplicación web simple para gestionar tus finanzas personales. Controla tus ingresos y gastos de manera sencilla, visualiza tu historial financiero y mantén un registro detallado de todas tus transacciones.

## Características

- **Gestión de transacciones**: Agrega, edita y elimina ingresos y gastos
- **Resumen financiero**: Visualiza tus ingresos totales, gastos y balance en tiempo real
- **Historial completo**: Consulta todas tus transacciones pasadas con detalles
- **Gráfico de tendencias**: Observa la evolución de tus finanzas con gráficos visuales
- **Autenticación segura**: Sistema de inicio de sesión con Supabase Auth
- **Diseño responsivo**: Interfaz adaptativa que funciona en dispositivos móviles y escritorio

## Tecnologías

- **Frontend**: React 19 con TypeScript
- **Build**: Vite
- **Estilos**: TailwindCSS v4
- **Estado**: Zustand
- **Autenticación**: Supabase Auth
- **Base de datos**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Enrutamiento**: React Router DOM v7

## Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuenta de Supabase (para la base de datos)

## Instalación

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
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

## Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea una tabla llamada `movimientos` con las siguientes columnas:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `monto` (numeric)
   - `descripcion` (text)
   - `fecha` (timestamp with time zone)
   - `user_id` (uuid, foreign key referencing auth.users)
3. Configura las políticas RLS (Row Level Security) para permitir acceso solo al usuario propietario

## Uso

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Navegación

- **Login**: Página de autenticación para usuarios nuevos y existentes
- **Home**: Panel principal con resumen de finanzas y gráfico de tendencias
- **Historial**: Lista completa de todas las transacciones
- **Opciones**: Configuración de la cuenta (aún no disponible)

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables de UI
│   ├── ActivityList.tsx
│   ├── ConfirmDeleteModal.tsx
│   ├── EditTransactionModal.tsx
│   ├── Header.tsx
│   ├── Skeleton.tsx
│   ├── SummaryCards.tsx
│   ├── TitleUpdater.tsx
│   ├── TotalCard.tsx
│   ├── TransactionForm.tsx
│   └── TrendChart.tsx
├── layouts/         # Componentes de diseño
│   └── ProtectedRoute.tsx
├── pages/           # Páginas de la aplicación
│   ├── History.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Options.tsx
├── services/        # Servicios externos
│   └── supabaseClient.ts
├── store/           # Gestión de estado global
│   └── useFinanceStore.ts
├── types/           # Definiciones de TypeScript
│   └── finance.ts
├── App.tsx          # Componente principal con rutas
├── globals.css      # Estilos globales y Tailwind
└── main.tsx         # Punto de entrada
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run lint` | Ejecuta el linter |
| `npm run preview` | Previsualiza el build de producción |

## Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar Finence:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y commitea (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

---
