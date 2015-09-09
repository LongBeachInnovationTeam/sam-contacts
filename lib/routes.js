Router.configure({
  layoutTemplate: "Layout"  // the default layout
});

Router.route('/', function () {
  this.layout("Layout");
  this.render("Home");
});

Router.route('/interactions/:id/:date', function () {
	var contactId = this.params.id;
	var interactionDate = this.params.date;
  var contact = Contacts.findOne({_id: contactId});
  if (contact) {
    var interaction = _.filter(contact.interactions, function (obj) {
      return obj.interactionDate == interactionDate;
    });
    this.render("ShowInteraction", {
      data: {
        contactId: contactId,
        interaction: interaction[0]
      }
    });
  }
});

Router.route('/quotes', function () {
  this.layout("Layout");
  this.render("JuicyQuotes");
});

Router.route('/contact', function () {
  this.layout("Layout");
  this.render("ContactStakeholders");
});

Router.route('/stats', function () {
  this.layout("Layout");
  this.render("Stats");
});
