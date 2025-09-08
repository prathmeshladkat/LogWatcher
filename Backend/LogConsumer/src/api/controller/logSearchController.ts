import type { Request, Response } from "express";
import Joi from "joi";
import { esClient } from "../../utils/index";
import { SearchRequest } from "@elastic/elasticsearch/lib/api/types";

interface LogDocument {
  ip: string;
  access_time: string;
  method: string;
  endpoint: string;
  protocol: string;
  status: number;
  bytes: number;
  referrer: string;
  user_agent: string;
  log_time: string;
  log_level: string;
  service: string;
  message: string;
  request_id: string;
}

interface LogSearchResult {
  logs: Array<{
    id: string;
    source: LogDocument;
    score: number;
  }>;
  total?: number;
  from: number;
  size: number;
  took?: number;
}

interface LogSearchParams {
  serviceName?: string;
  logLevel?: string;
  message?: string;
  startDate?: string;
  endDate?: string;
  from?: number;
  limit?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const searchLogs = async (req: Request, res: Response) => {
  try {
    const {
      serviceName,
      logLevel,
      message,
      startDate,
      endDate,
      from = 0,
      limit = 50,
    } = req.body as LogSearchParams;

    const mustConditions: any[] = [];

    if (serviceName && serviceName.trim() !== "") {
      mustConditions.push({
        match: {
          service: {
            // Changed from 'service_name' to 'service'
            query: serviceName.trim(),
            fuzziness: "AUTO",
            operator: "and" as const,
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
      const dateRange: any = {};

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
    } else {
      query = {
        match_all: {},
      };
    }

    const searchQuery: SearchRequest = {
      index: "logs",

      query: query,
      sort: [
        {
          access_time: {
            // Sort by access_time to match your log structure
            order: "desc" as const,
          },
        },
      ],
      from: Math.max(0, from),
      size: Math.min(1000, Math.max(1, limit)),
      track_total_hits: true,
    };

    const response = await esClient.search<LogDocument>(searchQuery);

    const results: LogSearchResult = {
      logs: response.hits.hits.map((hit: any) => ({
        id: hit._id,
        source: hit._source,
        score: hit._score,
      })),
      total:
        typeof response.hits.total === "object"
          ? response.hits.total.value
          : response.hits.total,
      from: from,
      size: limit,
      took: response.took, // This is correct for v8+
    };

    res.status(200).json({
      success: true,
      data: results,
    } as ApiResponse<LogSearchResult>);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during search",
      error: error instanceof Error ? error.message : "Unknown error",
    } as ApiResponse);
  }
};
