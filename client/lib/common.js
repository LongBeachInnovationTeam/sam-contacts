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

  sanitizeQuote = function (quote) {
    return quote.replace(/\s+/g,' ').trim();
  }

  strToId = function (str) {
    return "collapse-" + str;
  }

}