import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function AlertThresholdEditor({ alertConfig, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highWind, setHighWind] = useState(alertConfig?.highWind ?? 40);
  const [heavyRain, setHeavyRain] = useState(alertConfig?.heavyRain ?? 8);
  const [poorAQI, setPoorAQI] = useState(alertConfig?.poorAQI ?? 100);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ highWind, heavyRain, poorAQI });
      setIsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-white/90 dark:bg-neutral-900/90 dark:text-neutral-200 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          title="Pengaturan Peringatan Cuaca"
        >
          <Settings className="w-3 h-3 text-accent-brand" />
          Peringatan
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-xl transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Pengaturan Peringatan Cuaca
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">Angin Kencang</span>
              <span className="font-mono text-accent-brand font-semibold">{highWind} km/h</span>
            </div>
            <Slider value={[highWind]} min={10} max={150} step={5} onValueChange={(v) => setHighWind(v[0])} />
            <span className="text-[10px] text-neutral-400">Peringatan ketika angin melebihi batas</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">Hujan Lebat</span>
              <span className="font-mono text-accent-brand font-semibold">{heavyRain} mm</span>
            </div>
            <Slider value={[heavyRain]} min={1} max={100} step={1} onValueChange={(v) => setHeavyRain(v[0])} />
            <span className="text-[10px] text-neutral-400">Peringatan ketika curah hujan melebihi batas</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">Kualitas Udara (AQI)</span>
              <span className="font-mono text-accent-brand font-semibold">{poorAQI}</span>
            </div>
            <Slider value={[poorAQI]} min={20} max={400} step={5} onValueChange={(v) => setPoorAQI(v[0])} />
            <span className="text-[10px] text-neutral-400">Peringatan ketika AQI melebihi batas</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1 h-9 text-xs rounded-xl">
            <X className="w-3.5 h-3.5" />
            Batal
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 h-9 bg-accent-brand hover:brightness-110 text-white text-xs rounded-xl">
            {saving ? (
              <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Menyimpan...</span>
            ) : (
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />Simpan</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

AlertThresholdEditor.propTypes = {
  alertConfig: PropTypes.shape({
    highWind: PropTypes.number,
    heavyRain: PropTypes.number,
    poorAQI: PropTypes.number,
  }),
  onSave: PropTypes.func.isRequired,
};

export default AlertThresholdEditor;