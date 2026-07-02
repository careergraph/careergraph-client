/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import bannerHomeSacombank from "../../assets/slide/banner_home_sacombank.png";
import concentrixBanner from "../../assets/slide/concentrix_banner.png";
import mazdaLangHa from "../../assets/slide/MAZDA-LANG-HA.png";
import vnrGroup from "../../assets/slide/VNR-Group.png";

export default function BannerSlider() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    vnrGroup,
    mazdaLangHa,
    concentrixBanner,
    bannerHomeSacombank,
  ];

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  };

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % totalSlides;
    setCurrentSlide(newIndex);
  };

  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-[-12px] mb-8 w-full max-w-7xl sm:mt-[-18px] sm:mb-10">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            ref={sliderRef}
          >
            {slides.map((src, i) => (
              <div
                key={i}
                className="relative min-w-full overflow-hidden aspect-[16/8.8] sm:aspect-[16/6.8] lg:aspect-[16/4.25]"
              >
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="h-full w-full object-cover object-center"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/8 via-transparent to-slate-950/10" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-white/95 px-4 py-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Chuyển đến banner ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === index
                    ? "w-7 bg-indigo-600"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
