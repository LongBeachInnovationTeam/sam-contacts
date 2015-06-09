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

var clearForm = function (e, formData) {
  for (var prop in formData) {
    if (formData.hasOwnProperty(prop)) {
      e.target[prop].value = "";
    }
  }
}

if (Meteor.isClient) {

  Template.body.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    }
  });

  Template.body.events({
    "submit .new-contact": function (event) {
      var form = parseForm(event);
      Contacts.insert(form);
      clearForm(event, form);
      return false; // Prevent default form submit
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
