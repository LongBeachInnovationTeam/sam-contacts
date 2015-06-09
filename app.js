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
  layoutTemplate: "Layout"
});

Router.route('/', function () {
  this.layout("Layout");
  this.render("Home");
});

// Router.route('/contacts', function () {
//   this.layout("layout");
//   this.render("contactslist");
// });

TabularTables = {};

TabularTables.Contacts = new Tabular.Table({
  name: "ContactsList",
  collection: Contacts,
  columns: [
    {data: "name", title: "NAME"},
    {data: "title", title: "TITLE"},
    {data: "organization", title: "ORGANIZATION"},
    {data: "phone", title: "PHONE"},
    {data: "email", title: "EMAIL"},
    {data: "address", title: "ADDDRESS"},
    {data: "tags", title: "TAGS"},
    {data: "notes", title: "NOTES"}
  ],
  responsive: true
});


if (Meteor.isClient) {

  Template.registerHelper("TabularTables", TabularTables);

  Template.ContactsList.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    }
  });

  Template.AddContact.events({
    "submit .new-contact": function (event) {
      var form = parseForm(event);
      Contacts.insert(form);
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
