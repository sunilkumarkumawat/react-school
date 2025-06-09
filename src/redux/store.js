import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import settingsReducer from './settingsSlice';
import statesReducer from './statesSlice';
import districtsReducer from './districtsSlice';
import packageReducer from './packageSlice';
import homeReducer from './homeSlice';
import subLocalityReducer from './subLocalitySlice';
import popularLocalityReducer from './popularLocalitySlice';
import profilePropertyReducer from './profilePropertySlice';
import rolesReducer from './rolesSlice'; // Importing roles slice
import branchesReducer from './branchSlice'; // Importing branches slice
import usersListReducer from './usersListSlice'; // Importing users list slice

const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
    states: statesReducer,
    districts: districtsReducer,
    home: homeReducer,
    package: packageReducer,
    subLocalities: subLocalityReducer,
    popularLocalities: popularLocalityReducer,
    profileProperty: profilePropertyReducer,
    roles: rolesReducer,      // roles state
    branches: branchesReducer, // branches state
    usersList: usersListReducer // users list state
  },
});

export default store;