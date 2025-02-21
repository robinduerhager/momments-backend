require('dotenv').config()
import express, {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client'

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});