import { StyleSheet, View, Alert, Image, Text } from 'react-native';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';

import { useEffect, useState } from 'react';
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';
import { getAddress, getMapPreview } from '../../util/Location';

const LocationPicker = ({ onPickLocation }) => {
  const [pickedLocation, setPickedLocation] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    const handleLocation = async () => {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address });
      }
    };

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  const verifyPermissions = async () => {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Permission Denied!',
        'You need to grant location permission to use this app'
      );

      return false;
    }

    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const pickOnMapHandler = () => {
    navigation.navigate('Map');
  };

  let locationPreview = <Text>No location selected</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton
          width={'45%'}
          icon='location'
          onPress={getLocationHandler}
        >
          Locate User
        </OutlinedButton>
        <OutlinedButton width={'45%'} icon='map' onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVerticle: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    // overflow: 'hidden', - adding borderRadius to the image makes this unnecessary
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
