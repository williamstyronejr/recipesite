import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  // deleteObject,
} from 'firebase/storage';

const {
  FIREBASE_API,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = process.env;

const firebaseApp = initializeApp({
  apiKey: FIREBASE_API,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
});

const storage = getStorage(firebaseApp);

export async function uploadFirebaseFile(
  file: any,
  fileName: string,
  contentType: string,
  path = ''
) {
  if (!file) throw new Error('No file was provided');

  const storageRef = ref(storage, `${path}/${fileName}`);
  await uploadBytes(storageRef, file, {
    contentType,
  });

  const fileUrl = await getDownloadURL(storageRef);

  return {
    name: fileName,
    url: fileUrl,
    fieldName: file.fieldname,
  };
}
