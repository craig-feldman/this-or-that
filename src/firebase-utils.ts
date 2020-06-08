import { db } from "./firebase";

export type FirebaseDocument = {
  id: string;
};

const constructFromQuerySnapshot = <T extends FirebaseDocument>(
  qs: firebase.firestore.QuerySnapshot
) => {
  const results: T[] = [];

  qs.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data();
    const castData = data as T;
    castData.id = doc.id;

    results.push(castData);
  });

  return results;
};

const getDocumentsFromFirestoreViaPath = async <T extends FirebaseDocument>(
  collectionPath: string,
  orderBy?: [Extract<keyof T, string>, ("desc" | "asc" | undefined)?]
) => {
  const collRef = orderBy
    ? db.collection(collectionPath).orderBy(...orderBy)
    : db.collection(collectionPath);

  const querySnapshot = await collRef.get();

  return constructFromQuerySnapshot<T>(querySnapshot);
};

export { getDocumentsFromFirestoreViaPath };
