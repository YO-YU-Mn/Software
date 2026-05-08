import {
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';

import { useState } from 'react';

export default function ChatbotScreen() {

  const [refreshing, setRefreshing] =
    useState(false);

  async function onRefresh() {

    setRefreshing(true);

    setTimeout(() => {

      setRefreshing(false);

    }, 1000);
  }

  return (

    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

      <Text>
        AI Chatbot Page
      </Text>

    </ScrollView>
  );
}