// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import express from "express";
// import cors from "cors"
// import dotenv from "dotenv"
// import methodOverride from "method-override"
// import helmet from "helmet"
// import rateLimit from "express-rate-limit"
// import cookieParser from "cookie-parser"
// import authRoutes from "./src/routes/authRoutes.mjs"
// import userRoutes from "./src/routes/userRoutes.mjs"
// import profileRoutes from "./src/routes/ProfileRoutes.mjs"
// import movieRoutes from "./src/routes/movieRoutes.mjs"
// import adminRoutes from "./src/routes/AdminRoutes.mjs"
// import watchlistRoutes from "./src/routes/WatchlistRoutes.mjs"
// import path from 'path'; // Importa el módulo 'path'
// import { connectDB } from './src/config/dbConfig.mjs';

// // Configuración de variables de entorno
// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000
// const HOST = '0.0.0.0'; // Importante para Render

// // Configuración de seguridad
// app.use(helmet({
//   contentSecurityPolicy: false, // Desactivar CSP para permitir cargar recursos externos en el panel admin
// }))

// // Limitar solicitudes para prevenir ataques de fuerza bruta
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 1000, // Limitar cada IP a 100 solicitudes por ventana
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: "Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos",
// })

// // Aplicar limitador a todas las solicitudes
// app.use(limiter)

// app.use(
//   cors({
//     origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10kb" })) 
// app.use(express.urlencoded({ extended: true, limit: "10kb" }))
// app.use(cookieParser()) 
// app.use(methodOverride("_method")) 

// // Configuración de vistas EJS para el panel de administrador
// app.set("view engine", "ejs")
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.set("views", path.join(__dirname, 'src', 'views'));
// app.use(express.static('src/public'));


// // Rutas
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/profiles", profileRoutes)
// app.use("/api/movies", movieRoutes)
// app.use("/admin", adminRoutes)
// app.use("/api/watchlist", watchlistRoutes)

// // Ruta principal
// app.get("/", (req, res) => {
//   res.send("API de MoviesFlix funcionando correctamente")
// })

// connectDB().then(() => {
//     app.listen(PORT, HOST, () => {
//       console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
      
//       // Solo muestra en desarrollo
//       if (process.env.NODE_ENV !== 'production') {
//         console.log(`➜ Local: http://localhost:${PORT}`);
//       }
//     });
//   });

// export default app




import { fileURLToPath, pathToFileURL  } from 'url';
import { dirname, join } from 'path';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import methodOverride from "method-override";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from 'path';

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Importaciones dinámicas seguras
const importModule = async (modulePath) => {
  try {
    const fullPath = join(__dirname, modulePath);
    // Convierte la ruta a formato URL válido para Windows
    const moduleUrl = pathToFileURL(fullPath).href;
    const module = await import(moduleUrl);
    return module.default || module;
  } catch (err) {
    console.error(`Error importing ${modulePath}:`, err);
    // Muestra la ruta exacta que intentó cargar
    console.log(`Ruta intentada: ${join(__dirname, modulePath)}`);
    process.exit(1);
  }
};

// Importar rutas
const routes = await Promise.all([
  importModule('src/routes/authRoutes.mjs'),
  importModule('src/routes/userRoutes.mjs'),
  importModule('src/routes/ProfileRoutes.mjs'),
  importModule('src/routes/movieRoutes.mjs'),
  importModule('src/routes/AdminRoutes.mjs'),
  importModule('src/routes/WatchlistRoutes.mjs'),
  importModule('src/config/dbConfig.mjs')
]);

const [
  authRoutes,
  userRoutes,
  profileRoutes,
  movieRoutes,
  adminRoutes,
  watchlistRoutes,
  { connectDB }
] = routes;

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Demasiadas solicitudes desde esta IP"
}));
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Configuración de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/movies", movieRoutes);
app.use("/admin", adminRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.get("/", (req, res) => {
  res.send("API de MoviesFlix funcionando correctamente");
});

// Iniciar servidor
connectDB()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`➜ Local: http://localhost:${PORT}`);
      }
    });
  })
  .catch(err => {
    console.error("Error al conectar con MongoDB:", err);
    process.exit(1);
  });

export default app;
