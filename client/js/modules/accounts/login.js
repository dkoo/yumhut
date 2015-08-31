// pass activation token to Session when a new user clicks the enrollment link
Accounts.onResetPasswordLink(function (token, done) {
	Session.set('resetToken', token);
	console.log(token);
});


Template.login.helpers({
	reset: function() {
		return Session.get('reset');
	},
	resetting: function(t) {
		if (Accounts._resetPasswordToken) {
			Session.set('resetToken', Accounts._resetPasswordToken);
		}

		return Session.get('resetToken');
	}
});

Template.login.events({
	'click .signup': function(e) {
		e.preventDefault();
		Session.set('loggingIn', false);
		Session.set('registering', true);
	},
	'click .reset': function(e) {
		e.preventDefault();
		Session.set('reset', true);
	},
	'click .cancel': function(e) {
		e.preventDefault();
		Session.set('reset', false);
	},
	'submit #start-reset': function(e) {
		e.preventDefault();

		var email = e.target.email.value.trim().toLowerCase(),
			errors = '';

		if ( !email ) {
			errors += '<p>' + errIcon + 'Please enter your account e-mail address.</p>';
		}
		if ( email.indexOf('@') === -1 || // email address must contain @
			email.indexOf('.') === -1 // email address must contain .
		) {
			errors += '<p>' + errIcon + 'Please enter a valid e-mail address.</p>';
		}
		if ( errors ) {
			Meteor.utils.appendMessages(e.target, errors);
		} else {
			Session.set('loading', true);
			Accounts.forgotPassword({email: email}, function(err) {
				if (err) {
					Meteor.utils.appendMessages(e.target, err.reason);
				}
				else {
					Meteor.utils.appendMessages(e.target, '<p>Recovery e-mail sent!</p>');
				}
				Session.set('loading', false);
			});
		}
		return false;

	},
	'submit #login': function(e) {
		e.preventDefault();

		if ( Session.get('created') ) {
			Session.set('created', false);
		}

		var user = {
				name: e.target.user.value.trim().toLowerCase(),
				password: e.target.password.value
			},
			errors = '';

		// validate email and password
		if ( !user.name || !user.password ) { // if there's no email/password or the email doesn't contain an @ character
			if ( !user.name ) {
				errors += '<p>' + errIcon + 'Please enter your username.</p>';
			}
			if ( !user.password ) {
				errors += '<p>' + errIcon + 'Please enter your password.</p>';
			}
			if ( errors ) {
				Meteor.utils.appendMessages(e.target, errors);
			}
			return false;
		} else {
			Session.set('loading', true);
			// if inputs pass validation, attempt to log in with the given email and password
			Meteor.loginWithPassword(user.name, user.password, function(err){
				// handle callback errors
				if (err) {
					console.log(err);
					Meteor.utils.appendMessages(e.target, err.reason);
				} else {
					// successful login
					console.log('logging in');
					Session.set('menu', false);
				}
				Session.set('loading', false);
			});
			return false;
		}
	},
	'submit #reset': function(e) {
		e.preventDefault();
		var token = Session.get('resetToken'),
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
					Session.set('resetToken', undefined);
					Session.set('resetting', false);
					Session.set('loggingIn', false);

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