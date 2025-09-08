"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLogs = void 0;
const index_1 = require("../../utils/index");
const searchLogs = async (req, res) => {
    try {
        const { serviceName, logLevel, message, startDate, endDate, from = 0, limit = 50, } = req.body;
        const mustConditions = [];
        if (serviceName && serviceName.trim() !== "") {
            mustConditions.push({
                match: {
                    service: {
                        // Changed from 'service_name' to 'service'
                        query: serviceName.trim(),
                        fuzziness: "AUTO",
                        operator: "and",
                    },
                },
            });
        }
        if (logLevel && logLevel.trim() !== "") {
            mustConditions.push({
                term: {
                    log_level: logLevel.toUpperCase().trim(),
                },
            });
        }
        if (message && message.trim() !== "") {
            mustConditions.push({
                match: {
                    message: {
                        query: message.trim(),
                        fuzziness: "AUTO",
                    },
                },
            });
        }
        if (startDate || endDate) {
            const dateRange = {};
            if (startDate) {
                dateRange.gte = startDate;
            }
            if (endDate) {
                dateRange.lte = endDate;
            }
            mustConditions.push({
                range: {
                    access_time: dateRange, // Using access_time for date filtering
                },
            });
        }
        let query;
        if (mustConditions.length > 0) {
            query = {
                bool: {
                    must: mustConditions,
                },
            };
        }
        else {
            query = {
                match_all: {},
            };
        }
        const searchQuery = {
            index: "logs",
            query: query,
            sort: [
                {
                    access_time: {
                        // Sort by access_time to match your log structure
                        order: "desc",
                    },
                },
            ],
            from: Math.max(0, from),
            size: Math.min(1000, Math.max(1, limit)),
            track_total_hits: true,
        };
        const response = await index_1.esClient.search(searchQuery);
        const results = {
            logs: response.hits.hits.map((hit) => ({
                id: hit._id,
                source: hit._source,
                score: hit._score,
            })),
            total: typeof response.hits.total === "object"
                ? response.hits.total.value
                : response.hits.total,
            from: from,
            size: limit,
            took: response.took, // This is correct for v8+
        };
        res.status(200).json({
            success: true,
            data: results,
        });
    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during search",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.searchLogs = searchLogs;
