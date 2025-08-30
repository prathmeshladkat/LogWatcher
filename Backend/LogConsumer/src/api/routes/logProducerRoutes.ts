import { Router } from "express";
import {
  getStreamingStatus,
  startSendingLogs,
  stopSendingLogs,
} from "../controller/logPoducerController";

const router: Router = Router();

router.post("/start", startSendingLogs);
router.post("/stop", stopSendingLogs);
router.get("/status", getStreamingStatus);

export default router;
