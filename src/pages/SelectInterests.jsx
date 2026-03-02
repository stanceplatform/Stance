// pages/SelectInterests.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/layouts/AuthShell';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';
import bg from '../assets/bg.svg';

const SelectInterests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchMe } = useAuth();

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define available topics with their database tag names
  const topics = [
    { label: 'Cricket', value: 'cricket' },
    { label: 'Society & Politics', value: 'snp' },
    { label: 'Dating & PopCulture', value: 'dnp' },
    { label: 'Feminism', value: 'feminism' },
    { label: 'Student Life', value: 'student' },
  ];

  const handleTopicToggle = (topicValue) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicValue)) {
        return prev.filter(t => t !== topicValue);
      } else {
        return [...prev, topicValue];
      }
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: At least one topic must be selected
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic');
      return;
    }

    setLoading(true);
    try {
      const tagsPayload = [{
        tagName: selectedTopics,
        tagType: 'INTEREST',
      }];

      await apiService.addUserTags(tagsPayload);

      // Refresh user data
      await fetchMe();

      toast.success('Preferences saved successfully');

      // Navigate to dashboard, preserving questionid if it exists in sessionStorage
      const questionid = sessionStorage.getItem('redirectQuestionId');
      if (questionid) {
        sessionStorage.removeItem('redirectQuestionId');
        navigate(`/?questionid=${questionid}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Failed to update preferences:', err);
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Skip step since interests aren't strictly mandatory per root route... wait, we want them to at least select one.
  // The UI forces them to select one and click continue.

  return (
    <AuthShell bgImage={bg}>
      {/* Headline */}
      <h1 className="text-center font-intro text-[36px] leading-[48px] font-[600] text-[#F0E224] mb-8">
        Select atleast one topic, you are interested in:
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[360px]">
        {/* Topics Checkboxes */}
        <div className="mb-6 px-3">
          {topics.map((topic) => (
            <label
              key={topic.value}
              className="flex items-center gap-3 mb-4 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.value)}
                  onChange={() => handleTopicToggle(topic.value)}
                  className="appearance-none w-5 h-5 border-2 border-white rounded bg-transparent checked:bg-[#F0E224] checked:border-[#F0E224] cursor-pointer transition-all duration-200"
                  disabled={loading}
                />
                {selectedTopics.includes(topic.value) && (
                  <svg
                    className="absolute w-3 h-3 pointer-events-none"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3L4.5 8.5L2 6"
                      stroke="#5B037C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="font-inter text-[16px] leading-[24px] text-white group-hover:text-[#F0E224] transition-colors duration-200">
                {topic.label}
              </span>
            </label>
          ))}
        </div>

        {error && (
          <div className="mb-4 text-center text-sm text-red-200">{error}</div>
        )}

        <div className="mt-6">
          <CTAButton
            as="button"
            type="submit"
            variant="primary"
            disabled={loading}
          >
            <span className="font-inter font-[500] text-[18px] leading-[32px] tracking-[0.88px] text-[#5B037C]">
              {loading ? 'Submitting...' : 'Continue'}
            </span>
          </CTAButton>
        </div>
      </form>
    </AuthShell>
  );
};

export default SelectInterests;
