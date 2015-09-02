if (Meteor.isClient) {

  /*
    * To Title Case 2.1 – http://individed.com/code/to-title-case/
    * Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
   */
  String.prototype.toTitleCase = function () {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
      if (index > 0 && index + match.length !== title.length &&
        match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
        (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }
      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }
      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  };

  Date.prototype.addDays = function (days) {
    var d = new Date(this.valueOf())
    d.setDate(d.getDate() + days);
    return d;
  }

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

  getAllTags = function () {
    var tags = [
      "access to capital",
      "access to services",
      "business services",
      "co-working space",
      "creative economy",
      "eb-5",
      "economic development",
      "education",
      "entrepreneur",
      "external partner",
      "federal",
      "funding",
      "grants",
      "hackathon",
      "hub/cluster",
      "i-team",
      "incubator",
      "infrastructure",
      "internal partner",
      "jobs",
      "long beach",
      "market research",
      "media",
      "non profit",
      "open data",
      "placemaking",
      "real estate development",
      "research",
      "small business",
      "solutioning",
      "tech",
      "venture capital",
      "workforce development",
    ];
    return tags.sort();
  }

  getDateRange = function (startDate, endDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate.getTime() <= endDate.getTime()) {
      dateArray.push(new Date (currentDate));
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
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
    return moment(d).format("MMMM");
  }

  sanitizeQuote = function (quote) {
    return quote.replace(/\s+/g,' ').trim();
  }

  strToId = function (str) {
    return "collapse-" + str;
  }

}