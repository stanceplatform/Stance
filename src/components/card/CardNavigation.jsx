
function CardNavigation({ onNext, onPrevious }) { // Removed question prop
  const handleLeftTap = () => {
    onPrevious(); // Call the onPrevious function to navigate to the previous card
  };

  const handleRightTap = () => {
    onNext(); // Call the onNext function to navigate to the next card
  };

  return (
    <nav className="flex absolute inset-0 h-full overflow-hidden mx-auto max-w-[480px] z-10" id="card-navigation" >
      <div className="flex-1 h-full" onClick={handleLeftTap} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {/* Left half of the screen */}
      </div>
      <div className="flex-1 h-full" onClick={handleRightTap} style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {/* Right half of the screen */}
      </div>
    </nav>
  );
}

export default CardNavigation;