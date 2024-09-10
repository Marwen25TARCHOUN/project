import { compose, createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { rootReducer } from "./root-reducer";

const middleWares = [process.env.NODE_ENV !== "production" && logger].filter(Boolean);

const composeEnhancers = (process.env.NODE_ENV !== "production" && window && window.__REDUX_DEVTOOLS_EXTENSION__) || compose;

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['user'],
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const composedEnhancers = composeEnhancers(applyMiddleware(...middleWares));
  
  export const store = createStore(
    persistedReducer,
    undefined,
    composedEnhancers
  );
  
export const persistor = persistStore(store);

// const composeEnhancers = compose(applyMiddleware(...middleware))

// export const store = createStore(rootReducer, undefined, composeEnhancers);