import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { seedSettings, updateSettingByKey } from './controllers/settingsController.js';
import { seedSiteContent } from './controllers/siteContentController.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

connectDB().then(async () => {
  await seedSettings();
  await seedSiteContent();
  await updateSettingByKey('social_facebook', 'https://www.facebook.com/share/1cMaJrQcWF/?mibextid=wwXIfr');
}).catch(err => console.error('Seeding failed:', err.message));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, message: 'KMTI API running' }));
app.get('/health', (req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log('KMTI API running on port ' + PORT));