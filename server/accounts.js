Accounts.onCreateUser(function (options, user) {
	var email = user.emails[0].address;
	var isValidAddress = email.indexOf("longbeach.gov") > -1;
  if (options.profile) {	// We still want the default hook's 'profile' behavior.
    user.profile = options.profile;
  }
  if (isValidAddress) {
  	return user;
  }
  else {
  	throw new Meteor.Error("invalid-email-domain");
  }
});