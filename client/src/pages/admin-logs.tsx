import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingNav } from '@/components/FloatingNav';
import { MobileNav } from '@/components/MobileNav';
import { Badge } from '@/components/ui/badge';
import { Activity, User, FileText, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { ActivityLog } from '@shared/schema';
import { useAuth } from '@/lib/auth-context';

const actionIcons = {
  create: FileText,
  update: FileText,
  delete: FileText,
  login: User,
  logout: User,
  settings: SettingsIcon,
  comment: MessageSquare,
};

const actionColors = {
  create: 'text-green-500',
  update: 'text-blue-500',
  delete: 'text-red-500',
  login: 'text-purple-500',
  logout: 'text-gray-500',
  settings: 'text-yellow-500',
  comment: 'text-cyan-500',
};

export default function AdminLogsPage() {
  const { user } = useAuth();
  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/admin/logs'],
    enabled: user?.role === 'admin',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Only administrators can view activity logs.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ParticleBackground />
        <FloatingNav />
        <MobileNav />
        <div className="container mx-auto px-4 md:px-6 py-32">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <FloatingNav />
      <MobileNav />

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Admin Activity Logs
            </h1>
            <p className="text-lg text-muted-foreground">
              System-wide activity and administrative actions
            </p>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-16 bg-card border border-card-border rounded-xl">
              <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No activity logs yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                const Icon = actionIcons[log.action as keyof typeof actionIcons] || Activity;
                const colorClass = actionColors[log.action as keyof typeof actionColors] || 'text-gray-500';
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-card-border rounded-xl p-6 hover-elevate"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${colorClass} mt-1`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="capitalize">
                                {log.action}
                              </Badge>
                              <Badge variant="secondary" className="capitalize">
                                {log.entityType}
                              </Badge>
                            </div>
                            
                            {log.details && (
                              <p className="text-sm text-muted-foreground">
                                {log.details}
                              </p>
                            )}
                          </div>
                          
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {log.userId && (
                            <span>User ID: {log.userId.slice(0, 8)}...</span>
                          )}
                          {log.entityId && (
                            <span>Entity ID: {log.entityId.slice(0, 8)}...</span>
                          )}
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
