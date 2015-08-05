Template.body.onRendered(function() {
	document.querySelector('.container').classList.add('default');
});

// body helpers
Template.body.helpers({
	login: function() {
		document.body.classList.add('user');
		document.querySelector('.container').classList.remove('default');
	},
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

Template.body.events({
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
			setPlace(searchBar, autocomplete.getPlace());

			place = Session.get('place');

			if ( place ) {
				searchBar.value = place.name;
				address.value = place.vicinity;
			}
		});
	}
});

// reset default class names when logging out
Template.loginButtons.events({
	'click #login-buttons-logout': function() {
		document.querySelector('.container').classList.add('default');
		document.body.classList.remove('user');
	}
});

// count helpers
Template.count.helpers({
	showCount: function() {
		return Yums.find({checked: {$ne: true}}).count();
	},
	showCountIs: function(count) {
		var yumCount = Yums.find().count();
		return yumCount === count ? count === 1 || count === 0 ? true : false : false;
	}
});

// temporarily store place info in Session
function setPlace(el, place) {
	if ( place.place_id ) {
		var placeId = place.place_id;

		Session.set('place', place);
	} else {
		return;
	}
}
