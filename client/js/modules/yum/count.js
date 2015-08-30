// count helpers
Template.count.helpers({
	showCount: function() {
		return Yums.find({checked: {$ne: true}}).count();
	},
	showCountIs: function(count) {
		var yumCount = Yums.find().count();
		return yumCount === count ? count === 1 || count === 0 ? true : false : false;
	}
});
