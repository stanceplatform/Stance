import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCurrentQuestion } from "../../context/CurrentQuestionContext";

const Header = ({
  onNotificationsClick,
  onInviteClick,
  onMenuSelect,
  className = "",
  bgColor = "#9105C6",
  iconColor = "#F0E224",
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth()
  const { questionId } = useCurrentQuestion();

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const IconButton = ({ children, ...props }) => (
    <button
      {...props}
      className="grid place-items-center w-10 h-10 rounded-full hover:bg-white/10 active:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition"
      style={{ color: iconColor }}
    >
      {children}
    </button>
  );

  return (
    <header className="w-full h-[72px]" style={{ backgroundColor: bgColor }}>
      <div
        className={`mx-auto flex items-center justify-between h-full px-4 gap-2 ${className}`}
      >
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          {/* Replace src later */}
          <img
            loading="lazy"
            src="/logo-sm.png"
            alt="Logo"
            className="object-contain z-20 shrink-0 self-stretch my-auto aspect-[2.72] w-[98px]"
          />
        </div>

        {/* Right: icon cluster */}
        <div className="flex items-center gap-2">
          {/* Bell (Notifications) */}
          <IconButton
            aria-label="Notifications"
            onClick={(e) => {
              navigate("/notification");
            }}
            title="Notifications"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_680_1110)">
                <path d="M23.4 16.0801L22.92 15.8281C21.534 15.0983 20.0438 13.6456 20.0438 12.1756V9.7501C20.0438 6.3286 20.0438 0.600098 11.9438 0.600098C3.84754 0.600098 3.84754 6.3301 3.84754 9.7501V12.1756C3.84754 13.7296 2.47954 15.1576 1.20754 15.8281L0.727539 16.0816V18.9001H7.74754C7.74304 18.9758 7.72729 19.0501 7.72729 19.1258C7.73104 21.4853 9.64204 23.3971 12.0015 23.4001C14.361 23.3963 16.2728 21.4853 16.2773 19.1258C16.2773 19.0501 16.2615 18.9751 16.257 18.8993H23.4008L23.4 16.0801ZM14.4758 19.1258C14.4735 20.4923 13.3665 21.5986 12 21.6001C10.6335 21.5986 9.52654 20.4916 9.52429 19.1258C9.52429 19.0516 9.55654 18.9758 9.56404 18.9001H14.436C14.4435 18.9758 14.4758 19.0516 14.4758 19.1258ZM2.59579 17.1001C4.18954 16.0681 5.64754 14.2538 5.64754 12.1756V9.7501C5.64754 5.5861 6.11329 2.4001 11.946 2.4001C17.7818 2.4001 18.246 5.5861 18.246 9.7501V12.1756C18.246 14.1878 19.8165 16.0231 21.528 17.1001H2.59354H2.59579Z" fill="#F0E224" />
              </g>
              <defs>
                <clipPath id="clip0_680_1110">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </IconButton>

          {/* Invite (person + plus) */}
          <IconButton
            aria-label="Invite"
            onClick={(e) => {
              navigate("/send-invite");
            }}
            title="Invite"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_680_1112)">
                <path d="M25.3258 28.686V29.0002H23.5258V28.686C23.5258 23.3445 23.5258 23.2545 17 23.2545C10.4758 23.2545 10.4758 23.2545 10.4758 29.0002H8.67578C8.67578 22.2202 9.50003 21.5002 17 21.5002C24.0658 21.5002 25.31 21.9802 25.3258 28.686ZM12.5758 14.9902C12.5645 14.871 12.5578 14.7322 12.5578 14.5927C12.5578 12.1657 14.4808 10.188 16.886 10.1002H16.8943C16.9558 10.0972 17.0278 10.0957 17.1005 10.0957C18.2743 10.0957 19.3393 10.5607 20.1215 11.316L20.12 11.3145C20.9548 12.15 21.4783 13.2967 21.5 14.5657V14.5702C21.5068 14.6617 21.5105 14.769 21.5105 14.877C21.5105 16.1797 20.9728 17.3572 20.1073 18.1995L20.1065 18.2002C19.3258 18.9472 18.2735 19.416 17.1118 19.4445H17.1065H17.0008C16.9775 19.4452 16.9498 19.4452 16.9228 19.4452C14.522 19.4452 12.575 17.499 12.575 15.0975C12.575 15.06 12.5758 15.0217 12.5765 14.9842V14.9895L12.5758 14.9902ZM14.3758 14.9902C14.3728 15.0367 14.3713 15.0907 14.3713 15.1455C14.3713 15.8317 14.6473 16.4527 15.095 16.9042C15.5953 17.412 16.289 17.6805 17.0008 17.6445C17.705 17.6362 18.3425 17.358 18.8165 16.9087L18.815 16.9102C19.3933 16.2982 19.6775 15.468 19.595 14.6302C19.595 14.619 19.595 14.6062 19.595 14.5927C19.595 13.815 19.2995 13.1055 18.8135 12.5722L18.8158 12.5745C18.368 12.1552 17.765 11.898 17.1013 11.898C17.066 11.898 17.03 11.8987 16.9948 11.9002H17C16.9963 11.9002 16.9925 11.9002 16.988 11.9002C15.5293 11.9002 14.3465 13.083 14.3465 14.5417C14.3465 14.679 14.357 14.814 14.3773 14.9452L14.3758 14.9302V14.9902ZM32 17.6002H28.4V14.0002H26.6V17.6002H23V19.4002H26.6V23.0002H28.4V19.4002H32V17.6002Z" fill="#F0E224" />
              </g>
              <defs>
                <clipPath id="clip0_680_1112">
                  <rect width="24" height="24" fill="white" transform="translate(8 8)" />
                </clipPath>
              </defs>
            </svg>
          </IconButton>

          {/* 3 dots (menu) */}
          <div className="relative" ref={menuRef}>
            <IconButton
              aria-label="More options"
              onClick={() => setOpen((v) => !v)}
              title="More"
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 20C14 21.242 12.9927 22.25 11.7507 22.25C10.5087 22.25 9.50146 21.2435 9.50146 20.0015V20.0007C9.50146 18.7587 10.5087 17.7515 11.7507 17.7515C12.9927 17.7515 14 18.758 14 20ZM20 17.75H19.9992C18.7572 17.75 17.75 18.7572 17.75 19.9992C17.75 21.2412 18.7565 22.2485 19.9985 22.2485C21.2405 22.2485 22.2485 21.2412 22.2485 19.9992C22.2485 18.7572 21.242 17.75 20 17.75ZM28.25 17.75C27.008 17.75 26 18.7572 26 19.9992C26 21.2412 27.0065 22.2485 28.2485 22.2485H28.2492C29.4912 22.2485 30.4985 21.2412 30.4985 19.9992C30.4985 18.7572 29.492 17.75 28.25 17.75Z" fill="#F0E224" />
              </svg>
            </IconButton>

            {open && (
              <div
                className="absolute right-0 mt-2 min-w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
                role="menu"
              >
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    const qs = questionId ? `?questionId=${questionId}` : "";
                    navigate(`/report${qs}`);
                    setOpen(false);
                  }}
                >
                  Report
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={(e) => {
                    navigate("/help");
                    setOpen(false);
                  }}
                >
                  Need Help
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={(e) => {
                    window.open("/guidelines", "_blank", "noopener,noreferrer");
                    setOpen(false);
                  }}
                >
                  Community Posting Guidelines
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={(e) => {
                    logout()
                    setOpen(false);
                  }}
                >
                  Logout
                </button>
                {/* Optional extra */}
                {/* <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    onMenuSelect?.("extra");
                    setOpen(false);
                  }}
                >
                  Something else…
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
