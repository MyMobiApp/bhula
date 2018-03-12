import { Injectable } from '@angular/core';

import 'firebase/firestore';

/*
  Generated class for the FirestoreDBServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreDBServiceProvider {
  dbObj: any;

  constructor() {
    console.log('Hello FirestoreDBServiceProvider Provider');
  }

  initFirestoreDB(firebase: any) {
    let _me_ = this;

    _me_.dbObj = firebase.firestore();
    
    firebase.firestore().enablePersistence()
      .then(function () {
        // Initialize Cloud Firestore through firebase
        _me_.dbObj = firebase.firestore();
      })
      .catch(function (err) {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log("FirestoreDBServiceProvider failed-precondition");
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log("FirestoreDBServiceProvider unimplemented");
        }
      });
  }

  /**
    * Create the database collection and defines an initial document
    * Note the use of merge : true flag within the returned promise  - this
    * is needed to ensure that the collection is not repeatedly recreated should
    * this method be called again (we DON'T want to overwrite our documents!)
    *
    * @public
    * @method createAndPopulateDocument
    * @param  collectionObj    {String}           The database collection we want to create
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be added
    * @return {Promise}
    */
  createAndPopulateDocument(collectionObj: string,
                            docID: string,
                            dataObj: any): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.dbObj
        .collection(collectionObj)
        .doc(docID)
        .set(dataObj, { merge: true })
        .then((data: any) => {
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
  * Return documents from specific database collection
  *
  * @public
  * @method getDocuments
  * @param  collectionObj    {String}           The database collection we want to retrieve records from
  * @return {Promise}
  */
  getDocuments(collectionObj: string): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.dbObj.collection(collectionObj)
        .get()
        .then((querySnapshot) => {

          // Declare an array which we'll use to store retrieved documents
          let obj: any = [];


          // Iterate through each document, retrieve the values for each field
          // and then assign these to a key in an object that is pushed into the
          // obj array
          querySnapshot
            .forEach((doc: any) => {
              obj.push({
                id: doc.id,
                city: doc.data().city,
                population: doc.data().population,
                established: doc.data().established
              });
            });


          // Resolve the completed array that contains all of the formatted data
          // from the retrieved documents
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
  * Return documents from specific database collection
  *
  * @public
  * @method getDocumentWithID
  * @param  collectionObj    {String}           The database collection we want to retrieve records from
  * @param  docID            {String}           The document ID
  * @return {Promise}
  */
  getDocumentWithID(collectionObj: string, docID: string): Promise<any> {
    let _me_ = this;

    return new Promise((resolve, reject) => {
      _me_.dbObj.collection(collectionObj)
        .doc(docID)
        .get()
        .then((querySnapshot) => {
          let obj: any;

          if (querySnapshot.exists) {
              obj = querySnapshot.data();
              console.log("Document data:", querySnapshot.data());
          } else {
              // doc.data() will be undefined in this case
              obj = null;
              console.log("No such document!");
          }


          // Resolve the data that contains the formatted data
          // from the retrieved document
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
  * Add a new document to a selected database collection
  *
  * @public
  * @method addDocument
  * @param  collectionObj    {String}           The database collection we want to add a new document to
  * @param  docID            {String}           The document ID
  * @param  dataObj          {Any}              The key/value object we want to add
  * @return {Promise}
  */
  addDocument(collectionObj: string,
    docID: string,
    dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let _me_ = this;

      _me_.dbObj.collection(collectionObj).doc(docID).set(dataObj)
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
  * Delete an existing document from a selected database collection
  *
  * @public
  * @method deleteDocument
  * @param  collectionObj    {String}           The database collection we want to delete a document from
  * @param  docID            {Any}              The document we wish to delete
  * @return {Promise}
  */
  deleteDocument(collectionObj: string,
                docID: string): Promise<any> {
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.dbObj
        .collection(collectionObj)
        .doc(docID)
        .delete()
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
  * Update an existing document within a selected database collection
  *
  * @public
  * @method updateDocument
  * @param  collectionObj    {String}           The database collection to be used
  * @param  docID            {String}           The document ID
  * @param  dataObj          {Any}              The document key/values to be updated
  * @return {Promise}
  */
  updateDocument(collectionObj: string,
                docID: string,
                dataObj: any): Promise<any> {
    let _me_ = this;
    
    return new Promise((resolve, reject) => {
      _me_.dbObj
        .collection(collectionObj)
        .doc(docID)
        .update(dataObj)
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
