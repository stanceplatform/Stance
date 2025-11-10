import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function NotifHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // In RRv6, first entry has key === 'default' (can't go back)
  const canGoBack = location.key !== "default";

  const handleBackClick = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <section className="flex gap-2 items-center px-4 py-2 bg-white">
      <div className="flex flex-1 shrink items-center self-stretch my-auto w-full basis-0 min-w-[240px] px-4">
        <button
          onClick={handleBackClick}
          className="flex gap-2 items-start self-stretch py-3 pr-3 my-auto"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4998 12.8999H5.17559L10.0041 17.7299L8.72984 19.0056L1.72559 11.9999L8.72984 4.99414L10.0041 6.26989L5.17559 11.0999H22.4998V12.8999Z" fill="#121212" />
          </svg>

        </button>
        <h1 className="flex-1 shrink self-stretch my-auto text-xl font-semibold leading-10 basis-3 text-ellipsis text-[#121212] font-intro text-left">
          Notifications
        </h1>
      </div>
    </section>
  );
}

export default NotifHeader;