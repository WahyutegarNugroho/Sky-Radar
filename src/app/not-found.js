import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center gap-4 p-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-2xl">
        <svg className="w-10 h-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">404</h1>
      <p className="text-sm text-neutral-500 text-center max-w-md leading-relaxed">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link href="/" className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
