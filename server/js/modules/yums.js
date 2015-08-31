Meteor.methods({
	checkStatus: function() {
		return this.userId;
	},
	addYum: function(place) {
		// user must be logged in to add yums
		if ( !Meteor.userId() ) {
			throw new Meteor.Error('not-authorized');
		}
		Yums.insert({
			name: place.name,
			id: place.id,
			loc: place.loc,
			address: place.address,
			favs: place.favs.split('\n'),
			notes: place.notes,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	deleteYum: function(yumId, username) {
		if ( Meteor.user().username === username ) {
			Yums.remove(yumId);
		} else {
			throw new Meteor.Error('not-authorized');
		}
	},
	deleting: function(yumId, action) {
		var state = action === 'delete' ? true : false;
		
		Yums.update(yumId, {
			$set: {
				deleting: state
			}
		});
	},
	editYum: function(yumId, action) {
		var state = action === 'edit' ? true : false;
		
		Yums.update(yumId, {
			$set: {
				editing: state
			}
		});
	},
	updateYum: function(yumId, place, username) {
		if ( Meteor.user().username === username ) {
			if ( place ) {
				Yums.update(yumId, {
					$set: {
						name: place.name,
						id: place.id,
						loc: place.loc,
						address: place.address,
						notes: place.notes,
						editing: false
					}
				});
			} else {
				Yums.update(yumId, {
					$set: {
						editing: false
					}
				});
				return false;
			}
		}
	},
	updateFavs: function(yumId, newFavs, username) {
		if ( Meteor.user().username === username ) {
			if ( newFavs ) {
				Yums.update(yumId, {
					$set: {
						favs: newFavs
					}
				});
			}
		}
	}
});