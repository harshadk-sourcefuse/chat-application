// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: "http://localhost:3000",
  AUTH_URL: "http://localhost:3001",
  PUBNUB_SUBSCRIBE_KEY: "sub-c-684dfcc4-761b-4b22-829b-d5be419f0d5d",
  PUBNUB_PUBLISH_KEY: "pub-c-39b01215-950b-4d5f-acba-7ce2f61e12d5",
  PUBNUB_SECRET_KEY: "sec-c-NTY3ZjQzNDUtNzVkOC00MTljLTgyM2ItYWMyNmI3YzA0YTEx",
  // PUBNUB_SSL:true,
  // PUBNUB_LOG_VERBOSITY:true,
  PUBNUB_UUID: 'chat-app',
  CLIENT_ID: 'avengers',
  CLIENT_SECRET: 'avengers'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
