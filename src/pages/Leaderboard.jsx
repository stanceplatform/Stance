import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '../components/ui/CrownIcon';

const sampleData = [
  { rank: 1, name: 'Ashish Singh', initials: 'AS', score: 90, color: '#212121', crown: true },
  { rank: 2, name: 'Aditya thakare', initials: 'AT', score: 80, color: '#3A3A3A' },
  { rank: 3, name: 'SOUMYADEEP', initials: 'S', score: 70, color: '#4E4E4E' },
  { rank: 4, name: 'Danish Mirza', initials: 'DM', score: 60, color: '#707070' },
  { rank: 5, name: 'Renuka Singh', initials: 'RS', score: 50, color: '#8D8D8D' },
  { rank: 98, name: 'Chinmaya Srivastav (you)', initials: 'CS', score: 10, color: '#F2F2F2', isCurrentUser: true },
];

const RankNumber = ({ rank }) => {
  return (
    <div className="relative w-8 h-[48px] mr-3 flex-none flex items-center justify-center">
      {/* Back Layer (Purple Shadow) - Shifted Left & Up slightly to appear "behind" if Top-Left light source, 
          or if we want Yellow to be Bottom-Right. 
          Based on image: Purple is visible on Left. Yellow is to the Right. 
          Let's place Purple absolute at slightly negative X. 
      */}
      <span
        className="absolute text-[#9105C6] font-intro font-black text-[32px] leading-[48px] select-none"
        style={{ transform: 'translate(-2px, -2px)' }}
      >
        {rank}
      </span>
      {/* Front Layer (Yellow) */}
      <span className="relative text-[#F0E224] font-intro font-black text-[32px] leading-[48px] select-none z-10">
        {rank}
      </span>
    </div>
  );
};

const Leaderboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <main className="flex flex-col mx-auto w-full max-w-[480px] min-h-dvh max-h-dvh relative bg-gradient-to-b from-[#F0E224] to-black">
      {/* Fixed Header */}
      <header className="flex-none flex items-center px-4 py-4 bg-transparent text-[#121212] relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-1 focus:outline-none"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4998 12.8999H5.17559L10.0041 17.7299L8.72984 19.0056L1.72559 11.9999L8.72984 4.99414L10.0041 6.26989L5.17559 11.0999H22.4998V12.8999Z" fill="#121212" />
          </svg>
        </button>
        <h1 className="text-[20px] font-semibold leading-[40px] font-intro">Weekly Leaderboard</h1>
      </header>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-4 px-4 pt-2 scrollbar-hide">
        <div className="flex flex-col rounded-[16px] overflow-hidden">
          {sampleData.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center px-4 py-4 relative`}
              style={{ backgroundColor: user.color }}
            >
              {/* Rank */}
              <RankNumber rank={user.rank} />

              {/* Avatar */}
              <div className="relative mr-4 shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#9105C6] text-[#F0E224] text-[20px] leading-[28px] font-semibold font-intro">
                  {user.initials}
                </div>
                {user.crown && (
                  <span className="absolute -top-0 -right-0">
                    <CrownIcon />
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                <div
                  className="truncate font-inter text-start font-normal text-[15px] leading-[22px] mb-2"
                  style={{ color: user.isCurrentUser ? 'black' : '#FFFFFF' }}
                >
                  {user.name}
                </div>

                {/* Progress Bar */}
                <div className="relative h-1 w-full rounded-full bg-black/20 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${user.score}%`,
                      background: 'repeating-linear-gradient(120deg, #9105C6, #9105C6 12px, #F0E224 12px, #F0E224 24px)'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
