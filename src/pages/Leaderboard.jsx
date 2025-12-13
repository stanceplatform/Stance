import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '../components/ui/CrownIcon';
import apiService from '../services/api';

const RANK_COLORS = {
  1: '#212121',
  2: '#3A3A3A',
  3: '#4E4E4E',
  4: '#707070',
  5: '#8D8D8D',
  6: '#FFFFFF',
};

const RankNumber = ({ rank }) => {
  return (
    <div className="relative w-8 h-[48px] mr-3 flex-none flex items-center justify-center">
      {/* Back Layer (Purple Shadow) */}
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
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchLeaderboard = async () => {
      try {
        const data = await apiService.getLeaderboardTop();
        if (Array.isArray(data)) {
          // Normalize scores: calculate percentage relative to the highest score
          // Default to 100 if no data or max score is 0 to avoid division by zero
          const maxScore = Math.max(...data.map((u) => u.points || 0), 100);

          const processed = data.map((user) => ({
            ...user,
            name: user.fullName,
            // If points > 100, we might want to cap it visually or just use normalized percentage
            scorePercent: maxScore > 0 ? (user.points / maxScore) * 100 : 0,
            color: RANK_COLORS[user.rank] || 'rgba(255, 255, 255, 0.1)',
            crown: user.rank === 1,
            isCurrentUser: user.me,
          }));
          setLeaderboardData(processed);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      document.body.style.overflow = "auto";
    };
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
          {loading ? (
            // Basic loading state (optional, can be better)
            <div className="p-4 text-center text-white font-intro">Loading...</div>
          ) : (
            leaderboardData.map((user) => (
              <div
                key={user.rank} // Assuming rank is unique enough for key, or use user.userId if available
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
                    style={{ color: user.rank === 6 ? '#212121' : '#FFFFFF' }}
                  >
                    {user.name} {user.isCurrentUser && '(you)'}
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-1 w-full rounded-full bg-[#F2F2F2] overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${user.scorePercent}%`,
                        background: 'repeating-linear-gradient(120deg, #9105C6, #9105C6 12px, #F0E224 12px, #F0E224 24px)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
