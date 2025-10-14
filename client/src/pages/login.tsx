import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      toast({ title: 'Welcome back!' });
      setLocation('/');
    } catch (error: any) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <ParticleBackground />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">Welcome back to your account</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-login-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} data-testid="input-login-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" data-testid="button-login">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <Link href="/register">
              <a className="text-primary hover:underline" data-testid="link-register">
                Don't have an account? Sign up
              </a>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home">
              Back to Home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
