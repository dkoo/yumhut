// pass activation token to Session when a new user clicks the enrollment link
Accounts.onEnrollmentLink(function (token, done) {
	Session.set('activateToken', token);
});

Template.register.helpers({
	activating: function() {
		return Session.get('activateToken');
	}
});

Template.register.events({
	'click .back': function(e) {
		e.preventDefault();
		Session.set('registering', false);
	},
	'submit #register': function(e) {
		e.preventDefault();
		var newUser = {
				email: e.target.email.value.trim().toLowerCase(),
				username: e.target.user.value.trim()
			},
			errIcon = '<i class="fa fa-exclamation-circle"></i>',
			// mini helper to validate new user input
			validateUser = function(user) {
				var error = '';

				if ( user.email.indexOf('@') === -1 || // email address must contain @
					user.email.indexOf('.') === -1  || // email address must contain .
					user.email.length < 5 ) // email address must be at least 5 characters
				{
					error += user.email ? '<p>' + errIcon + 'E-mail must be a valid email address.</p>' : '<p>' + errIcon + 'Please enter a valid e-mail address.</p>';
				}
				if ( !user.username ) {
					error += '<p>' + errIcon + 'Please enter a username.</p>';
				} else if ( user.username.length < 3 ) {
					error += '<p>' + errIcon + 'Username must be at least three characters.</p>';
				}

				// if input passes all tests, return true, otherwise return the error messages
				return !error ? true : error;
			},
			valid = validateUser(newUser);

		if ( valid === true ) {
			Session.set('loading', true);

			// create the user account
			Meteor.call('createNewUser', newUser, function(err) {
				if ( err ) {
					console.log(err);
					Meteor.utils.appendMessages(e.target, err.reason);
				} else {
					console.log(newUser.email + ' account created!');
					Meteor.utils.appendMessages(e.target, 'Account created! Please check your email to complete your registration.');
				}
				Session.set('loading', false);
			});
		} else {
			Meteor.utils.appendMessages(e.target, valid);
		}
	},
	'submit #activate': function(e) {
		e.preventDefault();
		var token = Session.get('activateToken'),
			errIcon = '<i class="fa fa-exclamation-circle"></i>',
			password = e.target.password.value,
			confirm = e.target.confirm.value,
			error = '';

		// validate password fields
		if ( password.length < 6 ) {
			error += password ? '<p>' + errIcon + 'Password must be at least 6 characters.</p>' : '<p>' + errIcon + 'Please enter a password.</p>';
		}
		if ( password !== confirm ) {
			error += '<p>' + errIcon + 'Password fields do not match!</p>';
		}
		if ( error ) {
			Meteor.utils.appendMessages(e.target, error);
		} else {
			Session.set('loading', true);
			Accounts.resetPassword(token, password, function(err) {
				if ( err ) {
					console.log(err);
					Meteor.utils.appendMessages(e.target, err.reason);
				} else {
					// unset Session registration keys
					Session.set('activateToken', undefined);
					Session.set('activating', false);
					Session.set('registering', false);

					// log in with the given password
					Session.set('loading', true);
					Meteor.loginWithPassword(Meteor.user().username, password);
				}
				Session.set('loading', false);
			});
		}
		return false;
	}
});