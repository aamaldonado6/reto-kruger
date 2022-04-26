// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /*propiedad para configurar la base de datos*/
  firestore: {
    apiKey: "AIzaSyBziIiyeL_r-RzVCGwS2bDe_F-nSjsDpGg",
    authDomain: "angulardemo-48db8.firebaseapp.com",
    databaseURL: "https://angulardemo-48db8-default-rtdb.firebaseio.com",
    projectId: "angulardemo-48db8",
    storageBucket: "angulardemo-48db8.appspot.com",
    messagingSenderId: "54379298042",
    appId: "1:54379298042:web:59b41bc6eff04aee3edd43",
    measurementId: "G-RF2R91G544"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
