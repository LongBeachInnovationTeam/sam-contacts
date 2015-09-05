if (Meteor.isServer) {
	Meteor.publish("contactsList", function (limit) {
    // A limit value of 0 is equivalent to setting no limit
	  if (limit > Contacts.find().count()) {
	    limit = 0;
	  }
	  return Contacts.find({}, {
      limit: limit,
      //sort: { name: 1, organization: 1},
    });
	});
  Meteor.publish("contacts", function () {
    return Contacts.find();
  });
  Meteor.publish("users", function () {
  	return Meteor.users.find({ }, {
  		fields: {
  			emails: 1,
  			profile: 1
  		}
  	});
	});
}