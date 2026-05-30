import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import walletsRouter from "./wallets";
import tokensRouter from "./tokens";
import networksRouter from "./networks";
import transactionsRouter from "./transactions";
import portfolioRouter from "./portfolio";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(walletsRouter);
router.use(tokensRouter);
router.use(networksRouter);
router.use(transactionsRouter);
router.use(portfolioRouter);
router.use(activityRouter);

export default router;
