if (Meteor.isClient) {

  var compileRecipients = function (stakeholderGroups) {
  	if (!stakeholderGroups) {
  		stakeholderGroups = $("#email-stakeholders-field").select2("val");
  	}
		var selectedRecipients = Contacts.find({ tags: { $in: stakeholderGroups } }).fetch();
		var validRecipients = new Array();
		if (selectedRecipients.length > 0) {
			selectedRecipients.forEach(function (r) {
				var isValidEmail = r.email !== "" && r.email;
				if (isValidEmail) {
					validRecipients.push(r);
				}
			});

		}
		return _.uniq(validRecipients).sort();
  }

  var getModifiedRecipients = function () {
  	var selected = $("#email-stakeholders-list-field").select2("val");
		return selected;
  }

  var resetForm = function () {
    $("#email-stakeholders-field").select2("data", null);
  }

	Template.ContactStakeholders.helpers({
		isEmptyList: function () {
			return Session.get("isEmptyList");
		},
		getLabelEmail: function (recipient) {
			return recipient.email;
		},
		getLabelName: function (recipient) {
			var label = "";
			if (recipient.name && recipient.name !== "") {
				label = recipient.name;
			}
			else if (recipient.email && recipient.email !== "") {
				label = recipient.email;
			}
			return label;
		},
		getStakeholderAddresses: function () {
			return Session.get("stakeholderAddressList");
		},
    getStakeholders: function () {
      var contacts = Contacts.find({}).fetch();
      var tags = new Array();
      contacts.forEach(function (contact) {
        contact.tags.forEach(function (tag) {
          if (tags.indexOf(tag) < 0) {
            tags.push(tag);
          }
        });
      });
      return tags.sort();
    },
    getOptionValue: function () {
      var self = this;
      return this;
    },
    getUserLabel: function () {
    	return Meteor.user().emails[0].address;
    }
	});

	Template.ContactStakeholders.events({
		"click #btn-copy": function (event, template) {
			event.preventDefault();
			var validRecipients = getModifiedRecipients().join();
			window.prompt("Copy to clipboard: Ctrl+C, Enter", validRecipients);
			return false;
		},
		"click #btn-export": function (event, template) {
			event.preventDefault();
			var categories = $("#email-stakeholders-field").select2("val");
			Router.go("export", { id: categories.join() });
			return false;
		},
		"submit .new-email": function (event, template) {
			event.preventDefault();

			var subject = $("#email-subject-field").val();
			var message = $("#email-message-field").val();
			var checkedElement = template.find("input:radio[name=sendAsRadio]:checked");
			var sendingAs = $(checkedElement).val();
			var validRecipients = getModifiedRecipients();

			if (validRecipients.length > 0) {
				var validRecipientsStr = validRecipients.join();
				var mailToStr = "mailto:" + validRecipientsStr +
					"?subject=" + escapeHtml(subject) +
					"&body=" + escapeHtml(message);
				window.open(mailToStr);
			}

			return false;
		}
	});

	Template.ContactStakeholders.rendered = function () {
		// Initialization of components and states
		$("#email-stakeholders-field").select2();
		$("#email-stakeholders-list-field").select2();
		Session.set("isEmptyList", true);
		$('[data-toggle="tooltip"]').tooltip()

		$(".email-tags-dropdown").on("change", function (e) {
			if (e.val.length === 0) {
				Session.set("isEmptyList", true);
				Session.set("stakeholderAddressList", new Array());
				$("#email-stakeholders-list-field").val(null).trigger("change");
			}
			else {
				Session.set("isEmptyList", false);
				var validRecipients = compileRecipients(e.val);
				var emails = new Array();
				validRecipients.forEach(function (r) {
					emails.push(r.email);
				});
				Session.set("stakeholderAddressList", validRecipients);
				Meteor.setTimeout(function () {
					$("#email-stakeholders-list-field").val(emails).trigger("change");
				}, 100);
			}
		});

	}

}