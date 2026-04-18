import { SafeAreaView, StatusBar } from 'react-native';

import { AppNavigator } from './src/navigation';
import { MedicineAssistantProvider } from './src/state/MedicineAssistantProvider';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MedicineAssistantProvider>
        <AppNavigator />
      </MedicineAssistantProvider>
    </SafeAreaView>
  );
}
