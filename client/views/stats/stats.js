if (Meteor.isClient) {

	UI.registerHelper("navItem", function() {
    return Session.get("navItem");
	});

	Template.Stats.rendered = function () {
		// Set global chart defaults
		Chart.defaults.global.animation = false;
		Chart.defaults.global.responsive = true;
		Chart.defaults.global.scaleFontFamily = "'Open Sans', sans-serif";

		// Set default template to render
		Session.set("navItem", "StatsStakeholders");
		// Setting the session to the name of the template will render it
		// after its respective tab is selected
		$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
		  var pillHash = e.target.hash;
		  if (pillHash === "#stakeholders") {
		  	Session.set("navItem", "StatsStakeholders");
		  }
		  if (pillHash === "#interactions") {
		  	Session.set("navItem", "StatsInteractions");
		  }
		});
	}
}