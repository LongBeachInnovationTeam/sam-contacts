if (Meteor.isClient) {

	var getSortedKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
			keys.push(key);
  	}
    return keys.sort(function (a,b) {
			return obj[a] - obj[b];
    }).reverse();
	}

	var getSortedValues = function (obj) {
		return _.values(obj).sort(function (a, b) {
			return b - a;
		});
	}

	var getCategoriesCountData = function () {
		var tagCounts = {};
		var contacts = Contacts.find({}).fetch();
		contacts.forEach(function (c) {
			c.tags.forEach(function (t) {
				if (tagCounts[t]) {
					var curCount = tagCounts[t];
					tagCounts[t] = curCount + 1;
				}
				else {
					tagCounts[t] = 1;
				}
			});
		});
		var sortedKeys = getSortedKeys(tagCounts);
		var sortedValues = getSortedValues(tagCounts);
		var rgbaFill = "rgba(123, 45, 131, 1.0)";
		var rgbaHighlight = "rgba(123, 45, 131, 0.75)";
		var data = {
		  labels: sortedKeys,
		  datasets: [
		    {
		      label: "Total Categories",
		      fillColor: rgbaFill,
		      strokeColor: rgbaFill,
		      highlightFill: rgbaHighlight,
		      highlightStroke: rgbaFill,
		      data: sortedValues
		    }
		  ]
		};
		return data;
	}

	var getMonthlyTrendData = function () {
		var rollingMonths = {};
		// Get all contacts that were created withing the last six months
		var startDate = new Date();
		var endDate = new Date(startDate);
		endDate.setMonth(startDate.getMonth() - 6);
		endDate.setDate(1);
		var contacts = Contacts.find({
			createdDate: {
				$gte: endDate,
				$lt: startDate
			}
		}).fetch();
		contacts.forEach(function (c) {
			var createdDate = new Date(c.createdDate);
			var monthName = parseMonth(createdDate);
			if (rollingMonths[monthName]) {
				var curCount = rollingMonths[monthName];
				rollingMonths[monthName] = curCount + 1;
			}
			else {
				rollingMonths[monthName] = 1;
			}
		});
		var rgbaFill = "rgba(123, 45, 131, 0.2)";
		var rgbaHighlight = "rgba(123, 45, 131, 1.0)";
		var data = {
	    labels: _.keys(rollingMonths),
	    datasets: [
        {
          label: "My dataset",
          fillColor: rgbaFill,
          strokeColor: rgbaHighlight,
          pointColor: rgbaHighlight,
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: rgbaHighlight,
          data: _.values(rollingMonths)
        }
	    ]
		};
		return data;
	}

	var parseMonth = function (d) {
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

	var getTotalParticipantCount = function () {
		var participants = {};
		var startDate = new Date();
		var endDate = new Date(startDate);
		endDate.setDate(1);
		var contacts = Contacts.find({
			createdDate: {
				$gte: endDate,
				$lt: startDate
			}
		}).fetch();
		contacts.forEach(function (c) {
			var email = c.ownerUsername;
			var userName = email.match(/^([^@]*)@/)[1];
			var firstName = userName.split(".")[0];
			if (participants[firstName]) {
				var curCount = participants[firstName];
				participants[firstName] = curCount + 1;
			}
			else {
				participants[firstName] = 1;
			}
		});
		return participants;
	}

	var renderCategoriesCountChart = function () {
		var data = getCategoriesCountData();
		var ctx = $("#category-chart").get(0).getContext("2d");
		new Chart(ctx).Bar(data, {});
	}

	var renderMonthlyTrendChart = function () {
		var data = getMonthlyTrendData();
		var ctx = $("#monthly-trend-chart").get(0).getContext("2d");
		new Chart(ctx).Line(data, {
			scaleShowGridLines : false,
			bezierCurve : false
		});
	}

	Template.Stats.rendered = function () {
		Chart.defaults.global.responsive = true;
		renderCategoriesCountChart();
		renderMonthlyTrendChart();
	}

	Template.Stats.helpers({
		getTotalContacts: function () {
			return Contacts.find().count();
		},
		getTotalJuicyQuotes: function () {
			var counter = 0;
			Contacts.find().fetch().forEach(function (c) {
				counter += c.quotes.length;
			});
			return counter;
		}
	});

}