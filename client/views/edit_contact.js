if (Meteor.isClient) {

  var resetEditContactForm = function () {
    var id = Session.get("editContactId");
    $(".edit-tags-dropdown").select2("destroy");
    $(".edit-invalid-contact-alert").hide();
    $("form.edit-contact").parsley().reset();
    $("#edit-contact-modal").modal("hide");
  }

  Template.EditContact.helpers({
    editFormData: function () {
      var id = Session.get("editContactId", id);
      return Contacts.findOne({_id: id});
    },
    getTags: function () {
      return getAllTags();
    },
    getOptionValue: function () {
      var self = this;
      return this;
    }
  });

  Template.EditContact.events({
    "submit .edit-contact": function (event, template) {
      event.preventDefault();

      var id = Session.get("editContactId");
      var name = $("#edit-name-field").val();
      var title = $("#edit-title-field").val();
      var organization = $("#edit-organization-field").val();
      var phone = $("#edit-phone-field").val();
      var phoneExt = $("#edit-phone-ext-field").val();
      var cell = $("#edit-cell-field").val();
      var email = $("#edit-email-field").val();
      var address = $("#edit-address-field").val();
      var website = $("#edit-website-field").val();
      var tags = $(".edit-tags-dropdown").select2("val");
      var regularMeetings = $("#edit-regular-meetings-field").val();
      var notableAnnualEvents = $("#edit-notable-events-field").val();
      var notes = $("#edit-notes-field").val();

      var editedContact = {
        name: name,
        title: title,
        organization: organization,
        phone: sanitizePhone(phone) || "",
        phoneExt: phoneExt,
        cell: sanitizePhone(cell) || "",
        email: email,
        address: address,
        website: website,
        tags: tags,
        regularMeetings: regularMeetings,
        notableAnnualEvents: notableAnnualEvents,
        notes: notes
      }

      var isValidName = editedContact.name !== "" && editedContact.name;
      var isValidOrganizationName = editedContact.organization !== "" && editedContact.organization;

      // Update contact
      if (isValidName || isValidOrganizationName) {
        Meteor.call("updateContact", id, editedContact);
      }

      resetEditContactForm();
      return false;
    },
    "click .delete-contact-btn": function (event) {
      Meteor.call("removeContact", this._id);
      resetEditContactForm();
    }
  });

  Template.EditContact.rendered = function () {
    $("#edit-contact-modal").on("hidden.bs.modal", function (e) {
      resetEditContactForm();
    });
    $(".edit-invalid-contact-alert").hide();
    $(".edit-contact").parsley().subscribe("parsley:form:validate", function (formInstance) {
      if (!$('#edit-name-field').val().length && !$('#edit-organization-field').val().length) {
        formInstance.submitEvent.preventDefault();
        $(".edit-invalid-contact-alert").show();
      }
      return;
    });
  }
}