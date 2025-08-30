import type React from "react";
import Navigation from "@/components/layout/navigation";
import { SiteContainer } from "@/components/layout/site-container";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <SiteContainer>{children}</SiteContainer>
      </main>
    </div>
  );
}
