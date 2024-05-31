import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config.js';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io(BASE_URL);

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const token = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')).token : '';
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json();
      localStorage.removeItem('User');
      navigate('/login')
      if (!res.ok) {
        throw new Error('Failed to logout')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')).token : '';
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTeams = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/teams`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Fetch failed');
        }
        setTeams(data.teams);
      } catch (error) {
        console.error('Error fetching teams:', error.message);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/notifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Fetch failed');
        }
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchTeams();
    fetchNotifications();

    socket.on("teamUpdated", (data) => {
      const { userIds } = data;
      const userData = JSON.parse(localStorage.getItem("User"));
      const userId = userData.userId
      console.log('userId',userId);
      if (userIds && userIds.includes(userId)) {
        fetchTeams();
        fetchNotifications();
      }
    });

    const userId = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User'))._id : '';
    socket.emit('subscribe', userId);

    return () => {
      socket.off("teamUpdated");
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Home Page</h1>
      <div>
        {teams.map((team) => (
          <div key={team._id} className="mb-4">
            <h2 className="text-xl font-semibold">{team.teamName}</h2>
            <p>Team Owner: {team.teamOwner}</p>
            <p>Team Captain: {team.teamCaptain}</p>
            <p>Team Coach: {team.teamCoach}</p>
            <p>Team Home Ground: {team.teamHomeGround}</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className='text-xl mt-8 mb-4'>Notifications</h2>
        {notifications.map((notification) => (
          <div key={notification._id} className="mb-4">
            <p className='text-blue-600 text-2xl'>{notification.message}</p>
          </div>
        ))}
      </div>
      <button onClick={Logout} className='w-24 bg-red-500 text-white text-sm leading-5 rounded-lg px-4 py-3 mt-8'>
        Logout
      </button>
    </div>
  );
};

export default Home;

