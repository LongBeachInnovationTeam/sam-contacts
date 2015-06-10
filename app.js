Contacts = new Mongo.Collection("contacts");

var contact = {
  name: "",
  title: "",
  organization: "",
  phone: "",
  email: "",
  address: "",
  //tags: "",
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

TabularTables = {};

TabularTables.Contacts = new Tabular.Table({
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
  name: "ContactsList",
  responsive: true
});


if (Meteor.isClient) {

  Template.registerHelper("TabularTables", TabularTables);

  Template.ContactsList.helpers({
    contacts: function () {
      return Contacts.find({}, { sort: { name: 1 }});
    }
  });

  Template.body.events({
    "submit .new-contact": function (event) {
      var form = parseForm(event);
      form["lastModifiedDate"] = new Date();
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
