import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useInterval from 'use-interval';

interface snakeNode {
  x: number;
  y: number;
}

const TICK_TIME = 250

const WIDTH = Dimensions.get('screen').width - 16

function App(): JSX.Element {

  const currentDirection = useRef('')
  const nextDirection = useRef('')

  const [isPlaying, setIsPlaying] = useState(true)

  const snake = useRef([new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()]).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  const [bait, setBait] = useState(() => setLocation())

  function setLocation() {
    let baitX : number

    do{
      baitX = Math.floor(Math.random()*25)
    } while(snakeNodes.current.find(({x}) => x === baitX))

    let baitY : number

    do{
      baitY = Math.floor(Math.random()*25)
    } while(snakeNodes.current.find(({y}) => y === baitY))
    
    return {baitX, baitY}
  }

  function tick() {

    for(let i = snake.length-1; i > 0; --i){
      snakeNodes.current[i].x = snakeNodes.current[i-1].x
      snakeNodes.current[i].y = snakeNodes.current[i-1].y
    }

    currentDirection.current = nextDirection.current

    if (currentDirection.current === 'up') {
      snakeNodes.current[0].y -= WIDTH/25
    }
    if (currentDirection.current === 'left') {
      snakeNodes.current[0].x -= WIDTH/25
    }
    if (currentDirection.current === 'right') {
      snakeNodes.current[0].x += WIDTH/25
    }
    if (currentDirection.current === 'down') {
      snakeNodes.current[0].y += WIDTH/25
    }


    for(let i = 0; i < snake.length; ++i){
      Animated.timing(snake[i], {
        toValue: { x: snakeNodes.current[i].x, y: snakeNodes.current[i].y },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start()
    }

    if (snakeNodes.current[0].x < 0 || snakeNodes.current[0].x > WIDTH ||
        snakeNodes.current[0].y < 0 || snakeNodes.current[0].y > WIDTH) {
      setIsPlaying(false)
    }
  }


  useInterval(tick, isPlaying && TICK_TIME)

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>

      </View>
      <View style={{ width: WIDTH, aspectRatio: 1, backgroundColor: 'darkgray' }}>
        {snake.map((item, index) => <Animated.View key={index} style={{
          width: WIDTH / 25, aspectRatio: 1, backgroundColor: 'red', position: 'absolute',
          transform: [
            { translateX: snake[index].x},
            { translateY: snake[index].y }
          ]
        }}
        />)}

        <View style={{ width: WIDTH / 25, aspectRatio: 1, backgroundColor: 'green', position: 'absolute',
               top: bait.baitY * (WIDTH / 25), left: bait.baitX * (WIDTH / 25)}}/> 
        
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
