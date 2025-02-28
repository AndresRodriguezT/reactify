# Reactify 🎵

Reactify es una aplicación web moderna construida con Next.js que permite a los usuarios buscar y descubrir música. La aplicación integra autenticación segura mediante Supabase y ofrece una interfaz de usuario intuitiva y responsive.

## Características ✨

- 🔐 Autenticación de usuarios (Login/Signup)
  - Soporte para Google y Spotify OAuth
  - Sistema de recuperación de contraseña
- 🎵 Búsqueda de música en tiempo real
- 📱 Diseño responsive
- 🌙 Interfaz moderna y minimalista
- 🚀 Rendimiento optimizado

## Tecnologías Utilizadas 🛠️

- [Next.js 15](https://nextjs.org/) - Framework de React
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript tipado
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
- [Supabase](https://supabase.com/) - Backend as a Service
- [Lucide React](https://lucide.dev/) - Iconos
- [Radix UI](https://www.radix-ui.com/) - Componentes UI primitivos
- [React Hot Toast](https://react-hot-toast.com/) - Notificaciones

## Requisitos Previos 📋

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación 🚀

### 1. Clona el repositorio:

```bash
git clone https://github.com/tuusuario/reactify.git
cd reactify
```
### 2. Instala las dependencias:

```bash
npm install
# o 
yarn install
```

### 3. Crea un archivo .env.local en la raíz del proyecto y configura las variables de entorno:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

### 5. Abre http://localhost:3000 en tu navegador.

## Scripts Disponibles 📝
- npm run dev - Inicia el servidor de desarrollo con Turbopack
- npm run build - Construye la aplicación para producción
- npm run start - Inicia el servidor de producción
- npm run lint - Ejecuta el linter
