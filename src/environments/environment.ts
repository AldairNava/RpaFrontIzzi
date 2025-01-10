// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
	API_URL: 'https://rpabackizzi.azurewebsites.net/',
    // API_URL: 'https://10.251.58.11/api/',
    // API_URL: "https://localhost:44372/",
    SCOCKET_URL: 'https://rpabackizzi.azurewebsites.net:3000',
    user: 'mavilas@sky.com.mx',
    password: 'mik4asa2022/',
    postLogoutUrl:"http:localhost:4200"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
