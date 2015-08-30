Template.login.events({
	'click .signup': function(e) {
		e.preventDefault();
		Session.set('loggingin', false);
		Session.set('registering', true);
	},
	'submit #login': function(e) {
		e.preventDefault();
	}
});