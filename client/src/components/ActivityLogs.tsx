
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ActivityLogs = () => {
  const { data: logs = [] } = useQuery({
    queryKey: ['/api/admin/activity-logs'],
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-400';
      case 'update': return 'text-blue-400';
      case 'delete': return 'text-red-400';
      case 'login': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.slice(0, 20).map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user?.username || 'Unknown'}</TableCell>
                <TableCell>
                  <span className={getActionColor(log.action)}>
                    {log.action.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{log.entityType}</TableCell>
                <TableCell className="max-w-md truncate">{log.details}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
