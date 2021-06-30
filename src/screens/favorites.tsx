import auth from '@react-native-firebase/auth';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, Text, TouchableRipple } from 'react-native-paper';
import { Edge } from 'react-native-safe-area-context';
import CustomHeader from '~/components/custom-header';
import FixedContainer from '~/components/fixed-container';
import useFirestoreCollection from '~/hooks/use-firestore-collection';
import { BottomTabScreenProps } from '~/navigators/bottom-tab';
import { useRootStore } from '~/stores/store-setup';
import { SingleMovie } from '~/types/omdbapi';

const edges: Edge[] = ['right', 'left'];

interface MovieCardProps {
  item: SingleMovie;
  remove: (id: string, title: string) => void;
}

const MovieCard = ({ item, remove }: MovieCardProps) => {
  const [expended, setExpended] = useState(false);
  return (
    <Card style={styles.card}>
      <View>
        <Card.Cover style={styles.poster} source={{ uri: item.Poster }} />
        <View style={styles.metadata}>
          <Text style={styles.whiteText}>{item.Ratings[0].Value}</Text>
          <Text style={styles.whiteText}>{item.Released}</Text>
          <Text style={styles.whiteTextBold}>{item.Genre}</Text>
        </View>
      </View>
      <Card.Title title={item.Title} subtitle={item.Year} />
      <Card.Content>
        <TouchableRipple onPress={() => setExpended(!expended)}>
          <Paragraph numberOfLines={expended ? undefined : 3}>{item.Plot}</Paragraph>
        </TouchableRipple>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => remove(item.imdbID, item.Title)}>Remove from Favorites</Button>
      </Card.Actions>
    </Card>
  );
};

const Favorites = observer<BottomTabScreenProps<'Favorites'>>(({ navigation }) => {
  const uid = useMemo(() => auth().currentUser?.uid ?? '', []);
  const [limit, setLimit] = useState(10);
  const [data] = useFirestoreCollection<SingleMovie>(`${uid}/userdata/favorites`, limit);
  const loadMore = useCallback(() => setLimit((l) => l + 10), []);
  const { removeFromFavorites } = useRootStore();

  const remove = useCallback(
    (id: string, title: string) => {
      Alert.alert(
        `Remove ${title} from favorites?`,
        'Do you really want to remove this item from your favorite list?',
        [
          { text: 'Remove', style: 'destructive', onPress: () => removeFromFavorites(id) },
          { text: 'Keep' },
        ]
      );
    },
    [removeFromFavorites]
  );

  return (
    <FixedContainer edges={edges}>
      <CustomHeader
        onLeftMenuPress={navigation.toggleDrawer}
        title="Favorites"
        subtitle="Your Favorite Movies"
      />
      <FlatList
        onEndReached={loadMore}
        data={data}
        renderItem={({ item }) => <MovieCard item={item} remove={remove} />}
        keyExtractor={(item) => item.imdbID}
      />
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  poster: {
    height: 500,
  },
  metadata: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  whiteText: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  whiteTextBold: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Favorites;
