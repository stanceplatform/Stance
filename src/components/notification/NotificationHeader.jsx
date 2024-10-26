import * as React from "react";

function NotifHeader() {
  const handleBackClick = () => {
    // Handle navigation back
    window.history.back();
  };

  return (
    <section className="flex gap-2 items-center px-4 py-2 bg-white">
      <div className="flex flex-1 shrink items-center self-stretch my-auto w-full basis-0 min-w-[240px]">
        <button 
          onClick={handleBackClick}
          className="flex gap-2 items-start self-stretch py-3 pr-3 my-auto w-9"
          aria-label="Go back"
        >
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/9667f82c7e1b4746ad9299d82be6adf4/3f982c34c450ae75aaf9a5824f7637fde2d7d62c3b0caf387eb21df86831279e?apiKey=9667f82c7e1b4746ad9299d82be6adf4&" 
            alt="" 
            className="object-contain w-6 aspect-square" 
          />
        </button>
        <h1 className="flex-1 shrink self-stretch my-auto text-3xl font-bold leading-none basis-3 text-ellipsis text-pink-950">
          Notifications
        </h1>
      </div>
    </section>
  );
}

export default NotifHeader;