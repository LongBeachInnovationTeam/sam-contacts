if (Meteor.isClient) {

  var resetAddContactForm = function () {
    // Reset form, hide modal, and return to caller
    $("#add-tags-field").tagsinput("destroy");
    $("#add-invalid-contact-alert").hide();
    $("#add-existing-contact-alert").hide();
    $(".new-contact").parsley().reset();
    $(".new-contact")[0].reset();
    $("#add-contact-modal").modal("hide");
  }

  Template.AddContact.events({
    "submit .new-contact": function (event, template) {
      event.preventDefault();

      var name = $("#add-name-field").val();
      var title = $("#add-title-field").val();
      var organization = $("#add-organization-field").val();
      var phone = $("#add-phone-field").val();
      var phoneExt = $("#add-phone-ext-field").val();
      var cell = $("#add-cell-field").val();
      var email = $("#add-email-field").val();
      var address = $("#add-address-field").val();
      var tags = $("#add-tags-field").val();
      var regularMeetings = $("#add-regular-meetings-field").val();
      var notableAnnualEvents = $("#add-notable-events-field").val();
      var notes = $("#add-notes-field").val();

      var newContact = {
        name: name,
        title: title,
        organization: organization,
        phone: sanitizePhone(phone) || "",
        phoneExt: phoneExt,
        cell: sanitizePhone(cell) || "",
        email: email,
        address: address,
        tags: sanitizeTags(tags) || new Array(),
        regularMeetings: regularMeetings,
        notableAnnualEvents: notableAnnualEvents,
        notes: notes,
        interactions: new Array(),
        owner: Meteor.userId(),
        ownerUsername: Meteor.user().emails[0].address
      }

      var isValidName = newContact.name !== "" && newContact.name;
      var isValidOrganizationName = newContact.organization !== "" && newContact.organization;
      var isExistingContact = contactExists(newContact.name);

      // Create an entry in the Organizations collection for a newly identified organization
      if (isValidOrganizationName) {
        var orgName = newContact.organization;
        if (!organizationExists(orgName)) {
          var org = {
            name: orgName,
            createdDate: new Date()
          }
          Meteor.call("addOrganization", org);
        }
      }

      // Create a new contact
      if (isExistingContact) {
        $("#add-existing-contact-alert").show();
      }
      else {
        if (isValidName || isValidOrganizationName) {
          var org = Organizations.findOne({
            name: newContact.organization
          });
          if (org) {
            newContact.organization_id = org._id;
          }
          newContact.createdDate = new Date();
          newContact.lastModifiedDate = newContact.createdDate;
          Meteor.call("addContact", newContact);
        }
        resetAddContactForm();
      }

      return false;
    }
  });

  Template.AddContact.rendered = function () {
    $("#add-contact-modal").on("hidden.bs.modal", function (e) {
      resetAddContactForm();
    });
    $("#add-invalid-contact-alert").hide();
    $("#add-existing-contact-alert").hide();
    $(".new-contact").parsley().subscribe("parsley:form:validate", function (formInstance) {
      if (!$('#add-name-field').val().length && !$('#add-organization-field').val().length) {
        formInstance.submitEvent.preventDefault();
        $("#add-invalid-contact-alert").show();
      }
      return;
    });
  }

}