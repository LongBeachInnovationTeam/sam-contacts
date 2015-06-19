if (Meteor.isServer) {
  Meteor.publish("contacts", function () {
    return Contacts.find();
  });
  Meteor.publish("organizations", function () {
    return Organizations.find();
  });
}