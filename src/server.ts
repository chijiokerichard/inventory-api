// mport express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import express, { type Response,type Request} from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req:Request, res:Response) => {
  res.send("Hello from Express API!");
});
app.listen(process.env.PORT, () => console.log(`Server running on port http://localhost:3000`));

export default app; // ✅ Required for Vercel
