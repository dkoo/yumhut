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