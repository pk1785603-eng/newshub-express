import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/contexts/AdminContext';
import logo from '@/assets/logo.png';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading, login } = useAdmin();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="24x7 News Time" className="h-16 w-auto" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Enter your admin password to continue
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Protected admin area. Unauthorized access prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
