const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.selectPhotoOfTheDay = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    // Reference to the photos collection
    const photosRef = db.collection('photos');
    
    // Query to get the photo with the highest votes
    const snapshot = await photosRef.orderBy('votes', 'desc').limit(1).get();

    if (snapshot.empty) {
      console.log('No photos found');
      return null;
    }

    // Get the top photo
    const photo = snapshot.docs[0];
    const photoData = photo.data();

    // Add the winner to the winners collection
    await db.collection('winners').add({
      photoId: photo.id,
      photoUrl: photoData.url,
      votes: photoData.votes,
      userId: photoData.userId, // Ensure userId is available in photo data
      selectedAt: admin.firestore.Timestamp.now(),
    });

    console.log(`Photo of the day selected: ${photoData.url}`);
    return null;
  } catch (error) {
    console.error('Error selecting photo of the day:', error);
    return null;
  }
});
