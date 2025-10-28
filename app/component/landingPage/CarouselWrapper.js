"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
const CarouselWrapper = ({ children }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">{children}</div>
    </div>
  );
};

export default CarouselWrapper;
