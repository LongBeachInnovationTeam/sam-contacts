if (Meteor.isClient) {

	Template.AddQuote.helpers({
		authors: function () {
			return Contacts.find().fetch().map(function (c) { return c.name; });
		}
	});

	Template.AddQuote.rendered = function () {
		Meteor.typeahead.inject();
	};

}