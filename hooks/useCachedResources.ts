import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Lato_400Regular, Lato_400Regular_Italic } from '@expo-google-fonts/lato';
import { Asap_400Regular, Asap_700Bold, Asap_500Medium } from '@expo-google-fonts/asap';
import { Cabin_400Regular, Cabin_500Medium, Cabin_700Bold } from '@expo-google-fonts/cabin';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          Lato_400Regular,
          Asap_400Regular,
          Lato_400Regular_Italic,
          Asap_700Bold,
          Asap_500Medium,
          Cabin_400Regular,
          Cabin_500Medium,
          Cabin_700Bold
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
