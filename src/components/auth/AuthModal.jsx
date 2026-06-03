import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { authClient } from '@/lib/auth-client';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Loader2, Mail, Lock, ShieldAlert } from 'lucide-react';

function AuthModal({ onAuthSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const resetRef = useRef(null);

  const form = useAuthForm(useCallback((result) => {
    if (result.data?.user) {
      setUser(result.data.user);
      onAuthSuccess(result.data.user);
      setIsOpen(false);
      resetRef.current?.();
    }
  }, [onAuthSuccess]));
  resetRef.current = form.reset;

  React.useEffect(() => {
    async function checkSession() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser(session.data.user);
        onAuthSuccess(session.data.user);
      }
    }
    checkSession();
  }, [onAuthSuccess]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authClient.signOut();
      setUser(null);
      onAuthSuccess(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 bg-white border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 rounded-xl shadow-sm pointer-events-auto overflow-hidden transition-colors duration-300">
        <div className="flex items-center gap-2 pl-3 pr-1">
          <div className="w-6 h-6 bg-accent-brand/10 border border-accent-brand/20 flex items-center justify-center text-accent-brand rounded-lg">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1 max-w-[100px]">{user.name}</span>
        </div>
        <Button
          onClick={handleLogout}
          disabled={logoutLoading}
          size="sm"
          variant="ghost"
          className="h-8 px-2.5 text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
        >
          {logoutLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); form.reset(); }}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="bg-accent-brand hover:brightness-110 text-white h-10 px-4 font-medium text-xs pointer-events-auto rounded-xl shadow-sm"
        >
          <LogIn className="w-3.5 h-3.5" />
          Masuk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
            {form.isSignUp ? 'Daftar Baru' : 'Masuk ke SkyRadar'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex p-1 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 w-full rounded-xl transition-colors duration-300">
          <button
            type="button"
            onClick={() => { form.setIsSignUp(false); form.reset(); }}
            className={`flex-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              !form.isSignUp
                ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-gray-200 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={() => { form.setIsSignUp(true); form.reset(); }}
            className={`flex-1 py-2 text-xs font-medium transition-all duration-300 rounded-lg ${
              form.isSignUp
                ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-gray-200 dark:border-neutral-700 shadow-sm'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {form.error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-xl">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{form.error}</span>
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="flex flex-col gap-3">
          {form.isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Nama Lengkap</label>
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 focus-within:border-accent-brand/50 transition-colors rounded-xl">
                <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap Anda..."
                  value={form.name}
                  onChange={(e) => form.setName(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Alamat Email</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 focus-within:border-accent-brand/50 transition-colors rounded-xl">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <input
                type="email"
                required
                placeholder="email@anda.com"
                value={form.email}
                onChange={(e) => form.setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Password</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 focus-within:border-accent-brand/50 transition-colors rounded-xl">
              <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter..."
                value={form.password}
                onChange={(e) => form.setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={form.loading}
            className="w-full bg-accent-brand hover:brightness-110 text-white h-10 font-medium text-xs mt-2 rounded-xl"
          >
            {form.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              form.isSignUp ? 'Daftar' : 'Masuk'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AuthModal.propTypes = {
  onAuthSuccess: PropTypes.func.isRequired,
};

export default AuthModal;
