if (Meteor.isClient) {

  contactExists = function (name) {
    var existingContact = Contacts.findOne({
      name: name
    });
    if (existingContact) {
      return true;
    }
    else {
      return false;
    }
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

  sanitizeTags = function (tags) {
    // Get tags from tag input, split them into a new array, strip out any
    // non-alphanumeric characters make them lowercase, and return an array of tags
    var tagsArray = tags.split(",");
    for (tag in tagsArray) {
      tagsArray[tag] = tagsArray[tag].toLowerCase().replace(/\W/g, ' ');
    }
    return tagsArray;
  }

  strToId = function (str) {
    return "collapse-" + str;
  }

}