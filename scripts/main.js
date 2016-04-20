var timeDiv = document.getElementById("times");
var errorDiv = document.getElementById("error");
var date = new Date();
var currentTime = [date.getHours(), date.getMinutes()];
var times_gleason = [
    [7, 25],
    [7, 42],
    [7, 59],
    [8, 16],
    [8, 33],
    [8, 50],
    [9, 7],
    [9, 24],
    [9, 41],
    [9, 58],
    [10, 15],
    [10, 32],
    [10, 49],
    [11, 6],
    [11, 23],
    [11, 40],
    [11, 57],
    [12, 14],
    [12, 31],
    [12, 48],
    [13, 05],
    [13, 22],
    [13, 39],
    [13, 56],
    [14, 13],
    [14, 30],
    [14, 47],
    [15, 4],
    [15, 21],
    [15, 38],
    [15, 55],
    [16, 12],
    [18, 05],
    [18, 30],
    [18, 55],
    [19, 20],
    [19, 45],
    [20, 10],
    [20, 35],
    [21, 0],
    [21, 25],
    [21, 50],
    [22, 15],
    [22, 40],
    [23, 5],
    [23, 30],
    [23, 55],
    [24, 20],
    [24, 45],
    [25, 10],
    [25, 35]
];
var times_province = [
    [7, 18],
    [7, 35],
    [7, 52],
    [8, 9],
    [8, 26],
    [8, 43],
    [9, 0],
    [9, 17],
    [9, 34],
    [9, 51],
    [10, 8],
    [10, 25],
    [10, 42],
    [10, 59],
    [11, 16],
    [11, 33],
    [11, 50],
    [12, 7],
    [12, 24],
    [12, 41],
    [12, 58],
    [13, 15],
    [13, 32],
    [13, 49],
    [14, 6],
    [14, 23],
    [14, 40],
    [14, 57],
    [15, 14],
    [15, 31],
    [15, 48],
    [16, 5],
    [18, 19],
    [18, 44],
    [19, 9],
    [19, 34],
    [19, 59],
    [20, 24],
    [20, 49],
    [21, 14],
    [21, 39],
    [22, 4],
    [22, 29],
    [22, 54],
    [23, 19],
    [23, 44],
    [24, 9],
    [24, 34],
    [24, 59],
    [25, 24]
];
var province = ["The Province", [43.086581, -77.656322], times_province];
var gleason = ["Gleason Circle", [43.082950, -77.675816], times_gleason];
var places = [province, gleason];

function distance(a, b) {
    var sum = 0;
    var n;
    for (n = 0; n < a.length; n++) {
        sum += Math.pow(a[n] - b[n], 2);
    }
    return Math.sqrt(sum);
}

function isAfter(time1, time2) {
    if (time2[0] > time1[0]) {
        return true;
    } else if (time2[0] === time1[0]) {
        if (time2[1] > time1[1]) {
            return true;
        }
    }
    return false;
}

function getNextTime(time, list) {
    for (var i in list) {
        if (list.hasOwnProperty(i)) {
            if (isAfter(time, list[i]) === true) {
                return list[i];
            }
        }
    }
    return -1;
}

function convertTo12(time) {
    var hour = time[0];
    var suffix = "AM";
    if (hour >= 12) {
        suffix = "PM";
        if (hour > 12) {
            hour = hour - 12;
            suffix = "PM";
            if (hour === 24) {
                suffix = "AM";
                if (hour > 24) {
                    hour = hour - 12;
                }
            }
        }
    }
    return [hour, time[1], suffix];
}

function generateDivs(chosenIndex) {
    for (var i in places) {
        if (places.hasOwnProperty(i)) {
            var block = document.createElement('div');
            block.className = 'block';
            if(i === chosenIndex) {
              block.id = 'chosen';
            }
            var name = document.createElement('span');
            name.className = 'name';
            var clock = document.createElement('span');
            clock.className = 'time';
            name.innerHTML = places[i][0] + " ";
            //iDiv.appendChild(div2);
            var nextTime = getNextTime(currentTime, places[i][2]);
            if (nextTime === -1) {
                clock.innerHTML = "Out of luck!";
            } else {
                var time = convertTo12(nextTime);
                clock.innerHTML = time[0] + ":" + time[1] + time[2];
            }
            block.appendChild(name);
            block.appendChild(clock);
            timeDiv.appendChild(block);
        }
    }
    return -1;
}

function showPosition(position) {
    var browserLocation = [position.coords.latitude, position.coords.longitude];
    var bestDistance = Number.MAX_SAFE_INTEGER;
    var bestIndex = Number.MAX_SAFE_INTEGER;
    for (var i in places) {
        if (places.hasOwnProperty(i)) {
            var currentDistance = distance(browserLocation, places[i][1]);
            if (currentDistance < bestDistance) {
                bestDistance = currentDistance;
                bestIndex = i;
            }
        }
    }
    generateDivs(i);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorDiv.innerText = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorDiv.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorDiv.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorDiv.innerHTML = "An unknown error occurred.";
            break;
    }
    generateDivs(-1);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        errorDiv.innerHTML = "Geolocation is not supported by this browser.";
        generateDivs(-1);
    }
}

getLocation();

//timeDiv.innerText = isAfter(currentTime, [22,22]);
