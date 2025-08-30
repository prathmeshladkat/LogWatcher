import LiveLogsPanel from "@/components/features/live-logs/live-logs-panel";

export default function DashboardPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold"> Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your application logs in real-time
        </p>
      </div>
      <LiveLogsPanel />
    </div>
  );
}
