// src/utils/api.js
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Authenticationをインポート

const getUserUID = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export const addSelection = async (selection) => {
  const uid = getUserUID();
  if (!uid) {
    throw new Error("User not authenticated");
  }

  const userSelectionsRef = collection(db, "users", uid, "selections");
  await addDoc(userSelectionsRef, selection);
};

export const getSelections = async () => {
  const uid = getUserUID();
  if (!uid) {
    throw new Error("User not authenticated");
  }

  const userSelectionsRef = collection(db, "users", uid, "selections");
  const snapshot = await getDocs(userSelectionsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateSelection = async (id, updates) => {
  const uid = getUserUID();
  if (!uid) {
    throw new Error("User not authenticated");
  }

  const userSelectionRef = doc(db, "users", uid, "selections", id);
  await updateDoc(userSelectionRef, updates);
};

export const deleteSelection = async (id) => {
  const uid = getUserUID();
  if (!uid) {
    throw new Error("User not authenticated");
  }

  const userSelectionRef = doc(db, "users", uid, "selections", id);
  await deleteDoc(userSelectionRef);
};
