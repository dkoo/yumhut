Template.accounts.helpers({
	registering: function() {
		return Session.get('registering');
	},
	loggingin: function() {
		return Session.get('loggingin');
	}
});

Template.accounts.events({
	'click .register': function(e) {
		e.preventDefault();
		Session.set('registering', true);
	},
	'click .login': function(e) {
		e.preventDefault();
		Session.set('loggingin', true);
	}
});