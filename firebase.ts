import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5U4kE16q7wiu0gQqKJEakLTQ8nZaQGFA",
  authDomain: "scentsationz.firebaseapp.com",
  projectId: "scentsationz",
  storageBucket: "scentsationz.firebasestorage.app",
  messagingSenderId: "949470920218",
  appId: "1:949470920218:web:86a276977b83c3816b9ba3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

/**
 * Enhanced stability for Firestore connection.
 * experimentalForceLongPolling is critical for 
 * reliability in environments with aggressive proxies or network timeouts.
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

import { getDocFromServer, doc } from "firebase/firestore";

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: The client is offline. Please check your Firebase configuration or project provisioning.");
    } else {
      console.error("Firestore connection test error:", error);
    }
  }
}

testConnection();
