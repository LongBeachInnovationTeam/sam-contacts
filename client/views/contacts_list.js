if (Meteor.isClient) {

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
    getInteractionHref: function (id, date) {
      return "interactions/" + id + "/" + date;
    },
    getLastContactedDate: function () {
      var lastContactedDate = this.interactions[this.interactions.length - 1].interactionDate;
      return lastContactedDate;
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

}