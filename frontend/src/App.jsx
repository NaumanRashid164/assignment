import { useEffect, useState } from 'react'

import './App.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import PerformanceTest from './components/PerformanceTest';
import { VITE_GOOGLE_CLIENT_ID } from './constants';
import axios from 'axios';


function App() {
  const serverUrl = import.meta.env.VITE_APP_SERVER_URL;
  // const clientID = VITE_GOOGLE_CLIENT_ID;
  const clientID = "873262355992-jn745jjg6469fkuaiqcrl6v7cd084pac.apps.googleusercontent.com";
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(false);
  const handleLoginSuccess = () => {
    axios.get(serverUrl + '/api/google/redirect')
      .then(res => {
        let data = res.data;

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.log("Google OAuth URL not found")
        }

      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      setIsLogin(true);
    }
  }, [searchParams]);

  return (
    <>

      <PerformanceTest />
      <br />
      <br />
      <br />
      {
        isLogin == false && (
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleLoginSuccess}>Login With Google</button>
        )
      }
    </>
  )
}

export default App
