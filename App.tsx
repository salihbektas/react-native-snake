import React, { useRef } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const WIDTH = Dimensions.get('screen').width - 16

function App(): JSX.Element {

  const currentDirection = useRef('')
  const nextDirection = useRef('')

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>

      </View>
      <View style={{ width: WIDTH, aspectRatio: 1, backgroundColor: 'darkgray' }}>
        <View style={{ width: WIDTH / 25, aspectRatio: 1, backgroundColor: 'red' }} />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => { if (currentDirection.current !== 'down') nextDirection.current = 'up' }} >
          <Text style={styles.text} >Up</Text>
        </Pressable>
        <View style={styles.middleRow}>
          <Pressable style={styles.button} onPress={() => { if (currentDirection.current !== 'right') nextDirection.current = 'left' }} >
            <Text style={styles.text} >Left</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => { if (currentDirection.current !== 'left') nextDirection.current = 'right' }} >
            <Text style={styles.text} >Right</Text>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={() => { if (currentDirection.current !== 'up') nextDirection.current = 'down' }} >
          <Text style={styles.text} >Down</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 8,
    flex: 1,
    backgroundColor: '#0d1117'
  },

  topContainer: {
    flex: 1,
    backgroundColor: 'orange'
  },

  buttonContainer: {
    flex: 3
  },

  button: {
    flex: 1,
    backgroundColor: '#f0f6fc',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8
  },

  middleRow: { flexDirection: 'row', flex: 1 },

  text: { fontSize: 16, fontWeight: '800' }

});

export default App;
