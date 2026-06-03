import '../index.css';
import { MapProvider } from '@/contexts/MapContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/shared/ErrorBoundary'; export const dynamic = 'force-dynamic'; export const metadata = { title: 'SkyRadar Web Viewer - Real-time Weather Radar', description: 'SkyRadar Web Viewer - Pantau pergerakan awan dan curah hujan secara real-time menggunakan peta interaktif dengan data radar cuaca RainViewer.',
}; export default function RootLayout({ children }) { return ( <html lang="id"><body className="antialiased"><ErrorBoundary><MapProvider><AuthProvider>{children} </AuthProvider></MapProvider></ErrorBoundary></body></html>);
}
