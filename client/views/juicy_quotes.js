if (Meteor.isClient) {

  var colorCode = 0;

  Template.JuicyQuotes.events({
    "click .delete-juicy-quote-link": function (event, template) {
      var contactId = event.currentTarget.dataset.contactId;
      var quote = event.currentTarget.dataset.quote;
      var author = event.currentTarget.dataset.author;
      Session.set("quote", {
        contactId: contactId,
        quote: quote,
        author: author
      });
      $("#delete-quote-modal").modal("show");
    },
    "submit .delete-quote-form": function (event, template) {
      event.preventDefault();
      var quote = Session.get("quote");
      if (quote.contactId) {
        var editedContact = Contacts.findOne({_id: quote.contactId});
        var quotes = _.filter(editedContact.quotes, function (q) {
          return q.quote === quote;
        });
        editedContact.quotes = quotes;
        editedContact.lastModifiedDate = new Date();
        Meteor.call("updateContact", quote.contactId, editedContact);
        Session.set("quote", null);
        $("#delete-quote-modal").modal("hide");
      }
      return false;
    }
  });

  Template.JuicyQuotes.helpers({
    contacts: function () {
      return Contacts.find({}).fetch();
    },
    getQuoteType: function () {
      if (colorCode == 6) {
        colorCode = 0;
      }
      colorCode++;
      return "quoute-type" + colorCode;
    }
  });

}