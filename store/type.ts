import { Identity } from '~/types';

export interface StoreState {
  currentUser: string;
  isLogin: boolean;
  token: string;
  userImage: string;// 用户头像
  email: string;
  identity: Identity | -1;
}


export interface StoreGetters {
  getIdentity: (state: StoreState) => number;
  getEmail: (state: StoreState) => string;
  getLogin: (state: StoreState) => boolean;
  getUserImage: (state: StoreState) => string;
  getCurrentUser: (state: StoreState) => string;
} // (1)

export type StoreComputedGetters = {
  [Getter in keyof StoreGetters]: ReturnType<StoreGetters[Getter]>
} // (1)

export type StoreStateAndGetters = StoreState &
  StoreComputedGetters // (2)

export type Store = ReturnType<typeof import('../store')['useStore']> // (3)

/*
NOTES:
  (1): Define function signatures for getters (which will be used to ensure the getters
  we pass to our store match the format defined here) and then generate a mapped type that
  replaces the function signatures with their return types (used inside regular function
  getters so that we can access a value like this.doubleCount as usual instead of being
  expected to invoke it as this.doubleCount() first.)

  (2): This will be the value we'll use to type `this` inside our getters. I don't know why,
  but using the same trick from point (3) here would not work. Pinia supports actions where
  `this` is typed using the computed store's type, but if you try to do the same thing for
  getters it causes a recursion error (that's why we manually need to type our state and
  getters, but don't need to do the same for actions.)

  (3): Dynamically import the computed type of our store. We will use this to type `this`
  inside our externally defined actions.
*/