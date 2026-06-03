import React from 'react';
import PropTypes from 'prop-types';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function GeoLocationButton({ onClick, loading }) {
  return (
    <div>
      <Button
        onClick={onClick}
        disabled={loading}
        size="icon"
        title={loading ? 'Mendeteksi lokasi...' : 'Lokasi Saya'}
        className="w-12 h-12 bg-white text-neutral-800 hover:bg-gray-50 border border-gray-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800 rounded-lg shadow-md transition-colors duration-300"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent-brand" />
        ) : (
          <Navigation className="h-5 w-5 fill-neutral-600 dark:fill-neutral-400 text-neutral-600 dark:text-neutral-400" />
        )}
      </Button>
    </div>
  );
}

GeoLocationButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default GeoLocationButton;
