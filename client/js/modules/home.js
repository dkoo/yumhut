Template.home.helpers({
	yums: function() {
		if ( Session.get('filtered') ) {
			return Yums.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
		} else {
			return Yums.find({}, {sort: {createdAt: -1}});
		}
	},
	adding: function() {
		return Session.get('adding');
	},
	deleting: function() {
		return Session.get('deleting');
	}
});

Template.home.events({
	'click button.add': function(e) {
		e.preventDefault();

		document.body.classList.add('overflow');

		// enter "add" mode
		Session.set('adding', true);
		var searchBar = document.getElementById('autocomplete'),
			address = document.getElementsByName('add_address')[0],
			favs = document.getElementsByName('add_favs')[0],
			notes = document.getElementsByName('add_notes')[0],
			place,
			autocomplete = new google.maps.places.Autocomplete(
				searchBar, {types: ['establishment'] }
			);

		searchBar.value = '';
		address.value = '';
		favs.value = '';
		notes.value = '';

		// set up the Google Places search bar
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			Meteor.utils.setPlace(autocomplete.getPlace());

			place = Session.get('place');

			if ( place ) {
				searchBar.value = place.name;
				address.value = place.vicinity;
			}
		});
	}
});