<!DOCTYPE html>
<html>
<head>
	<title>Google map test</title>
	<script type="text/javascript" src="/js/jquery-1.11.1.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
	<style type="text/css">
	#map {
		width: 1000px;
		height: 400px;
	}
	</style>
</head>
<body>

<h1>ggg</h1>

<div id="map" data-zoom="10" data-data="[1.346452,103.859510],[1.373224,103.752565]"></div>
<p>AIzaSyBEwxg16GAXtHtDjCUDXyIworx73oVrCJ8</p>

869937364022-00tg9n8jfh0kbklc97rmvn89qm83vbfe.apps.googleusercontent.com

<script type="text/javascript">
	function initMap(idHtml) {
		idHtml = '#'+idHtml;
		zoom = jQuery(idHtml).attr('data-zoom');
		data = jQuery(idHtml).attr('data-data');
		if(!data) {
			return;
		}
		data = '['+data+']';
		data = JSON.parse(data);
		if(!data) {
			return;
		}
		if(!zoom) {
			zoom = 10;
		}
		zoom = parseInt(zoom);
		latLongFirst = {lat: data[0][0], lng: data[0][1]};
		var map = new google.maps.Map(document.getElementById('map'), {
		    zoom: zoom,
		    center: latLongFirst
		});
	  	for (var i = 0; i < data.length; i++) {
		    var latLong = data[i];
		    var marker = new google.maps.Marker({
		      position: {lat: latLong[0], lng: latLong[1]},
		      map: map,
		      zIndex: zoom
		    });
  		}
	}
	initMap('map');
</script>

<?php /*
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBEwxg16GAXtHtDjCUDXyIworx73oVrCJ8&callback=initMap"></script>
*/ ?>
</body>
</html>