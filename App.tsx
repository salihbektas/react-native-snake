import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useInterval from 'use-interval';
import Colors from './Colors';

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

  const [time, setTime] = useState(0)

  const [point, setPoint] = useState(0)

  const snakeValues = useRef([new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()])

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  const [bait, setBait] = useState(() => setLocation())

  const [snake, setSnake] = useState(() => [
    <Animated.View key={0} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues.current[0].x },
        { translateY: snakeValues.current[0].y }
      ]
    }} />,
    <Animated.View key={1} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues.current[1].x },
        { translateY: snakeValues.current[1].y }
      ]
    }} />,
    <Animated.View key={2} style={{
      ...styles.snakeNode,
      transform: [
        { translateX: snakeValues.current[2].x },
        { translateY: snakeValues.current[2].y }
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
      setPoint(p => p + 1)
      snakeNodes.current.push({ ...snakeNodes.current[snakeNodes.current.length - 1] })
      snakeValues.current.push(new Animated.ValueXY({
        x: snakeNodes.current[snakeNodes.current.length - 2].x * (WIDTH / 25),
        y: snakeNodes.current[snakeNodes.current.length - 2].y * (WIDTH / 25)
      }))
      setBait(setLocation())
      setSnake([...snake, <Animated.View key={snakeValues.current.length - 1} style={{
        ...styles.snakeNode,
        transform: [
          { translateX: snakeValues.current[snakeValues.current.length - 1].x },
          { translateY: snakeValues.current[snakeValues.current.length - 1].y }
        ]
      }} />])
    }

    for (let i = snakeValues.current.length - 1; i > 0; --i) {
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


    for (let i = 0; i < snakeValues.current.length; ++i) {
      Animated.timing(snakeValues.current[i], {
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

  function reset() {
    currentDirection.current = ''
    nextDirection.current = ''
    setPoint(0)
    setTime(0)
    setBait(setLocation())
    snakeNodes.current = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    snakeValues.current = [new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()]
    setSnake([
      <Animated.View key={0} style={{
       ...styles.snakeNode,
        transform: [
          { translateX: snakeValues.current[0].x },
          { translateY: snakeValues.current[0].y }
        ]
      }} />,
      <Animated.View key={1} style={{
       ...styles.snakeNode,
        transform: [
          { translateX: snakeValues.current[1].x },
          { translateY: snakeValues.current[1].y }
        ]
      }} />,
      <Animated.View key={2} style={{
       ...styles.snakeNode,
        transform: [
          { translateX: snakeValues.current[2].x },
          { translateY: snakeValues.current[2].y }
        ]
      }} />
    ])
    setIsPlaying(true)
  }


  useInterval(tick, isPlaying && TICK_TIME)

  useInterval(() => setTime(t => t + 1), isPlaying && 1000)

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>
        <Text style={styles.infoText}>Time = {Math.floor(time / 60)} : {time % 60}</Text>
        <Pressable onPress={reset}>
          <Image source={require("./assets/reset.png")} style={styles.reset} />
        </Pressable>
        <Text style={styles.infoText}>Point = {point}</Text>
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
    backgroundColor: Colors.dark
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  infoText: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  reset: {
    tintColor: Colors.white,
    resizeMode: 'contain',
    height: 30,
    aspectRatio: 1
  },

  board: {
    width: WIDTH,
    aspectRatio: 1,
    backgroundColor: Colors.grey
  },

  snakeNode: {
    width: WIDTH / 25,
    aspectRatio: 1,
    backgroundColor: Colors.purple,
    position: 'absolute'
  },

  bait: {
    width: WIDTH / 25,
    aspectRatio: 1,
    backgroundColor: Colors.green,
    position: 'absolute'
  },

  buttonContainer: {
    flex: 3
  },

  button: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8
  },

  middleRow: { flexDirection: 'row', flex: 1 },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark
  }

});

export default App;
