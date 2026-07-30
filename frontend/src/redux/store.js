// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import userSlice from "./userSlice";
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";   // ← Fixed

// const persistConfig = {
//   key: "ekart",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   user: userSlice,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,        // ← You had persistReducer here (missing 'd')
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export default store;


import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import productSlice from "./productSlice"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
const storage = createWebStorage("local"); 
const persistConfig = {
  key: "ekart",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userSlice,
  product: productSlice

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,   // ← Important: persistedReducer, not persistReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;