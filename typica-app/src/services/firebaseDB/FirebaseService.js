import { initializeApp } from 'firebase/app';
import {firebaseConfig} from "./firebaseConfig.js"
import { initializeFirestore , persistentLocalCache,persistentMultipleTabManager,getDocsFromCache,getDocFromCache, collection, getDocs,addDoc,deleteDoc, updateDoc ,runTransaction,doc,getDoc,query, where } from 'firebase/firestore';
const app = initializeApp(firebaseConfig);
//const db = getFirestore(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 524*1024*1024,
    useFetchStreams: true,
    tabManager: persistentMultipleTabManager(),
  }),
});

/*
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});*/



/*
export async function getData(nameCollection) {
  const dataCollection = collection(db, nameCollection);
  const querySnapshot = await getDocs(dataCollection);
  const dataArray = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return dataArray;
}*/
export async function getData(nameCollection) {
  const dataCollection = collection(db, nameCollection);
  // Try to get data from cache
  const querySnapshot = await getDocsFromCache(dataCollection);
  const dataArray = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  if(dataArray.length>0)
  {
    console.log("Data cache available");
    return dataArray;
  }
  else{
    console.log("Cache not available, fetching from server");
    const querySnapshot = await getDocs(dataCollection);
    const dataArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return dataArray;
  }
}

export async function saveData(nameCollection, data) {
  try {
    const dataCollection = collection(db, nameCollection);
    const docRef = await addDoc(dataCollection, data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function editData(nameCollection, docId, newData) {
  try {
    const docRef = doc(db, nameCollection, docId);
    await updateDoc(docRef, newData);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

export async function deleteData(nameCollection, docId) {
  try {
    const docRef = doc(db, nameCollection, docId);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

export const incrementValue = async (nameCollection, docId, fieldToIncrement, iValue) => {
  try {
    const docRef = doc(db, nameCollection, docId);
    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);
      if (!docSnapshot.exists()) {
        throw new Error("Document does not exist!");
      }
      // Get the current value or default to 0
      let currentValue = docSnapshot.data()[fieldToIncrement] || 0;
      // Increment the value
      currentValue+=iValue;
      // Update the document within the transaction
      transaction.update(docRef, { [fieldToIncrement]: currentValue });
    });
    await getDoc(docRef);
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
};
//await getDoc(docRef);
export const decrementValue = async (nameCollection, docId, fieldToIncrement, dValue) => {
  try {
    const docRef = doc(db, nameCollection, docId);
    await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(docRef);
      if (!docSnapshot.exists()) {
        throw new Error("Document does not exist!");
      }
      // Get the current value or default to 0
      let currentValue = docSnapshot.data()[fieldToIncrement] || 0;
      // Decrese the value
      currentValue-=dValue;
      // Update the document within the transaction
      transaction.update(docRef, { [fieldToIncrement]: currentValue });
    });
    await getDoc(docRef);
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
};

export async function getItem(nameCollection, docId) {
  const docRef = doc(db, nameCollection, docId);
  const docSnapshot = await getDocFromCache(docRef);
  if (docSnapshot.exists()) {
    console.log("doc fetched from cache.");
    return docSnapshot.data();
  } 
  else 
  {
    console.log("Cache not available, fetching from server");
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  } 
  
 
}

/*
export async function getItem(nameCollection, docId) {
  try {
    const docRef = doc(db, nameCollection, docId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();  // Return the document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}*/

export async function deleteItemAndRes(collectionName, registersName, itemId) {
  try {
    // Step 1: Query movements linked to the product
    const movementsCollection = collection(db, registersName);  // Your collection name for movements
    const q = query(movementsCollection, where("idP", "==", itemId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = doc(db, registersName, docSnapshot.id);
      await deleteDoc(docRef);  // Delete the document
    });
    // Step 3: Delete the product itself
    const productRef = doc(db, collectionName, itemId);  // Your products collection
    await deleteDoc(productRef);

  } catch (e) {
    console.error("Error deleting product and movements: ", e);
  }
}

export async function getVendedorPorDefecto() {
  const docRef = doc(db, "DatosEstaticos", "keyDefaultSeller");
  try {
    let docSnapshot = await getDocFromCache(docRef);
    return docSnapshot.data();
  } catch (e) {
    console.log("Default seller not found in cache, fetching from server");
    let docSnapshot = await getDoc(docRef);
    return docSnapshot.data();
  }
}

export async function getNroVenta() {
  const docRef = doc(db, "DatosEstaticos", "keyNroVenta");
  try {
    // Attempt to get document from cache first
    let docSnapshot = await getDocFromCache(docRef);
    return docSnapshot.data() ;

  } catch (e) {
    console.log("NroVenta not found in cache, fetching from server");
    let docSnapshot = await getDoc(docRef);
    return docSnapshot.data() ;
  }
}

export async function getCategoriaProductos() {
  const docRef = doc(db, "DatosEstaticos", "keyCategoria");
  try {
    // Attempt to get document from cache first
    let docSnapshot = await getDocFromCache(docRef);
    return docSnapshot.data();
  } catch (e) {
    console.log("Categoria not found in cache, fetching from server");
    let  docSnapshot = await getDoc(docRef);
    return docSnapshot.data();
  }
}


/*
export async function getVendedorPorDefecto() {
  try {
    const docRef = doc(db, "DatosEstaticos", "keyDefaultSeller");
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();  // Return the document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}

export async function getNroVenta() {
  try {
    const docRef = doc(db, "DatosEstaticos", "keyNroVenta");
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();  // Return the document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}
export async function getCategoriaProductos() {
  try {
    const docRef = doc(db, "DatosEstaticos", "keyCategoria");
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();  // Return the document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}*/