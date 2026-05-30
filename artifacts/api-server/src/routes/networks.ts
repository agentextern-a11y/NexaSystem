import { Router } from "express";
import { db } from "@workspace/db";
import { networksTable } from "@workspace/db";

const router = Router();

router.get("/networks", async (_req, res) => {
  const networks = await db.select().from(networksTable);
  return res.json(networks);
});

export default router;
