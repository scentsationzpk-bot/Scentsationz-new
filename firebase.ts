import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5U4kE16q7wiu0gQqKJEakLTQ8nZaQGFA",
  authDomain: "scentsationz.firebaseapp.com",
  projectId: "scentsationz",
  storageBucket: "scentsationz.firebasestorage.app",
  messagingSenderId: "949470920218",
  appId: "1:949470920218:web:86a276977b83c3816b9ba3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Enhanced stability for Firestore connection.
 * experimentalForceLongPolling and useFetchStreams: false are critical for 
 * reliability in environments with aggressive proxies or network timeouts.
 */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ 
    tabManager: persistentMultipleTabManager() 
  }),
  experimentalForceLongPolling: true,
  useFetchStreams: false
});