import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const CollegeSelectionModal = ({ isOpen, onClose, onSubmit, loading: externalLoading }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchColleges();
    }
  }, [isOpen]);

  const fetchColleges = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getColleges();
      setColleges(data || []);
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
      setError('Failed to load colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCollege) {
      setError('Please select a college');
      return;
    }
    onSubmit(selectedCollege);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-bold text-lg mb-4 text-black">
          Select your college
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <select
              value={selectedCollege}
              onChange={(e) => {
                setSelectedCollege(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-dashed border-black rounded-lg bg-white text-black focus:outline-none focus:border-black appearance-none cursor-pointer"
              disabled={loading || externalLoading}
            >
              <option value="">--- Select College ---</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 text-center text-sm text-red-600">{error}</div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || externalLoading || !selectedCollege}
              className="w-full max-w-[200px] border border-black rounded"
            >
              <div className={`px-4 py-2 bg-white text-black font-medium ${loading || externalLoading || !selectedCollege ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                {loading || externalLoading ? 'Submitting...' : 'Submit'}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeSelectionModal;

