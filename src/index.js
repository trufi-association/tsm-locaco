const express = require("express");
const config = require("config");
const fs = require("fs");

const server = express();

let cityConfigurationIndex = [];
const reloadCityConfiguration = () => {
	console.log("reloading city configuration ...");
	cityConfigurationIndex = [];
	fs.readdir(config.get("dataDir"), (error, items) => {
		for (let i = 0; i < items.length; i++) {
			let json = require("./" + config.get("dataDir") + "/" + items[i]);
			cityConfigurationIndex.push(json);
		}
	});
}

// inspired by https://stackoverflow.com/questions/56306097/get-nearest-point-from-another-one-in-javascript
// because MDN did not help me understanding how array.prototype.reduce() works
const findClosedCoordinate = ({lat, lon}) => {
	function euclideanDistance(cityConf) {
		return Math.sqrt(
			Math.pow(lat - cityConf.mapConfiguration.mapCenter.lat, 2) +
			Math.pow(lon - cityConf.mapConfiguration.mapCenter.lon, 2)
		);
	}
	return cityConfigurationIndex.reduce((firstCityConf, secondCityConf) => {
		return euclideanDistance(firstCityConf) < euclideanDistance(secondCityConf) ? firstCityConf : secondCityConf;
	}) || {};
}

console.log("starting Trufi TSM (Trufi Server Module) 'Locaco' (Location aware configuration) ...");
reloadCityConfiguration();

process.on("SIGHUP", () => { reloadCityConfiguration() })

server.use( express.json({ extended: false, limit: 50000}));

server.get("/configuration/city", (req, res) => {
	res.send(findClosedCoordinate(req.body));
});


server.listen(config.get("port"),
              config.get("hostname"),
			  () => {
				  console.log(`TSM 'Locaco' listening on interface ${config.get("hostname")}:${config.get("port")}`)
			  }
);