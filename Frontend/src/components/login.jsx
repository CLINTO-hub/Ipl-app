import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';

const Login = () => {
  const [formdata, setFormdata] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const submitHandler = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formdata)
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      navigate('/home');
      localStorage.setItem("User", JSON.stringify({ token: result.token, userId: result.userId }));

    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')).token : '';
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <section className='px-5 lg:px-0 mt-24'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10'>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
          <span className='text-primaryColor'>User</span> Login
        </h3>

        <form className='py-4 md:py-0'>
          <div className='mb-5'>
            <input
              type='email'
              placeholder='Enter your Email'
              name='email'
              value={formdata.email}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>
          <div className='mb-5'>
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={formdata.password}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>
          <div className='mt-7'>
            <button
              onClick={submitHandler}
              type='submit'
              className='w-full bg-red-500 text-black text-[18px] leading-[30px] rounded-lg px-4 py-3'
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
