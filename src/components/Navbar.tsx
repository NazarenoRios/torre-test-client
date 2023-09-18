'use client';

import Image from 'next/image';
import logo from '../assets/torrelogo.svg';
import TextField from '@mui/material/TextField';
import styles from './Navbar.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Autocomplete } from '@mui/material';
import useFetchAndLoad from '../hooks/useFetchAndLoad';
import { GetQueries, SaveQueries } from '../services/user.services';

const Navbar = () => {
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const logedout = searchParams.get('logout');
  const logged = searchParams.get('logged');

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // Nuevo estado para el dropdown

  const pathname = usePathname();

  const { loading, callEndpoint } = useFetchAndLoad();

  const handleRegister = () => {
    push('/register');
  };

  const handleSignIn = () => {
    push('/signin');
  };

  const handleGoHome = () => {
    push('/');
  };

  const handleFavorites = () => {
    push('/favorites');
  };

  const checkToken = () => {
    return localStorage.getItem('token');
  };

  const handleLogout = () => {
    localStorage.clear();
    push('/?logout=true');
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const authToken = localStorage.getItem('token');
        const UID = localStorage.getItem('UID');

        const response = await callEndpoint(
          SaveQueries(authToken, searchQuery, UID)
        );

        if (response.status === 200) {
          setSearchQuery('');

          push(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
          console.error('Error al enviar la consulta al backend');
        }
      } catch (error) {
        setSearchQuery('');
        push(`/search?query=${encodeURIComponent(searchQuery)}`);
        console.error('Error en la solicitud al backend', error);
      } finally {
        setSearchQuery('');
      }
    }
  };

  const fetchSearchs = async () => {
    try {
      const authToken = localStorage.getItem('token');

      if (logged) {
        const res = await callEndpoint(GetQueries(authToken));

        setRecentSearches(res.data.searchHistory);
      }

      if (logedout) {
        setRecentSearches([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSearchs();
  }, [logged]);

  useEffect(() => {
    checkToken();
  }, [pathname, logedout]);

  return (
    <div className='navbar bg-[#27292d]'>
      <div className='navbar-start'>
        <Image
          src={logo}
          alt='logo'
          className='ml-6 cursor-pointer'
          onClick={handleGoHome}
        />
      </div>
      <div className='navbar-center hidden lg:flex'>
        {pathname.includes('/signin') || pathname.includes('/register') ? (
          ''
        ) : (
          <Autocomplete
            id='free-solo-demo'
            freeSolo
            options={recentSearches.map((searchItem) => searchItem.query)}
            renderInput={(params) => (
              <TextField
                {...params}
                id='outlined-basic'
                label='Search'
                variant='outlined'
                sx={{ width: '30vw' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            )}
          />
        )}
      </div>
      <div className='navbar-end flex items-center'>
        <div className='flex items-center'>
          {checkToken() ? (
            <>
              <button
                onClick={handleFavorites}
                className={`btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39] ${styles.hoverBlack}`}
              >
                FAVORITES
                <FavoriteOutlinedIcon />
              </button>
              <button
                onClick={handleLogout}
                className={`btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39] ${styles.hoverBlack}`}
              >
                Logout
                <LogoutOutlinedIcon />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRegister}
                className={`btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39] ${styles.hoverBlack}`}
              >
                Register
                <AppRegistrationOutlinedIcon />
              </button>
              <button
                onClick={handleSignIn}
                className={`btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39] ${styles.hoverBlack}`}
              >
                Sign in
                <LoginOutlinedIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
