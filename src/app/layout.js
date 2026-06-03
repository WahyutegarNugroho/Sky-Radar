import '../index.css';
import { MapProvider } from '@/contexts/MapContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/shared/ErrorBoundary'; export const metadata = { title: 'SkyRadar Web Viewer - Real-time Weather Radar', description: 'SkyRadar Web Viewer - Pantau pergerakan awan dan curah hujan secara real-time menggunakan peta interaktif dengan data radar cuaca RainViewer.', openGraph: { title: 'SkyRadar Web Viewer', description: 'Pantau pergerakan awan dan curah hujan secara real-time.', type: 'website', locale: 'id_ID', }, icons: { icon: '/favicon.svg' },
}; export const viewport = { width: 'device-width', initialScale: 1, themeColor: [
  { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
],
}; export default function RootLayout({ children }) { return ( <html lang="id"><body className="antialiased"><ErrorBoundary><MapProvider><AuthProvider>{children} </AuthProvider></MapProvider></ErrorBoundary></body></html>);
}
