if (Meteor.isClient) {

  var resetEditContactForm = function () {
    var id = Session.get("editContactId");
    $("#" + id + "-edit-tags-field").tagsinput("destroy");
    $(".edit-invalid-contact-alert").hide();
    $("form.edit-contact").parsley().reset();
    $("#edit-contact-modal").modal("hide");
  }

  Template.EditContact.helpers({
    editFormData: function () {
      var id = Session.get("editContactId", id);
      return Contacts.findOne({_id: id});
    },
    getTagsAsString: function (tags) {
      return tags.join();
    },
    getTagsInputId: function () {
      var id = Session.get("editContactId", id);
      return id + "-edit-tags-field";
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
      var tags = $("#" + id + "-edit-tags-field").val();
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
        tags: sanitizeTags(tags) || [],
        regularMeetings: regularMeetings,
        notableAnnualEvents: notableAnnualEvents,
        notes: notes
      }

      var isValidName = editedContact.name !== "" && editedContact.name;
      var isValidOrganizationName = editedContact.organization !== "" && editedContact.organization;

      // Create an entry in the Organizations collection for a newly identified organization
      if (isValidOrganizationName) {
        var orgName = editedContact.organization;
        if (!organizationExists(orgName)) {
          var org = {
            name: orgName,
            createdDate: new Date()
          }
          Meteor.call("addOrganization", org);
        }
      }

      // Update contact
      if (isValidName || isValidOrganizationName) {
        var org = Organizations.findOne({
          name: editedContact.organization
        });
        if (org) {
          editedContact.organization_id = org._id;
        }
        editedContact.lastModifiedDate = new Date();
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