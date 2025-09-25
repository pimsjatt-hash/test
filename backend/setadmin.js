// setAdmin.js
import admin from "firebase-admin";

// Initialize with your Firebase project credentials
admin.initializeApp();

// Replace <UID> with the actual Firebase Auth UID of the user
const uid = "<UID>";  // <-- insert real UID here

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin claim set for UID: ${uid}`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error setting claim:", err);
    process.exit(1);
  });
