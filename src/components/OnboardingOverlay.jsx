'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MapPin, CloudSun, Layers, Move } from 'lucide-react';
import PropTypes from 'prop-types';

const slides = [
  {
    icon: <MapPin className="w-10 h-10 text-emerald-500" />,
    title: 'Cari Lokasi',
    description: 'Klik di peta untuk melihat data cuaca dan radar di lokasi tersebut. Anda juga bisa menggunakan tombol GPS untuk mendeteksi lokasi Anda saat ini.',
  },
  {
    icon: <CloudSun className="w-10 h-10 text-amber-500" />,
    title: 'Informasi Cuaca',
    description: 'Kartu cuaca menampilkan suhu, kelembaban, kecepatan angin, dan prakiraan 7 hari. Data bersumber dari Open-Meteo dan BMKG.',
  },
  {
    icon: <Layers className="w-10 h-10 text-blue-700" />,
    title: 'Lapisan Radar',
    description: 'Gunakan kontrol lapisan untuk mengaktifkan radar cuaca, mengubah gaya peta, transparansi, dan skema warna sesuai preferensi Anda.',
  },
  {
    icon: <Move className="w-10 h-10 text-sky-500" />,
    title: 'Jelajahi & Simpan',
    description: 'Navigasi peta dengan bebas. Gunakan tombol bookmark untuk menyimpan lokasi favorit agar mudah diakses kembali.',
  },
];

export default function OnboardingOverlay({ open, onClose }) {
  const [slide, setSlide] = useState(0);

  const dismiss = useCallback(() => {
    setSlide(0);
    if (onClose) onClose();
  }, [onClose]);

  const next = useCallback(() => {
    if (slide < slides.length - 1) {
      setSlide(s => s + 1);
    } else {
      dismiss();
    }
  }, [slide, dismiss]);

  const prev = useCallback(() => {
    if (slide > 0) setSlide(s => s - 1);
  }, [slide]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-sm bg-white border border-gray-200 overflow-hidden"
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 p-1.5 bg-gray-100 hover:bg-gray-200 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center gap-4 p-8 pb-6">
              <div className="p-4 bg-gray-50 border border-gray-200">{slides[slide].icon}</div>
              <h2 className="text-lg font-semibold text-neutral-800 text-center">{slides[slide].title}</h2>
              <p className="text-xs text-neutral-500 text-center leading-relaxed">{slides[slide].description}</p>
            </div>

            <div className="flex items-center justify-between px-6 pb-6">
              <div className="flex gap-1.5">
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 transition-all duration-300 ${
                      idx === slide ? 'w-4 bg-blue-700' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {slide > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-neutral-700 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Kembali
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-xs font-medium text-white transition-colors"
                >
                  {slide < slides.length - 1 ? 'Lanjut' : 'Mulai'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

OnboardingOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
