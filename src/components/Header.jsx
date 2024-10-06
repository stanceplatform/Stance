import React from 'react';
import IconButton from './IconButton';

const icons = [
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/76d71d5953ba62fa0acd2cbba5c8464b7629dbee409759e30406cc2f71f9ebc1?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4", alt: "Share" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/fbc3e39e70608aaa0a5f866371489062616505b63b24f79581449f2ce7bde34c?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4", alt: "Like" },
  { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/57b98bdf74735abcf6e0fda76d916769d0894dfbe619fb4e12080a8e1656f01d?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4", alt: "More options" }
];

function Header() {
  return (
    <header className="flex relative flex-row gap-4 justify-between p-4 w-full opacity-[0.86]">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ba494924b7b74f2ab4117b9cc51026096cd23cac22c01b5156ebb0070d3bcb4?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4" alt="Logo" className="object-contain z-0 shrink-0 self-stretch my-auto aspect-[2.72] w-[98px]" />
      <div className="flex absolute right-0 bottom-0 z-0 self-start bg-neutral-900 bg-opacity-10 h-[72px] min-h-[72px] w-[390px]" />
      <nav className="flex z-0 gap-1 items-center self-stretch my-auto">
        {icons.map((icon, index) => (
          <IconButton key={index} src={icon.src} alt={icon.alt} />
        ))}
      </nav>
    </header>
  );
}

export default Header;