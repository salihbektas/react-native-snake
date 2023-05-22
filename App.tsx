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

  const snakeValues = useRef([new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()]).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  const [bait, setBait] = useState(() => setLocation())

  const [snake, setSnake] = useState(() => [
    <Animated.View key={0} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues[0].x },
        { translateY: snakeValues[0].y }
      ]
    }} />,
    <Animated.View key={1} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues[1].x },
        { translateY: snakeValues[1].y }
      ]
    }} />,
    <Animated.View key={2} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues[2].x },
        { translateY: snakeValues[2].y }
      ]
    }} />
  ])

  function setLocation() {
    let baitX: number

    do {
      baitX = Math.floor(Math.random() * 25)
    } while (snakeNodes.current.find(({ x }) => x === baitX))

    let baitY: number

    do {
      baitY = Math.floor(Math.random() * 25)
    } while (snakeNodes.current.find(({ y }) => y === baitY))

    return { baitX, baitY }
  }

  function tick() {

    if (snakeNodes.current[0].x === bait.baitX && snakeNodes.current[0].y === bait.baitY) {
      snakeNodes.current.push({ ...snakeNodes.current[snakeNodes.current.length - 1] })
      snakeValues.push(new Animated.ValueXY({
        x: snakeNodes.current[snakeNodes.current.length - 2].x * (WIDTH / 25),
        y: snakeNodes.current[snakeNodes.current.length - 2].y * (WIDTH / 25)
      }))
      setBait(setLocation())
      setSnake([...snake, <Animated.View key={snakeValues.length - 1} style={{
        ...styles.snakeNode,
        transform: [
          { translateX: snakeValues[snakeValues.length - 1].x },
          { translateY: snakeValues[snakeValues.length - 1].y }
        ]
      }} />])
    }

    for (let i = snakeValues.length - 1; i > 0; --i) {
      snakeNodes.current[i].x = snakeNodes.current[i - 1].x
      snakeNodes.current[i].y = snakeNodes.current[i - 1].y
    }

    currentDirection.current = nextDirection.current

    if (currentDirection.current === 'up') {
      snakeNodes.current[0].y--
    }
    if (currentDirection.current === 'left') {
      snakeNodes.current[0].x--
    }
    if (currentDirection.current === 'right') {
      snakeNodes.current[0].x++
    }
    if (currentDirection.current === 'down') {
      snakeNodes.current[0].y++
    }


    for (let i = 0; i < snakeValues.length; ++i) {
      Animated.timing(snakeValues[i], {
        toValue: { x: snakeNodes.current[i].x * (WIDTH / 25), y: snakeNodes.current[i].y * (WIDTH / 25) },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start()
    }

    if (snakeNodes.current[0].x < 0 || snakeNodes.current[0].x > 24 ||
      snakeNodes.current[0].y < 0 || snakeNodes.current[0].y > 24) {
      setIsPlaying(false)
    }
  }


  useInterval(tick, isPlaying && TICK_TIME)

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>

      </View>
      <View style={styles.board}>

        <View style={{
          ...styles.bait,
          top: bait.baitY * (WIDTH / 25),
          left: bait.baitX * (WIDTH / 25)
        }} />

        {snake}
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

  board: {
    width: WIDTH,
    aspectRatio: 1,
    backgroundColor: 'darkgray'
  },

  snakeNode: {
    width: WIDTH / 25,
    aspectRatio: 1,
    backgroundColor: 'red',
    position: 'absolute'
  },

  bait: {
    width: WIDTH / 25,
    aspectRatio: 1,
    backgroundColor: 'green',
    position: 'absolute'
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
