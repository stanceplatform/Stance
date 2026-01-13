
function CardNavigation({ onNext, onPrevious }) { // Removed question prop
  const handleLeftTap = () => {
    onPrevious(); // Call the onPrevious function to navigate to the previous card
  };

  const handleRightTap = () => {
    onNext(); // Call the onNext function to navigate to the next card
  };

  return (
    <nav className="flex absolute top-0 left-0 right-0 h-screen overflow-hidden mx-auto max-w-[480px] z-10" id="card-navigation" >
      <div className="flex-1 h-full" onClick={() => {
        // Track Next Arrow Click
        import('../../utils/mixpanel').then(({ default: mixpanel }) => {
          mixpanel.trackEvent("Click on previous arrow");
        });
        handleLeftTap();
      }} style={{ cursor: 'pointer', }}>
        {/* Left half of the top 50% of the screen */}
      </div>
      <div className="flex-1 h-full" onClick={() => {
        // Track Next Arrow Click (Right is Next usually)
        import('../../utils/mixpanel').then(({ default: mixpanel }) => {
          mixpanel.trackEvent("Click on next arrow");
        });
        handleRightTap();
      }} style={{ cursor: 'pointer', }}>
        {/* Right half of the top 50% of the screen */}
      </div>
    </nav>
  );
}

export default CardNavigation;