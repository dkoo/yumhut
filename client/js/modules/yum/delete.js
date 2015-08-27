Template.delete.onRendered(function() {
	var modal = document.querySelector('.deleteme'),
		sizeModal = function(el) {
			var scrolled = document.body.scrollTop,
				viewportY = window.innerHeight;

			el.style.cssText = 'height: ' + viewportY + 'px; margin-top: ' + scrolled + 'px;';
		};

	// size and center the modal
	sizeModal(modal);

	// resize and recenter the modal if the window size changes
	$(window).resize(function(e) {
		sizeModal(modal);
	});
});

Template.delete.events({
	// confirm delete?
	'click .deleteme .yes': function(e) {
		e.preventDefault();
		Meteor.call('deleteYum', this._id, this.username );
		Session.set('deleting', false);
		document.body.classList.remove('overflow');
	},
	// cancel delete
	'click .deleteme .no': function(e) {
		e.preventDefault();
		Meteor.call('deleting', this._id, 'cancel');
		Session.set('deleting', false);
		document.body.classList.remove('overflow');
	}
});