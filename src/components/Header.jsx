import React from "react";

function Header() {
  return (
    <header className="flex overflow-hidden relative gap-5 justify-between items-start self-stretch px-6 py-5 w-full text-lg tracking-tight leading-none text-fuchsia-400 whitespace-nowrap bg-white bg-opacity-10">
      <time className="z-10 pt-0 pb-1 mt-2 rounded-3xl">9:41</time>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8adc49ee3577d432606eef51f20022759fa9077b9fa6e5d3cdc519d4d56f4743?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4" alt="Status icons" className="object-contain shrink-0 rounded-none aspect-[5.92] w-[77px]" />
    </header>
  );
}

export default Header;