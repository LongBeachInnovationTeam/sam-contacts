if (Meteor.isServer) {
	Meteor.methods({
		addContact: function (newContact) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
	    newContact.createdDate = new Date();
	    newContact.lastModifiedDate = newContact.createdDate;
			Contacts.insert(newContact);
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
			editedContact.lastModifiedDate = new Date();
			Contacts.update({ _id: id }, { $set: editedContact });
		}
	});
}