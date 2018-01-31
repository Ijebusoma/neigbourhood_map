
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
          {title: 'Park Ave Penthouse', lat: 40.7713024, lng: -73.9632393},
          {title: 'Chelsea Loft', lat: 40.7444883, lng: -73.9949465},
          {title: 'Union Square Open Floor Plan', lat: 40.7347062, lng: -73.9895759},
          {title: 'East Village Hip Studio', lat: 40.7281777, lng: -73.984377},
          {title:'Times Square',lat:40.734201,lng:-73.914769}
          ];

        //global variables

        var bounds;
        var map;
        var clientID;
        var clientSecret;

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
	this.lat=data.lat;
	this.lng=data.lng;
	//this.lng=data.location.lng;
	//this.URL;
	this.hours = "";
	this.address = "";




 //FOURSQUARE API Attachments
 clientID="GCQZ0YREZOBQUMWO54DCJTBC33WPB4AR2N0L30ZVO5ZHC5GD"
clientSecret="VVZIKOHDH0RIEPXBXZPYEYPWBC3ETZISHDXX3ILEU2R5DQP1"
  var largeInfowindow = new google.maps.InfoWindow();
function openWindow(marker,infoWindow){
//alert(this.lat)

	var foursquareUrl = "https://api.foursquare.com/v2/venues/search?ll=" +marker.lat+','+marker.lng+'&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + marker.title;
	$.ajax({
	 url:foursquareUrl,
	 async:true,
	 data:{
	 format:'json'
	 },
      success: function(data) {
      alert("success")
      /**

         //var results = data.response.venues[0];

         var results = data['response']['venues'][0];
         //address = data['location']['formattedAddress'];

         self.URL = results.url;
           self.address=results.location.address;
         if(typeof self.URL === 'undefined'){
         self.URL === 'Website N/A'
         }

         infoWindow.setContent('<p>'+self.name+'</p>'+'<p>'+self.URL+'</p>')
         infoWindow.open(map,marker)
**/
        },
      error: function() {
          alert("Error while fetching Foursquare data")
      }
   });
}

   //FOURSQUARE ENDS
//array of locations is pushed from the VM and markers drop in upon page load
	this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.lat, this.lng),
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

//self.infoWindow.open(map, this);
self.marker.setAnimation(google.maps.Animation.BOUNCE);
setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);

openWindow(this,largeInfowindow)
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
//Google Map error handler
 function googleMapError(){
document.getElementById('map').innerHTML= "There was an error while fetching data from Google Maps, check your internet connection and try again"
}
