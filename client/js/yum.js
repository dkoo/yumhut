// when yums first load, exit edit mode
Template.yum.onRendered(function() {
	Meteor.call('editYum', this.data._id, 'cancel');
	Meteor.call('deleting', this.data._id, 'cancel');
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

// yum helpers
Template.yum.helpers({
	isOwner: function() {
		return this.owner === Meteor.userId();
	},
	countFavs: function() {
		return this.favs[0] ? true : false;
	},
	showFavs: function() {
		return this.favs;
	},
	listFavs: function() {
		return this.favs.join('\n');
	}
});

// yum events
Template.yum.events({
	// enter "edit" mode
	'click .edit': function(e) {
		e.preventDefault();
		Meteor.call('editYum', this._id, 'edit');
		var parent = e.currentTarget.parentNode.parentNode,
			id = this.id,
			yumname = document.getElementsByName('editname_' + id)[0],
			address = document.getElementsByName('editaddress_' + id)[0],
			notes = document.getElementsByName('editnotes_' + id)[0],
			autocomplete = new google.maps.places.Autocomplete(
				yumname, {types: ['establishment'] }
			);

		yumname.value = this.name;
		address.value = this.address;
		notes.value = this.notes;

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			setPlace(yumname, autocomplete.getPlace());

			place = Session.get('place');

			if ( place ) {
				yumname.value = place.name;
				address.value = place.vicinity;
			}
		});
	},
	// add a fav
	'click .addfav': function(e) {
		e.preventDefault();

		var id = this._id,
			placeId = this.id,
			favs = this.favs || [],
			input = document.getElementsByName('fav_' + placeId)[0],
			newFav = input.value;

		if ( newFav ) {
			favs.push(newFav);
			Meteor.call('updateFavs', id, favs, this.username);
			input.value = '';
		}

		input.focus();
	},
	// delete a fav
	'click .deletefav': function(e) {
		e.preventDefault();

		var doc = Template.instance().data,
			id = doc._id,
			favs = doc.favs,
			thisFav = this.valueOf(),
			newFavs = [];

		if ( favs ) {
			for ( var i = 0, len = favs.length; i < len; i++ ) {
				if ( thisFav !== favs[i] ) {
					newFavs.push(favs[i]);
				}
			}
			Meteor.call('updateFavs', id, newFavs, doc.username);
		}
	},
	// delete a yum
	'click .delete': function(e) {
		e.preventDefault();

		document.body.classList.add('overflow');
		Meteor.call('deleting', this._id, 'delete');
		Session.set('deleting', true);
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

		placeDetails.name = yumname.value ? yumname.value : this.name;
		placeDetails.address = address.value ? address.value : this.address;
		placeDetails.notes = notes.value ? notes.value : this.notes;

		// update the Yum{
		Meteor.call('updateYum', this._id, placeDetails, this.username);

		// clear form after submitting
		yumname.value = '';
		address.value = '';
		notes.value = '';

		// clear Session info after submitting
		Session.set('place', null);
	}
});

Template.delete.onRendered(function() {
	var modal = document.querySelector('.deleteme'),
		sizeModal = function(el) {
			var scrolled = document.body.scrollTop,
				viewportY = window.innerHeight;

			el.style.cssText = 'height: ' + viewportY + 'px; margin-top: ' + scrolled + 'px;';
		};

	// size and center the modal
	sizeModal(modal);

	// resize and recenter the modal if the window size changes
	$(window).resize(function(e) {
		sizeModal(modal);
	});
});

Template.delete.events({
	// confirm delete?
	'click .deleteme .yes': function(e) {
		e.preventDefault();
		Meteor.call('deleteYum', this._id, this.username );
		Session.set('deleting', false);
		document.body.classList.remove('overflow');
	},
	// cancel delete
	'click .deleteme .no': function(e) {
		e.preventDefault();
		Meteor.call('deleting', this._id, 'cancel');
		Session.set('deleting', false);
		document.body.classList.remove('overflow');
	}
});


// utility functions for the rest of the app

// temporarily store place info in Session
function setPlace(el, place) {
	if ( place.place_id ) {
		var placeId = place.place_id;

		Session.set('place', place);
	} else {
		return;
	}
}

function randomString(length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for(var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}