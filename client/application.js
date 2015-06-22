Meteor.subscribe("contacts");
Meteor.subscribe("organizations");

Accounts.ui.config({
  forceEmailLowercase: true,
  forceUsernameLowercase: true,
  forcePasswordLowercase: false
});