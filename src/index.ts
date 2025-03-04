import 'dotenv/config';
import express, { Request, Response } from 'express'
import cors from 'cors'
import { isAuthenticated } from '@/middleware/auth'
import { ApiRouter } from '@/routes'
import { login } from '@/routes/login'
// import * as Minio from 'minio'

// const minioClient = new Minio.Client({
//   endPoint: 'fsn1.your-objectstorage.com',
//   useSSL: true,
//   accessKey: 'TMI5PN0IHPI1G84VYCQI',
//   secretKey: 'quixE9hjXM0eRGCHqtBaEdVQ7g3Y4Pp7bJSMQjWJ',
// })

const app = express();

// CORS and BodyParser Support
app.use(cors());
app.use(express.json());

// This route needs to be unauthenticated, since it's the login route
// and the user will get the jwt for later authentication through this route
app.post('/login', login)
app.use('/discussions', isAuthenticated, ApiRouter)

// Test authentication middleware
// app.get('/test', isAuthenticated, async (req: Request, res: Response) => {
//   res.send({ message: "You are authenticated" })
// })

// app.get("/", async (req: Request, res: Response) => {
//   const stream = minioClient.listObjects('momments', '', true);
//   const files: string[] = [];

//   stream.on('data', (obj: any) => {
//     files.push(obj.name);
//   });

//   stream.on('end', async () => {
//     const resp = {
//       buckets: await minioClient.listBuckets(),
//       files
//     }
//     res.send(resp)
//   });

//   stream.on('error', (err) => {
//     console.error("Error fetching files:", err);
//     res.status(500).json({ error: "Failed to fetch files" });
//   });

// });

// app.get('/bassdrums', async (req: Request, res: Response) => {
//    res.send(await minioClient.presignedGetObject('momments', 'BassDrums30.mp3'))
// })


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});