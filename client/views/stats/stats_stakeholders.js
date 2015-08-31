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
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 6);
		startDate.setDate(1);
		var contacts = Contacts.find({
			createdDate: {
				$gte: startDate,
				$lte: endDate
			}
		}, { sort: { createdDate: 1 } }).fetch();
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

	var getMonthlyParticipantCount = function (startDate, endDate) {
		var participants = {
			alex: 0,
			alma: 0,
			eric: 0,
			harrison: 0,
			heidi: 0,
			holly: 0,
			john: 0,
			ryan: 0
		};
		var contacts = Contacts.find({
			createdDate: {
				$gte: startDate,
				$lte: endDate
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

	var getPreviousMonthParticipantCount = function (){
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 1);
		startDate.setDate(1);
		return getMonthlyParticipantCount(startDate, endDate);
	}

	var getCurrentMonthParticipantCount = function () {
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setDate(1);
		return getMonthlyParticipantCount(startDate, endDate);
	}

	var getMonthlyParticipantData = function () {
		var currentMonthData = getCurrentMonthParticipantCount();
		var previousMonthData = getPreviousMonthParticipantCount();
		var combinedKeys = _.union(_.keys(previousMonthData), _.keys(currentMonthData));

		var currentRgbaFill = "rgba(123, 45, 131, 1.0)";
		var currentRgbaHighlight = "rgba(123, 45, 131, 0.75)";
		var previousRgbaFill = "rgba(59, 85, 216, 1.0)";
		var previousRgbaHighlight = "rgba(59, 85, 216, 0.75)";

		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 1);
		var currentMonthName = parseMonth(endDate);
		var previousMonthName = parseMonth(startDate);

		var data = {
	    labels: combinedKeys,
	    datasets: [
        {
          label: previousMonthName + " " + "Participation",
		      fillColor: previousRgbaFill,
		      strokeColor: previousRgbaFill,
		      highlightFill: previousRgbaHighlight,
		      highlightStroke: previousRgbaFill,
          data: _.values(previousMonthData)
        },
        {
          label: currentMonthName + " " + "Participation",
		      fillColor: currentRgbaFill,
		      strokeColor: currentRgbaFill,
		      highlightFill: currentRgbaHighlight,
		      highlightStroke: currentRgbaFill,
          data: _.values(currentMonthData)
        }
	    ]
		};

		return data;
	}

	var renderCategoriesCountChart = function () {
		var data = getCategoriesCountData();
		var ctx = $("#category-chart").get(0).getContext("2d");
		new Chart(ctx).Bar(data);
	}

	var renderMonthlyTrendChart = function () {
		var data = getMonthlyTrendData();
		var ctx = $("#monthly-trend-chart").get(0).getContext("2d");
		new Chart(ctx).Line(data, {
			scaleShowGridLines : false,
			bezierCurve : false
		});
	}

	var renderMonthlyParticipantChart = function () {
		var data = getMonthlyParticipantData();
		var ctx = $("#monthly-participation-chart").get(0).getContext("2d");
		var chart = new Chart(ctx).Bar(data);
		document.getElementById("monthly-participation-legend").innerHTML = chart.generateLegend();
	}

	// Make the count panel and monthly trend panel the same height
	var resizeCountPanel = function () {
		var monthlyTrendPanelHeight = $("#monthly-trend-panel").height();
		$("#count-panel").height(monthlyTrendPanelHeight);
	}

	Template.StatsStakeholders.created = function () {
	  $(window).resize(function () {
	  	Meteor.setTimeout(function () {
				resizeCountPanel();
			}, 100);
	  });
	}

	Template.StatsStakeholders.destroyed = function () {
		$(window).off('resize');
	}

	Template.StatsStakeholders.rendered = function () {
		Meteor.setTimeout(function () {
			renderCategoriesCountChart();
			renderMonthlyTrendChart();
			renderMonthlyParticipantChart();
			resizeCountPanel();
		}, 500);
	}

	Template.StatsStakeholders.helpers({
		getCurrentMonthLabel: function () {
			var today = new Date();
			var monthName = parseMonth(today);
			var year = today.getFullYear().toString();
			var monthLabel = monthName.substring(0, 3).toUpperCase();
			var yearLabel = "'" + year.substring(2, year.length);
			var label = monthLabel + " " + yearLabel;
			return label;
		},
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