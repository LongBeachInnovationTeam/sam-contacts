if (Meteor.isServer) {
	Meteor.publish("getContacts", function (limit) {
	  if (limit > Contacts.find().count()) {
	    limit = 0;
	  }
	  return Contacts.find({ }, { limit: limit });
	});
  Meteor.publish("contacts", function () {
    return Contacts.find();
  });
  Meteor.publish("organizations", function () {
    return Organizations.find();
  });
}