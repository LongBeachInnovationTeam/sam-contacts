if (Meteor.isServer) {

	Meteor.startup(function () {

  	// Configure email SMTP credentials
  	process.env.MAIL_URL = 'smtp://mail.longbeach.gov:25';

	  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users
	  // asking for help with their account, be sure to set this to an email address that you can receive email at.
	  Accounts.emailTemplates.from = 'Long Beach i-team <i-team@longbeach.gov>';

	  // A Function that takes a user object and returns a String for the subject line of the email.
	  Accounts.emailTemplates.verifyEmail.subject = function (user) {
	    return 'SAM: Confirm Your Email Address';
	  };

	  // A Function that takes a user object and a url, and returns the body text for the email.
	  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
	  Accounts.emailTemplates.verifyEmail.text = function (user, url) {
	    return 'Click on the following link to verify your email address: ' + url;
	  };

	});

	Accounts.onCreateUser(function (options, user, err) {
		if (err) {
			throw new Meteor.Error("account-creation");
		}
		else {
			var email = user.emails[0].address;
			var isValidAddress = email.indexOf("longbeach.gov") > -1;
		  if (options.profile) {	// We still want the default hook's 'profile' behavior.
		    user.profile = options.profile;
		  }
		  if (isValidAddress) {
	  	  Meteor.setTimeout(function () {
			    Accounts.sendVerificationEmail(user._id);
			  }, 2 * 1000);
		  	return user;
		  }
		  else {
		  	throw new Meteor.Error("not-authorized");
		  }
		}
	});

	// User can only login if they verified their account via email
	Accounts.validateLoginAttempt(function (attempt) {
	  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified) {
	    return false; // the login is aborted
	  }
	  return true;
	});

}