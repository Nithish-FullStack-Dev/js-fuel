import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function Header() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#top" aria-label="JS Fuel home">
        <BrandMark compact />
      </a>
      <nav className="site-header__nav" aria-label="Primary navigation">
        <a href="#station">Station</a>
        <a href="#petrol">Fuel range</a>
        <a href="#dispenser">Dispenser</a>
      </nav>
      <a className="site-header__cta" href="#contact">
        Explore <ArrowUpRight size={15} strokeWidth={1.7} />
      </a>
    </header>
  );
}
