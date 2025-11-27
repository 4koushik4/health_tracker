import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

const indexPath = path.join(process.cwd(), "dist/spa/index.html");

export default function handler(req: VercelRequest, res: VercelResponse) {
  const html = fs.readFileSync(indexPath, "utf-8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
