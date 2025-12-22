import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import mainRoutes from './src/routes/routes.js';
import { errorHandler } from './src/middleware/error.middleware.js';
import { redocRouter } from './src/config/docs/redoc.js';

const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// app.use(
//   cors({
//     origin: 'http://localhost:5173', // NOT "*"
//     credentials: true, // Required for cookies
//   }),
// );

// ⭐ ADD REDOC
if (process.env.NODE_ENV !== 'production') {
  redocRouter(app);
}

app.use('/api', mainRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(` 🟢🟢 Server listening on port:${PORT} on ${process.env.NODE_ENV} mode.`);
});
