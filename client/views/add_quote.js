if (Meteor.isClient) {

	Template.AddQuote.rendered = function () {
		Meteor.typeahead.inject();
	};

	Template.AddQuote.helpers({
		authors: function () {
			return Contacts.find().fetch().map(function (c) {
				return {
					id: c._id,
					value: c.name
				};
			});
		},
		selectedAuthor: function (event, suggestion, datasetName) {
			// event - the jQuery event object
	    // suggestion - the suggestion object
	    // datasetName - the name of the dataset the suggestion belongs to
	    Session.set("editContactId", suggestion.id);
		}
	});

  Template.AddQuote.events({
    "submit .add-quoute": function (event, template) {
      event.preventDefault();

      var quote = $("#add-quote-field").val();
      var author = $("#add-quote-author-field").val();
      var quoteDate = $("#add-quote-date-field").val();
      var authorId = Session.get("editContactId");
      var newQuote = {
      	authorId: authorId,
        author: author,
        quote: sanitizeQuote(quote),
        quoteDate: quoteDate
      }

      var isValidQuote = newQuote.quote !== "" && newQuote.quote;

      if (isValidQuote) {
        var editedContact = Contacts.findOne({_id: authorId});
        newQuote.dateAdded = new Date();
        editedContact.quotes.push(newQuote);
        editedContact.lastModifiedDate = new Date();
        Meteor.call("updateContact", authorId, editedContact);
      }

      return false;
    }
  });

}