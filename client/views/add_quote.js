if (Meteor.isClient) {

  var addNewContact = function (newQuote) {
    var newContact = {
      name: newQuote.author,
      tags: new Array(),
      interactions: new Array(),
      quotes: new Array(),
      owner: Meteor.userId(),
      ownerUsername: Meteor.user().emails[0].address
    }
    var isValidName = newQuote.author !== "" && newQuote.author;
    var isExistingContact = contactExists(newContact.name, "");
    if (isValidName) {
      newContact.createdDate = new Date();
      newContact.lastModifiedDate = newContact.createdDate;
      Meteor.call("addContact", newContact);
    }
  }

  var resetAddQuotesForm = function () {
    // Reset form, hide modal, and return to caller
    // $("#add-invalid-contact-alert").hide();
    // $("#add-existing-contact-alert").hide();
    $(".add-quoute").parsley().reset();
    $(".add-quoute")[0].reset();
    $("#add-quote-modal").modal("hide");
  }

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
      var isExistingContact = contactExists(newQuote.author, "");
      var editedContact = Contacts.findOne({_id: newQuote.authorId});

      // Create a new contact in the DB if it does not already exist
      if (isValidQuote && !isExistingContact) {
        addNewContact(newQuote);
        editedContact = Contacts.findOne({ name: newQuote.author });
        newQuote.authorId = editedContact._id;
      }

      if (isValidQuote) {
        newQuote.dateAdded = new Date();
        editedContact.quotes.push(newQuote);
        editedContact.lastModifiedDate = new Date();
        if (newQuote.authorId) {
          Meteor.call("updateContact", newQuote.authorId, editedContact);
          resetAddQuotesForm();
        }
      }

      return false;
    }
  });

}