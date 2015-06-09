Contacts = new Mongo.Collection("contacts");

if (Meteor.isClient) {

  Template.body.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    }
  });

  Template.body.events({
    "submit .new-contact": function (event) {
      var name = event.target.name.value;


      Contacts.insert({
        name: name,
        createdAt: new Date()
      });

      // Clear form
      event.target.name.value = "";

      // Prevent default form submit
      return false;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
