import React from "react";

const fuelDetails = [
  {
    title: "Quality Fuel",
    description:
      "High-quality fuel engineered for reliable performance and smoother journeys.",
  },
  {
    title: "Better Performance",
    description:
      "Consistent combustion designed to support efficiency and engine performance.",
  },
  {
    title: "Reliable Supply",
    description:
      "Dependable fuel solutions built for everyday mobility and commercial needs.",
  },
];

const FuelVideo = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#230601]">
      {/* Desktop Video */}
      <video
        src="/videos/fuel.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />

      {/* Mobile Image */}
      <img
        src="/images/bg.png"
        alt="JS Fuel"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col justify-between px-[3%] py-[8%] max-md:px-[5%] max-md:py-12">
        {/* LEFT HEADLINE */}
        <div className="max-w-[520px]">
          <h1 className="text-[clamp(38px,4vw,78px)] font-light uppercase leading-[0.88] tracking-[-0.045em] text-white font-display">
            POWERING
            <br />
            EVERY JOURNEY.
            <br />
            REAL PERFORMANCE.
          </h1>
        </div>

        {/* RIGHT DETAILS */}
        <div className="mt-16 ml-auto w-[32%] min-w-[430px] max-w-[620px] max-md:mt-12 max-md:ml-0 max-md:w-full max-md:min-w-0 max-md:max-w-none">
          {fuelDetails.map((item, index) => (
            <div
              key={item.title}
              className={`py-6 max-md:py-4 ${
                index !== fuelDetails.length - 1
                  ? "border-b border-white/35"
                  : ""
              }`}
            >
              <h2 className="font-display text-[clamp(30px,2.5vw,50px)] leading-none text-white max-md:text-[28px]">
                {item.title}
              </h2>

              <p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-white/85 lg:text-[16px] max-md:mt-2 max-md:text-[13px] font-mono">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FuelVideo;
