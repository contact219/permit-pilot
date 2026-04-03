import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import * as routes from './routes/index.js';

const { Pool } = pg;
const PgSession = connectPgSimple(session);
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const secret = process.env.SESSION_SECRET || 'dev-secret-change-me';
app.use(
  session({
    store: new PgSession({ pool, tableName: 'session', createTableIfMissing: true }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use((req: any, _res: any, next: any) => {
  req.user = (req.session as any)?.user || null;
  next();
});

app.use('/api/auth', routes.authRouter);
app.use('/api/projects', routes.projectsRouter);
app.use('/api/export', routes.exportRouter);
app.use('/api/jurisdictions', routes.jurisdictionsRouter);
app.use('/api/billing', routes.billingRouter);
app.use('/api/admin/jurisdictions', routes.adminJurisdictionsRouter);
app.use('/api/admin/users', routes.adminUsersRouter);
app.use('/api/admin/scraper', routes.adminScraperRouter);
app.use('/api/admin/scraper/logs', routes.adminScraperLogsRouter);

app.get('/api/health', (_: any, res: any) =>
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
);

// Serve built client (must be after all API routes)
app.use(express.static(join(__dirname, '../../dist')));
app.get('*', (_: any, res: any) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
