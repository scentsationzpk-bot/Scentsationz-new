import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.ts';

async function run() {
  await deleteDoc(doc(db, 'products', 'velvet-night'));
  console.log('Deleted Velvet Night');
  await deleteDoc(doc(db, 'products', 'urban-edge'));
  console.log('Deleted Urban Edge');
  process.exit(0);
}
run();
