'use client';
export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-white dark:bg-neutral-950">
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 p-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-900/40 rounded-2xl">
            <svg className="w-10 h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 text-center">Terjadi Kesalahan</h2>
          <p className="text-sm text-neutral-500 text-center max-w-md leading-relaxed">
            Maaf, aplikasi mengalami gangguan yang tidak terduga. Silakan muat ulang halaman untuk mencoba kembali.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-[10px] text-red-500/60 font-mono max-w-md text-center truncate">{error?.message}</pre>
          )}
          <button onClick={() => reset()} className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors">
            Muat Ulang Halaman
          </button>
        </div>
      </body>
    </html>
  );
}
