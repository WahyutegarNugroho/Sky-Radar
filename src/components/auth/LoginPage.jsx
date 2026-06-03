import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Mail, Lock, Loader2, ShieldAlert, ArrowRight, Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function LoginPage({ onAuthSuccess, onBack, onRegisterClick, onGuestAccess }) {
  const form = useAuthForm((result) => {
    if (result.data?.user) onAuthSuccess(result.data.user);
  });

  // Ensure form is set to login mode
  useEffect(() => {
    form.setIsSignUp(false);
  }, []);

  const handleDemoLogin = () => {
    form.setEmail('demo@skyradar.com');
    form.setPassword('demopassword123');
    form.setIsSignUp(false);
  };

  return (
    <div className="relative min-h-screen w-screen bg-[url('https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 select-none font-sans">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/85 z-0" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white/3 border border-white/8 rounded-2xl shadow-xl flex flex-col gap-6 backdrop-blur-md">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold w-max self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Halaman Utama
        </button>

        <div className="flex flex-col gap-1.5 mt-2">
          <h3 className="text-2xl font-bold text-white m-0">Selamat Datang Kembali</h3>
          <p className="text-xs text-neutral-400 leading-normal m-0">
            Masuk dengan kredensial akun Anda untuk memulihkan preferensi cloud Anda.
          </p>
        </div>

        {form.error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs rounded-xl">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{form.error}</span>
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-medium">Alamat Email</label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-black/40 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl transition-all duration-300">
              <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="email"
                required
                placeholder="email@anda.com"
                value={form.email}
                onChange={(e) => form.setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-neutral-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs text-neutral-400 font-medium">Password</label>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
              >
                Gunakan Akun Demo?
              </button>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-black/40 border border-white/10 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl transition-all duration-300">
              <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter..."
                value={form.password}
                onChange={(e) => form.setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-neutral-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={form.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2 rounded-xl transition-all shadow-md active:scale-98"
          >
            {form.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Masuk Aplikasi
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-col gap-3 items-center justify-center pt-4 border-t border-white/5">
          <div className="text-xs text-neutral-400">
            Belum punya akun?{' '}
            <button
              onClick={onRegisterClick}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              Daftar Baru
            </button>
          </div>
          <span className="text-[10px] text-neutral-500 font-medium">ATAU</span>
          <button
            onClick={onGuestAccess}
            className="w-full h-10 border border-white/10 hover:bg-white/5 text-neutral-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            Eksplorasi Peta Tanpa Login
          </button>
        </div>
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  onAuthSuccess: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onGuestAccess: PropTypes.func.isRequired,
};

export default LoginPage;
