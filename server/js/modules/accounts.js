// server methods for account login/registration

Meteor.methods({
	createNewUser: function(user) {
		var validateUser = function(user) {
				var error = '';

				if ( user.email.indexOf('@') === -1 && // email address must contain @
					user.email.indexOf('.') === -1  || // email address must contain .
					user.email.length < 5 ) // email address must be at least 5 characters
				{
					error += user.email ? 'E-mail must be a valid email address.' : 'Please enter a valid e-mail address.';
				}
				if ( !user.username ) {
					error += 'Please enter a username.';
				} else if ( user.username.length < 4 ) {
					error += 'Username must be at least three characters.';
				}

				// if input passes all tests, return true, otherwise return the error messages
				return !error ? true : error;
			},
			valid = validateUser(user);

			if ( valid === true ) {
				var newUser = Accounts.createUser(user);
				return Accounts.sendEnrollmentEmail(newUser);
			} else {
				return false;
			}

		// return Accounts.createUser(user);
	}
});