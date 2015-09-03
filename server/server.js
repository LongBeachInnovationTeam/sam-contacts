if (Meteor.isServer) {

	Meteor.startup(function () {
		// Ensure that the following indexes are defined and created in our mongodb database
		Contacts._ensureIndex({
			"name": 1,
			"organization": 1,
			"tags": 1
		}, { background: true });
	});

	// User can only login if they verified their account via email
	Accounts.validateLoginAttempt(function (attempt) {
	  if (attempt.user && attempt.user.emails) {
	  	var email = attempt.user.emails[0].address;
	    if (email === "demo@longbeach.gov") {
	    	return true;
	    }
	    else {
	    	return false;
	    }
	  }
	});

}