if (Meteor.isClient) {

  contactExists = function (name, organizationName) {
    var existingContact;
    if (name && name !== "") {
      existingContact = Contacts.findOne({
        name: name
      });
    }
    else if (organizationName && organizationName != "") {
      existingContact = Contacts.findOne({
        name: organizationName
      });
    }
    if (existingContact) {
      return true;
    }
    else {
      return false;
    }
  }

  var entityMap = {
    " ": "%20",
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  escapeHtml = function (string) {
    return String(string).replace(/[&<>"'\/\s]/g, function (s) {
      return entityMap[s];
    });
  }

  organizationExists = function (org) {
    var existingOrg = Organizations.findOne({
      name: org
    });
    if (existingOrg) {
      return true;
    }
    else {
      return false;
    }
  }

  sanitizePhone = function (phone) {
    // Normalize phone number to use the U.S. hyphen format
    var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phoneRegex.test(phone)) {
      var formattedPhoneNumber = phone.replace(phoneRegex, "$1-$2-$3");
      return formattedPhoneNumber;
    }
  }

  parseMonth = function (d) {
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[d.getMonth()];
  }

  sanitizeQuote = function (quote) {
    return quote.replace(/\s+/g,' ').trim();
  }

  strToId = function (str) {
    return "collapse-" + str;
  }

}