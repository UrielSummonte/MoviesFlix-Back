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

//app.use(cors());  // Permite todos los orígenes

const allowedOrigins = [
  'https://moviesflix-front.onrender.com',
  'https://moviesflix-back.onrender.com/',
  'http://localhost:5173',
  'http://localhost:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Aplica CORS solo a rutas de API
app.use('/api', cors(corsOptions));

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

