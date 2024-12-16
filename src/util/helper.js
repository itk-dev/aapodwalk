export const isDeviceIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

// Borrowed from here: https://www.movable-type.co.uk/scripts/latlong.html?from=48.86,-122.0992&to=48.8599,-122.1449
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
        long
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

export function getIndexedPinSvg(index) {
  return `<div class="relative w-8 h-8">
          <svg width="32" height="32" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.9901 31.5051C11.5203 33.7746 2.81441 28.7482 0.544934 20.2784C-1.72454 11.8086 3.30181 3.10274 11.7716 0.833264C20.2414 -1.43621 28.9473 3.59014 31.2168 12.0599C33.4863 20.5297 28.4599 29.2356 19.9901 31.5051Z" fill="#047857" fill-opacity="0.2"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.47679 19.7608C4.46038 27.1637 12.0696 31.5569 19.4725 29.5733C26.8753 27.5897 31.2685 19.9805 29.2849 12.5776C27.3013 5.17471 19.6921 0.781523 12.2893 2.76512C4.88638 4.74871 0.493193 12.3579 2.47679 19.7608ZM0.544934 20.2784C2.81441 28.7482 11.5203 33.7746 19.9901 31.5051C28.4599 29.2356 33.4863 20.5297 31.2168 12.0599C28.9473 3.59014 20.2414 -1.43621 11.7716 0.833264C3.30181 3.10274 -1.72454 11.8086 0.544934 20.2784Z" fill="#059669"/>
            <path d="M18.2779 25.1152C13.3372 26.4391 8.25874 23.507 6.93488 18.5663C5.61101 13.6256 8.54305 8.54715 13.4838 7.22329C18.4245 5.89943 23.5029 8.83147 24.8268 13.7722C26.1507 18.7129 23.2186 23.7913 18.2779 25.1152Z" fill="#059669"></path>
          </svg>
          <div class="pin-label">${index}</div>
        </div>`;
}

export function getPinSvg() {
  return `<svg width="32" height="32" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9901 31.5051C11.5203 33.7746 2.81441 28.7482 0.544934 20.2784C-1.72454 11.8086 3.30181 3.10274 11.7716 0.833264C20.2414 -1.43621 28.9473 3.59014 31.2168 12.0599C33.4863 20.5297 28.4599 29.2356 19.9901 31.5051Z" fill="#047857" fill-opacity="0.2"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.47679 19.7608C4.46038 27.1637 12.0696 31.5569 19.4725 29.5733C26.8753 27.5897 31.2685 19.9805 29.2849 12.5776C27.3013 5.17471 19.6921 0.781523 12.2893 2.76512C4.88638 4.74871 0.493193 12.3579 2.47679 19.7608ZM0.544934 20.2784C2.81441 28.7482 11.5203 33.7746 19.9901 31.5051C28.4599 29.2356 33.4863 20.5297 31.2168 12.0599C28.9473 3.59014 20.2414 -1.43621 11.7716 0.833264C3.30181 3.10274 -1.72454 11.8086 0.544934 20.2784Z" fill="#059669"/>
        <path d="M18.2779 25.1152C13.3372 26.4391 8.25874 23.507 6.93488 18.5663C5.61101 13.6256 8.54305 8.54715 13.4838 7.22329C18.4245 5.89943 23.5029 8.83147 24.8268 13.7722C26.1507 18.7129 23.2186 23.7913 18.2779 25.1152Z" fill="#059669"></path>
      </svg>`;
}

export default {};
