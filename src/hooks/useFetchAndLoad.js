'use client';

import { useEffect, useState } from 'react';

const useFetchAndLoad = () => {
  const [loading, setLoading] = useState(false);
  let controller = null;

  const callEndpoint = async (axiosCall) => {
    if (axiosCall.controller) controller = axiosCall.controller;
    setLoading(true);
    let result = {};
    try {
      result = await axiosCall.call();
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
    return result;
  };

  const cancelEndpoint = () => {
    setLoading(false);
    if (controller) controller.abort();
  };

  useEffect(
    () => () => {
      cancelEndpoint();
    },
    []
  );

  return { loading, callEndpoint };
};

export default useFetchAndLoad;
