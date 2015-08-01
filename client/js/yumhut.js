var yumhut = (function() {
	
	// init Yums collection
	Yums = new Mongo.Collection('yums');

	// watch the yums template for changes
	Meteor.subscribe('yums');

	// startup actions
	Meteor.startup(function() {
		Session.set('adding', false);
	});

	// body helpers
	Template.body.helpers({
		yums: function() {
			if ( Session.get('filtered') ) {
				return Yums.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			} else {
				return Yums.find({}, {sort: {createdAt: -1}});
			}
		}
	});

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
			} else {
				// otherwise, just give it a random unique id
				placeDetails.id = randomString(6);
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
		},
		'change .filter input': function(e) {
			Session.set('filtered', e.target.checked);
		},
		'click button.add': function(e) {
			e.preventDefault();

			// enter "add" mode
			Session.set('adding', true);
			var searchBar = document.getElementById('autocomplete'),
				address = document.getElementsByName('add_address')[0],
				place,
				autocomplete = new google.maps.places.Autocomplete(
					searchBar, {types: ['establishment'] }
				);

			// set up the Google Places search bar
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				setPlace(searchBar, autocomplete.getPlace());

				place = Session.get('place');

				if ( place ) {
					searchBar.value = place.name;
					address.value = place.formatted_address;
				}
			});
		},
		'click .new-yum button.cancel': function(e) {
			e.preventDefault();

			var el = document.getElementById('autocomplete');
			el.value = '';

			Session.set('adding', false);
		}
	});

	// count helpers
	Template.count.helpers({
		showCount: function() {
			return Yums.find({checked: {$ne: true}}).count();
		},
		showCountIs: function(count) {
			return Yums.find().count() === count;
		}
	});

	// when yums first load, exit edit mode
	Template.yum.onRendered(function() {
		Meteor.call('editYum', this.data._id, 'cancel');
	});

	// yum helpers
	Template.yum.helpers({
		isOwner: function() {
			return this.owner === Meteor.userId();
		},
		listFavs: function() {
			return this.favs.join('\n');
		}
	});

	// yum events
	Template.yum.events({
		// delete a yum
		'click .delete': function() {
			Meteor.call('deleteYum', this._id, this.username );
		},
		// enter "edit" mode
		'click .edit': function(e) {
			Meteor.call('editYum', this._id, 'edit');
			var parent = e.currentTarget.parentNode.parentNode,
				id = this.id,
				yumname = document.getElementsByName('editname_' + id)[0],
				address = document.getElementsByName('editaddress_' + id)[0],
				autocomplete = new google.maps.places.Autocomplete(
					yumname, {types: ['establishment'] }
				);

			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				setPlace(yumname, autocomplete.getPlace());

				place = Session.get('place');

				if ( place ) {
					yumname.value = place.name;
					address.value = place.formatted_address;
				}
			});
		},
		// cancel "edit" mode
		'click .cancel': function(e) {
			e.preventDefault();
			var parent = e.currentTarget.parentNode.parentNode,
				yumname = document.getElementsByName('editname_' + this.id)[0],
				address = document.getElementsByName('editaddress_' + this.id)[0];

			yumname.value = '';
			address.value = '';
			Session.set('place', null);
			Meteor.call('editYum', this._id, 'cancel');
		},
		// edit the yum
		'submit .edit-yum': function(e) {
			e.preventDefault();

			// retrieve autocomplete results
			var place = Session.get('place'),
				yumname = document.getElementsByName('editname_' + this.id)[0],
				address = document.getElementsByName('editaddress_' + this.id)[0],
				// favs = document.getElementsByName('editfavs_' + this.id)[0],
				notes = document.getElementsByName('editnotes_' + this.id)[0],
				placeDetails = {};

			// if there's a Google result, reset the id and geolocation
			if ( place ) {
				placeDetails.id = place.place_id;
				placeDetails.loc = place.geometry.location;
			} else {
				// otherwise, keep the same id and loc
				placeDetails.id = this.id;
				placeDetails.loc = this.loc;
			}

			placeDetails.name = yumname.value;
			placeDetails.address = address.value ? address.value : this.address;
			// placeDetails.favs = favs.value ? favs.value : this.favs;
			placeDetails.notes = notes.value ? notes.value : this.notes;

			// update the Yum{
			Meteor.call('updateYum', this._id, placeDetails, this.username);

			// clear form after submitting
			yumname.value = '';
			address.value = '';
			// favs.value = '';
			notes.value = '';

			// clear Session info after submitting
			Session.set('place', null);
		}
	});

	// config for accounts.ui package
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

	// temporarily store place info in Session
	setPlace = function(el, place) {
		if ( place.place_id ) {
			var placeId = place.place_id;

			Session.set('place', place);
		} else {
			return;
		}
	};

	function randomString(length) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < length; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}());
