'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import avatarLogo from '../../assets/avatar.png';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import { toast } from 'react-toastify';
import { UserSearchs } from '../../services/torre-api.services';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import {
  AddFavorite,
  GetFavorites,
  RemoveFavorite,
} from '../../services/favorite.services';
import { User } from '../../interfaces/user.interface';

const SearchPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userFavorites, setUserFavorites] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const { loading, callEndpoint } = useFetchAndLoad();

  const fetchUsers = async () => {
    try {
      const authToken = localStorage.getItem('token');

      const offset = (currentPage - 1) * pageSize;

      if (authToken) {
        const favorites = await callEndpoint(
          GetFavorites(authToken, currentPage, pageSize)
        );

        const userFavorites = favorites.data;

        const userResponse = await callEndpoint(
          UserSearchs(authToken, query, offset, pageSize)
        );

        const usersData = userResponse.data.results;

        const updatedUsersData = usersData.map((user) => {
          const favorite = userFavorites.find(
            (favorite) => favorite.username === user.username
          );

          return {
            ...user,
            isUserInFavorites: !!favorite,
            favoriteId: favorite ? favorite._id : null,
          };
        });
        setUsers(updatedUsersData);
      } else {
        const usersResponse = await callEndpoint(
          UserSearchs(authToken, query, offset, pageSize)
        );

        setUsers(usersResponse.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query, currentPage]);

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleFavorite = async (user: User) => {
    try {
      const authToken = localStorage.getItem('token');

      const favoriteId = user.favoriteId;

      if (user.isUserInFavorites) {
        await callEndpoint(RemoveFavorite(authToken, favoriteId));

        setUserFavorites((prevFavorites) =>
          prevFavorites.filter(
            (favorite) => favorite.favoriteId !== user.favoriteId
          )
        );

        const updatedUser = { ...user };
        updatedUser.isUserInFavorites = false;
        updatedUser.favoriteId = null;

        setUsers((prevUsers) =>
          prevUsers.map((prevUser) =>
            prevUser.username === user.username ? updatedUser : prevUser
          )
        );
      } else {
        const favoriteData = {
          name: user.name,
          picture: user.picture,
          professionalHeadline: user.professionalHeadline,
          username: user.username,
          verified: user.verified,
        };

        const res = await callEndpoint(AddFavorite(authToken, favoriteData));

        setUserFavorites((prevFavorites) => [...prevFavorites, res.data]);

        const updatedUser = { ...user };
        updatedUser.isUserInFavorites = true;
        updatedUser.favoriteId = res.data._id;

        setUsers((prevUsers) =>
          prevUsers.map((prevUser) =>
            prevUser.username === user.username ? updatedUser : prevUser
          )
        );
      }
    } catch (error) {
      toast.error('Error al actualizar favoritos', {
        position: 'top-center',
        className: 'custom-toast',
      });
    }
  };

  return (
    <div className='mt-24 flex flex-wrap justify-center'>
      {users.map((user) => (
        <div
          key={user.username}
          className='mt-12 flex h-[25vh] w-[50vw] flex-row flex-wrap rounded-lg bg-[#1c1e21] p-3 antialiased shadow-lg'
        >
          <div className='flex w-full items-center md:w-1/3'>
            {user?.picture ? (
              <Image
                className='mx-auto rounded-lg antialiased shadow-lg'
                src={user?.picture}
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
                {user.name}
              </div>
              <div className='text-normal mt-4 cursor-pointer text-center text-gray-300 hover:text-gray-400'>
                <span className='border-b border-dashed border-gray-500 pb-1'>
                  {user.professionalHeadline}
                </span>
              </div>

              {user.verified ? (
                <div className='text-normal mt-4 cursor-pointer text-center text-gray-300 hover:text-gray-400'>
                  <span className='border-b border-dashed border-gray-500 pb-1'>
                    Verified <VerifiedIcon className='text-[#cddc39]' />
                  </span>
                </div>
              ) : (
                ''
              )}

              <div className='bottom-0 right-0 cursor-pointer pt-3 text-sm text-gray-300 hover:text-gray-400 md:absolute md:pt-0'>
                {user.isUserInFavorites ? (
                  <button
                    onClick={() => toggleFavorite(user)}
                    className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
                  >
                    <FavoriteOutlinedIcon />
                    unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => toggleFavorite(user)}
                    className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'
                  >
                    <FavoriteBorderOutlinedIcon />
                    follow
                  </button>
                )}

                <button className='btn btn-outline mr-3 border-[#cddc39] text-[#cddc39] hover:bg-[#cddc39]'>
                  <Person2OutlinedIcon />
                  GNOME
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='mb-12 mt-12 flex w-full justify-center '>
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
          disabled={users.length < pageSize}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
