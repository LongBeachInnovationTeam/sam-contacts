if (Meteor.isClient) {

  var resetAddInteractionForm = function (template) {
    // Reset form, hide modal, and return to caller
    $(".add-interaction").parsley().reset();
    template.find(".add-interaction").reset();
    $("#add-interaction-modal").modal("hide");
  }

  Template.AddInteraction.helpers({
    contactInfo: function () {
      var id = Session.get("editContactId");
      return Contacts.findOne({_id: id});
    }
  });

  Template.AddInteraction.events({
    "submit .add-interaction": function (event, template) {
      event.preventDefault();

      var id = Session.get("editContactId");
      var interactionDate = $("#add-interaction-date-field").val();
      var estimatedAttendees = $("#add-interaction-estimated-attendees-field").val();
      var purpose = $("#add-interaction-purpose-field").val();
      var outcome = $("#add-interaction-outcome-field").val();
      var followUpAction = $("#add-interaction-follow-up-field").val();
      var notes = $("#add-interaction-notes-field").val();

      var interaction = {
        interactionDate: interactionDate,
        estimatedAttendees: estimatedAttendees,
        purpose: purpose,
        outcome: outcome,
        followUpAction: followUpAction,
        notes: notes
      };

      var isValidId = id !== "" && id;
      var isValidInteractionDate = interaction.interactionDate !== "" && interaction.interactionDate;

      if (isValidId && isValidInteractionDate) {
        var editedContact = Contacts.findOne({_id: id});
        interaction.createdDate = new Date();
        interaction.lastModifiedDate = interaction.createdDate;
        editedContact.interactions.push(interaction);
        editedContact.lastModifiedDate = new Date();
        Contacts.update({_id: id}, { $set: editedContact });
      }

      resetAddInteractionForm(template);
      return false;
    }
  });
}