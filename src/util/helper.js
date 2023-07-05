import Proj4 from "proj4";

export function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  /*
    Formula
    c = 2 ⋅ atan2( √a, √(1−a) )
    d = R ⋅ c
    where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
    note that angles need to be in radians to pass to trig functions!
    */

  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  let d = Math.round(R * c) - 35; // in metres

  if (d < 0) {
    d = false;
  }

  return d;
}

export function getIdFromApiEndpoint(endpoint) {
  const regex = /[^\/]+$/;
  // Todo create utils file
  const idFound = endpoint ? endpoint.toString().match(regex) : null;
  return idFound[0];
}

export function uniqueArrayById(list) {
  const mapOfList = new Map(list.map((item) => [item.id, item]));
  const uniqueArrayToReturn = [...mapOfList.values()];

  return uniqueArrayToReturn;
}

function latlngToUTM(lat, long) {
  const parsedLat = parseFloat(lat);
  const parsedLong = parseFloat(long);
  const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  const utm = "+proj=utm +zone=32";

  return Proj4(wgs84, utm, [parsedLong, parsedLat]);
}

export function getFeaturesForMap(resources) {
  const locations = [];
  resources.forEach(({ lat, long }) => {
    const utmCoordinates = latlngToUTM(Number(lat), Number(long));
    locations.push({
      northing: utmCoordinates[0],
      easting: utmCoordinates[1],
    });
  });
  return locations;
}

export default {};
