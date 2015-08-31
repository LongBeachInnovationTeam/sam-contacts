if (Meteor.isClient) {

	var isDateInReportingRange = function (d) {
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 6);
		startDate.setDate(1);
		if (d.getTime() >= startDate.getTime() && d <= endDate.getTime()) {
			return true;
		}
		else {
			return false;
		}
	}

	var getMonthlyInteractionHistoryData = function () {
		// Data structures for Series 1 and Series 2 of the chart
		var totalInteractions = {};
		var estimatedAttendees = {};

		// Get all contacts that were created withing the last six months
		var endDate = new Date();
		var startDate = new Date(endDate);
		startDate.setMonth(startDate.getMonth() - 6);
		startDate.setDate(1);

		// Initialize values for the past six months
		var dateRange = getDateRange(startDate, endDate);
		dateRange.forEach(function (d) {
			var currentMonth = parseMonth(d);
			if (!totalInteractions[currentMonth]) {
				totalInteractions[currentMonth] = 0;
			}
			if (!estimatedAttendees[currentMonth]) {
				estimatedAttendees[currentMonth] = 0;
			}
		});

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
						estimatedAttendees[monthName] = curCount + (parseInt(i.estimatedAttendees) || 0);
					}
					else {
						estimatedAttendees[monthName] = parseInt(i.estimatedAttendees) || 0;
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
          label: "Total interactions",
          fillColor: series1Fill,
          strokeColor: series1Highlight,
          pointColor: series1Highlight,
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: series1Highlight,
          data: _.values(totalInteractions)
        },
        {
          label: "Estimated non-iteam members met",
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

	var getCategoryData = function () {
		// Data structures for Series 1 and Series 2 of the chart
		var tags = {};
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
				if (isDateInReportingRange(createdDate)) {
					c.tags.forEach(function (t) {
						if (tags[t]) {
							var curCount = tags[t];
							tags[t] = curCount + (parseInt(i.estimatedAttendees) || 0);
						}
						else {
							tags[t] = parseInt(i.estimatedAttendees) || 0;
						}
					});
				}
			});
		});
		var data = new Array();
		for(var t in tags) {
			var attr = tags[t];
			if (tags.hasOwnProperty(t) && attr > 0) {
				data.push({
					value: attr,
					color: randomColor({ luminosity: "bright", count: tags.length }),
					label: t
				});
			}
		}
		return data;
	}

	var renderInteractionHistoryChart = function () {
		var data = getMonthlyInteractionHistoryData();
		var ctx = $("#interaction-history-chart").get(0).getContext("2d");
		var chart = new Chart(ctx).Line(data, {
			scaleShowGridLines : false,
			bezierCurve : false
		});
		return chart;
	}

	var renderCategoryPolarAreaChart = function () {
		var data = getCategoryData();
		var ctx = $("#interaction-category-chart").get(0).getContext("2d");
		var chart = new Chart(ctx).PolarArea(data);
		return chart;
	}

	// Make the count panel and monthly trend panel the same height
	var resizeCountPanel = function () {
		var monthlyTrendPanelHeight = $("#monthly-trend-panel").height();
		$("#count-panel").height(monthlyTrendPanelHeight);
	}

	Template.StatsInteractions.created = function () {
	  $(window).resize(function () {
	  	Meteor.setTimeout(function () {
				resizeCountPanel();
			}, 100);
	  });
	}

	Template.StatsInteractions.destroyed = function () {
		$(window).off('resize');
	}

	Template.StatsInteractions.rendered = function () {
		Meteor.setTimeout(function () {
			var interactionHistoryChart = renderInteractionHistoryChart();
			var categoryPolarAreaChart = renderCategoryPolarAreaChart();
			resizeCountPanel();
			// Generate the legend after resizing the panel in order to make it responsive
			$("#interaction-history-legend").html(interactionHistoryChart.generateLegend());
			$("#interaction-category-legend").html(categoryPolarAreaChart.generateLegend());
		}, 500);
	}

	Template.StatsInteractions.helpers({
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