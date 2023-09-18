'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import avatarLogo from '../../assets/avatar.png';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { GetFavorites, RemoveFavorite } from '../../services/favorite.services';
import { Favorite } from '../../interfaces/favorites.interface';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const { loading, callEndpoint } = useFetchAndLoad();

  const fetchFavorites = async () => {
    try {
      const authToken = localStorage.getItem('token');

      const response = await callEndpoint(
        GetFavorites(authToken, currentPage, pageSize)
      );

      setFavorites(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const authToken = localStorage.getItem('token');

      await callEndpoint(RemoveFavorite(authToken, favoriteId));

      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== favoriteId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleGnome = (user: Favorite) => {
    window.open(`https://torre.ai/${user.username}`, '_blank');
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentPage]);

  return (
    <div className='mt-24 flex flex-wrap justify-center'>
      {favorites.map((favorite) => (
        <div
          key={favorite.username}
          className='mt-12 flex h-[25vh] w-[60vw] flex-row flex-wrap rounded-lg bg-[#1c1e21] p-3 antialiased shadow-lg'
        >
          <div className='flex w-full items-center md:w-1/3'>
            {favorite?.picture ? (
              <Image
                className='mx-auto rounded-lg antialiased shadow-lg'
                src={favorite?.picture}
                alt='Profile'
                width={150}
                height={150}
              />
            ) : (
              <Image
                className='mx-auto rounded-lg antialiased shadow-lg'
                src={avatarLogo}
                alt='Profile'
                width={150}
                height={150}
              />
            )}
          </div>
          <div className='flex w-full flex-row flex-wrap px-3 md:w-2/3'>
            <div className='relative w-full pt-3 text-center font-semibold text-gray-700 md:pt-0'>
              <div className='mt-8 text-center text-2xl leading-tight text-white'>
                {favorite.name}
              </div>
              <div className='text-normal mt-2 cursor-pointer text-center text-gray-300 hover:text-gray-400'>
                <span className='border-b border-dashed border-gray-500 pb-1'>
                  {favorite.professionalHeadline}
                </span>
              </div>
              {favorite.verified ? (
                <div className='text-normal mt-4 cursor-pointer text-center text-gray-300 hover:text-gray-400'>
                  <span className='border-b border-dashed border-gray-500 pb-1'>
                    Verified <VerifiedIcon className='text-[#cddc39]' />
                  </span>
                </div>
              ) : (
                ''
              )}
              <div className='bottom-0 right-0 cursor-pointer pt-3 text-sm text-gray-300 hover:text-gray-400 md:absolute md:pt-0'>
                <button
                  onClick={() => removeFavorite(favorite._id)}
                  className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
                >
                  <FavoriteOutlinedIcon />
                  unfollow
                </button>

                <button
                  onClick={() => handleGnome(favorite)}
                  className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
                >
                  <Person2OutlinedIcon />
                  GNOME
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='mb-12  mt-12 flex w-full justify-center'>
        <button
          className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          PREVIOUS
        </button>
        <button
          className='btn btn-outline border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
          onClick={goToNextPage}
          disabled={favorites.length < pageSize}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default FavoritesPage;
