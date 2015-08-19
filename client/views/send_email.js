if (Meteor.isClient) {

  var resetForm = function () {
    $(".email-tags-dropdown").select2("data", null);
  }

	Template.ContactStakeholders.helpers({
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
		"submit .new-email": function (event, template) {
			event.preventDefault();

			var stakeholderGroups = $("#email-stakeholders-field").select2("val");
			var subject = $("#email-subject-field").val();
			var message = $("#email-message-field").val();
			var checkedElement = template.find('input:radio[name=sendAsRadio]:checked');
			// var sendingAs = $(checkedElement).val();

			var selectedRecipients = Contacts.find({ tags: { $in: stakeholderGroups } }).fetch();
			var validRecipients = new Array();

			if (selectedRecipients.length > 0) {
				selectedRecipients.forEach(function (r) {
					var isValidEmail = r.email !== "" && r.email;
					var isNotDuplicate = validRecipients.indexOf(r.email > -1);
					if (isValidEmail && isNotDuplicate) {
						validRecipients.push(r.email);
					}
				});
				validRecipients.sort();
			}

			var validRecipientsStr = validRecipients.join();
			var mailToStr = "mailto:" + validRecipientsStr +
				"?subject=" + subject.trim().replace(" ", "%20") +
				"&body=" + message.trim().replace(" ", "%20");
			window.open(mailToStr);

			return false;
		},


	});

	Template.ContactStakeholders.rendered = function () {
		$(".email-tags-dropdown").select2();
	}

}