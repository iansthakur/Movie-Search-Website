  
  
  var favArray=[];


  let pos;
  let map;
  let bounds;
  let infoWindow;
  let currentInfoWindow;
  let service;
  let infoPane;

  // https://codelabs.developers.google.com/codelabs/google-maps-nearby-search-js/#0
  // THIS CODE WAS TAKEN FROM GOOGLE CODEDOCS
  function initMap() {
    // Initialize variables
    bounds = new google.maps.LatLngBounds();
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;
    /* TODO: Step 4A3: Add a generic sidebar */
    infoPane = document.getElementById('panel');
    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 20
        });
        bounds.extend(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Movie theaters near you');
        infoWindow.open(map);
        map.setCenter(pos);
        // Call Places Nearby Search on user's location
        getNearbyPlaces(pos);
      }, () => {
        // Browser supports geolocation, but user has denied permission
        handleLocationError(true, infoWindow);
      });
    } else {
      // Browser doesn't support geolocation
      handleLocationError(false, infoWindow);
    }
  }


  // Handle a geolocation error
  function handleLocationError(browserHasGeolocation, infoWindow) {
    // Set default location to Sydney, Australia
    pos = { lat: -33.856, lng: 151.215 };
    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 20
    });
    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Geolocation permissions denied. Using default location.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;
    // Call Places Nearby Search on the default location
    getNearbyPlaces(pos);
  }


  // Perform a Places Nearby Search Request
  function getNearbyPlaces(position) {
    let request = {
      location: position,
      rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: 'theater'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
  }
  // Handle the results (up to 20) of the Nearby Search
  function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results);
    }
  }


  // Set markers at the location of each place result
  function createMarkers(places) {
    places.forEach(place => {
      let marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
      });
      // Add click listener to each marker
      google.maps.event.addListener(marker, 'click', () => {
        let request = {
          placeId: place.place_id,
          fields: ['name', 'rating']
        };
        service.getDetails(request, (placeResult, status) => {
          showDetails(placeResult, marker, status)
        });
      });
      // Adjust the map bounds to include the location of this marker
      bounds.extend(place.geometry.location);
    });
    /* Once all the markers have been placed, adjust the bounds of the map to
     * show all the markers within the visible area. */
    map.fitBounds(bounds);
  }


  // Builds an InfoWindow to display details above the marker
  function showDetails(placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      let placeInfowindow = new google.maps.InfoWindow();
      let rating = "None";
      if (placeResult.rating) rating = placeResult.rating;
      placeInfowindow.setContent('<div><strong>' + placeResult.name +
        '</strong><br>' + 'Rating: ' + rating + '</div>');
      placeInfowindow.open(marker.map, marker);
      currentInfoWindow.close();
      currentInfoWindow = placeInfowindow;
      showPanel(placeResult);
    } else {
      console.log('showDetails failed: ' + status);
    }
  }


  

document.getElementById("search-hit").addEventListener("click", search);

document.getElementById("search-bar").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          event.preventDefault();
          //remove map
          document.getElementById("map").style.display = "none";
          document.getElementById("welcome").style.display = "none";
          search();
      }
});



//Favorites button
document.getElementById("fav").addEventListener("click", function(event){
  console.log("favorite button pressed");
  //remove map
  document.getElementById("map").style.display = "none";
  document.getElementById("welcome").style.display = "none";
  var listDiv = document.getElementsByClassName("container");

  //removing old search
  while (listDiv[0].firstChild) {
      listDiv[0].removeChild(listDiv[0].firstChild);
    }
    //request for getting fav movies
    if(favArray.length == 0){
      alert("No Favorites yet");
    }
    else{

              for (var i = 0; i < favArray.length; i++){
                  var movie = favArray[i];
                  console.log(movie.poster_path);

                  //this just makes life easier
                  if(movie.poster_path != null){
                      appendForFav(movie);
                  }

              }
      document.getElementById("search-bar").value = "";
    }

  });
 


//popular button
document.getElementById("pop").addEventListener("click", function(event){
  console.log("popular button pressed");
  //remove map
  document.getElementById("map").style.display = "none";
  document.getElementById("welcome").style.display = "none";
  var listDiv = document.getElementsByClassName("container");

  //removing old search
  while (listDiv[0].firstChild) {
      listDiv[0].removeChild(listDiv[0].firstChild);
    }

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var movies = JSON.parse(this.responseText);
          for (var i = 0; i < movies.results.length; i++){
              var movie = movies.results[i];
              console.log(movie.poster_path);

              //this just makes life easier
              if(movie.poster_path != null){
                  append(movie);
              }

          }

      }
  };

  xhttp.open("GET", "https://api.themoviedb.org/3/movie/popular?api_key=1e9707701b00ff4193087a278fc21242&language=en-US&page=1", true);
  xhttp.send();

  document.getElementById("search-bar").value = "";
});

//home is actually the maps
document.getElementById("home").addEventListener("click", function(event){
  var listDiv = document.getElementsByClassName("container");
  var map = document.createElement("div");

  //removing old search
  while (listDiv[0].firstChild) {
      listDiv[0].removeChild(listDiv[0].firstChild);
    }

    document.getElementById("map").style.display = "block";
    document.getElementById("welcome").style.display = "block";
    console.log(document.getElementById("map"));



});


function search(){
    console.log("search pressed");
    // Getting input from search bar
    var searchVar = document.getElementById("search-bar").value;

    if(searchVar == ""){
        //if search bar is empty, alert the user
        alert("Empty Search!");
    } else{ //else make the AJAX request
        var listDiv = document.getElementsByClassName("container");

        //removing old search
        while (listDiv[0].firstChild) {
            listDiv[0].removeChild(listDiv[0].firstChild);
          }

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var movies = JSON.parse(this.responseText);
                for (var i = 0; i < movies.results.length; i++){
                    var movie = movies.results[i];
                    console.log(movie.poster_path);

                    //this just makes life easier
                    if(movie.poster_path != null){
                        append(movie);
                    }

                }

            }
        };

        xhttp.open("GET", "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query="+searchVar+"&language=en-US&api_key=1e9707701b00ff4193087a278fc21242", true);
        xhttp.send();

        document.getElementById("search-bar").value = "";
    }
}


function append(movie){
    var listDiv = document.getElementsByClassName("container");

    var card = document.createElement("div");
    card.setAttribute("class","card mb-3 mx-auto");
    card.style.maxWidth = "540px";

    var allHolder = document.createElement("div");
    allHolder.setAttribute("class", "row no-gutters");

    var imgDiv = document.createElement("div");
    imgDiv.setAttribute("class", "col-md-4");

    var imgSrc = document.createElement("img");
    imgSrc.setAttribute("src", "https://image.tmdb.org/t/p/w200/"+movie.poster_path);
    imgSrc.setAttribute("class", "card-img");
    imgSrc.setAttribute("alt", "...");

    var textDiv = document.createElement('div');
    textDiv.setAttribute("class", "col-md-8");

    var cardBody = document.createElement('div');
    cardBody.setAttribute("class", "card-body");

    var cardTitle = document.createElement('h5');
    cardTitle.setAttribute("class", "card-title");
    cardTitle.textContent = movie.title;

    var cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text text-left");
    cardText.textContent = movie.overview;

    var trailer = document.createElement("iframe");
    trailer.setAttribute("class", "trailer");
    trailer.setAttribute("id", "trailer"+movie.id);

    var button = document.createElement("a");
    button.setAttribute("class", "btn btn-primary");
    //get video from youtuve api

    button.addEventListener("click", function(event){
      if(favArray.indexOf(movie) == -1){
        favArray.push(movie)
      } else {
        console.log("already there");
      }
      

    });
    // button.setAttribute("href", "#");
    button.style.color = "white;";
    button.textContent = "Add to Favorites";




    // console.log(trailer.id);

    imgDiv.appendChild(imgSrc);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(button);
    cardBody.appendChild(trailer);

    textDiv.appendChild(cardBody);

    allHolder.appendChild(imgDiv);
    allHolder.appendChild(textDiv);

    card.appendChild(allHolder);

    listDiv[0].appendChild(card);

}

function appendForFav(movie){
  var listDiv = document.getElementsByClassName("container");

  var card = document.createElement("div");
  card.setAttribute("class","card mb-3 mx-auto");
  card.style.maxWidth = "540px";

  var allHolder = document.createElement("div");
  allHolder.setAttribute("class", "row no-gutters");

  var imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "col-md-4");

  var imgSrc = document.createElement("img");
  imgSrc.setAttribute("src", "https://image.tmdb.org/t/p/w200/"+movie.poster_path);
  imgSrc.setAttribute("class", "card-img");
  imgSrc.setAttribute("alt", "...");

  var textDiv = document.createElement('div');
  textDiv.setAttribute("class", "col-md-8");

  var cardBody = document.createElement('div');
  cardBody.setAttribute("class", "card-body");

  var cardTitle = document.createElement('h5');
  cardTitle.setAttribute("class", "card-title");
  cardTitle.textContent = movie.title;

  var cardText = document.createElement("p");
  cardText.setAttribute("class", "card-text text-left");
  cardText.textContent = movie.overview;

  var trailer = document.createElement("iframe");
  trailer.setAttribute("class", "trailer");
  trailer.setAttribute("id", "trailer"+movie.id);

  imgDiv.appendChild(imgSrc);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);

  cardBody.appendChild(trailer);

  textDiv.appendChild(cardBody);

  allHolder.appendChild(imgDiv);
  allHolder.appendChild(textDiv);

  card.appendChild(allHolder);

  listDiv[0].appendChild(card);

}
