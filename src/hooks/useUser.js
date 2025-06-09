import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const useUser = () => {
  const { user } = useContext(AppContext);
  return user;
};

export default useUser;