import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NotificationList from '../notification/NotificationList';

const icons = [
  { icon: faMessage, alt: "Comment" },
  { icon: faEllipsisH, alt: "More options" }
];

function Header({ onOpenNotifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBellClick = () => {
    navigate('/notification'); // Navigate to /notification route
  };

  return (
    <header className="absolute flex relative flex-row gap-4 justify-between p-4 w-full opacity-[0.86] z-10">
      <img 
        loading="lazy" 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ba494924b7b74f2ab4117b9cc51026096cd23cac22c01b5156ebb0070d3bcb4?placeholderIfAbsent=true&apiKey=9667f82c7e1b4746ad9299d82be6adf4" 
        alt="Logo" 
        className="object-contain z-20 shrink-0 self-stretch my-auto aspect-[2.72] w-[98px]" 
      />
      <div className="flex absolute right-0 bottom-0 z-10 self-start bg-neutral-900 bg-opacity-10 h-[72px] min-h-[72px] w-full" />
      <nav className="flex z-0 gap-1 items-center self-stretch my-auto">
        <button 
          aria-label="Notification" 
          className="p-2 text-white hover:text-gray-300 transition-colors"
          onClick={handleBellClick} // Call handleBellClick on bell icon click
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </button>
        {icons.map((icon, index) => (
          <button 
            key={index} 
            aria-label={icon.alt} 
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <FontAwesomeIcon icon={icon.icon} size="lg" />
          </button>
        ))}
      </nav>
      {showNotifications && <NotificationList />}
    </header>
  );
}

export default Header;
