import React from "react";

function Logo() {
  return (
    <div className="flex relative flex-col text-2xl leading-loose text-center text-yellow-400">
      <img loading="lazy" src="/logo.svg" alt="App logo" className="object-contain self-center max-w-full  w-[200px]" />
      {/* <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/eec5d1a83b28b7b2417d10a2ec53ca774ceddc8711ba2f5393179e608f95131b?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4" alt="App logo" className="object-contain self-center max-w-full aspect-[2.72] w-[283px]" /> */}
      {/* <p>space to share your opinions</p> */}
    </div>
  );
}

export default Logo;