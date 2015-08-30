Template.register.events({
	'click .back': function(e) {
		e.preventDefault();
		Session.set('registering', false);
	},
	'submit #register': function(e) {
		e.preventDefault();
	}
});