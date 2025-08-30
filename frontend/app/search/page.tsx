// app/search/page.tsx
import SearchPage from "@/components/features/search/search-page";

export default function SearchPageRoute() {
  return (
    <div className=" py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search Logs</h1>
        <p className="text-muted-foreground">
          Search and filter through your application logs
        </p>
      </div>
      <SearchPage />
    </div>
  );
}
