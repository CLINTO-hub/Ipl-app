// App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Home from './components/home.jsx';

function App() {
 

  return (
    <div>
      <Routes>
        <Route path='/home' element={ <Home />  } />
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

