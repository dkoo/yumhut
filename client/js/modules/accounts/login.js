Template.login.events({
	'click .signup': function(e) {
		e.preventDefault();
		Session.set('loggingin', false);
		Session.set('registering', true);
	},
	'submit #login': function(e) {
		e.preventDefault();

		if ( Session.get('created') ) {
			Session.set('created', false);
		}

		var user = {
				name: e.target.user.value.trim().toLowerCase(),
				password: e.target.password.value,
				errors: document.getElementById('errors')
			},
			// possible error messages
			messages = {
				email: '<p><i class="fa fa-exclamation-circle"></i> Please enter a valid e-mail address.</p>',
				password: '<p><i class="fa fa-exclamation-circle"></i> Please enter a login password.</p>',
				userNotFound: '. Do you need to <a href="#" class="register">register</a>?',
				wrongPassword: '. Try entering your password again.'
			};

		// validate email and password
		if ( !user.name || !user.password ) { // if there's no email/password or the email doesn't contain an @ character
			if ( !user.name ) {
				errors.innerHTML = messages.username;
				if ( !user.password ) {
					errors.innerHTML += messages.password;
				}
			} else {
				if ( !user.password ) {
					errors.innerHTML = messages.password;
				}
			}
			return false;
		} else {
			Session.set('loading', true);
			// if inputs pass validation, attempt to log in with the given email and password
			Meteor.loginWithPassword(user.name, user.password, function(err){
				// handle callback errors
				if (err) {
					console.log(err);
					var reason = err.reason;
					if ( reason === 'User not found' ) {
						errors.innerHTML = reason + messages.userNotFound;
					} else if ( reason === 'Incorrect password' ) {
						errors.innerHTML = reason + messages.wrongPassword;
					}
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

});