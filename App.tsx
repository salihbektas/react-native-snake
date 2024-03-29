import React, {useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import Colors from './Colors';
import {STEP, TICK_TIME, WIDTH} from './src/constants';

interface snakeNode {
  x: number;
  y: number;
}

function App(): React.JSX.Element {
  const [currentDirection, setCurrentDirection] = useState('');
  const [nextDirection, setNextDirection] = useState('');

  const [isPlaying, setIsPlaying] = useState(true);

  const [time, setTime] = useState(0);

  const [point, setPoint] = useState(0);

  const snakeValues = useRef([
    new Animated.ValueXY(),
    new Animated.ValueXY(),
    new Animated.ValueXY(),
  ]);

  const snakeNodes = useRef<snakeNode[]>([
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
  ]);

  const [bait, setBait] = useState(() => setLocation());

  const [snake, setSnake] = useState(() => [
    <Animated.View
      key={0}
      style={{
        ...styles.snakeNode,
        transform: [
          {translateX: snakeValues.current[0].x},
          {translateY: snakeValues.current[0].y},
        ],
      }}
    />,
    <Animated.View
      key={1}
      style={{
        ...styles.snakeNode,
        width: STEP - 2,
        margin: 1,
        transform: [
          {translateX: snakeValues.current[1].x},
          {translateY: snakeValues.current[1].y},
        ],
      }}
    />,
    <Animated.View
      key={2}
      style={{
        ...styles.snakeNode,
        width: STEP - 2,
        margin: 1,
        transform: [
          {translateX: snakeValues.current[2].x},
          {translateY: snakeValues.current[2].y},
        ],
      }}
    />,
  ]);

  function setLocation() {
    let baitX: number;

    do {
      baitX = Math.floor(Math.random() * 25);
    } while (snakeNodes.current.find(({x}) => x === baitX));

    let baitY: number;

    do {
      baitY = Math.floor(Math.random() * 25);
    } while (snakeNodes.current.find(({y}) => y === baitY));

    return {x: baitX, y: baitY};
  }

  function tick() {
    if (nextDirection === '') return;

    if (
      snakeNodes.current[0].x === bait.x &&
      snakeNodes.current[0].y === bait.y
    ) {
      let margin = Math.ceil(snake.length / 5);
      if (margin > 4) margin = 4;
      setPoint(p => p + 1);
      snakeNodes.current.push({
        ...snakeNodes.current[snakeNodes.current.length - 1],
      });
      snakeValues.current.push(
        new Animated.ValueXY({
          x: snakeNodes.current[snakeNodes.current.length - 2].x * STEP,
          y: snakeNodes.current[snakeNodes.current.length - 2].y * STEP,
        }),
      );
      setBait(setLocation());
      setSnake([
        ...snake,
        <Animated.View
          key={snakeValues.current.length - 1}
          style={{
            ...styles.snakeNode,
            width: STEP - 2 * margin,
            margin: margin,
            transform: [
              {
                translateX:
                  snakeValues.current[snakeValues.current.length - 1].x,
              },
              {
                translateY:
                  snakeValues.current[snakeValues.current.length - 1].y,
              },
            ],
          }}
        />,
      ]);
    }

    for (let i = snakeValues.current.length - 1; i > 0; --i) {
      snakeNodes.current[i].x = snakeNodes.current[i - 1].x;
      snakeNodes.current[i].y = snakeNodes.current[i - 1].y;
    }

    setCurrentDirection(nextDirection);

    if (currentDirection === 'up') {
      snakeNodes.current[0].y--;
    }
    if (currentDirection === 'left') {
      snakeNodes.current[0].x--;
    }
    if (currentDirection === 'right') {
      snakeNodes.current[0].x++;
    }
    if (currentDirection === 'down') {
      snakeNodes.current[0].y++;
    }

    for (let i = 0; i < snakeValues.current.length; ++i) {
      Animated.timing(snakeValues.current[i], {
        toValue: {
          x: snakeNodes.current[i].x * STEP,
          y: snakeNodes.current[i].y * STEP,
        },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }

    for (let i = 1; i < snakeNodes.current.length; i++) {
      if (
        time !== 0 &&
        snakeNodes.current[0].x === snakeNodes.current[i].x &&
        snakeNodes.current[0].y === snakeNodes.current[i].y
      ) {
        setIsPlaying(false);
        Vibration.vibrate(100);
        break;
      }
    }

    if (
      snakeNodes.current[0].x < 0 ||
      snakeNodes.current[0].x > 24 ||
      snakeNodes.current[0].y < 0 ||
      snakeNodes.current[0].y > 24
    ) {
      setIsPlaying(false);
      Vibration.vibrate(100);
    }
  }

  function reset() {
    setCurrentDirection('');
    setNextDirection('');
    setPoint(0);
    setTime(0);
    setBait(setLocation());
    snakeNodes.current = [
      {x: 0, y: 0},
      {x: 0, y: 0},
      {x: 0, y: 0},
    ];
    snakeValues.current = [
      new Animated.ValueXY(),
      new Animated.ValueXY(),
      new Animated.ValueXY(),
    ];
    setSnake([
      <Animated.View
        key={0}
        style={{
          ...styles.snakeNode,
          transform: [
            {translateX: snakeValues.current[0].x},
            {translateY: snakeValues.current[0].y},
          ],
        }}
      />,
      <Animated.View
        key={1}
        style={{
          ...styles.snakeNode,
          width: STEP - 2,
          margin: 1,
          transform: [
            {translateX: snakeValues.current[1].x},
            {translateY: snakeValues.current[1].y},
          ],
        }}
      />,
      <Animated.View
        key={2}
        style={{
          ...styles.snakeNode,
          width: STEP - 2,
          margin: 1,
          transform: [
            {translateX: snakeValues.current[2].x},
            {translateY: snakeValues.current[2].y},
          ],
        }}
      />,
    ]);
    setIsPlaying(true);
  }

  function formatTime(time: number) {
    return new Date(time * 1000).toISOString().slice(14, 19);
  }

  function formatPoint(point: number) {
    return point.toString().padStart(2, '\u2007').padEnd(3, '\u2007');
  }

  /*
  useInterval(tick, isPlaying && TICK_TIME);

  useInterval(
    () => setTime(t => t + 1),
    isPlaying && nextDirection !== '' && 1000
    );
*/
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>
        <Text style={styles.infoText}>Time = {formatTime(time)}</Text>
        <Pressable onPress={reset}>
          <Image source={require('./assets/reset.png')} style={styles.reset} />
        </Pressable>
        <Text style={styles.infoText}>Point = {formatPoint(point)}</Text>
      </View>
      <View style={styles.board}>
        <View
          style={{
            ...styles.bait,
            top: bait.y * STEP,
            left: bait.x * STEP,
          }}
        />

        {snake}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={{...styles.button, marginVertical: 2}}
          onPress={() => {
            if (currentDirection !== 'down')
              setNextDirection('up');
          }}>
          <Text style={styles.text}>Up</Text>
        </Pressable>
        <View style={styles.middleRow}>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (currentDirection !== 'right')
                setNextDirection('left');
            }}>
            <Text style={styles.text}>Left</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (currentDirection !== 'left')
                setNextDirection('right');
            }}>
            <Text style={styles.text}>Right</Text>
          </Pressable>
        </View>
        <Pressable
          style={{...styles.button, marginVertical: 2}}
          onPress={() => {
            if (currentDirection !== 'up')
              setNextDirection('down');
          }}>
          <Text style={styles.text}>Down</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 8,
    flex: 1,
    backgroundColor: Colors.dark,
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoText: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  reset: {
    tintColor: Colors.white,
    resizeMode: 'contain',
    height: 30,
    aspectRatio: 1,
  },

  board: {
    width: WIDTH,
    aspectRatio: 1,
    backgroundColor: Colors.grey,
    borderRadius: 8,
  },

  snakeNode: {
    width: STEP,
    borderRadius: 5,
    aspectRatio: 1,
    backgroundColor: Colors.purple,
    position: 'absolute',
  },

  bait: {
    width: STEP,
    borderRadius: STEP / 2,
    aspectRatio: 1,
    backgroundColor: Colors.green,
    position: 'absolute',
  },

  buttonContainer: {
    flex: 3,
  },

  button: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
  },

  middleRow: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 2,
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
});

export default App;
