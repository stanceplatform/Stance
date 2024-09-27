import React from "react";

function CardNavigation() {
  return (
    <nav className="flex relative gap-10 justify-between items-center p-4 w-full">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/316c19b2dbd2c369725e4802f2c9d0ecf1c725150fa847db4994eb27a44bc1e4?apiKey=9667f82c7e1b4746ad9299d82be6adf4&" alt="" className="object-contain shrink-0 self-stretch my-auto aspect-[2.72] w-[98px]" />
      <div className="flex gap-2 items-center self-stretch p-2 my-auto w-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c457d867b8b601d58682b2b3558ffb230eed9abc5045ec24c46cbc1f5e2ea5e?apiKey=9667f82c7e1b4746ad9299d82be6adf4&" alt="" className="object-contain self-stretch my-auto w-6 aspect-square" />
      </div>
    </nav>
  );
}

export default CardNavigation;