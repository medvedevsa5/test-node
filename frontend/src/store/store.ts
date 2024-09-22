import { configureStore, Reducer } from '@reduxjs/toolkit';
import { userSlice, UserState } from './features/userSlice';

export interface ApplicationStore {
    user: Reducer<UserState>;
}

export const store = configureStore({
    reducer:({
        user: userSlice.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});


// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store