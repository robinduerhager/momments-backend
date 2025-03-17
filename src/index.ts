import 'dotenv/config';
import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { isAuthenticated } from '@/middleware/auth'
import { CommentsRouter, DiscussionsRouter, CommentModulesRouter, AudioFileRouter } from '@/routes'
import { NODE_ENV, DOMAIN } from '@/utils/vars'
import { login, me } from '@/routes/userRoutes'

if (!NODE_ENV || !DOMAIN) {
  console.error('Please set the NODE_ENV and DOMAIN environment variables');
  process.exit(1);
}

const app = express();

// CORS Support
app.use(cors({
  origin: ['https://www.google.de', 'https://www.soundtrap.com'],
}));

// Body parser
app.use(express.json());

// Static folder for e.g. avatar images
app.use(express.static(path.join(__dirname, '../public')))

// This route needs to be unauthenticated, since it's the login route
// and the user will get the jwt for later authentication through this route
app.post('/login', login)

app.use('/me', isAuthenticated, me)
app.use('/discussions', isAuthenticated, DiscussionsRouter)
app.use('/comments', isAuthenticated, CommentsRouter)
app.use('/modules', isAuthenticated, CommentModulesRouter)
app.use('/audiofiles', isAuthenticated, AudioFileRouter)

const PORT = process.env.PORT || 8080;

if (NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://${DOMAIN}:${PORT}`);
  });
}

if (NODE_ENV === 'production') {
  const key = fs.readFileSync(`/app/ssl/${DOMAIN}/privkey.pem`, 'utf8');
  const cert = fs.readFileSync(`/app/ssl/${DOMAIN}/fullchain.pem`, 'utf8');

  if (!key || !cert) {
    console.error('SSL certificate and key not found');
    process.exit(1);
  }

  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`Server is running on https://${DOMAIN}:${PORT}`);
  });
}