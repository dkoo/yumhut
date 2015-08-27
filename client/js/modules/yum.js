// when yums first load, exit edit mode
Template.yum.onRendered(function() {
	Meteor.call('editYum', this.data._id, 'cancel');
	Meteor.call('deleting', this.data._id, 'cancel');
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
			Meteor.utils.setPlace(autocomplete.getPlace());

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