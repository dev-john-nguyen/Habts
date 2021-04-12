import { StatusBar } from 'expo-status-bar';
import reducers from './services';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import Main from './screens';
import { verifyAuth } from './services/user/actions';
import { View, Image } from 'react-native';
import Layout from './constants/Layout';

const composeEnhancers = composeWithDevTools(applyMiddleware(reduxThunk))


const store = createStore(
  reducers,
  composeEnhancers
);

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof reducers>

function configureStore() {
  store.dispatch(verifyAuth(store.getState()))
  return store;
}


export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return <Image source={require('./assets/images/splash.png')} style={{ height: Layout.window.height, width: Layout.window.width }} />
  } else {
    return (
      <Provider store={configureStore()}>
        <SafeAreaProvider>
          <Main />
          <StatusBar style="light" />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
