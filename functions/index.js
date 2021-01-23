const functions = require('firebase-functions');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});


exports.getStoreFrontMenu = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.send("Can only post to this method");
    }

    // fetch menu data
    storeId = req.body.storeId;
    
    const db = admin.firestore()
    const sectionRef = await db.collection('menu').doc(storeId).collection("sections").get();

    const receivedData = sectionRef.docs.map((value, index, arr) => {
        console.log(value.data())
        return value.data()
    })

    //fetch store meta data (address, city, etc)
    const storeRef = await db.collection("store").doc(storeId).get()
    const storeData = storeRef.data()

    const returnData = {...storeData, ...receivedData}
    
    console.log(returnData)

    res.json(returnData);
});