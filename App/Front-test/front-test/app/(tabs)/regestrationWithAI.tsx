import {
  View,
  Text,
} from 'react-native';
import {
  ScrollView,
  RefreshControl,
} from 'react-native';

import {
  useState,
} from 'react';

export default function RegistrationAIScreen() {

const [refreshing, setRefreshing] =
    useState(false);

    async function getData() {

      console.log('Fetching data...');
    }


   async function onRefresh() {

    setRefreshing(true);

    await getData();

    setRefreshing(false);
  }

  return (

     <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    > 
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 25 }}>
        Registration AI Page
      </Text>
    </View>
    </ScrollView>
  );
}