Yums = new Mongo.Collection('yums');

if (Meteor.isClient) {
	Meteor.subscribe('yums');

	Template.body.helpers({
		yums: function() {
			if ( Session.get('filtered') ) {
				return Yums.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			} else {
				return Yums.find({}, {sort: {createdAt: -1}});
			}
		},
		filtered: function() {
			return Session.get('filtered');
		},
		showCount: function() {
			return Yums.find({checked: {$ne: true}}).count();
		}
	});

	Template.body.events({
		'submit .new-yum': function(e) {
			e.preventDefault();

			var input = e.target.name.value;

			// add a Yum
			Meteor.call('addYum', input);

			// clear after submitting
			e.target.name.value = '';
		},
		'change .filter input': function(e) {
			Session.set('filtered', e.target.checked);
		}
	});

	Template.yum.helpers({
		isOwner: function() {
			return this.owner === Meteor.userId();
		}
	});

	Template.yum.events({
		'click .delete': function() {
			Meteor.call('deleteYum', this._id, this.username );
		},
		'click .edit': function() {
			Meteor.call('editYum', this._id);
		},
		'submit .edit-yum': function(e) {
			e.preventDefault();

			var input = e.target.name.value;

			// edit Yum
			Meteor.call('updateYum', this._id, input);

			// reset form
			e.target.name.value = input;
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
}

if (Meteor.isServer) {
	Meteor.publish('yums', function () {
		return Yums.find({
			owner: this.userId
		});
	});
}
