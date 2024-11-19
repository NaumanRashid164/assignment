import React, { useState } from 'react';
import axios from 'axios';

function PerformanceTest() {
  const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
  const [url, setUrl] = useState('');
  const [deviceType, setDeviceType] = useState('Mobile');
  const [performanceScore, setPerformanceScore] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const response = await axios.post(serverUrl + "/api/lighthouse", {
        url,
        platform: deviceType,
      });

      setPerformanceScore(response.data.performance_score);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Validation error response
        setValidationErrors(error.response.data.errors || {});
      } else {
        // Other errors
        setError(error.response?.data?.error || 'An unexpected error occurred.');
        setPerformanceScore(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Performance Test</h2>

      <div className="w-full mb-4">
        <input
          type="url"
          placeholder="Enter Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {validationErrors.url && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.url[0]}</div>
        )}
      </div>

      <div className="flex space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Mobile"
            checked={deviceType === 'Mobile'}
            onChange={() => setDeviceType('Mobile')}
            className="focus:ring-2 focus:ring-blue-500"
          />
          <span>Mobile</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="Desktop"
            checked={deviceType === 'Desktop'}
            onChange={() => setDeviceType('Desktop')}
            className="focus:ring-2 focus:ring-blue-500"
          />
          <span>Desktop</span>
        </label>
        {validationErrors.platform && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.platform[0]}</div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Get Performance Score
      </button>

      {/* Loader */}
      {isLoading && <p>Loading...</p>}


      {performanceScore !== null && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          <h3 className="font-semibold">Performance Score:</h3>
          <p className="text-xl">{performanceScore}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default PerformanceTest;
