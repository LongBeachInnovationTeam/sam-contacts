if (Meteor.isClient) {

  var colorCode = 0;

  Template.JuicyQuotes.helpers({
    contacts: function () {
      return Contacts.find({}, {
        limit: 50
      });
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