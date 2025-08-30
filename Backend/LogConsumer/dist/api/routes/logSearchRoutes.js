"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logSearchController_1 = require("../controller/logSearchController");
const router = (0, express_1.Router)();
router.post("/search", logSearchController_1.searchLogs);
exports.default = router;
