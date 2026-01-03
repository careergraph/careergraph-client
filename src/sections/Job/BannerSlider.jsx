/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

export default function BannerSlider() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2025/10/VNR-Group.png",
    "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2025/10/MAZDA-LANG-HA.png",
    "https://jobsgo.vn/uploads/banner/concentrix_banner.png",
    "https://jobsgo.vn/uploads/banner/banner_home_sacombank.jpg",
  ];

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].clientWidth;
      sliderRef.current.style.transform = `translateX(-${
        index * slideWidth
      }px)`;
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
    <div className="w-full max-w-[1400px] mx-auto overflow-hidden relative rounded-xl h-96 border border-slate-200 shadow-sm mb-10 mt-[-20px]">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        ref={sliderRef}
      >
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
