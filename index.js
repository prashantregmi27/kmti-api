import 'dotenv/config';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { seedSettings, updateSettingByKey } from './controllers/settingsController.js';
import { seedSiteContent } from './controllers/siteContentController.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedSettings();
  await seedSiteContent();
  await updateSettingByKey('social_facebook', 'https://www.facebook.com/share/1cMaJrQcWF/?mibextid=wwXIfr');
}).catch(err => {
  console.error('Seeding failed:', err.message);
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'https://kmti.edu.np' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests, please try again later.' });
app.use('/api', limiter);
app.use('/api', routes);

const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/', (req, res) => res.json({ message: 'KMTI API is running', version: '1.0.0' }));

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`KMTI API running on port ${PORT}`));
