import {
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    StoreEnhancer,
  } from "redux";
  import {thunk} from "redux-thunk";
import { authReducer } from "./Auth";
  
  /* Create root reducer, containing all features of the application */
  const rootReducer = combineReducers({
    auth:authReducer,
  });
  
  const allStoreEhancers: StoreEnhancer = compose(
    applyMiddleware(thunk)
  );
  
  const store = createStore(rootReducer,undefined, allStoreEhancers);
  
  export default store;
  
  // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>;
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch;