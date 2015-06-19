if (Meteor.isClient) {

  Template.ShowInteraction.helpers({
    getContactName: function () {
      var contact = Contacts.findOne({_id: this.contactId});
      Session.set("contact", contact);
      var isValidName = contact.name !== "" && contact.name;
      var isValidOrganization = contact.organization !== "" && contact.organization;
      if (isValidName) {
        return contact.name.toUpperCase();
      }
      if (isValidOrganization) {
        return contact.organization.toUpperCase();
      }
    }
  });

	Template.ShowInteraction.events({
		"submit .edit-interaction": function (event, template) {
			event.preventDefault();

			var id = this.contactId;
      var interactionDate = $("#edit-interaction-date-field").val();
      var estimatedAttendees = $("#edit-interaction-estimated-attendees-field").val();
      var purpose = $("#edit-interaction-purpose-field").val();
      var outcome = $("#edit-interaction-outcome-field").val();
      var followUpAction = $("#edit-interaction-follow-up-field").val();
      var notes = $("#edit-interaction-notes-field").val();

      var editedInteraction = {
        contactId: id,
        interactionDate: interactionDate,
        estimatedAttendees: estimatedAttendees,
        purpose: purpose,
        outcome: outcome,
        followUpAction: followUpAction,
        notes: notes
      };

      var isValidId = editedInteraction.contactId !== "" && editedInteraction.contactId;
      var isValidInteractionDate = editedInteraction.interactionDate !== "" && editedInteraction.interactionDate;

      if (isValidId && isValidInteractionDate) {
        var editedContact = Session.get("contact");
        if (editedContact) {
    	    for (var i in editedContact.interactions) {
			      if (editedContact.interactions[i].interactionDate === editedInteraction.interactionDate) {
			        editedContact.interactions[i] = editedInteraction;
			        break;
			      }
			    }
          Meteor.call("updateContact", id, editedContact);
			    $("#edit-interaction-fail-alert").hide();
			    $("#edit-interaction-succeed-alert").show();
        }
      }
      else {
      	$("#edit-interaction-succeed-alert").hide();
      	$("#edit-interaction-fail-alert").show();
      }

			return false;
		}

	});

	Template.ShowInteraction.rendered = function () {
		$("#edit-interaction-succeed-alert").hide();
		$("#edit-interaction-fail-alert").hide();
	}

}