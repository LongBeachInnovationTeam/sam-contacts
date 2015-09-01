if (Meteor.isClient) {
  Template.DeleteQuote.helpers({
    getQuote: function () {
    	return Session.get("quote");
    }
  });
}