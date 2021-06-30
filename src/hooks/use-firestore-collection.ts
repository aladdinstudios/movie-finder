import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

export type Collection<T extends Record<string, any>> = T;

export type Where = [string, FirebaseFirestoreTypes.WhereFilterOp, string];

const useFirestoreCollection = <T extends Record<string, any>>(
  path: string,
  limit = 10,
  where?: Where
) => {
  const db = useMemo(() => firestore(), []);

  const query = useMemo(() => {
    if (where) {
      return db
        .collection(path)
        .where(...where)
        .orderBy('Title', 'desc')
        .limit(limit);
    }
    return db.collection(path).orderBy('Title', 'desc').limit(limit);
  }, [db, limit, path, where]);

  const ref = useMemo(() => {
    return db.collection(path);
  }, [db, path]);

  const [data, setData] = useState<Collection<T>[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const unsubscribe = query.onSnapshot(
      (coll) =>
        setData(
          coll.docs.map((v) => ({
            ...(v.data() as Collection<T>),
          }))
        ),
      (err) => setError(err)
    );
    return () => {
      unsubscribe();
    };
  }, [query]);

  return [data, error, query, ref] as const;
};

export default useFirestoreCollection;
