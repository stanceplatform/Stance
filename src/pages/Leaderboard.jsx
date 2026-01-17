import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CrownIcon from '../components/ui/CrownIcon';
import apiService from '../services/api';
import CTAButton from '../components/ui/CTAButton';
import { ALLOWED_CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

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
  const location = useLocation();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityName, setCommunityName] = useState('');
  const [monthYear, setMonthYear] = useState('');

  const { user: currentUser } = useAuth();

  useEffect(() => {


    const fetchLeaderboard = async () => {
      try {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const category = pathParts[0];
        const isCategoryRoute = category && ALLOWED_CATEGORIES.includes(category);

        if (!isCategoryRoute) {
          // Fetch college info for the title only if NOT on a category route
          apiService.getLeaderboardCollege()
            .then(data => {
              // console.log('/leaderboard/college data:', data);
              setCommunityName(data?.communityName);

              if (data?.date) {
                const dateObj = new Date(data.date);
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const year = dateObj.getFullYear();
                setMonthYear(`${month}, ${year}`);
              } else {
                setMonthYear('');
              }
            })
            .catch(err => console.error('/leaderboard/college failed', err));
        }

        const data = await apiService.getLeaderboardTop();

        if (isCategoryRoute) {
          // Use metadata from the interest leaderboard response
          if (data?.communityName) {
            setCommunityName(data.communityName);
          }
          if (data?.month && data?.year) {
            const dateObj = new Date(data.year, data.month - 1);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            setMonthYear(`${month}, ${data.year}`);
          }
        }

        // Handle nested leaderboard structure for interest response
        const users = data?.leaderboard?.content || data?.content || [];
        if (Array.isArray(users)) {
          // Normalize scores: calculate percentage relative to the highest score
          // Default to 100 if no data or max score is 0 to avoid division by zero
          const maxScore = Math.max(...users.map((u) => u.points || 0), 100);

          // Standard colors for top ranks (excluding White for rank 6/others)
          const rankColorsList = [
            '#212121', // 1
            '#3A3A3A', // 2
            '#4E4E4E', // 3
            '#707070', // 4
            '#8D8D8D'  // 5
          ];

          let nonUserColorIndex = 0;

          const processed = users.map((user) => {
            const isMe = user.me || (currentUser?.id && (user.userId === currentUser.id || user.id === currentUser.id));
            let assignedColor;

            if (isMe) {
              assignedColor = '#FFFFFF';
            } else {
              // Assign next available color from the list, or default to some background (e.g. transparent or Rank 6 color)
              // If we run out of colors, we can fallback to RANK_COLORS[6] or similar.
              // The user only specified behavior for "top 5" colors shifting.
              if (nonUserColorIndex < rankColorsList.length) {
                assignedColor = rankColorsList[nonUserColorIndex];
                nonUserColorIndex++;
              } else {
                assignedColor = RANK_COLORS[6] || '#FFFFFF';
                // Wait, rank 6 is white. If everyone else is white, that's fine.
                // But we should ensure contrast.
              }
            }

            return {
              ...user,
              name: user.fullName,
              scorePercent: maxScore > 0 ? (user.points / maxScore) * 100 : 0,
              color: assignedColor,
              crown: user.rank === 1,
              isCurrentUser: isMe,
            };
          });
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
    <main className="flex flex-col mx-auto w-full max-w-[480px] min-h-dvh relative bg-gradient-to-b from-[#F0E224] to-black">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 mx-auto w-full max-w-[480px] flex-none flex items-center px-4 py-4 bg-[#F0E224] text-[#121212] z-50">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-1 focus:outline-none"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4998 12.8999H5.17559L10.0041 17.7299L8.72984 19.0056L1.72559 11.9999L8.72984 4.99414L10.0041 6.26989L5.17559 11.0999H22.4998V12.8999Z" fill="#121212" />
          </svg>
        </button>
        <h1 className="text-[20px] font-semibold leading-[40px] font-intro">
          Top Voice {communityName} {monthYear}
        </h1>
      </header>

      {/* Scrollable List */}
      <div className="flex-1 pb-4 px-4 mb-6 pt-24">
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col   rounded-[16px] overflow-hidden">
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
                      style={{ color: user.isCurrentUser ? '#000000' : '#FFFFFF' }}
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
      </div>
      <div className="flex-none flex flex-col  px-6 pt-6 pb-8 text-start bg-white rounded-t-[48px] w-full">
        <h2 className="text-[18px] font-intro font-bold text-[#121212] mb-1">Want to reach the top?</h2>
        <p className="text-[15px] font-semibold font-inter text-[#121212] opacity-80 mb-3">
          Stay consistent, post strong arguments, upvote others, and earn upvotes to climb the leaderboard.
        </p>

        <CTAButton
          variant="primary"
          className="w-full max-w-none"
          onClick={() => {
            const pathParts = location.pathname.split('/').filter(Boolean);
            const category = pathParts[0];
            if (category && ALLOWED_CATEGORIES.includes(category)) {
              navigate(`/${category}`);
            } else {
              navigate('/');
            }
          }}
        >
          Start Your Progress
        </CTAButton>
      </div>
    </main>
  );
};

export default Leaderboard;
