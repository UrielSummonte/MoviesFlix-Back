import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import methodOverride from "method-override"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/AuthRoutes.mjs"
import userRoutes from "./routes/UserRoutes.mjs"
import profileRoutes from "./routes/ProfileRoutes.mjs"
import movieRoutes from "./routes/MovieRoutes.mjs"
import adminRoutes from "./routes/AdminRoutes.mjs"
import watchlistRoutes from "./routes/WatchlistRoutes.mjs"
import path from 'path'; 
import { connectDB } from './config/dbConfig.mjs';

// Configuración de variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0'; // Importante para Render

// Configuración de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP para permitir cargar recursos externos en el panel admin
}))

// Limitar solicitudes para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limitar cada IP a 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos",
})

// Aplicar limitador a todas las solicitudes
app.use(limiter)

// app.use(
//   cors({
//     origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
//     credentials: true,
//   })
// );

const allowedOrigins = [
  'http://localhost:5173',
  'https://moviesflix-front.onrender.com'
];

// Middleware CORS solo para rutas que empiezan con /api
app.use('/api', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ Origen bloqueado por CORS:', origin);
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
}));



app.use(express.json({ limit: "10kb" })) 
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser()) 
app.use(methodOverride("_method")) 

// Configuración de vistas EJS para el panel de administrador
app.set("view engine", "ejs")
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", path.join(__dirname, 'views'));
app.use(express.static('src/public'));


// Rutas
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/movies", movieRoutes)
app.use("/admin", adminRoutes)
app.use("/api/watchlist", watchlistRoutes)

// Ruta principal
app.get("/", (req, res) => {
  res.send("API de MoviesFlix funcionando correctamente")
})

connectDB().then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
      
      // Solo muestra en desarrollo
      if (process.env.NODE_ENV !== 'production') {
        console.log(`➜ Local: http://localhost:${PORT}`);
      }
    });
  });

export default app


// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import methodOverride from "method-override";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import cookieParser from "cookie-parser";
// import path from 'path';

// // ==============================================
// // 1. Configuración Inicial
// // ==============================================
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// dotenv.config();

// // ==============================================
// // 2. Configuración de Express y Middlewares
// // ==============================================
// const app = express();
// const PORT = process.env.PORT || 5000;
// const HOST = '0.0.0.0';

// // **Seguridad y límites de tasa**
// app.use(helmet({ contentSecurityPolicy: false }));
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 1000, // Límite de 1000 peticiones por IP
//   message: "Demasiadas solicitudes desde esta IP"
// }));

// // **Configuración CORS mejorada**
// const allowedOrigins = [
//   'https://moviesflix-front.onrender.com',
//   'http://localhost:5173'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Origen no permitido por CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   optionsSuccessStatus: 200
// }));

// // **Middlewares adicionales**
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// app.use(cookieParser());
// app.use(methodOverride("_method"));

// // **Headers personalizados para CORS**
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Expose-Headers', 'Authorization');
//   next();
// });

// // **Configuración de vistas (si usas EJS)**
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// // ==============================================
// // 3. Importación Dinámica de Rutas (Versión Sincrónica)
// // ==============================================
// // **Evitamos problemas con `path-to-regexp` usando importaciones estáticas**
// import authRoutes from './routes/AuthRoutes.mjs';
// import userRoutes from './routes/UserRoutes.mjs';
// import profileRoutes from './routes/ProfileRoutes.mjs';
// import movieRoutes from './routes/MovieRoutes.mjs';
// import adminRoutes from './routes/AdminRoutes.mjs';
// import watchlistRoutes from './routes/WatchlistRoutes.mjs';

// // **Conexión a la base de datos**
// import { connectDB } from './config/dbConfig.mjs';

// // ==============================================
// // 4. Definición de Rutas
// // ==============================================
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/profiles", profileRoutes);
// app.use("/api/movies", movieRoutes);
// app.use("/admin", adminRoutes);
// app.use("/api/watchlist", watchlistRoutes);

// // **Ruta de prueba**
// app.get("/", (req, res) => {
//   res.send("✅ API de MoviesFlix funcionando correctamente");
// });

// // ==============================================
// // 5. Inicio del Servidor
// // ==============================================
// connectDB()
//   .then(() => {
//     app.listen(PORT, HOST, () => {
//       console.log(`🚀 Servidor ejecutándose en http://${HOST}:${PORT}`);
//       if (process.env.NODE_ENV !== 'production') {
//         console.log(`➜ Local: http://localhost:${PORT}`);
//       }
//     });
//   })
//   .catch(err => {
//     console.error("❌ Error al iniciar la aplicación:", err);
//     process.exit(1);
//   });

// export default app;