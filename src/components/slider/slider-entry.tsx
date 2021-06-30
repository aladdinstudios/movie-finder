import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, overlay, Text, useTheme } from 'react-native-paper';
import { AdditionalParallaxProps, ParallaxImage } from 'react-native-snap-carousel';
import { useRootStore } from '~/stores/store-setup';
import { Search } from '~/types/omdbapi';

interface SliderEntryProps {
  data: Search;
  index: number;
  total: number;
  parallaxProps?: AdditionalParallaxProps;
}

const SliderEntry = observer<SliderEntryProps>(({ data, parallaxProps }) => {
  const { colors } = useTheme();
  const { favorites, addToFavorites, removeFromFavorites } = useRootStore();

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.slideInnerContainer, { backgroundColor: overlay(5, colors.surface) }]}
      onPress={() => console.log(`You've clicked '${data.Title}'`)}
    >
      <View style={styles.shadow} />
      <View style={styles.imageContainer}>
        <ParallaxImage
          source={{ uri: data.Poster }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={'rgba(0, 0, 0, 0.25)'}
          {...parallaxProps}
        />
        <View style={styles.radiusMask} />
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {data.Title}
        </Text>
        <Text style={styles.year}>({data.Year})</Text>
      </View>
      <View style={styles.favorite}>
        {favorites.has(data.imdbID) ? (
          <IconButton
            size={40}
            color={colors.notification}
            onPress={() => removeFromFavorites(data.imdbID)}
            icon="heart"
          />
        ) : (
          <IconButton
            size={40}
            color={colors.notification}
            onPress={() => addToFavorites(data.imdbID)}
            icon="heart-outline"
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideHeight = viewportHeight * 0.7;
const slideWidth = wp(84);
const itemHorizontalMargin = wp(1);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
    overflow: 'hidden',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: '#1a1917',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
  },
  textContainer: {
    alignItems: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 5,
    flex: 1,
  },
  year: {
    fontWeight: 'bold',
  },
  favorite: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    aspectRatio: 1,
    backgroundColor: 'rgba(222, 222, 222, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default SliderEntry;
