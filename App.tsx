import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const WIDTH = Dimensions.get('screen').width - 16

function App(): JSX.Element {
  

  return (
    <SafeAreaView style={ styles.main }>
      <View style={ styles.topContainer }>

      </View>
      <View style={{ width: WIDTH, aspectRatio: 1, backgroundColor: 'darkgray'}}>
        <View style={{width: WIDTH/25, aspectRatio: 1, backgroundColor: 'red'}} />
      </View>
      <View style={ styles.buttonContainer }>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 8,
    flex: 1,
    backgroundColor: 'navy'
  },
  topContainer: {
    flex: 1,
    backgroundColor: 'orange'
  },
  buttonContainer: {
    flex: 3,
    backgroundColor: 'white'
  }
});

export default App;
