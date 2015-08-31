Template.accounts.onRendered(function() {
	// check if user is logged in, and stop loading animation on callback
	Meteor.call('checkStatus', function(err, result) {
		if ( err ) {
			console.log(err);
		}
		Session.set('loading', false);
	});
});

Template.accounts.helpers({
	registering: function() {
		var registering = Session.get('registering'),
			activating = Session.get('activateToken');

		return registering || activating ? true : false;
	},
	loggingin: function() {
		var loggingIn = Session.get('loggingIn'),
			resetting = Session.get('resetToken');

		return loggingIn || resetting ? true : false;
	}
});

Template.accounts.events({
	'click .register': function(e) {
		e.preventDefault();
		Session.set('registering', true);
	},
	'click .login': function(e) {
		e.preventDefault();
		Session.set('loggingIn', true);
	}
});