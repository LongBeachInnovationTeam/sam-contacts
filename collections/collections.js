Contacts = new Meteor.Collection("contacts");
Organizations = new Meteor.Collection("organizations");

Contacts.initEasySearch(["name", "title", "organization", "tags"]);

Meteor.methods({
	addContact: function (newContact) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Contacts.insert(newContact);
	},
	addOrganization: function (org) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Organizations.insert(org);
	},
	removeContact: function (id) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Contacts.remove(id);
	},
	updateContact: function (id, editedContact) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Contacts.update({ _id: id }, { $set: editedContact });
	}
});