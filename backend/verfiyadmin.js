import admin from "firebase-admin";
admin.initializeApp();
async function check(uid) {
  const token = await admin.auth().getUser(uid);
  console.log(token.customClaims);
}
check(process.argv[2]).catch(e=>console.error(e));
