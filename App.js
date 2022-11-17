import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import Map from './screens/Map';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors';
import { useCallback, useEffect, useState } from 'react';
import { init } from './util/database';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from 'react-native';
import PlaceDetails from './screens/PlaceDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        init();
      } catch (error) {
        console.warn(error);
      } finally {
        setDbInitialized(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) return null;

  return (
    <>
      <StatusBar style='dark' />
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerHintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name='AllPlaces'
            component={AllPlaces}
            options={({ navigation }) => ({
              title: 'Your favorite places',
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon='add'
                  size={24}
                  color={'#e21717'}
                  onPress={() => navigation.navigate('AddPlace')}
                />
              ),
            })}
          />
          <Stack.Screen
            name='AddPlace'
            component={AddPlace}
            options={{
              title: 'Add a New Place',
            }}
          />
          <Stack.Screen name='Map' component={Map} />
          <Stack.Screen name='PlaceDetails' component={PlaceDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
