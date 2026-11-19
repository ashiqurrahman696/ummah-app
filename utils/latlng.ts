navigator.geolocation.getCurrentPosition(
    function (position) {
        getPos(position.coords.latitude, position.coords.longitude);
    },
    function errorCallback(error) {
        console.log(error);
    }
);

function getPos(lat?: number, lng?: number) {
    return {
        lat,
        lng,
    };
}

export {getPos};