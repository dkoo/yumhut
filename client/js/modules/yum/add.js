// add yum helpers
Template.add.helpers({
	adding: function() {
		return Session.get('adding');
	},
	filtered: function() {
		return Session.get('filtered');
	}
});

// add yum events
Template.add.events({
	'submit .new-yum': function(e) {
		e.preventDefault();

		// enter add mode
		Session.set('adding', true);

		// retrieve autocomplete results
		var place = Session.get('place'),
			placeDetails = {};

		// if there was a Google place result
		if ( place ) {
			placeDetails.id = place.place_id;
			placeDetails.loc = place.geometry.location;
		}

		// get the inputted values
		placeDetails.name = e.target.add_name.value;
		placeDetails.address = e.target.add_address.value;
		placeDetails.favs = e.target.add_favs.value;
		placeDetails.notes = e.target.add_notes.value;

		// add the Yum{
		Meteor.call('addYum', placeDetails);

		// clear after submitting
		e.target.name.value = '';

		// delete Session info after submitting
		Session.set('place', null);
		Session.set('adding', false);
	},
	'change .filter input': function(e) {
		Session.set('filtered', e.target.checked);
	},
	'click .new-yum button.cancel': function(e) {
		e.preventDefault();

		var el = document.getElementById('autocomplete');
		el.value = '';

		Session.set('adding', false);
		document.body.classList.remove('overflow');
	}
});