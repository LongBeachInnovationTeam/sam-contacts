if (Meteor.isClient) {

  // incrementLimit = function (inc) {
  //   if (!inc) {
  //     inc = 10;
  //   }
  //   var newLimit = Session.get("limit") + inc;
  //   Session.set("limit", newLimit);
  // }

  var colorCode = 0;

  var resetAddQuoteForm = function () {
    // Reset form, hide modal, and return to caller
    $(".new-contact").parsley().reset();
    $(".new-contact")[0].reset();
    $("#add-quote-modal").modal("hide");
  }

  Template.JuicyQuotes.helpers({
    contacts: function () {
      return Contacts.find({}, {
        limit: Session.get("limit")
      });
    },
    getQuoteType: function () {
      if (colorCode == 6) {
        colorCode = 0;
      }
      colorCode++;
      return "quoute-type" + colorCode;
    }
  });

  Template.JuicyQuotes.created = function () {
    Session.setDefault("limit", 50);
    // Deps.autorun() automatically rerun the subscription whenever Session.get('limit') changes
    // http://docs.meteor.com/#deps_autorun
    Deps.autorun(function() {
      Meteor.subscribe("getContacts", Session.get("limit"));
    });
  }

  // Template.JuicyQuotes.rendered = function () {
  //   // is triggered every time we scroll
  //   $(window).scroll(function() {
  //     if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  //       incrementLimit();
  //     }
  //   });
  // }

}