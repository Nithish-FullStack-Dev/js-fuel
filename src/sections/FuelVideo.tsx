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
    <section className="relative min-h-screen w-full overflow-hidden bg-[#230601]">
      {/* Background Video */}
      <video
        src="/videos/fuel.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full">
        {/* LEFT HEADLINE */}
        <div className="absolute left-[3%] top-[8%] max-w-[520px]">
          <h1 className="text-[clamp(38px,4vw,78px)] font-light uppercase leading-[0.88] tracking-[-0.045em] text-white">
            POWERING
            <br />
            EVERY JOURNEY.
            <br />
            REAL PERFORMANCE.
          </h1>
        </div>

        {/* RIGHT DETAILS */}
        <div className="absolute bottom-[2%] right-[3%] w-[32%] min-w-[430px] max-w-[620px]">
          {fuelDetails.map((item, index) => (
            <div
              key={item.title}
              className={`py-6 ${
                index !== fuelDetails.length - 1
                  ? "border-b border-white/35"
                  : ""
              }`}
            >
              <h2 className="font-serif text-[clamp(30px,2.5vw,50px)] leading-none text-white">
                {item.title}
              </h2>

              <p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-white/85 lg:text-[16px]">
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
