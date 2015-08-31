Meteor.utils = {
	// temporarily store place info in Session
	setPlace: function(place) {
		if ( place.place_id ) {
			var placeId = place.place_id;

			Session.set('place', place);
		} else {
			return;
		}
	},
	appendMessages: function(parent, HTML) {
		var messages = document.getElementById('messages') || document.createElement('div');
		messages.setAttribute('id', 'messages');
		messages.innerHTML = HTML;
		parent.appendChild(messages);
	}
}