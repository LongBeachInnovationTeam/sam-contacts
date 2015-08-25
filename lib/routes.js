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

var createCsv = function() {
  var categories = this.params.id.replace("%20", " ").split(",");
  var selectedRecipients = Contacts.find({ tags: { $in: categories } }).fetch();
  var d = new Date();
  var fileName = "sam-export-" + d.toJSON() + ".csv";
  var csv = Papa.unparse(selectedRecipients);
  // Set the headers
  this.response.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename=' + fileName
  });
  return this.response.end(csv);
};

Router.route('/export/:id', createCsv, { name:'export', where: 'server' });
