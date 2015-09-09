Contacts = new Meteor.Collection("contacts");
Contacts.initEasySearch(["name", "title", "organization", "tags"], {
	"use": "mongo-db"
});