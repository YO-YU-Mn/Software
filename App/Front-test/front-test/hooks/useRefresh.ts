import { useState } from 'react';

export default function useRefresh(callback: any) {

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {

    setRefreshing(true);

    await callback();

    setRefreshing(false);
  }

  return {
    refreshing,
    onRefresh,
  };
}