// init Yums collection
Yums = new Mongo.Collection('yums');

Meteor.publish('yums', function () {
	return Yums.find({
		owner: this.userId
	});
});