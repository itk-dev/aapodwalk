export const isDeviceIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

export function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  /*
    Formula
    c = 2 ⋅ atan2( √a, √(1−a) )
    d = R ⋅ c
    where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
    note that angles need to be in radians to pass to trig functions!
    */
  if (lat1 && lon1 && lat2 && lon2) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = Math.round(R * c) - 35; // in metres

    if (d < 0) {
      d = false;
    }

    return d;
  }
  return 0;
}

function compareProximity(routeA, routeB) {
  return routeA.proximityToFirstPoint - routeB.proximityToFirstPoint;
}

export function sortByProximity(routes, lat, long) {
  // Every route gets a "proximityToFirstPoint", to avoid calculating these double in the compare function
  const routesWithProximityToFirstPoint = routes.map((element) => {
    return {
      ...element,
      proximityToFirstPoint: getDistanceBetweenCoordinates(
        element.points[0].latitude || 0,
        element.points[0].longitude || 0,
        lat,
        long,
      ),
    };
  });
  return routesWithProximityToFirstPoint.sort(compareProximity);
}

function isATagSelected(tags, selectedTag) {
  return tags.filter(({ id }) => id === selectedTag).length > 0;
}

export function routesFilteredByTag(routes, tag) {
  return routes.filter(({ tags }) => isATagSelected(tags, tag));
}

export default {};
