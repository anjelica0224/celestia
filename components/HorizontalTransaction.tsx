import {Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const HorizontalTransaction = () => {
  // Creating an array of numbers from 0 to 5
  const data: number[] = [...new Array(6).keys()];

  // Array of colors to be used for the background of each item
  const colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
  ];

  // Function to render each item in the carousel
  const renderItem = ({item}: {item: number}) => {
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          justifyContent: 'center',
          backgroundColor: colors[item], // Assigning background color based on the index of the item
        }}>
        <Text style={{textAlign: 'center', fontSize: 30}}>{item}</Text> {/* Displaying the item number */}
      </View>
    );
  };

  return (
    <Carousel
      loop // Enables infinite looping of the carousel
      width={280} // Width of each item in the carousel
      height={200} // Height of the carousel
      data={data} // Data to be rendered in the carousel
      autoPlay // Automatically starts playing the carousel
      style={{
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      scrollAnimationDuration={10000000} // Duration of the scrolling animation
      onSnapToItem={(index: number) => console.log('current index:', index)} // Callback function triggered when an item is snapped to
      renderItem={renderItem} // Function to render each item in the carousel
    />
  );
};

export default HorizontalTransaction;