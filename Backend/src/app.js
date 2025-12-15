// create server and setup middleware
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const  foodpartnerRoutes = require('./routes/foodpartner.routes');
const cors =require('cors');

// enable CORS for all routes
// allow both local dev and deployed frontend origin(s)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://foodreel-frontend.onrender.com',
  'http://localhost:5173',
];

// parse JSON and URL-encoded bodies (handles form posts and JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// request logger should run early so we capture ALL incoming requests
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl} - origin: ${req.headers.origin || 'none'}`);
  next();
});
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // allow Render subdomains automatically (convenience for deployed apps)
    if (/\.onrender\.com$/.test(origin)) {
      console.log('Allowing onrender origin:', origin);
      return callback(null, true);
    }
    console.warn('CORS deny origin:', origin);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
}));

console.log('CORS allowed origins:', allowedOrigins.join(', '));

// serve uploaded files
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// simple debug endpoint to verify POST connectivity from deployed frontend
app.post('/debug/echo', (req, res) => {
  res.status(200).json({ ok: true, received: req.body, origin: req.headers.origin || null });
});


// mount auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

// mount food routes
const foodRoutes = require('./routes/food.routes');
app.use('/api/food', foodRoutes);

// test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// request logger for troubleshooting (prints every incoming request)
// CORS error handler - respond with a clear 403 when origin is denied
app.use((err, req, res, next) => {
  if (err && err.message && err.message.includes('CORS policy')) {
    console.warn('[CORS] Denied', req.headers.origin || 'none', err.message);
    return res.status(403).json({ message: 'CORS policy: Origin not allowed', origin: req.headers.origin || null });
  }
  next(err);
});

// 404 handler to log missing routes
app.use((req, res) => {
  console.warn('[404] Not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;
