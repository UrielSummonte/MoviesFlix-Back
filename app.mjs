// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import express from "express";
// import cors from "cors"
// import dotenv from "dotenv"
// import methodOverride from "method-override"
// import helmet from "helmet"
// import rateLimit from "express-rate-limit"
// import cookieParser from "cookie-parser"
// import authRoutes from "./routes/AuthRoutes.mjs"
// import userRoutes from "./routes/userRoutes.mjs"
// import profileRoutes from "./routes/ProfileRoutes.mjs"
// import movieRoutes from "./routes/movieRoutes.mjs"
// import adminRoutes from "./routes/AdminRoutes.mjs"
// import watchlistRoutes from "./routes/WatchlistRoutes.mjs"
// import path from 'path'; // Importa el módulo 'path'
// import { connectDB } from './config/dbConfig.mjs';

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
// app.set("views", path.join(__dirname, 'views'));
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



import { fileURLToPath, pathToFileURL } from 'url';
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

// Función mejorada de importación
const importModule = async (modulePath) => {
  try {
    const fullPath = join(__dirname, modulePath);
    const moduleUrl = pathToFileURL(fullPath).href;
    return await import(moduleUrl);
  } catch (err) {
    console.error(`Error al importar ${modulePath}:`, err.message);
    console.log(`Ruta completa intentada: ${join(__dirname, modulePath)}`);
    process.exit(1);
  }
};

// Importar módulos de rutas
const [
  authRoutes,
  userRoutes,
  profileRoutes,
  movieRoutes,
  adminRoutes,
  watchlistRoutes
] = await Promise.all([
  importModule('./routes/AuthRoutes.mjs'),
  importModule('./routes/userRoutes.mjs'),
  importModule('./routes/ProfileRoutes.mjs'),
  importModule('./routes/movieRoutes.mjs'),
  importModule('./routes/AdminRoutes.mjs'),
  importModule('./routes/WatchlistRoutes.mjs')
]);

// Importar dbConfig por separado para evitar conflictos
const dbConfig = await importModule('./config/dbConfig.mjs');
const { connectDB } = dbConfig;

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middlewares (configuración idéntica a la anterior)
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
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use("/api/auth", authRoutes.default);
app.use("/api/users", userRoutes.default);
app.use("/api/profiles", profileRoutes.default);
app.use("/api/movies", movieRoutes.default);
app.use("/admin", adminRoutes.default);
app.use("/api/watchlist", watchlistRoutes.default);

// Ruta principal
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
    console.error("Error al iniciar la aplicación:", err);
    process.exit(1);
  });

export default app;