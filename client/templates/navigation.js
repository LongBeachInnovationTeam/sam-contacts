Template.Navigation.rendered = function () {
	$(".navbar-nav li a").click(function (e) {
		$(".navbar-collapse").collapse('hide');
	});
}