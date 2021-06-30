import { flow, types } from 'mobx-state-tree';
import { omdbApiSingle } from '~/services/omdbapi';
import { Await } from '~/types/await';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Example of a Appwide Global Store
 */

const RootStore = types
  .model('RootStore', {
    userColorScheme: types.maybeNull(types.union(types.literal('light'), types.literal('dark'))),
    hydrated: false,
    favorites: types.map(types.model({ id: types.identifier })),
  })
  .actions((self) => ({
    setUserColorScheme(colorScheme: typeof self.userColorScheme | 'auto') {
      if (colorScheme === 'auto') {
        self.userColorScheme = null;
      } else {
        self.userColorScheme = colorScheme;
      }
    },
    addToFavorites: flow(function* addToFavorites(id: string) {
      try {
        const user = auth();
        if (user.currentUser) {
          const data: Await<ReturnType<typeof omdbApiSingle>> = yield omdbApiSingle(id);
          if (data) {
            const db = firestore();
            const doc = db.doc(`${user.currentUser.uid}/userdata/favorites/${data.imdbID}`);
            const fav = db.doc(`${user.currentUser.uid}/userdata`);
            yield Promise.all([
              doc.set(data, {
                merge: true,
              }),
              fav.set(
                {
                  favorites: firestore.FieldValue.arrayUnion(data.imdbID),
                },
                { merge: true }
              ),
            ]);

            self.favorites.put({ id: data.imdbID });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }),
    removeFromFavorites: flow(function* removeFromFavorites(id: string) {
      try {
        const user = auth();
        if (user.currentUser) {
          const db = firestore();
          const doc = db.doc(`${user.currentUser.uid}/userdata/favorites/${id}`);
          const fav = db.doc(`${user.currentUser.uid}/userdata`);
          yield Promise.all([
            doc.delete(),
            fav.set(
              {
                favorites: firestore.FieldValue.arrayRemove(id),
              },
              { merge: true }
            ),
          ]);

          self.favorites.delete(id);
        }
      } catch (error) {
        console.error(error);
      }
    }),
    hydrate: flow(function* hydrate() {
      try {
        const user = auth();
        if (user.currentUser) {
          const db = firestore();
          const fav = db.doc(`${user.currentUser.uid}/userdata`);
          const doc: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> =
            yield fav.get();

          const data = doc.data();

          if (data) {
            const { favorites } = data as { favorites?: string[] };

            if (favorites && favorites.length) {
              self.favorites.clear();
              favorites.forEach((value) => self.favorites.put({ id: value }));
            }
          }
        } else {
          self.favorites.clear();
        }
        self.hydrated = true;
      } catch (error) {
        console.error(error);
        self.hydrated = true;
      }
    }),
  }))
  .views((self) => ({
    get currentColorScheme() {
      if (self.userColorScheme) {
        return self.userColorScheme;
      }
      return 'auto';
    },
  }));

export default RootStore;
