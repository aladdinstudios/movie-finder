import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import useAsyncEffect from 'use-async-effect';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import SliderEntry, { itemWidth, slideHeight, sliderWidth } from '~/components/slider/slider-entry';
import { useDebounce } from '~/hooks/use-debounce';
import { BottomTabScreenProps } from '~/navigators/bottom-tab';
import { omdbApiSearch } from '~/services/omdbapi';
import { Search } from '~/types/omdbapi';
import SkeletonContent from 'react-native-skeleton-content';
import randomWords from 'random-words';

const edges: Edge[] = ['right', 'left'];

const Home = observer<BottomTabScreenProps<'Home'>>(({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<Search[]>([]);

  const searchTerm = useDebounce(searchQuery, 500);

  useAsyncEffect(
    async (isMounted) => {
      try {
        if (!searchTerm) {
          return;
        }
        setLoading(true);
        const res = await omdbApiSearch(searchTerm);
        if (!isMounted() || !res) {
          return;
        }
        setResults(res.Search);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
    [searchTerm]
  );

  useAsyncEffect(async (isMounted) => {
    try {
      setLoading(true);
      const res = await omdbApiSearch(randomWords());
      if (!isMounted() || !res) {
        return;
      }
      setResults(res.Search);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  return (
    <FixedContainer edges={edges}>
      <CustomHeader
        onLeftMenuPress={navigation.toggleDrawer}
        title="Movie Finder"
        subtitle="Movie Discovery Service"
      />
      <Searchbar
        style={styles.searchBar}
        placeholder="Search for movie, tv series etc"
        onChangeText={setSearchQuery}
        value={searchQuery}
        clearIcon="close"
      />
      <SkeletonContent
        containerStyle={styles.loader}
        isLoading={loading}
        layout={[
          {
            key: 'someId',
            borderRadius: 8,
            alignSelf: 'center',
            height: slideHeight,
            width: itemWidth,
          },
        ]}
      >
        <Carousel
          data={results}
          renderItem={({ item, index }, parallaxProps) => (
            <SliderEntry
              data={item}
              index={index}
              total={results.length}
              parallaxProps={parallaxProps}
            />
          )}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={4000}
          vertical={false}
        />
      </SkeletonContent>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  slider: {
    overflow: 'visible',
  },
  sliderContentContainer: {},
  searchBar: {
    margin: 10,
    paddingLeft: 12,
    paddingRight: 18,
  },
  loader: {
    flex: 1,
  },
});

export default Home;
