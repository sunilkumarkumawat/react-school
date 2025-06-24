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
import rolesReducer from './rolesSlice';
import branchesReducer from './branchSlice';
import usersListReducer from './usersListSlice';
import studentListReducer from './studentListSlice';
import expensesReducer from './expensesSlice'; // Importing expenses slice

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
    roles: rolesReducer,
    branches: branchesReducer,
    usersList: usersListReducer,
    studentList: studentListReducer,
    expenses: expensesReducer, // Added expenses state
  },
});

export default store;