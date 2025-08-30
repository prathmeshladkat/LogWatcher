"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logPoducerController_1 = require("../controller/logPoducerController");
const router = (0, express_1.Router)();
router.post("/start", logPoducerController_1.startSendingLogs);
router.post("/stop", logPoducerController_1.stopSendingLogs);
router.get("/status", logPoducerController_1.getStreamingStatus);
exports.default = router;
