Router.configure({
  layoutTemplate: "Layout"  // the default layout
});

Router.route('/', function () {
  this.layout("Layout");
  this.render("Home");
});

Router.route('/interactions', function () {
  this.layout("Layout");
  this.render("Interactions");
});

Router.route('/interactions/:id/:date', function () {
	var contactId = this.params.id;
	var interactionDate = this.params.date;
  var contact = Contacts.findOne({_id: contactId});
  if (contact) {
    var interaction;
    for (var i in contact.interactions) {
      if (contact.interactions[i].interactionDate === interactionDate) {
        interaction = contact.interactions[i];
        break;
      }
    }
    this.render("ShowInteraction", {
      data: {
        contactId: contactId,
        interaction: interaction
      }
    });
  }
});

Router.route('/email', function () {
  this.layout("Layout");
  this.render("EmailStakeholders");
});

Router.route('/categories', function () {
  this.layout("Layout");
  this.render("Categories");
});