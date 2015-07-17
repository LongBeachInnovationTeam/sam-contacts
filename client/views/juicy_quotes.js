if (Meteor.isClient) {

  var colorCode = 0;

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