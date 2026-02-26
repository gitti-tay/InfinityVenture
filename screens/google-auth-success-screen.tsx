import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2 } from 'lucide-react';

/**
 * Google OAuth Success Screen
 * Handles the redirect from /api/auth/google/callback
 * Extracts the JWT token from URL params, stores it, fetches user info,
 * and redirects to /home
 */
export function GoogleAuthSuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No authentication token received. Please try again.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
      return;
    }

    // Store the token
    localStorage.setItem('iv_token', token);

    // Fetch user info with the token
    const apiBase = window.location.origin + '/api';

    fetch(apiBase + '/auth/me', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token validation failed');
        return res.json();
      })
      .then(data => {
        if (data.success && data.user) {
          localStorage.setItem('iv_user', JSON.stringify(data.user));
          // Force full page reload so AuthContext picks up the new token
          window.location.href = '/home';
        } else {
          throw new Error('Invalid response');
        }
      })
      .catch(() => {
        localStorage.removeItem('iv_token');
        localStorage.removeItem('iv_user');
        setError('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {error ? (
          <>
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <p className="text-muted-foreground text-sm">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <div className="text-lg font-medium text-foreground">
              Signing you in with Google...
            </div>
            <p className="text-muted-foreground text-sm">
              Please wait while we complete the authentication.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
