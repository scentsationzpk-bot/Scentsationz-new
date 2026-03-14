import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const updateProducts = async () => {
  try {
    await updateDoc(doc(db, 'products', 'starborn'), {
      description: 'Ek zabardast aur taqatwar khushboo. Har mehfil mein apni alag pehchaan banayein.',
      luxuryStory: 'Starborn aapki kamyabi aur taqat ki pehchaan hai.',
    });
    console.log('Updated starborn');

    await updateDoc(doc(db, 'products', 'tobacco-trail'), {
      description: 'Tobacco aur vanilla ka behtareen premium blend. Sardiyon ki raaton ke liye sab se behtareen.',
      luxuryStory: 'Tobacco Trail ek private cigar lounge ke shandar safar ka ehsaas hai.',
    });
    console.log('Updated tobacco-trail');

    await updateDoc(doc(db, 'products', 'cool-current'), {
      description: 'Rozana lagane ke liye ek taaza aur energetic khushboo. Din bhar fresh aur active rahein.',
      luxuryStory: 'Cool Current ek thandi aur taaza hawa ka jhonka hai.',
    });
    console.log('Updated cool-current');

    await updateDoc(doc(db, 'bundles', 'vault-duo'), {
      description: 'Hamari Reserved collection se din aur raat ke liye behtareen combo chunein.',
    });
    console.log('Updated vault-duo');

    console.log('All products updated successfully.');
  } catch (error) {
    console.error('Error updating products:', error);
  }
};

updateProducts();
