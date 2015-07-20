if (Meteor.isClient) {

  incrementLimit = function (inc) {
    if (!inc) {
      inc = 10;
    }
    var newLimit = Session.get("limit") + inc;
    Session.set("limit", newLimit);
  }

  Template.ContactsList.helpers({
    contacts: function () {
      return Contacts.find({}, {
        limit: Session.get("limit"),
        sort: { name: 1, organization: 1 }
      });
    },
    getCell: function (str) {
      if (str && str !== "") {
        return " | M: " + str;
      }
      else {
        return "";
      }
    },
    getCollapseHref: function (str) {
      return "#" + strToId(str);
    },
    getCollapseId: function (str) {
      return strToId(str);
    },
    getEmail: function (str) {
      if (str && str !== "") {
        return str;
      }
      else {
        return "Unknown Email";
      }
    },
    getInteractionHref: function (id, date) {
      return "interactions/" + id + "/" + date;
    },
    getLastContactedDate: function () {
      var lastInteraction = this.interactions[this.interactions.length - 1];
      if (lastInteraction && lastInteraction.hasOwnProperty("interactionDate")) {
        var lastContactedDate = lastInteraction.interactionDate;
        if (lastContactedDate) {
          return lastContactedDate;
        }
      }
    },
    getLastContactedDateHref: function () {
      var interactionDate = this.interactions[this.interactions.length - 1].interactionDate;
      if (interactionDate) {
        var lastContactedDateHref = "interactions/" + this._id + "/" + interactionDate;
        return lastContactedDateHref;
      }
      else {
        return "#";
      }
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
    getPhone: function (phone, ext) {
      if (phone && phone !== "") {
        if (ext && ext !== "" && typeof ext === "string") {
          return phone + " x" + ext;
        }
        else {
          return phone;
        }
      }
      else {
        return "Unknown Phone";
      }
    },
    getTags: function() {
      var self = this;
      self.tags = self.tags || [];
      if (Array.isArray(self.tags)) {
        return _.map(self.tags, function (value, index) {
          return {
            value: value,
            index: index
          };
        });
      }
    },
    getTotalContacts: function () {
      return Contacts.find().count();
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
    "click .add-interaction-btn": function (event) {
      var id = event.target.dataset.id;
      Session.set("editContactId", id);
      $("#add-interaction-modal").modal("show");
    },
    "click .contact-edit-btn": function (event) {
      console.log(event);
      var id = event.target.id;
      Session.set("editContactId", id);
      Meteor.setTimeout(function () {
        $("#" + id + "-edit-tags-field").tagsinput("refresh");
      }, 100);
    }
  });

  Template.ContactsList.created = function () {
    Session.setDefault("limit", 20);
    // Deps.autorun() automatically rerun the subscription whenever Session.get('limit') changes
    // http://docs.meteor.com/#deps_autorun
    Deps.autorun(function() {
      Meteor.subscribe("getContacts", Session.get("limit"));
    });
  }

  Template.ContactsList.rendered = function () {
    // is triggered every time we scroll
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        incrementLimit();
      }
    });
  }

}