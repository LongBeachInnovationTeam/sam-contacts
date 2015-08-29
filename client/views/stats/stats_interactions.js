if (Meteor.isClient) {

	var isDateInReportingRange = function (d) {
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 6);
		startDate.setDate(1);
		if (d >= startDate && d <= endDate) {
			return true;
		}
		else {
			return false;
		}
	}

	var getMonthlyTrendData = function () {
		// Data structures for Series 1 and Series 2 of the chart
		var totalInteractions = {};
		var estimatedAttendees = {};
		// Get all contacts that were created withing the last six months
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 6);
		startDate.setDate(1);
		var contacts = Contacts.find({
			interactions: {
				$elemMatch: {
					interactionDate: {
						$gte: startDate.toISOString(),
						$lte: endDate.toISOString()
					}
				}
			}
		}, { sort: { "interactions.interactionDate": 1 } }).fetch();
		contacts.forEach(function (c) {
			c.interactions.forEach(function (i) {
				var createdDate = new Date(i.interactionDate);
				var monthName = parseMonth(createdDate);
				if (isDateInReportingRange(createdDate)) {
					if (totalInteractions[monthName]) {
						var curCount = totalInteractions[monthName];
						totalInteractions[monthName] = curCount + 1;
					}
					else {
						totalInteractions[monthName] = 1;
					}
					if (estimatedAttendees[monthName]) {
						var curCount = estimatedAttendees[monthName];
						estimatedAttendees[monthName] = curCount + parseInt(i.estimatedAttendees);
					}
					else {
						estimatedAttendees[monthName] = parseInt(i.estimatedAttendees);
					}
				}
			});
		});
		var series1Fill = "rgba(59, 216, 125, 0.2)";
		var series1Highlight = "rgba(59, 216, 125, 1.0)";
		var series2Fill = "rgba(59, 85, 216, 0.2)";
		var series2Highlight = "rgba(59, 85, 216, 1.0)";
		var data = {
	    labels: _.keys(totalInteractions),
	    datasets: [
        {
          label: "Total Interactions",
          fillColor: series1Fill,
          strokeColor: series1Highlight,
          pointColor: series1Highlight,
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: series1Highlight,
          data: _.values(totalInteractions)
        },
        {
          label: "Total Interactions",
          fillColor: series2Fill,
          strokeColor: series2Highlight,
          pointColor: series2Highlight,
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: series2Highlight,
          data: _.values(estimatedAttendees)
        }
	    ]
		};
		return data;
	}

	var renderInteractionHistoryChart = function () {
		var data = getMonthlyTrendData();
		var ctx = $("#interaction-history-chart").get(0).getContext("2d");
		new Chart(ctx).Line(data, {
			scaleShowGridLines : false,
			bezierCurve : false
		});
	}

	Template.StatsInteractions.rendered = function () {
		Meteor.setTimeout(function () {
			renderInteractionHistoryChart();
			//resizeCountPanel();
		}, 500);
	}

	Template.StatsInteractions.helpers({
		getCurrentMonthLabel: function () {
			var today = new Date();
			var monthName = parseMonth(today);
			var year = today.getFullYear().toString();
			var yearLabel = "'" + year.substring(2, year.length);
			var label = monthName.substring(0, 3).toUpperCase() + " " + yearLabel;
			return label;
		},
		getTotalInteractions: function () {
			var counter = 0;
			Contacts.find().fetch().forEach(function (c) {
				counter += c.interactions.length;
			});
			return counter;
		},
		getTotalNonIteamMembers: function () {
			var counter = 0;
			Contacts.find().fetch().forEach(function (c) {
				c.interactions.forEach(function (i) {
					var estimatedAttendees = i.estimatedAttendees;
					if (estimatedAttendees && estimatedAttendees !== "") {
						counter += parseInt(i.estimatedAttendees);
					}
				});
			});
			return counter;
		}
	});

}