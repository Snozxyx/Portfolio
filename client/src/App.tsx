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
import AnimePage from "./pages/anime";
import GamesPage from "./pages/games";
import AdminLogsPage from "./pages/admin-logs";
import type { SiteSettings } from "@shared/schema";

function Router() {
  const { user } = useAuth();
  // Fetch site settings
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
  });

  // Show maintenance page if enabled (except for admins)
  if (settings?.maintenanceMode && user?.role !== 'admin') {
    return <MaintenancePage message={settings.maintenanceMessage} />;
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
        {settings?.showAnimePage && <Route path="/anime" component={AnimePage} />}
        {settings?.showGamesPage && <Route path="/games" component={GamesPage} />}
        <Route path="/admin/logs" component={AdminLogsPage} />
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