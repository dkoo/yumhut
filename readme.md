# Yumhut

A minimalist dining journal to keep track of all the places that make you go “yum.” Uses the [Google Places API](https://developers.google.com/maps/documentation/javascript/places) to fetch metadata such as addresses and geolocations.

To run:

* Clone this repository
* `$ cd yumhut/tests` and run `npm install`
* Run `gulp` to watch for SCSS changes and compile CSS
  - Or, just run `gulp build` to compile
* rename /client/js/lib/googlePlaces_DEFAULT.js to /client/js/lib/googlePlaces.js
* [Get a Google Maps API key](https://developers.google.com/maps/documentation/javascript/tutorial#api_key) and copy it into /client/js/lib/googlePlaces.js
* Run `meteor` to start the local dev server.
* Access the app at [http://localhost:3000](http://localhost:3000)

A demo is deployed at http://app.yumhut.com. Please note that it may not be completely up-to-date with this repository.