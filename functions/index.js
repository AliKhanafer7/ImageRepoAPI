const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
var serviceAccount = require("./permissions.json");
var jsonValidation = require("./jsonSchema");
const { firestore } = require('firebase-admin');
const fs = require('fs');

app.use(cors({ origin: true }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-api-9a206..firebaseio.com",
    storageBucket: "gs://imagerepository-b7a29.appspot.com"
});


const db = admin.firestore();
var bucket = admin.storage().bucket();

// get images based on image keywords
app.get('/api/search/images/:keywords', (req, res) => {
    (async () => {
        try {
            var response = []
            await db.collection('images')
            .where("keywords","array-contains-any",JSON.parse(req.params.keywords))
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    response.push(documentSnapshot.data());
                })
            })
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })();
});

// get images based on image colors
app.get('/api/search/images/colors/:colors', (req, res) => {
    (async () => {
        try {
            var response = []
            await db.collection('images')
            .where("colors","array-contains-any",JSON.parse(req.params.colors))
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    response.push(documentSnapshot.data());
                })
            })
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })();
});

// get images based on image colors
app.get('/api/search/images/photographerName/:photographerName', (req, res) => {
    (async () => {
        try {
            var response = []
            await db.collection('images')
            .where("photographerName","==",req.params.photographerName)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    response.push(documentSnapshot.data());
                })
            })
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })();
});

// get images based on a similar image
app.get('/api/search/images/similarImage/:similarImage', (req, res) => {
    (async () => {
        try {
            var response = []
            await db.doc("images/" + req.params.similarImage)
            .get()
            .then(async querySnapshot => {
                await db.collection("images")
                .where("keywords","array-contains-any",querySnapshot.data().keywords)
                .get()
                .then(snapshot => {
                    snapshot.forEach(snapshotValue => {
                        response.push(snapshotValue.data())
                    })
                })               
            })
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })();
});

// adds an image to the repository
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            //Validate JSON
            jsonValidation(req.body)

            //Add image metadata to firestore
            await db.collection('images').doc('/' + req.body.imageName + '/')
                .create({ image: req.body });


            //Add actual image to cloud storage
            await bucket.upload("/Users/alikhanafer/Desktop/testimage.png", {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                // By setting the option `destination`, you can change the name of the
                // object you are uploading to a bucket.
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                },
            })
            return res.status(200).send();
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.errors[0].stack);
        }
    })();
});


exports.app = functions.https.onRequest(app);