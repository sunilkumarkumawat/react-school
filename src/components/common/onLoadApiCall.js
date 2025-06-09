import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBranches } from '../../redux/branchSlice';
import { fetchRoles } from '../../redux/rolesSlice';
import { AppContext } from '../../context/AppContext';

const onLoadApiCall = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AppContext);
  const API_URL = process.env.REACT_APP_BASE_URL || '';

  useEffect(() => {
    if (token) {
      dispatch(fetchBranches({ API_URL, token }));
      dispatch(fetchRoles({ API_URL, token }));
    }
    // eslint-disable-next-line
  }, [token, API_URL, dispatch]);

  // ...rest of your component
};

export default onLoadApiCall;