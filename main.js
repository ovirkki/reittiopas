"use strict";

var http = require("http");
var url = require("url");
var route = require("./route.js");

function getStops() {
    var stopList = route.getStops();
    if (stopList === undefined || stopList.length === 0) {
        throw "Tietokantavirhe"
    }
    return stopList;
}

function getRoute(start, destination) {
    if (start === undefined || destination === undefined) {
        throw "lähtöpaikka tai määränpää puuttuu"
    }
    if (start === destination) {
        throw "sama lähtöpaikka ja määränpää";
    }
    return route.getRoute(start, destination);
}

const requestListener = function (req, res) {
    try {
         res.setHeader('Access-Control-Allow-Origin', '*');
         if (req.url == "/stops") {
            var stopList = getStops();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(stopList));
         } else {
            var queryData = url.parse(req.url, true).query;
            var route = getRoute(queryData.start, queryData.destination);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(route));
         }
         res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, err);
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(8080);
