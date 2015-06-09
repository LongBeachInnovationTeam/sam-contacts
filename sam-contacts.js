Contacts = new Mongo.Collection("contacts");

var contact = {
  name: "",
  title: "",
  organization: "",
  phone: "",
  email: "",
  address: "",
  tags: "",
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
  // the default layout
  layoutTemplate: "layout"
});

Router.route('/', function () {
  this.layout("layout");
  this.render("home");
});

Router.route('/contacts', function () {
  this.layout("layout");
  this.render("contacts");
});

if (Meteor.isClient) {

  Template.contacts.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    }
  });

  Template.addcontact.events({
    "submit .new-contact": function (event) {
      var form = parseForm(event);
      Contacts.insert(form);
      Router.go("contacts");
      return false; // Prevent default form submit
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
