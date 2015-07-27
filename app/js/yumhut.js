Yums = new Mongo.Collection('yums');

if (Meteor.isClient) {
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

      var input = e.target.text.value;

      Yums.insert({
        text: input,
        createdAt: new Date()
      });

      // clear after submitting
      e.target.text.value = '';
    },
    'change .filter input': function(e) {
      Session.set('filtered', e.target.checked);
    }
  });

  Template.yum.events({
    'click .toggle-checked': function() {
      Yums.update(this._id, {
        $set: {checked: !this.checked}
      });
    },
    'click .delete': function() {
      Yums.remove(this._id);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
