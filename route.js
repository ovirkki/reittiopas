"use strict";

let jsonData = require("./reittiopas.json");

var fastestRoute = [];

function init() {
    fastestRoute = [];
}

function isThereFaster(time) {
    if (fastestRoute.length > 0 && calcTotalDuration(fastestRoute) < time) {
        return true;
    } else {
        return false;
    }
}

function getOneRouteDuration(start, destination) {
    var routeInfo = jsonData.tiet.find(routeData => {
        return (routeData.mista === start && routeData.mihin === destination) ||
            (routeData.mihin === start && routeData.mista === destination);
    });
    if (routeInfo !== undefined) {
        return routeInfo.kesto;
    } else {
        console.log("Could not find route from " + start + " to " + destination + ". Should not be here at all...");
        return 99;
    }
}

function getLinesForNode(stopChar) {
    var lineNames = Object.keys(jsonData.linjastot);
    return lineNames.filter(line => {
        return jsonData.linjastot[line].indexOf(stopChar) > -1;
    });
}

function getNextStops(start, lineStops, previous) {
    var stops = [];
    var pos = lineStops.indexOf(start);
    if (pos > -1) {
        if (pos > 0 && lineStops[pos - 1] !== previous) {
            stops.push(lineStops[pos - 1]);
        }
        if (pos < lineStops.length - 1 && lineStops[pos + 1] !== previous) {
            stops.push(lineStops[pos + 1]);
        }
    }
    return stops;
}

function createRouteElement(line, start, dest) {
    return {
        line: line,
        start: start,
        destination: dest
    };
}

function calcTotalDuration(routeData) {
    function sum(sum, routeElement) {
        return sum + getOneRouteDuration(routeElement.start, routeElement.destination);
    }
    return routeData.reduce((sum, routeElement) => {
        return sum + getOneRouteDuration(routeElement.start, routeElement.destination);
    }, 0);

}

function validateRoute(newRouteElement, routeSoFar, finalDestination) {
    //Exclude route that takes back to already visited stop
    var beenHere = routeSoFar.some(prevRouteElement => {
        return prevRouteElement.start === newRouteElement.destination ||
            prevRouteElement.destination === newRouteElement.destination;
    });
    if (beenHere) {
        console.log("EXIT: been there already!");
        return false;
    }
    //Exclude route taking longer than the fastest one already found
    var totalTime = getOneRouteDuration(newRouteElement.start, newRouteElement.destination) + calcTotalDuration(routeSoFar);
    if (isThereFaster(totalTime)) {
        console.log("EXIT: fastest total time exceeded!");
        return false;
    }
    //If destination reached do not continue with this route, store new fastest route (known to be fastest because of the check above)
    if (newRouteElement.destination === finalDestination) {
        fastestRoute = routeSoFar.concat(newRouteElement);
        console.log("---------New fastest route found:");
        console.log(fastestRoute);
        return false
    }
    return true;
}

function makeRoute(start, finalDestination, routeSoFar, previous) {
    console.log("Route: " + start + " to " + finalDestination);
    var lines = getLinesForNode(start);
    var routes = [];
    lines.forEach(line => {
        var nextStops = getNextStops(start, jsonData.linjastot[line], previous);
        if (nextStops.length > 0) {
            var lineRoutes = nextStops.map(nextStop => {
                return createRouteElement(line, start, nextStop);
            })
            routes = routes.concat(lineRoutes);
        }
    })
    var validRoutes = routes.filter(route => {
        return validateRoute(route, routeSoFar, finalDestination);
    });

    validRoutes.forEach(route => {
        makeRoute(route.destination, finalDestination, routeSoFar.concat(route), start);
    })

}

function getRoute(start, destination) {
    init();
    makeRoute(start, destination, []);
    return fastestRoute;
}

function getStops() {
    return jsonData.pysakit;
}

module.exports.getStops = getStops;
module.exports.getRoute = getRoute;
