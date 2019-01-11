Henne Strand Camping app for Android and IOS.

First, make sure that the latest Node.js is installed (https://nodejs.org/en/).

Then check that you have the latest Ionic CLI and Cordova installed:

- $ npm install cordova ionic -g

Then run these commands in the root folder of the app:

- $ npm install
- $ ionic serve  (hvis den fejler med timeout, kør: npm run ionic:serve)
- $ ionic state restore

- $ npm run build --aot (to ensure that we get an aot-optimized build)
- $ ionic build android/ios --prod --release

If in doubt, consult the docs: http://ionicframework.com/docs/v1/guide/publishing.html

one-liner for signed .apk:
ionic build android --release -- --keystore="./hscamping.keystore" --storePassword=hscamping42 --alias=hscamping --password=hscamping42

for ios these installs are needed:

npm install -g ios-sim
npm install -g ios-deploy --unsafe-perm=true

NB! for ios, a "sudo" prefix may be needed (i.e. sudo npm install...)

"ionic resources" may need to be run to ensure that the correct resources are available to the build.

----

Ionic Cloud Build (https://docs.ionic.io/services/package/):

- make sure that the www folder contains "google-services.json" and "GoogleService-Info.plist" - they can be copied to the www folder from the root dir.

- run "npm run build --aot" (to ensure that we get an aot-optimized build)

- then:

ionic package build android --profile hscamping_prod --release
or
ionic package build ios --profile hscamping_prod --release

- ionic package download BUILD_ID (after the service has produced the .apk/.ipa (usually < 30sec) - type "ionic package list" and
"ionic package info BUILD_ID" for more info).




Ekstra:
Downgrade version af ionic:
npm i -g ionic@3.19.0
