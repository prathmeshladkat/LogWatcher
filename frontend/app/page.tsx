"use client";

import { SiteContainer } from "@/components/layout/site-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Clock, Search, Shield, Zap } from "lucide-react";

import { useState } from "react";

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = () => {
    try {
      setIsSigningIn(true);
      // Change this URL to your backend auth endpoint
      window.location.href = "http://localhost:7777/auth/google";
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/*Header*/}
      <header className="border-b bg-background/95 backdrop-blur">
        <SiteContainer>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8" />
                <span className="text-2xl font-bold">Log Watcher</span>
              </div>
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
              >
                sign in
              </Button>
            </div>
          </div>
        </SiteContainer>
      </header>

      {/*Main container*/}
      <main className="container mx-auto px-4 py-12">
        <SiteContainer>
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/*Left side*/}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Monitor Your
                  <span className="block text-primary">Applications Logs</span>
                  <span className="block">In Real-Time</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Stream, search, and analyze your application logs with
                  powerful filtering and real-time monitoring capabilities.
                </p>
              </div>

              {/*Features Grid*/}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Real-Time Streaming</h3>
                    <p className="text-sm text-muted-foreground">
                      Live log updates
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Search className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Advanced Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Filter by service, level
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Log insights & trends
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Secure Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Google OAuth
                    </p>
                  </div>
                </div>
              </div>
              {/* Console Preview */}
              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-400 ml-2">Live Logs</span>
                </div>
                <div className="space-y-1 text-green-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-gray-400">[12:34:56]</span>
                    <span className="bg-green-600 text-black px-1 rounded text-xs">
                      INFO
                    </span>
                    <span className="text-blue-400">[auth-service]</span>
                    <span>User authentication successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-gray-400">[12:34:57]</span>
                    <span className="bg-yellow-600 text-black px-1 rounded text-xs">
                      WARN
                    </span>
                    <span className="text-blue-400">[payment-service]</span>
                    <span className="text-yellow-400">
                      High memory usage detected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-gray-400">[12:34:58]</span>
                    <span className="bg-red-600 text-white px-1 rounded text-xs">
                      ERROR
                    </span>
                    <span className="text-blue-400">[database]</span>
                    <span className="text-red-400">Connection timeout</span>
                  </div>
                  <div className="text-gray-500 animate-pulse">▊</div>
                </div>
              </div>
            </div>

            {/*Right Side*/}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <p className="text-muted-foreground">
                    Sign in to access your log monitoring dashboard
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isSigningIn ? "Signing in..." : "Continue with Google"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>By signing in, you agree to our</p>
                    <div className="flex justify-center gap-4 mt-1">
                      <a href="#" className="underline hover:text-foreground">
                        Terms of Service
                      </a>
                      <a href="#" className="underline hover:text-foreground">
                        Privacy Policy
                      </a>
                    </div>
                  </div>

                  {/* Demo Features */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 text-center">
                      What you&apos;ll get access to:
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span>Real-time log streaming dashboard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        <span>Advanced search and filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span>Log analytics and insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Secure, authenticated access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SiteContainer>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <SiteContainer>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="font-semibold">Log Watcher</span>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground">
                  Documentation
                </a>
                <a href="#" className="hover:text-foreground">
                  Support
                </a>
                <a href="#" className="hover:text-foreground">
                  Status
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 Log Watcher. All rights reserved.
              </p>
            </div>
          </div>
        </SiteContainer>
      </footer>
    </div>
  );
  //redirect("/dashboard");
}
