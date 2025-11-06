import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

// Context
import { DatasetProvider } from './src/context/DatasetContext';

// Components
import Header from './src/components/Header';
import Login from './src/components/Login';

// Pages
import Dashboard from './src/pages/Dashboard';
import SearchVoters from './src/pages/SearchVoters';
import DemoVote from './src/pages/DemoVote';
import ListPage from './src/pages/ListPage';
import ListBox from './src/pages/ListBox';
import VoterDetail from './src/pages/VoterDetail';
import Survey from './src/pages/Survey';
import ResponseList from './src/pages/ResponseList';

const Stack = createNativeStackNavigator();

const AppContent = ({ selectedDataset, onLogout, onDatasetChange, currentRoute }) => {
  try {
    return (
      <View style={styles.container}>
        <Header 
          onLogout={onLogout} 
          selectedDataset={selectedDataset}
          onDatasetChange={onDatasetChange}
        />
        <View style={styles.spacer} />
        <View style={styles.content}>
        <Stack.Navigator 
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Dashboard">
            {(props) => <Dashboard {...props} selectedDataset={selectedDataset} onLogout={onLogout} />}
          </Stack.Screen>
          <Stack.Screen name="SearchVoters">
            {(props) => <SearchVoters {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
          <Stack.Screen name="DemoVote">
            {(props) => <DemoVote {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
          <Stack.Screen name="ListPage">
            {(props) => <ListPage {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
          <Stack.Screen name="ListBox">
            {(props) => <ListBox {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
          <Stack.Screen name="VoterDetail">
            {(props) => <VoterDetail {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="ResponseList">
            {(props) => <ResponseList {...props} selectedDataset={selectedDataset} />}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    </View>
  );
  } catch (error) {
    console.error('AppContent render error:', error);
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: '#333', fontSize: 16, textAlign: 'center'}}>
          App Error. Please restart the application.
        </Text>
      </View>
    );
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(101);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('Dashboard');

  const handleNavigationStateChange = (state) => {
    if (state && state.routes && state.routes.length > 0) {
      const currentRouteName = state.routes[state.index]?.name;
      setCurrentRoute(currentRouteName);
    }
  };

  useEffect(() => {
    // Simple initialization without AsyncStorage
    setIsLoggedIn(false);
    setSelectedDataset(101);
    setIsLoading(false);
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleDatasetChange = (datasetId) => {
    setSelectedDataset(datasetId);
  };

  // Show loading screen while checking login status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* You can add a loading spinner here */}
      </View>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  try {
    return (
      <DatasetProvider>
        <NavigationContainer onStateChange={handleNavigationStateChange}>
          <AppContent 
            selectedDataset={selectedDataset}
            onLogout={handleLogout}
            onDatasetChange={handleDatasetChange}
            currentRoute={currentRoute}
          />
        </NavigationContainer>
      </DatasetProvider>
    );
  } catch (error) {
    console.error('Main App render error:', error);
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: '#333', fontSize: 16, textAlign: 'center'}}>
          Critical App Error. Please reinstall the application.
        </Text>
      </View>
    );
  }
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 30,
  },
  spacer: {
    height: 15,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
});