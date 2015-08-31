// init Yums collection
Yums = new Mongo.Collection('yums');

Meteor.publish('yums', function () {
	return Yums.find({
		owner: this.userId
	});
});

Meteor.startup(function() {
	// set email environment credentials
	process.env.MAIL_URL = 'smtp://no-reply%40yumhut.com:e^xQnekA@mail.yumhut.com:465';

	Accounts.emailTemplates.siteName = 'Yumhut';
	Accounts.emailTemplates.from = 'Yumhut <no-reply@yumhut.com>';
	Accounts.emailTemplates.enrollAccount.subject = function (user) {
		return 'Confirm your registration';
	};
	Accounts.emailTemplates.enrollAccount.text = function (user, url) {
		return 'Thanks for joining Yumhut, ' + user.username + '! We’re excited to help you keep track of all your yums. To activate your account, click the link below:\n\n' + url;
	};
	Accounts.emailTemplates.resetPassword.subject = function (user) {
		return 'Reset your Yumhut password';
	};
	Accounts.emailTemplates.resetPassword.text = function (user, url) {
		return 'Hi, ' + user.username + '! We’re sending you this e-mail because we received a request to reset your password. If you don’t want to reset your password, just ignore this e-mail. Otherwise, click the link below to reset it:\n\n' + url;
	};
});

// db methods
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
