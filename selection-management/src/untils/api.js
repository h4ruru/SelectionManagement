import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const selectionCollectionRef = collection(db, "selections");

export const addSelection = async (selection) => {
  await addDoc(selectionCollectionRef, selection);
};

export const getSelections = async () => {
  const snapshot = await getDocs(selectionCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateSelection = async (id, updates) => {
  const selectionDoc = doc(db, "selections", id);
  await updateDoc(selectionDoc, updates);
};

export const deleteSelection = async (id) => {
  const selectionDoc = doc(db, "selections", id);
  await deleteDoc(selectionDoc);
};
