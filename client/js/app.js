// init Yums collection
Yums = new Mongo.Collection('yums');

// watch the yums template for changes
Meteor.subscribe('yums');

// startup actions
Meteor.startup(function() {
	Session.set('adding', false);
	Session.set('deleting', false);
});

// config for accounts.ui package
Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

// body helpers
Template.body.helpers({
	loading: function() {
		return Session.get('loading');
	}
});


// reset default class names when logging out
Template.loginButtons.events({
	'click #login-buttons-logout': function() {
		document.body.classList.remove('user');
	}
});