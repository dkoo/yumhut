Yums = new Mongo.Collection('yums');

if (Meteor.isClient) {
  Template.body.helpers({
    yums: function() {
      return Yums.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    'submit .new-yum': function (event) {
      event.preventDefault();

      var input = event.target.text.value;

      Yums.insert({
        text: input,
        createdAt: new Date()
      });

      // clear after submitting
      event.target.text.value = '';
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
