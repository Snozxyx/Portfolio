import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import BlogList from "./pages/blog-list";
import BlogPost from "./pages/blog-post";
import BlogCreate from "./pages/blog-create";
import BlogEdit from "./pages/blog-edit";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import MaintenancePage from "./pages/maintenance";
import type { SiteSettings } from "@shared/schema";

function Router() {
  const { user } = useAuth();
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings'],
    retry: false,
  });

  // Show maintenance page if maintenance mode is on and user is not admin
  if (settings?.maintenanceMode && user?.role !== 'admin') {
    return <MaintenancePage message={settings.maintenanceMessage || undefined} />;
  }

  return (
    <>
      <AnnouncementBanner />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/blog" component={BlogList} />
        <Route path="/blog/create" component={BlogCreate} />
        <Route path="/blog/:id/edit" component={BlogEdit} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile/:id" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;