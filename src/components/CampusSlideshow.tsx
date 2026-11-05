import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

export interface SlideItem {
  id: number;
  url: string;
  fallbackUrl: string;
  tag: string;
  title: string;
  description: string;
  statBadge: string;
}

export const SLIDESHOW_DATA: SlideItem[] = [
  {
    id: 1,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-WWPsk3cO-Ye1VZ7rw-V-hcq_WN-Tpn7tsTS3SQwwUXmzhr4bbULl4LvV&s=10',
    fallbackUrl: '/slideshow/slide1.jpg',
    tag: 'CAMPUS GREEN CANOPY',
    title: 'M.Kumarasamy College of Engineering Aerial Green Canopy',
    description:
      '45+ acres of expansive coconut tree agroforestry creating an institutional natural carbon sink and oxygen reserve.',
    statBadge: '45+ Acres · 1,200+ Palms',
  },
  {
    id: 2,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnKfP8MU6uxaKHWe8qzl5gRwHZzykirgk8on6WW2BlUq37MPvgYfmsnL8&s=10',
    fallbackUrl: '/slideshow/slide2.jpg',
    tag: 'GREEN BIOTECHNOLOGY',
    title: 'Biotechnology in Engineering Innovations for a Healthier World',
    description:
      'Advanced environmental bio-remediation, sustainable materials, and bio-chemical waste decomposition research.',
    statBadge: 'Biotech Innovation Lab',
  },
  {
    id: 3,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuSTUACLG-AFhUtdXFF8Pavdscl639grT3Mb0eXq8B6vlNehjgcBlRQy2h&s=10',
    fallbackUrl: '/slideshow/slide3.jpg',
    tag: 'IOT REAL-TIME TELEMETRY',
    title: 'IoT-Powered Real-Time Environmental Monitoring Systems',
    description:
      'Campus smart sensor network capturing live ambient emissions, solar power generation, and lab energy consumption.',
    statBadge: '24/7 Live Monitoring Grid',
  },
  {
    id: 4,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVisq8vsG7pxYp_aS_AtV2g-LNkIxzsMMOu4Dtz0bi9w&s',
    fallbackUrl: '/slideshow/slide4.jpg',
    tag: 'INSTITUTIONAL GOVERNANCE',
    title: 'Academic Leadership & Sustainability Directorate Oversight',
    description:
      'Executive leadership steering NAAC "A" Grade excellence, ISO 14064-1 compliance, and national green campus rankings.',
    statBadge: 'Autonomous · NAAC "A" Grade',
  },
  {
    id: 5,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoCTdWfF2uAMbDX9zD5ua5MrQtFGSoOXCWEkSA_c8_SFpSyrrr9GJj5FU&s=10',
    fallbackUrl: '/slideshow/slide5.jpg',
    tag: 'RENEWABLE BIOGAS ENERGY',
    title: 'Floating Dome Type Bio-Gas Sustainable Clean Energy Plant',
    description:
      'Converting 500 kg/day of hostel mess organic food waste into clean biogas fuel for zero-waste circular energy.',
    statBadge: '500 kg/day Waste to Clean Fuel',
  },
  {
    id: 6,
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYmc_6aN9vHVE5pOsU6OQt0ILPaxutCgRp5Vhe7RLjPMoVUWsD2r-kjg&s=10',
    fallbackUrl: '/slideshow/slide6.png',
    tag: 'INSTITUTIONAL EMBLEM',
    title: 'MKCE Autonomous Emblem & Environmental Standards Charter',
    description:
      'Established in 2000 in Karur, Tamil Nadu, committed to engineering excellence, social responsibility, and net-zero audits.',
    statBadge: 'Silver Band Green Ranking',
  },
  {
    id: 7,
    url: '/slideshow/slide7.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop',
    tag: 'ECOLOGICAL BIODIVERSITY',
    title: 'Protected Agroforestry & Campus Biodiversity Reserve',
    description:
      'Over 3,500 native trees, drip-irrigated green zones, and biological preservation areas across the college campus.',
    statBadge: '3,500+ Planted Trees',
  },
  {
    id: 8,
    url: '/slideshow/slide8.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop',
    tag: 'LOW-CARBON INFRASTRUCTURE',
    title: 'Energy-Efficient Architecture & Clean Tech Laboratories',
    description:
      'Daylight harvesting glass perimeter design, high-efficiency sensor lighting, and solar microgrid integration.',
    statBadge: '35% Solar Power Offset',
  },
];

export const CampusSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = SLIDESHOW_DATA.length;
  const currentSlide = SLIDESHOW_DATA[currentIndex];

  // Auto-play interval (every 5 seconds)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // Touch swipe support for Android devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-xs overflow-hidden w-full max-w-full">
      {/* Slideshow Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Campus Environmental & Innovation Showcase</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                8 Pictures Slideshow
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Visual telemetry of M.Kumarasamy College of Engineering green initiatives and infrastructure
            </p>
          </div>
        </div>

        {/* Top Controls: Play/Pause, Slide counter, Fullscreen */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            title="View Fullscreen"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Slideshow Frame */}
      <div
        className="relative mt-3 rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] max-h-[460px] select-none group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Active Image */}
        <img
          key={currentSlide.id}
          src={currentSlide.url}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== currentSlide.fallbackUrl) {
              target.src = currentSlide.fallbackUrl;
            }
          }}
          alt={currentSlide.title}
          className="w-full h-full object-cover sm:object-contain bg-slate-950 transition-opacity duration-500 animate-fade-in"
        />

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

        {/* Top-Right Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {currentSlide.statBadge}
          </span>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-10 text-white">
          <div className="inline-block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mb-1.5">
            {currentSlide.tag}
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-tight drop-shadow-sm line-clamp-1">
            {currentSlide.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl line-clamp-2 leading-relaxed">
            {currentSlide.description}
          </p>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          title="Previous Picture"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-all z-20 shadow-lg group-hover:opacity-100 opacity-80"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          title="Next Picture"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-all z-20 shadow-lg group-hover:opacity-100 opacity-80"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 pt-3">
        {SLIDESHOW_DATA.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(index)}
              title={`Slide ${index + 1}: ${slide.title}`}
              className={`transition-all rounded-full ${
                isActive
                  ? 'w-7 sm:w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>

      {/* 8-Picture Thumbnail Navigation Strip */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SLIDESHOW_DATA.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative shrink-0 rounded-lg overflow-hidden border-2 transition-all w-16 sm:w-20 md:w-24 aspect-[16/10] bg-slate-900 ${
                  isActive
                    ? 'border-blue-600 ring-2 ring-blue-200 scale-102 shadow-xs'
                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                }`}
                title={`#${idx + 1}: ${slide.title}`}
              >
                <img
                  src={slide.url}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== slide.fallbackUrl) {
                      target.src = slide.fallbackUrl;
                    }
                  }}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 px-1 text-[9px] font-mono font-bold bg-black/70 text-white rounded-tl">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
          {/* Top Bar in Fullscreen */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                {currentSlide.tag}
              </span>
              <span className="text-xs font-mono text-slate-300">
                Picture {currentIndex + 1} of {totalSlides}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fullscreen Image Content */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
              title="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={currentSlide.url}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== currentSlide.fallbackUrl) {
                  target.src = currentSlide.fallbackUrl;
                }
              }}
              alt={currentSlide.title}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20"
              title="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Fullscreen Bottom Information */}
          <div className="text-center max-w-3xl mx-auto text-white">
            <h3 className="text-base sm:text-xl font-bold">{currentSlide.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentSlide.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
