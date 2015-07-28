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
  setChecked: function(yumId, setChecked) {
    Yums.update(yumId, {
      $set: {
        checked: setChecked
      }
    });
  }
});
