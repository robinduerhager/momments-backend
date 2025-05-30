import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { isAuthenticated } from '@/middleware/auth'
import { CommentsRouter, DiscussionsRouter, CommentModulesRouter, AudioFileRouter } from '@/routes'
import { NODE_ENV, DOMAIN } from '@/utils/vars'
import { login, me } from '@/routes/userRoutes'

// Ensure required environment variables are set for the backend
if (!NODE_ENV || !DOMAIN) {
  console.error('Please set the NODE_ENV and DOMAIN environment variables');
  process.exit(1);
}

const app = express();

// Add CORS Support. The Frontend / Browserextension will use the same domain of the website on which it runs
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

// Authenticated routes
app.use('/me', isAuthenticated, me)
app.use('/discussions', isAuthenticated, DiscussionsRouter)
app.use('/comments', isAuthenticated, CommentsRouter)
app.use('/modules', isAuthenticated, CommentModulesRouter)
app.use('/audiofiles', isAuthenticated, AudioFileRouter)

const PORT = process.env.PORT || 8080;

// If we are in development mode, we can use the default HTTP server, i guess since the domain will be localhost
if (NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://${DOMAIN}:${PORT}`);
  });
}

// If we are in production mode, we need to use HTTPS with SSL certificates, since we cannot use localhost as a domain.
// Else, we will not be able to connect to the backend from the frontend, because requests from a https:// domain to a http:// domain are blocked by the browser.
// See Mixed Content: https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
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