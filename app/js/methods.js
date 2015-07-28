Meteor.methods({
  addYum: function(input) {
    // user must be logged in to add yums
    if ( !Meteor.userId() ) {
      throw new Meteor.Error('not-authorized');
    }

    Yums.insert({
      name: input,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteYum: function(yumId, username) {
    if ( Meteor.user().username === username ) {
      Yums.remove(yumId);
    } else {
      throw new Meteor.Error('not-authorized');
    }
  },
  editYum: function(yumId) {
    Yums.update(yumId, {
      $set: {
        editing: true
      }
    });
  },
  updateYum: function(yumId, input) {
    Yums.update(yumId, {
      $set: {
        name: input,
        editing: false
      }
    });
  }
});
