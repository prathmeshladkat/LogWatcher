"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLog = void 0;
const index_1 = require("../utils/index");
const saveLog = async (log) => {
    try {
        await index_1.esClient.index({
            index: "logs",
            document: log,
        });
        console.log("log stored in elasticsearch");
    }
    catch (err) {
        console.error("❌ Failed to save log:", err);
    }
};
exports.saveLog = saveLog;
