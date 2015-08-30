// init Yums collection
Yums = new Mongo.Collection('yums');

// watch the yums template for changes
Meteor.subscribe('yums');

// startup actions
Meteor.startup(function() {
	Session.set('adding', false);
	Session.set('deleting', false);
});

// body helpers
Template.body.helpers({
	loading: function() {
		return Session.get('loading');
	}
});
