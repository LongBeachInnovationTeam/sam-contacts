if (Meteor.isClient) {

	var getSortedKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
			keys.push(key);
  	}
    return keys.sort(function (a,b) {
			return obj[a] - obj[b];
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
		var sortedKeys = getSortedKeys(tagCounts).reverse();
		var sortedValues = _.values(tagCounts).sort(function (a, b) {
			return b - a;
		});
		var data = {
		  labels: sortedKeys,
		  datasets: [
		    {
		      label: "Total Categories",
		      fillColor: "rgba(123, 45, 131, 1.0)",
		      strokeColor: "rgba(123, 45, 131, 1.0)",
		      highlightFill: "rgba(123, 45, 131, 0.75)",
		      highlightStroke: "rgba(123, 45, 131, 1.0)",
		      data: sortedValues
		    }
		  ]
		};
		return data;
	}

	var renderMonthlyCategoriesChart = function (d) {
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
			renderMonthlyCategoriesChart(categoryCountData);
		}
	}

}