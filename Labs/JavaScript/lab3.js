'use strict';

/* Lab 3: Airline route display. */

/**
 * App name space.
 *
 * The airlineRouteApp object encapsulates the variables and functions
 * into a namespace to prevent interference with global variables from
 * other libraries. In this case, it isn't strictly necessary, but a good
 * habit to get into.
 *
 * @type {object} airlineRouteApp
 */
var airlineRouteApp = airlineRouteApp || {};

/**
 * Indicates which cities have a direct flight between them.
 * A key has a direct flight to each of the cities in the array
 * associated with that key.
 *
 * @type {object} routes
 * @const
 */
airlineRouteApp.ROUTES = {
  'YYZ': ['YVR', 'YYC', 'YOW'],
  'YVR': ['YYZ', 'YYC'],
  'YXE': ['YYC'],
  'YYC': ['YXE','YVR', 'YYZ'],
  'YOW': ['YYZ']
};

/**
 * Detects presence of class in an element.
 * Return true if element has the class cls, false otherwise.
 *
 * @param {object} element
 * @param {string} cls
 * @return {boolean}
 */
airlineRouteApp.elementHasClass = function(element, cls) {
  return element.classList.contains(cls);
};

//I also add codes here besides the TODO part...
var routes = [];
var citynames = Object.keys(airlineRouteApp.ROUTES); //simply use this to get the array of keys of Object airlineRouteApp.ROUTES...
var citynumbers = citynames.length;

//console.log(number) is one of the good ways to debugging javascript...


/**
 * Create a paragraph element for each route in the routes object.
 * The text of the element will be "SRC <=> DEST" where SRC is is one of
 * the keys in routes, and DEST is in the array of cities.
 * Because routes are bi-directional, they should not be duplicated in the
 * output. In other words only one of the following should appear on the
 * page: "YYZ <=> YVR" xor "YVR <=> YYZ".
 */
airlineRouteApp.buildRoutes = function() {
  // TODO
  var checkingDuplicate = []; 
  for(var i = 0; i < citynumbers; i++){ //citynumbers corresponds to the variable citynames... 
    var destinationsArrayLength = airlineRouteApp.ROUTES[citynames[i]].length;
    var src = citynames[i];
    for(var j = 0; j < destinationsArrayLength; j++){ //length for every destinations array ...
        var des = airlineRouteApp.ROUTES[src][j];
        if((checkingDuplicate.indexOf(src + des) == -1) && (checkingDuplicate.indexOf(des + src) == -1)){
          checkingDuplicate.push(src + des);
          var para = document.createElement("p");
          var att = document.createAttribute("class");
          att.value = "routes";
          para.setAttributeNode(att);
          var node = document.createTextNode(src + " <=> " + des);
          para.appendChild(node);
          document.getElementById("routes").appendChild(para);
        }else{
          continue;
        }
      }
  }
  //a little styling here...
  var temp = document.getElementsByClassName("routes");
  var templength = temp.length;
  for(var k = 0; k < templength; k++){
    temp[k].style.fontSize = "200%";
  }
};
/**
 * Create one button element for each city in `routes`.
 * When the button is clicked, it will change the colour to red for all of the
 * paragraph elements with the class "route" and with the class name of
 * the city that is the name of the button.
 *
 * For example, if the user clicks on "YOW", only the "YOW <=> YYZ" route
 * will be coloured red. All other routes will be black.
 */
airlineRouteApp.buildCities = function() {
  // TODO
  for(var i = 0; i < citynumbers; i ++){
    var para = document.createElement("p");
    var att = document.createAttribute("class");
    att.value = "citytag";
    para.setAttributeNode(att);
    var node = document.createTextNode(citynames[i]);
    para.appendChild(node);;
    document.getElementById("cities").appendChild(para);
  }
  
  var temp = document.getElementsByClassName("citytag"); //the query of temp is the array...
  var templength = temp.length;
  for(var i = 0; i < templength; i++){
    temp[i].style.borderStyle = "solid";
    temp[i].style.textAlign = "center";
    temp[i].style.width = "10%";
    temp[i].style.margin = "0";
    temp[i].style.float = "left";
    temp[i].style.fontSize = "200%";
  }

  document.getElementById("routes").style.paddingTop = "50px"; //modify the style of "routes'division" so that it will have a line break...
};

//** clicks handler functions.....
airlineRouteApp.click = function(){
  var icons = document.getElementsByClassName("citytag");
  var routestodisplay = document.getElementsByClassName("routes");
  var routesnumber = routestodisplay.length;

  for(var i = 0; i < citynumbers; i++){
    icons[i].onclick = function(){
      for(var j = 0; j < routesnumber; j++){
        routestodisplay[j].style.color = "black";
        if(routestodisplay[j].innerHTML.includes(this.innerHTML)){ //why can't I replace 
        	//this with icons[i] here, althogh this does actually refer to 'icons[i]'....
        	//Does if(str.includes(substr)) and if(str.indexOf(substr) != -1) have the same effect ... 
          routestodisplay[j].style.color = "red";
        }
      }
    }
  }
};



/**
 * Init function.
 */
airlineRouteApp.init = function() {
  this.buildRoutes();
  this.buildCities();
  this.click();
};

// Initializing.
airlineRouteApp.init();
