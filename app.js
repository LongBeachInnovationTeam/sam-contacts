Contacts = new Mongo.Collection("contacts");

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

  var contact = {
    name: "",
    title: "",
    organization: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  }

  var parseForm = function (e) {
    var formData = new Object();
    formData = contact;
    for (var prop in formData) {
      if (formData.hasOwnProperty(prop) && (prop !== "tags" || prop !== "lastModifiedDate")) {
        formData[prop] = e.target[prop].value || "";
      }
    }
    return formData;
  }

  var sanitizeContactFormData = function (form) {
    // Get tags from tag input, strip out any non-alphanumeric characters
    var tags = $(".contact-tags").tagsinput("items");
    for (tag in tags) {
      tags[tag] = tags[tag].toLowerCase().replace(/\W/g, '');
    }
    form["tags"] = tags;

    // Normalize phone number to use the U.S. hyphen format
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var phone = form["phone"];
    if (phoneRegex.test(phone)) {
      var formattedPhoneNumber = phone.replace(phoneRegex, "$1-$2-$3");
      form["phone"] = formattedPhoneNumber;
    }

    return form;
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
    "click .contact-edit-btn": function (event) {
      Session.set("editContactId", event.target.id);
    }
  });

  Template.AddContact.events({
    "click #add-contact-cancel-btn": function (event, template) {
      $(".invalid-add-contact-error-message").html("");
      template.find("form").reset();
      $(".invalid-contact-alert").hide();
      $("#addContactModal").modal("hide");
    },
    "submit .new-contact": function (event, template) {
      event.preventDefault();
      // Get submitted form data and sanitize it for proper entry and retrieval
      var form = parseForm(event);
      form = sanitizeContactFormData(form);
      // Only insert a record if there was an entered name
      var name = form["name"].trim();
      var organization = form["organization"].trim();
      if ((name !== "" && name !== undefined) || (organization !== "" && organization !== undefined)) {
        form["lastModifiedDate"] = new Date();
        Contacts.insert(form);
      }
      // Reset form, hide modal, and return to caller
      $(".invalid-contact-alert").hide();
      $(".new-contact").parsley().reset();
      template.find("form").reset();
      $("#addContactModal").modal("hide");
      return false;
    }
  });

  Template.AddContact.rendered = function () {
    $(".invalid-contact-alert").hide();
    $(".new-contact").parsley().subscribe("parsley:form:validate", function (formInstance) {
      if (!$('#add-name-field').val().length && !$('#add-organization-field').val().length) {
        formInstance.submitEvent.preventDefault();
        $(".invalid-contact-alert").show();
      }
      return;
    });
  }

  Template.EditContact.helpers({
    editFormData: function () {
      var id = Session.get("editContactId", id);
      return Contacts.findOne({_id: id});
    },
    getTagsAsString: function (tags) {
      return tags.join();
    }
  });

  Template.EditContact.events({
    "submit .edit-contact": function (event, template) {
      event.preventDefault();
      // Get submitted form data and sanitize it for proper update and retrieval
      var id = Session.get("editContactId");
      var form = parseForm(event);
      form = sanitizeContactFormData(form);
      // Only insert a record if there was an entered name
      var name = form["name"].trim();
      var organization = form["organization"].trim();
      if ((name !== "" && name !== undefined) || (organization !== "" && organization !== undefined)) {
        form["lastModifiedDate"] = new Date();
        Contacts.update({_id: id}, { $set: form });
      }
      $(".invalid-contact-alert").hide();
      $(".edit-contact").parsley().reset();
      $("#editContactModal").modal("hide");
      return false;
    },
    "click .delete-contact-btn": function (event) {
      Contacts.remove(this._id);
      $(".invalid-contact-alert").hide();
      $("#editContactModal").modal("hide");
    }
  });

  Template.EditContact.rendered = function () {
    $(".invalid-contact-alert").hide();
    $(".edit-contact").parsley().subscribe("parsley:form:validate", function (formInstance) {
      if (!$('#edit-name-field').val().length && !$('#edit-organization-field').val().length) {
        formInstance.submitEvent.preventDefault();
        $(".invalid-contact-alert").show();
      }
      return;
    });
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
