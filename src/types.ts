export type FirebaseDocument = {
  id: string;
};

export type Item = {
  value: string | JSX.Element;
  votes: number;
};

export type ThisAndThatPair = {
  this: Item;
  that: Item;
  title: string;
  createdAt: firebase.firestore.FieldValue;
} & FirebaseDocument;

export type Options = "this" | "that";

// thisAndThatPairs={[
//   {
//     that: { votes: 0, value: "ABC" },
//     this: { votes: 0, value: "ABC" },
//     title: "ABC",
//     createdAt: serverTimestamp(),
//     id: "ABC",
//   },
// ]}
