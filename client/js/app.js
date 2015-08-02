// body helpers
Template.body.helpers({
	yums: function() {
		if ( Session.get('filtered') ) {
			return Yums.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
		} else {
			return Yums.find({}, {sort: {createdAt: -1}});
		}
	}
});

// count helpers
Template.count.helpers({
	showCount: function() {
		return Yums.find({checked: {$ne: true}}).count();
	},
	showCountIs: function(count) {
		var yumCount = Yums.find().count();
		return yumCount === count ? count === 1 ? true : false : false;
	}
});