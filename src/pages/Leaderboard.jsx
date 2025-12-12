import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
                  <span className="absolute -top-0 -right-0"><svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6129 2.12839C11.4194 1.44522 12.6732 2.03212 12.6648 3.08906L12.6597 3.1965L12.2029 8.43544L16.11 6.67163L16.2186 6.62715C17.3425 6.22878 18.3627 7.5334 17.6402 8.53979L12.0887 16.2724C11.7587 16.7321 11.1609 16.913 10.6315 16.7132L1.55914 13.2878C0.980815 13.0695 0.648859 12.4613 0.778219 11.8568L2.94657 1.73798C3.2098 0.510015 4.89256 0.408768 5.33008 1.53439L5.36865 1.64686L6.66172 6.04399L10.5334 2.20145L10.6129 2.12839Z" fill="#F0E224" stroke="white" stroke-width="1.5" />
                    <path d="M10.3807 8.21068C10.3282 9.09184 11.1807 9.74841 12.0192 9.47233L15.0934 8.45996L10.9568 15.2004L2.97358 11.7443L5.00435 4.31031L5.9928 6.80801C6.3142 7.6191 7.34684 7.85969 7.99378 7.27417L10.5758 4.93564L10.3807 8.21068Z" fill="#F0E224" stroke="#5B037C" stroke-width="1.5" />
                  </svg>
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
