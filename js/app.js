
var styles = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFAD00"
            },
            {
                "saturation": 50.2
            },
            {
                "lightness": -34.8
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FFAD00"
            },
            {
                "saturation": -19.8
            },
            {
                "lightness": -1.8
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FFAD00"
            },
            {
                "saturation": 72.4
            },
            {
                "lightness": -32.6
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#FFAD00"
            },
            {
                "saturation": 74.4
            },
            {
                "lightness": -18
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#00FFA6"
            },
            {
                "saturation": -63.2
            },
            {
                "lightness": 38
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#FFC300"
            },
            {
                "saturation": 54.2
            },
            {
                "lightness": -14.4
            },
            {
                "gamma": 1
            }
        ]
    }
]
var locations = [
          {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];

        //global variables

        var bounds;
        var map;

        function initMap(){
        map = new google.maps.Map(document.getElementById('map'), {
           center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13,
          styles: styles,
          mapTypeControl: false
        });


        ko.applyBindings(new ViewModel());
        infoWindow = new google.maps.InfoWindow();
        bounds = new google.maps.LatLngBounds();
        }


    var LocationModel = function(data) {
	var self = this;
	this.name = data.title;
	this.position=data.location;
	this.URL = "";
	this.street = "";
	this.city = "";
	this.phone = "";

//array of locations is pushed from the VM and markers drop in upon page load
	this.marker = new google.maps.Marker({
       position: this.position,
        title: this.name,
        animation: google.maps.Animation.DROP,
        map:map
         });


	this.visible = ko.observable(true);
		this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);


	this.bounce = function(place) {
	google.maps.event.trigger(self.marker, 'click');

	};

	//marker event handler
this.marker.addListener('click', function(){
self.marker.setAnimation(google.maps.Animation.BOUNCE);

})
};





function ViewModel(){
var self = this;
this.LocationArray = ko.observableArray([])
this.searchString = ko.observable("");


       //add the location to a location list
        locations.forEach(function(locationItem) {
        self.LocationArray.push(new LocationModel(locationItem));
        });

	this.filteredList = ko.computed(function() {
		var filter = self.searchString().toLowerCase();
		if (!filter) { //if nothing is entered in search string
			self.LocationArray().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.LocationArray();

		} else {
		return ko.utils.arrayFilter(self.LocationArray(), function(locationItem) {
                var str = locationItem.name.toLowerCase();
                var result = str.includes(filter);
                locationItem.visible(result); //show only the locations that are in the input string
				return result;

},self);
}
});
}

 function googleMapError(){
alert("error")
}
