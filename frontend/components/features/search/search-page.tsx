"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import LogDetailModal from "@/components/shared/log-detail-modal";

// Type definitions based on your API response
export type LogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface LogSource {
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
  log_level: LogLevel;
  service: string;
  message: string;
  request_id: string;
}

export interface LogEntry {
  id: string;
  source: LogSource;
  score: number | null;
}

interface SearchFilters {
  service?: string;
  level?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  from?: number;
  size?: number;
  sortField?: string;
  sortDirection?: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    logs: LogEntry[];
    total: number;
    from: number;
    size: number;
    took: number;
  };
}

interface SearchRequestBody {
  from: number;
  limit: number; // Backend expects 'limit' not 'size'
  serviceName?: string; // Backend expects 'serviceName'
  logLevel?: string; // Backend expects 'logLevel'
  message?: string; // Backend expects 'message'
  startDate?: string;
  endDate?: string;
  sortField?: string;
  sortDirection?: string;
}

// API service functions
const API_BASE_URL = "http://localhost:7777";

const searchLogsWithFilters = async (
  filters: SearchFilters
): Promise<ApiResponse> => {
  try {
    // Create request body with filters - map to backend parameter names
    const requestBody: SearchRequestBody = {
      from: filters.from || 0,
      limit: filters.size || 10, // Backend expects 'limit' not 'size'
    };

    // Add filters only if they have values - use backend parameter names
    if (filters.service) requestBody.serviceName = filters.service;
    if (filters.level) requestBody.logLevel = filters.level;
    if (filters.keyword) requestBody.message = filters.keyword;
    if (filters.startDate) requestBody.startDate = filters.startDate;
    if (filters.endDate) requestBody.endDate = filters.endDate;
    if (filters.sortField) requestBody.sortField = filters.sortField;
    if (filters.sortDirection)
      requestBody.sortDirection = filters.sortDirection;

    const response = await fetch(`${API_BASE_URL}/logs/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to search logs:", error);
    return {
      success: false,
      data: {
        logs: [],
        total: 0,
        from: 0,
        size: 10,
        took: 0,
      },
    };
  }
};

type SortField = "log_time" | "log_level" | "service" | "message";
type SortDirection = "asc" | "desc";

export default function SearchPage() {
  const [searchFilters, setSearchFilters] = useState({
    service: "",
    level: undefined as string | undefined,
    keyword: "",
    startDate: "",
    endDate: "",
  });
  const [sortField, setSortField] = useState<SortField>("log_time");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    success: false,
    data: {
      logs: [],
      total: 0,
      from: 0,
      size: 10,
      took: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate pagination values
  const totalPages = Math.ceil(apiResponse.data.total / logsPerPage);
  const currentFrom = (currentPage - 1) * logsPerPage;

  // Move handleInitialLoad to useCallback to fix the dependency warning
  const handleInitialLoad = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Load recent logs by default (last 24 hours, most recent first)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const initialFilters: SearchFilters = {
      startDate: twentyFourHoursAgo.toISOString().slice(0, 16),
      from: 0,
      size: logsPerPage,
      sortField: "log_time",
      sortDirection: "desc",
    };

    try {
      const results = await searchLogsWithFilters(initialFilters);
      if (results.success) {
        setApiResponse(results);
        setHasSearched(true);
      } else {
        setError("Failed to fetch recent logs");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while loading recent logs"
      );
    } finally {
      setIsLoading(false);
    }
  }, [logsPerPage]); // Added logsPerPage as dependency since it's used inside

  // Auto-load recent logs on component mount
  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]); // Now includes handleInitialLoad in dependency array

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    const filters: SearchFilters = {
      service: searchFilters.service || undefined,
      level: searchFilters.level || undefined,
      keyword: searchFilters.keyword || undefined,
      startDate: searchFilters.startDate || undefined,
      endDate: searchFilters.endDate || undefined,
      from: currentFrom,
      size: logsPerPage,
      sortField,
      sortDirection,
    };

    try {
      const results = await searchLogsWithFilters(filters);
      if (results.success) {
        setApiResponse(results);
        setHasSearched(true);
      } else {
        setError("Failed to fetch logs from server");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching logs"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      service: "",
      level: undefined,
      keyword: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
    setSortField("log_time");
    setSortDirection("desc");
    setHasSearched(false);
    setApiResponse({
      success: false,
      data: {
        logs: [],
        total: 0,
        from: 0,
        size: 10,
        took: 0,
      },
    });
  };

  const getLevelBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case "ERROR":
      case "CRITICAL":
        return "destructive";
      case "WARNING":
        return "secondary";
      case "INFO":
        return "default";
      default:
        return "outline";
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const renderTableContent = () => {
    if (isLoading && apiResponse.data.logs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading logs...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (apiResponse.data.logs.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={6}
            className="text-center py-8 text-muted-foreground"
          >
            {hasSearched
              ? "No logs found matching your search criteria"
              : "No recent logs found"}
          </TableCell>
        </TableRow>
      );
    }

    return apiResponse.data.logs.map((log) => (
      <TableRow key={log.id} className="hover:bg-muted/50">
        <TableCell className="font-mono text-sm">
          {new Date(log.source.log_time).toLocaleString()}
        </TableCell>
        <TableCell>
          <Badge variant={getLevelBadgeVariant(log.source.log_level)}>
            {log.source.log_level}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">{log.source.service}</TableCell>
        <TableCell className="max-w-md truncate">
          {log.source.message}
        </TableCell>
        <TableCell>
          <Badge variant={log.source.status >= 400 ? "destructive" : "default"}>
            {log.source.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedLog(log)}
          >
            View Details
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Service</label>
              <Input
                placeholder="Service name"
                value={searchFilters.service}
                onChange={(e) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    service: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Log Level
              </label>
              <Select
                value={searchFilters.level || "all"}
                onValueChange={(value) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    level: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARNING">WARNING</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Keyword</label>
              <Input
                placeholder="Search in message"
                value={searchFilters.keyword}
                onChange={(e) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    keyword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Date
              </label>
              <Input
                type="datetime-local"
                value={searchFilters.startDate}
                onChange={(e) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="datetime-local"
                value={searchFilters.endDate}
                onChange={(e) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {hasSearched && apiResponse.success && (
                <>
                  Found {apiResponse.data.total} logs
                  {totalPages > 1 && (
                    <>
                      {" "}
                      (Page {currentPage} of {totalPages})
                    </>
                  )}
                  {apiResponse.data.took && (
                    <> • Query took {apiResponse.data.took}ms</>
                  )}
                </>
              )}
              {!hasSearched && <>Showing recent logs from last 24 hours</>}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>Search</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">Error: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("log_time")}
                >
                  <div className="flex items-center gap-2">
                    Timestamp
                    <SortIcon field="log_time" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("log_level")}
                >
                  <div className="flex items-center gap-2">
                    Level
                    <SortIcon field="log_level" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("service")}
                >
                  <div className="flex items-center gap-2">
                    Service
                    <SortIcon field="service" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("message")}
                >
                  <div className="flex items-center gap-2">
                    Message
                    <SortIcon field="message" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>

          {totalPages > 1 && apiResponse.data.logs.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {apiResponse.data.from + 1} to{" "}
                {Math.min(
                  apiResponse.data.from + apiResponse.data.size,
                  apiResponse.data.total
                )}{" "}
                of {apiResponse.data.total} logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}

//search page -> css fixing -> auth -> deploy
