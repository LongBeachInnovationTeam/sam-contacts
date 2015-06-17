Contacts = new Mongo.Collection("contacts");
Organizations = new Mongo.Collection("organizations");

Router.configure({
  layoutTemplate: "Layout"  // the default layout
});

Router.route('/', function () {
  this.layout("Layout");
  this.render("Home");
});

Router.route('/email', function () {
  this.layout("Layout");
  this.render("EmailStakeholders");
});

Router.route('/categories', function () {
  this.layout("Layout");
  this.render("Categories");
});

if (Meteor.isClient) {

  var contactExists = function (name) {
    var existingContact = Contacts.findOne({
      name: name
    });
    if (existingContact) {
      return true;
    }
    else {
      return false;
    }
  }

  var organizationExists = function (org) {
    var existingOrg = Organizations.findOne({
      name: org
    });
    if (existingOrg) {
      return true;
    }
    else {
      return false;
    }
  }

  var sanitizePhone = function (phone) {
    // Normalize phone number to use the U.S. hyphen format
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phoneRegex.test(phone)) {
      var formattedPhoneNumber = phone.replace(phoneRegex, "$1-$2-$3");
      return formattedPhoneNumber;
    }
  }

  var sanitizeTags = function (tags) {
    // Get tags from tag input, split them into a new array, strip out any
    // non-alphanumeric characters make them lowercase, and return an array of tags
    var tagsArray = tags.split(",");
    for (tag in tagsArray) {
      tagsArray[tag] = tagsArray[tag].toLowerCase().replace(/\W/g, ' ');
    }
    return tagsArray;
  }

  var strToId = function (str) {
    return "collapse-" + str;
  }

  Template.ContactsList.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    },
    getEmail: function (str) {
      if (str && str !== "") {
        return str;
      }
      else {
        return "Unknown Email";
      }
    },
    getCollapseHref: function (str) {
      return "#" + strToId(str);
    },
    getCollapseId: function (str) {
      return strToId(str);
    },
    getNameOrOrganization: function (name, organization) {
      if (name && name !== "") {
        return name;
      }
      if (organization && organization !== "") {
        this.title = "Company/Organization";
        return organization;
      }
      return "Unknown";
    },
    getPhone: function (str) {
      if (str && str !== "") {
        return str;
      }
      else {
        return "Unknown Phone";
      }
    },
    getTags: function() {
      var self = this;
      self.tags = self.tags || [];
      return _.map(self.tags, function (value, index) {
        return {
          value: value,
          index: index
        };
      });
    },
    getTitle: function (str) {
      if (str && str !== "") {
        return str;
      }
      else {
        return "Unknown Title";
      }
    }
  });

  Template.ContactsList.events({
    "click #add-interaction-btn": function (event) {
      var id = event.target.dataset.id;
      Session.set("editContactId", id);
      $("#add-interaction-modal").modal("show");
    },
    "click .contact-edit-btn": function (event) {
      var id = event.target.id;
      Session.set("editContactId", id);
      Meteor.setTimeout(function () {
        $("#" + id + "-edit-tags-field").tagsinput("refresh");
      }, 100);
    }
  });

  var resetAddContactForm = function (template) {
    // Reset form, hide modal, and return to caller
    $("#add-tags-field").tagsinput("destroy");
    $("#add-invalid-contact-alert").hide();
    $("#add-existing-contact-alert").hide();
    $(".new-contact").parsley().reset();
    template.find(".new-contact").reset();
    $("#add-contact-modal").modal("hide");
  }

  Template.AddContact.events({
    "submit .new-contact": function (event, template) {
      event.preventDefault();

      var name = $("#add-name-field").val();
      var title = $("#add-title-field").val();
      var organization = $("#add-organization-field").val();
      var phone = $("#add-phone-field").val();
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
        email: email,
        address: address,
        tags: sanitizeTags(tags) || [],
        regularMeetings: regularMeetings,
        notableAnnualEvents: notableAnnualEvents,
        notes: notes,
        interactions: new Array()
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
          Organizations.insert(org);
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
          Contacts.insert(newContact);
        }
        resetAddContactForm(template);
      }

      return false;
    }
  });

  Template.AddContact.rendered = function () {
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
          Organizations.insert(org);
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
        Contacts.update({_id: id}, { $set: editedContact });
      }

      resetEditContactForm();
      return false;
    },
    "click .delete-contact-btn": function (event) {
      Contacts.remove(this._id);
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

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
