Contacts = new Mongo.Collection("contacts");

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
    if (formData.hasOwnProperty(prop)) {
      formData[prop] = e.target[prop].value;
    }
  }
  return formData;
}

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
      var newStr = "#collapse-" + str.toLocaleLowerCase().replace(" ", "-").replace(",","-").trim();
      return newStr;
    },
    getCollapseId: function (str) {
      var newStr = "collapse-" + str.toLocaleLowerCase().replace(" ", "-").replace(",","-").trim();
      return newStr;
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
      return _.map(self.tags, function (value, index){
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

  // Clear form when the modal is hidder
  // $('#addContactModal').on('hide.bs.modal', function(){
  //   console.log("HIDDEN");
  //   //$(this).find('form')[0].reset();
  // });

  Template.body.events({
    "submit .new-contact": function (event) {
      var form = parseForm(event);
      form["lastModifiedDate"] = new Date();
      form["tags"] = $("#add-contact-tags").tagsinput('items'); // get tags from tag input
      Contacts.insert(form);
      $('#addContactModal').modal('hide');
      Router.go("/");
      return false; // Prevent default form submit
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
