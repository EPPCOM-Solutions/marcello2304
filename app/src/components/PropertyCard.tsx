"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Property, SearchIntent } from '../types/property';
import { MapPin, BedDouble, Maximize, ExternalLink, Euro, TrendingUp } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSwipe: (id: string, direction: 'left' | 'right') => void;
  intent: SearchIntent;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSwipe, intent }) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const x = useMotionValue(0);
  
  // Transform values for rotation and opacity based on swipe
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // UI indicators for Nope/Like
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0, 0]);
  const likeOpacity = useTransform(x, [0, 50, 100], [0, 0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200);
      onSwipe(property.id, 'right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      onSwipe(property.id, 'left');
    }
  };

  // Rendite Ampel Calculation (Bruttomietrendite = Kaltmiete * 12 / Kaufpreis * 100)
  const renderRenditeAmpel = () => {
    if (intent === 'rent' || !property.estimatedRent || property.price < 5000) return null;
    
    const rendite = (property.estimatedRent / property.price) * 100;
    const factor = property.price / property.estimatedRent;
    
    let colorClass = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (rendite < 3) colorClass = "text-red-400 bg-red-400/10 border-red-400/20";
    else if (rendite >= 3 && rendite < 5) colorClass = "text-amber-400 bg-amber-400/10 border-amber-400/20";

    return (
      <div className={`mt-3 flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm ${colorClass}`}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <div>
            <div className="text-xs opacity-80">Rendite-Ampel</div>
            <div className="font-bold text-sm">{rendite.toFixed(1)}% Brutto</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-80">Kaufpreisfaktor</div>
          <div className="font-bold text-sm">{factor.toFixed(1)}x</div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
      className="absolute inset-0 w-full h-[70vh] p-4 cursor-grab active:cursor-grabbing origin-bottom"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass shadow-2xl border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
        
        {/* Source Badge */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {property.source}
        </div>

        <img src={property.imageUrl} alt={property.title} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

        {/* Swipe Indicators */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-8 z-30 transform -rotate-12 border-4 border-emerald-400 rounded-xl px-4 py-2 text-emerald-400 font-black text-4xl uppercase tracking-widest bg-emerald-950/40 backdrop-blur-md">
          Merken
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-8 z-30 transform rotate-12 border-4 border-pink-500 rounded-xl px-4 py-2 text-pink-500 font-black text-4xl uppercase tracking-widest bg-pink-950/40 backdrop-blur-md">
          Pass
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-bold font-sans tracking-tight leading-tight max-w-[70%]">{property.title}</h2>
            <div className="text-right">
              <span className="text-3xl font-black text-white decoration-emerald-500 underline decoration-4 underline-offset-4">{property.price.toLocaleString('de-DE')}</span>
              <span className="text-sm font-medium opacity-80 block">{property.price > 10000 ? '€ Kaufpreis' : '€ Kalt'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-300 text-sm mb-4">
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> <span className="truncate">{property.address}</span></div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
              <Maximize className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="font-semibold">{property.livingSpace} m²</span>
            </div>
            <div className="flex-1 bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/50 flex flex-col items-center justify-center">
              <BedDouble className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="font-semibold">{property.rooms} Zi.</span>
            </div>
          </div>

          {renderRenditeAmpel()}
        </div>
      </div>
    </motion.div>
  );
};
