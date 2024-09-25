import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-lg mb-4">You're now logged in and can access all features.</p>
            <div className="flex space-x-4">
                <Link to="/card" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Sample Card
                </Link>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Create New Card
                </button>
            </div>
        </div>
    );
};

export default Dashboard;