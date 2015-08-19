if (Meteor.isClient) {

  var compileRecipients = function () {
  	var stakeholderGroups = $("#email-stakeholders-field").select2("val");
		var selectedRecipients = Contacts.find({ tags: { $in: stakeholderGroups } }).fetch();
		var validRecipients = new Array();
		if (selectedRecipients.length > 0) {
			selectedRecipients.forEach(function (r) {
				var isValidEmail = r.email !== "" && r.email;
				if (isValidEmail) {
					validRecipients.push(r.email);
				}
			});

		}
		return _.uniq(validRecipients).sort();
  }

  var resetForm = function () {
    $("#email-stakeholders-field").select2("data", null);
  }

	Template.ContactStakeholders.helpers({
		isEmptyList: function () {
			return Session.get("isEmptyList");
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
			var validRecipients = compileRecipients().join();
			window.prompt("Copy to clipboard: Ctrl+C, Enter", validRecipients);
		},
		"submit .new-email": function (event, template) {
			event.preventDefault();

			var subject = $("#email-subject-field").val();
			var message = $("#email-message-field").val();
			var checkedElement = template.find("input:radio[name=sendAsRadio]:checked");
			// var sendingAs = $(checkedElement).val();
			var validRecipients = compileRecipients();

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
		$("#email-stakeholders-field").select2();
		Session.set("isEmptyList", true);
		$("#email-stakeholders-field").on("change", function (e) {
			var stakeholderGroups = $("#email-stakeholders-field").select2("val");
			if (stakeholderGroups.length === 0) {
				Session.set("isEmptyList", true);
			}
			else {
				Session.set("isEmptyList", false);
			}
		});
	}

}