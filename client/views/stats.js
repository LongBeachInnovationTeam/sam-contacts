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

	var renderCategoriesCountChart = function (d) {
		var ctx = $("#category-chart").get(0).getContext("2d");
		var monthlyCategoryChart = new Chart(ctx).Bar(d, {
			scaleShowGridLines: false
		});
	}

	Template.Stats.helpers({
	});

	Template.Stats.events({

	});

	Template.Stats.created = function () {
		Session.set("categoryCountData", getCategoriesCountData());
	}

	Template.Stats.rendered = function () {
		Chart.defaults.global.responsive = true;
		var categoryCountData = Session.get("categoryCountData");
		if (categoryCountData) {
			renderCategoriesCountChart(categoryCountData);
		}
	}

}