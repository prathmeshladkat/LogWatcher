import { Router } from "express";
import { searchLogs } from "../controller/logSearchController";

const router: Router = Router();

router.post("/search", searchLogs);

export default router;
