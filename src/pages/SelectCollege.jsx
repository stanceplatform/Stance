// pages/SelectCollege.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/layouts/AuthShell';
import Logo from '../components/ui/Logo';
import CTAButton from '../components/ui/CTAButton';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';
import bg from '../assets/bg.svg';

const SelectCollege = () => {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getColleges();
      setColleges(data || []);
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
      setError('Failed to load colleges. Please try again.');
      // Fallback to hardcoded list if API fails
      setColleges([
        { id: '1', name: 'NITK' },
        { id: '2', name: 'Ramjas College' },
        { id: '3', name: 'SRCC' },
        { id: '4', name: 'JGU' },
        { id: '5', name: 'LSR' },
        { id: '6', name: 'IIT Delhi' },
        { id: '7', name: 'Others' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCollege) {
      const validationMessage = 'Please select a college';
      setError(validationMessage);
      return;
    }

    setLoading(true);
    try {
      // Update user's college
      await apiService.updateUserCollege(selectedCollege);

      // Refresh user data to get updated collegeSelected status
      await fetchMe();

      toast.success('College added successfully');

      // Navigate to dashboard
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to update college:', err);
      const errorMessage = getApiErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell bgImage={bg}>


      {/* Headline */}
      <h1 className="text-center font-intro text-[36px] leading-[48px] font-[600] text-[#F0E224] mb-8">
        Select your college
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[360px]">
        <div className="mb-4 px-3 ">
          <select
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setError('');
            }}
            className={`w-full px-4 py-3 h-[56px] rounded-[16px] border-2 border-dashed bg-white/95 backdrop-blur-sm text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#F0E224]/30 appearance-none cursor-pointer font-inter text-[16px] leading-[24px] shadow-lg transition-all duration-200 hover:border-white hover:bg-white ${error ? 'border-red-300 focus:border-red-300' : 'border-white/80 focus:border-[#F0E224]'
              }`}
            disabled={loading}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23121212' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              paddingRight: '42px',
            }}
          >
            <option value="" className="text-[#9CA3AF]">--- Select College ---</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id} className="text-[#121212] py-2">
                {college.name}
              </option>
            ))}
          </select>
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

export default SelectCollege;

