"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Fuel = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  unit: string;
  image: string;
  hoverImage: string;
};

const fuels: Fuel[] = [
  {
    id: "petrol",
    name: "Petrol",
    subtitle: "Power for every journey",
    price: 115.69,
    unit: "L",
    image: "/images/petrol.png",
    hoverImage: "/images/1.png",
  },
  {
    id: "diesel",
    name: "Diesel",
    subtitle: "Built to keep you moving",
    price: 103.82,
    unit: "L",
    image: "/images/diesel.png",
    hoverImage: "/images/2.png",
  },
  {
    id: "cng",
    name: "CNG",
    subtitle: "A smarter way forward",
    price: 112,
    unit: "kg",
    image: "/images/cng.png",
    hoverImage: "/images/3.png",
  },
  {
    id: "lpg",
    name: "Auto LPG",
    subtitle: "Efficiency in every drive",
    price: 67.97,
    unit: "L",
    image: "/images/lpg.png",
    hoverImage: "/images/4.png",
  },
];

export default function FuelCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstCard = slider.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const gap = parseFloat(window.getComputedStyle(slider).columnGap) || 0;

    slider.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="fuel-collection"
      className="w-full overflow-hidden bg-[#FAF9F6] py-20 text-[#29231F] md:py-28 lg:py-36"
    >
      {/* Editorial heading */}
      <div className="mb-20 grid grid-cols-1 gap-8 px-5 md:mb-28 md:grid-cols-[32%_1fr] md:px-8 lg:mb-36 lg:px-10">
        <div className="pt-3">
          <span className="text-xs font-medium uppercase tracking-[0.12em] md:text-sm">
            04 FUEL OPTIONS
          </span>
        </div>

        <div>
          <h2 className="max-w-[1100px] font-serif text-[clamp(42px,5vw,94px)] font-normal leading-[1.05] tracking-[-0.045em]">
            The right fuel for
            <br />
            every journey.
            <br />
            <span className="text-[#848078]">Your drive, fully powered.</span>
          </h2>

          <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#77716B] md:text-base">
            From everyday commutes to the longest highways, discover reliable
            fuel solutions that keep Telangana moving.
          </p>
        </div>
      </div>

      {/* Horizontal carousel */}
      <div className="relative px-5">
        <div
          ref={sliderRef}
          className="
            flex w-full snap-x snap-mandatory
            gap-2 overflow-x-auto overscroll-x-contain
            px-5 pb-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            md:px-8 lg:px-10 
          "
        >
          {fuels.map((fuel) => (
            <article
              key={fuel.id}
              className="
                group relative min-w-0 flex-none
                w-[85vw] snap-start
                sm:w-[60vw]
                lg:w-[calc((100vw-80px-48px)/3.12)]
              "
            >
              {/* Product image */}
              <div
                className="
                  relative aspect-[0.78] w-full
                  overflow-hidden rounded-[3px]
                  bg-[#E8E5E1]
                  sm:aspect-[0.8]
                  lg:aspect-[0.77]
                "
              >
                <img
                  src={fuel.image}
                  alt={`${fuel.name} fuel`}
                  loading="lazy"
                  className="
                    absolute inset-0 h-full w-full
                    object-cover object-center
                    transition-all duration-700 ease-in-out
                    group-hover:scale-[1.035]
                    group-hover:opacity-0
                    group-focus-within:opacity-0
                  "
                />

                <img
                  src={fuel.hoverImage}
                  alt={`${fuel.name} fuel experience`}
                  loading="lazy"
                  className="
                    absolute inset-0 h-full w-full
                    scale-[1.04] object-cover object-center
                    opacity-0
                    transition-all duration-700 ease-in-out
                    group-hover:scale-100
                    group-hover:opacity-100
                    group-focus-within:scale-100
                    group-focus-within:opacity-100
                  "
                />

                {/* Subtle image overlay */}
                <div
                  className="
                    pointer-events-none absolute inset-0
                    bg-gradient-to-t
                    from-black/10 via-transparent to-transparent
                    opacity-0 transition-opacity duration-500
                    group-hover:opacity-100
                  "
                />

                {/* Small image index */}
                <span className="absolute left-5 top-5 text-xs font-medium tracking-wider text-[#29231F]/60">
                  {String(fuels.indexOf(fuel) + 1).padStart(2, "0")}
                  /04
                </span>

                {/* Hover label */}
                <div
                  className="
                    absolute bottom-5 left-5 right-5
                    translate-y-3 opacity-0
                    transition-all duration-500
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-[#29231F] backdrop-blur-md">
                    {fuel.subtitle}
                  </span>
                </div>
              </div>

              {/* Details below image */}
              <div className="flex items-start justify-between gap-3 px-2 pt-5">
                <div>
                  <h3 className="text-[18px] font-normal tracking-[-0.025em] md:text-[20px]">
                    {fuel.name}
                  </h3>

                  <p className="mt-2 text-[13px] text-[#858079]">
                    Telangana, Hyderabad
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[18px] font-normal tracking-[-0.025em] md:text-[20px]">
                    ₹{fuel.price.toFixed(2)}
                  </p>

                  <p className="mt-2 text-[13px] text-[#858079]">
                    per {fuel.unit === "kg" ? "kg" : "litre"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="mt-12 flex items-center justify-between px-5 md:px-8 lg:px-10">
          <div>
            <span className="text-xs uppercase tracking-[0.14em] text-[#77716B]">
              EXPLORE OUR FUELS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous fuel"
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full border border-[#29231F]/20
                transition-colors duration-300
                hover:bg-[#29231F] hover:text-white
              "
            >
              <ArrowLeft size={19} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next fuel"
              className="
                flex h-12 w-12 items-center justify-center
                rounded-full border border-[#29231F]/20
                transition-colors duration-300
                hover:bg-[#29231F] hover:text-white
              "
            >
              <ArrowRight size={19} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5 text-xs text-[#89847C] md:px-8 lg:px-10">
        Indicative Hyderabad fuel rates. Prices vary by location, supplier and
        revision date.
      </div>
    </section>
  );
}
