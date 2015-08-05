# Yumhut

Yumhut is a demo app I wrote to get a feel for [Meteor](https://www.meteor.com/). The idea for a minimalist shared dining journal came about because of how often my friends and I kept forgetting the places we ate at together in our cities and while traveling.

Currently, users can create accounts and documents of places with some metadata (address, favorite items, and notes). The app uses the Google Maps API and Google Places library to autocomplete place names and look up their address and geolocation info when adding or editing places. Google’s place IDs are stored in the app and could be used to associate documents about the same place across user accounts. Places don’t need to have an existing Google entry, so that users can create custom places. A basic demo with this basic functionality is located [here](http://app.yumhut.com/). A test account exists: tester / solstice

Features I’d like to implement include:

* Filtering/sorting based on different criteria (common favs, address, location, starred entries, etc.)
* Drag-and-drop functionality for custom sort orders
* Address autocomplete and geolocation tagging for custom places
* A 'radar' function to show only records within a certain distance of the user’s given location, with filtering
* Social features such as user profiles, the ability to friend other users, view their places, and view their favs and notes on places you've saved
* Public/private switches by account and per document
* More formatted notes and a different view for longer descriptions
* Permalinks for each place
* Google Map and sortable list views