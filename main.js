//local only, just open pathfinder.html


var grid = [];
var gridSize = 25;
var startPointCoord = [0, 0];
var endPointCoord = [0, 0];
var delay = 1; //ms

function createGrid() {
    var containerHeight = $(window).height() * .8;
    var containerWidth = $(window).width() * .98;
    var rowNum = gridSize;
    var colNum = (gridSize * 2);
    var increment = 0;
    for (var rows = 0; rows < rowNum; rows++) {
        for (var columns = 0; columns < colNum; columns++) {
            $("#container").append("<div class='grid' id=" + increment + " style='background-color: whiteSmoke'></div>");
            increment++;
            //grid[rows][columns] = 'empty';
        };
    };
    $(".grid").width(containerWidth / colNum);
    $(".grid").height(containerHeight / rowNum);
};

function removeGrid() {
    $(".grid").remove();
}

function getDistanceFromLeft(ID) {
    return ID % (gridSize * 2);
};

function getDistanceFromTop(ID) {
    return Math.floor(ID / (gridSize * 2));
};

function getDistanceFromEnd(ID) {
    var distanceFromLeft = getDistanceFromLeft(ID);
    var distanceFromTop = getDistanceFromTop(ID);
    if (endPointCoord[0] < distanceFromLeft) {
        var a = distanceFromLeft - endPointCoord[0];
    } else {
        var a = endPointCoord[0] - distanceFromLeft;
    }
    if (endPointCoord[1] < distanceFromTop) {
        var b = distanceFromTop - endPointCoord[1];
    } else {
        var b = endPointCoord[1] - distanceFromTop;
    }
    return Math.sqrt((a * a) + (b * b));
};

function getDistanceFromStart(ID) {
    var distanceFromLeft = getDistanceFromLeft(ID);
    var distanceFromTop = getDistanceFromTop(ID);
    if (startPointCoord[0] < distanceFromLeft) {
        var a = distanceFromLeft - startPointCoord[0];
    } else {
        var a = startPointCoord[0] - distanceFromLeft;
    }
    if (startPointCoord[1] < distanceFromTop) {
        var b = distanceFromTop - startPointCoord[1];
    } else {
        var b = startPointCoord[1] - distanceFromTop;
    }
    return Math.sqrt((a * a) + (b * b));
};

function getWeight(ID) {
    return (getDistanceFromEnd(ID) + getDistanceFromStart(ID));
}

function getSquareCoord(ID) {
    return grid[getDistanceFromTop(ID)][getDistanceFromLeft(ID)];
};

function getIDfromCoordinate(distanceFromTop, distanceFromLeft) {
    return ((distanceFromTop * (gridSize * 2)) + distanceFromLeft);
};

function isValidSpace(distanceFromTop, distanceFromLeft) {
    if (distanceFromLeft < 0
        || distanceFromTop < 0
        || distanceFromLeft > ((gridSize * 2) - 1)
        || distanceFromTop > (gridSize - 1)
        || grid[distanceFromTop][distanceFromLeft] == 'obstacle'
        || grid[distanceFromTop][distanceFromLeft] == 'visited'
        || grid[distanceFromTop][distanceFromLeft] == 'start'
    ) {
        return false;
    } else {
        return true;
    }
};

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

//------------------------------------best first search-----------------------------------------------------------------------

function enqueue(queue, location) {
    var contains = false

    //console.log(queue[0].priority);
    if (queue.length < 1) {
        queue.push(location);
        //console.log(queue);
        //console.log("pushed location into empty queue")
    } else {
        //console.log("went into enqueue else")
        //console.log(queue[0].priority)
        for (i = 0; i < queue.length; i++) {
            if (queue[i].priority > location.priority) {
                queue.splice(i, 0, location);
                //console.log(queue);
                contains = true;
                break;
            }
        }
        if (!contains) {
            queue.push(location);
            //console.log(queue);
        }
    }

    return queue;
}

async function bestFirst() {
    console.log("best first running");
    var location = {
        distanceFromTop: startPointCoord[1],
        distanceFromLeft: startPointCoord[0],
        path: [],
        status: grid[startPointCoord[1]][startPointCoord[0]],
        priority: 999
    };

    //console.log("dft: " + location.distanceFromTop);
    //console.log("dfl: " + location.distanceFromLeft);

    var queue = [location];
    while (queue.length > 0) {
        var currentLocation = queue.shift();
        await sleep(delay);
        console.log(queue);
        //explore up
        var newLocation = exploreBestFirst('up', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        //explore down
        var newLocation = exploreBestFirst('down', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        //explore left
        var newLocation = exploreBestFirst('left', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        //explore right
        var newLocation = exploreBestFirst('right', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }



        var newLocation = exploreBestFirst('upRight', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        var newLocation = exploreBestFirst('downRight', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        var newLocation = exploreBestFirst('upLeft', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }

        var newLocation = exploreBestFirst('downLeft', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            //console.log(newLocation);
            queue = enqueue(queue, newLocation);
        }
    }
}

function exploreBestFirst(direction, currentLocation) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
    //console.log(dft);

    if (direction === 'up') {
        dft--;
        //console.log("exploring up");
    }
    else if (direction === 'down') {
        dft++;
        //console.log("exploring down");
    }
    else if (direction === 'left') {
        dfl--;
        //console.log("exploring left");
    }
    else if (direction === 'right') {
        dfl++;
        //console.log("exploring right");
    }
    else if (direction === 'upRight') {
        dft--;
        dfl++;
    }
    else if (direction === 'downRight') {
        dft++;
        dfl++;
    }
    else if (direction === 'upLeft') {
        dft--;
        dfl--;
    }
    else if (direction === 'downLeft') {
        dft++;
        dfl--;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: 'temp',
        priority: getWeight(getIDfromCoordinate(dft, dfl))
    }

    if (isValidSpace(newLocation.distanceFromTop, newLocation.distanceFromLeft)) {
        if (grid[dft][dfl] == 'end') {
            console.log("found end");
            newLocation.status = 'end';
        }
        else {
            newLocation.status = 'empty';
            var thisBox = getIDfromCoordinate(dft, dfl);
            $("#" + thisBox).css("background-color", "LightGreen");
            grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'visited';
            //console.log("marked: " + newLocation.distanceFromLeft + " " + newLocation.distanceFromTop + " as visted")
        }
    }
    return newLocation;

};

//--------------------------------Breadth First Search--------------------------------------------------------------


async function colorPath(end) {
    var path = end.path;
    var originalLength = path.length;
    var currentDistanceFromLeft = startPointCoord[0];
    var currentDistanceFromTop = startPointCoord[1];
    //console.log(path);
    // console.log(path.length);

    for (var i = 0; i < originalLength - 1; i++) {
        var direction = path.shift();
        await sleep(delay);
        //console.log(path.length);
        if (direction == 'up') {
            currentDistanceFromTop--;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'down') {
            currentDistanceFromTop++;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'left') {
            currentDistanceFromLeft--;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'right') {
            currentDistanceFromLeft++;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'upRight') {
            currentDistanceFromLeft++;
            currentDistanceFromTop--;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'downRight') {
            currentDistanceFromLeft++;
            currentDistanceFromTop++;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'upLeft') {
            currentDistanceFromLeft--;
            currentDistanceFromTop--;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
        if (direction == 'downLeft') {
            currentDistanceFromLeft--;
            currentDistanceFromTop++;
            var thisBox = "#" + getIDfromCoordinate(currentDistanceFromTop, currentDistanceFromLeft);
            $(thisBox).css("background-color", "Gold");
        }
    }
};

function explore(direction, currentLocation) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
    //console.log(dft);

    if (direction === 'up') {
        dft--;
        //console.log("exploring up");
    }
    else if (direction === 'down') {
        dft++;
        //console.log("exploring down");
    }
    else if (direction === 'left') {
        dfl--;
        //console.log("exploring left");
    }
    else if (direction === 'right') {
        dfl++;
        //console.log("exploring right");
    }
    else if (direction === 'upRight') {
        dft--;
        dfl++;
    }
    else if (direction === 'downRight') {
        dft++;
        dfl++;
    }
    else if (direction === 'upLeft') {
        dft--;
        dfl--;
    }
    else if (direction === 'downLeft') {
        dft++;
        dfl--;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: 'temp'
    }

    if (isValidSpace(newLocation.distanceFromTop, newLocation.distanceFromLeft)) {
        if (grid[dft][dfl] == 'end') {
            console.log("found end");
            newLocation.status = 'end';
        }
        else {
            var thisBox = "#" + getIDfromCoordinate(dft, dfl);
            $(thisBox).css("background-color", "LightGreen");
            newLocation.status = 'empty';
            grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'visited';
            //console.log("marked: " + newLocation.distanceFromLeft + " " + newLocation.distanceFromTop + " as visted")
        }
    }

    return newLocation;
};

async function breadthFirst() {
    console.log("breadth first running");
    var location = {
        distanceFromTop: startPointCoord[1],
        distanceFromLeft: startPointCoord[0],
        path: [],
        status: grid[startPointCoord[1]][startPointCoord[0]]
    };

    //console.log("dft: " + location.distanceFromTop);
    //console.log("dfl: " + location.distanceFromLeft);

    var queue = [location];
    while (queue.length > 0) {
        var currentLocation = queue.shift();
        await sleep(delay);

        //explore up
        var newLocation = explore('up', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        //explore down
        var newLocation = explore('down', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        //explore left
        var newLocation = explore('left', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        //explore right
        var newLocation = explore('right', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        //explore up to the right
        var newLocation = explore('upRight', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        // explore up to the left
        var newLocation = explore('upLeft', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        // explore down to the left
        var newLocation = explore('downLeft', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }

        // explore down to the right
        var newLocation = explore('downRight', currentLocation);
        if (newLocation.status === 'end') {
            colorPath(newLocation);
            return newLocation.path;
        } else if (newLocation.status === 'empty') {
            queue.push(newLocation);
        }
    }
    //no valid path
    alert("no valid path");
    return false;
}

//-------------------------------------main----------------------------------------------------------------------
$(document).ready(function () {
    var startButtonClicked = false;
    var endButtonClicked = false;
    var drawButtonClicked = false;
    var eraseButtonClicked = false;
    var breadthFirstSearchClicked = false;
    var bestFirstClicked = false;
    var isStart = false;
    var isEnd = false;
    var currentDistanceFromLeft = 0;
    var currentDistanceFromTop = 0;
    var mouseisDown = false;

    //console.log(startButtonClicked, endButtonClicked, drawButtonClicked, eraseButtonClicked);
    for (var i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (var j = 0; j < (gridSize * 2); j++) {
            grid[i][j] = 'empty';
        }
    }
    createGrid();// create a 25x50 grid when the page loads

    //create a new grid of a different size
    //succesfully makes another grid but everything else stops working
    /*
    $(".newGrid").click(function () {
        isStart = false;
        isEnd = false;
        gridSize = prompt("How tall should the grid be?");
        for (var i = 0; i < gridSize; i++) {
            //grid[i] = [];
            for (var j = 0; j < (gridSize * 2); j++) {
                grid[i][j] = 'empty';
            }
        }
        createGrid(grid, gridSize);
        $(".grid").css("background-color", "white");
    });
    */

    //clear grid
    $(".ClearGrid").click(function () {
        isStart = false;
        isEnd = false;
        console.log("clear button clicked");
        //removeGrid();
        for (var i = 0; i < gridSize; i++) {
            //grid[i] = [];
            for (var j = 0; j < (gridSize * 2); j++) {
                grid[i][j] = 'empty';
            }
        }
        //createGrid(grid, gridSize);
        $(".grid").css("background-color", "whiteSmoke");
    });
    //clear search

    $(".ClearSearch").click(function () {
        isStart = false;
        isEnd = false;
        //console.log("clear button clicked");
        var IDCount = (gridSize * (gridSize * 2));
        //console.log(IDCount);
        for (var i = 0; i < IDCount; i++) {
            if (grid[getDistanceFromTop(i)][getDistanceFromLeft(i)] !== 'obstacle') {
                grid[getDistanceFromTop(i)][getDistanceFromLeft(i)] = 'empty';
                $("#" + i).css("background-color", "whiteSmoke");
            }
        }
        //createGrid(grid, gridSize);
        //$(".grid").css("background-color", "whiteSmoke");
    });


    // add a starting point
    $(".startingPoint").click(function () {
        //console.log("start button clicked");
        startButtonClicked = true;
        endButtonClicked = false;
        drawButtonClicked = false;
        eraseButtonClicked = false;
    });

    // add an end point
    $(".endingPoint").click(function () {
        //console.log("end button clicked");
        endButtonClicked = true;
        startButtonClicked = false;
        drawButtonClicked = false;
        eraseButtonClicked = false;
    });

    //add obstacles
    $(".drawObstacles").click(function () {
        //console.log("draw button clicked");
        drawButtonClicked = true;
        startButtonClicked = false;
        endButtonClicked = false;
        eraseButtonClicked = false;
    });

    //erase obstacles
    $(".eraseObstacles").click(function () {
        //console.log("erase button clicked");
        eraseButtonClicked = true;
        startButtonClicked = false;
        endButtonClicked = false;
        drawButtonClicked = false;
    });

    //set breadth first algorithm to true
    $(".breadthFirst").click(function () {
        //console.log("breadth first clicked");
        breadthFirstSearchClicked = true;
        bestFirstClicked = false;
    });

    //set aStar clicked to true
    $(".bestFirst").click(function () {
        bestFirstClicked = true;
        breadthFirstSearchClicked = false;
    });

    //grid mousedown
    $(".grid").on('mousedown', function () {
        mouseisDown = true;
        var thisBox = jQuery(this).attr("id");
        console.log("clicked on grid at ID: " + thisBox + ", status: " + grid[getDistanceFromTop(thisBox)][getDistanceFromLeft(thisBox)]);
        if (isEnd && isStart) {
            console.log("distance from end: " + getDistanceFromEnd(thisBox));
            console.log("distance from start: " + getDistanceFromStart(thisBox));
            console.log("weight: " + getWeight(thisBox));
        }
        currentDistanceFromLeft = getDistanceFromLeft(thisBox);
        currentDistanceFromTop = getDistanceFromTop(thisBox);
        //console.log(currentDistanceFromLeft);
        //console.log(currentDistanceFromTop);

        if (startButtonClicked && !isStart) {
            $(this).css("background-color", "DodgerBlue");
            //console.log("added start point at grid id:" + thisBox + " and cooordinate: " + currentDistanceFromLeft + " " + currentDistanceFromTop);
            startPointCoord = [currentDistanceFromLeft, currentDistanceFromTop];
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'start';
            isStart = true;
            startButtonClicked = false;
        }
        if (endButtonClicked && !isEnd) {
            $(this).css("background-color", "FireBrick");
            //console.log("added end point at grid id:" + thisBox + " and cooordinate: " + currentDistanceFromLeft + " " + currentDistanceFromTop);
            endPointCoord = [currentDistanceFromLeft, currentDistanceFromTop];
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'end';
            isEnd = true;
            endButtonClicked = false;
        }
        if (drawButtonClicked) {
            $(this).css("background-color", "black");
            if (getSquareCoord(thisBox) == 'start') {
                isStart = false;
            }
            if (getSquareCoord(thisBox) == 'end') {
                isEnd = false;
            }
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'obstacle';
        }
        if (eraseButtonClicked) {
            $(this).css("background-color", "whiteSmoke");
            if (getSquareCoord(thisBox) == 'start') {
                isStart = false;
            }
            if (getSquareCoord(thisBox) == 'end') {
                isEnd = false;
            }
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'empty';
        }
    })
        //mouse up
        .mouseup(function () {
            mouseisDown = false;
        });
    //grid mouseover
    $(".grid").mouseover(function () {
        var thisBox = jQuery(this).attr("id");
        currentDistanceFromLeft = getDistanceFromLeft(thisBox);
        currentDistanceFromTop = getDistanceFromTop(thisBox);
        if (mouseisDown && drawButtonClicked) {
            $(this).css("background-color", "black");
            thisBox = jQuery(this).attr("id");
            currentX = getDistanceFromLeft(thisBox);
            currentY = getDistanceFromTop(thisBox);
            if (getSquareCoord(thisBox) == 'start') {
                isStart = false;
            }
            if (getSquareCoord(thisBox) == 'end') {
                isEnd = false;
            }
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'obstacle'
        }
        if (mouseisDown && eraseButtonClicked) {
            $(this).css("background-color", "whiteSmoke");
            thisBox = jQuery(this).attr("id");
            currentDistanceFromLeft = getDistanceFromLeft(thisBox);
            currentDistanceFromTop = getDistanceFromTop(thisBox);
            if (getSquareCoord(thisBox) == 'start') {
                isStart = false;
            }
            if (getSquareCoord(thisBox) == 'end') {
                isEnd = false;
            }
            grid[currentDistanceFromTop][currentDistanceFromLeft] = 'empty'
        }
    });

    //load maze
    //loop through txt file and create new grid accordingly
    $(".loadMaze").click(function () {
        const fileInput = document.getElementById('fileInput');

        // Trigger a click on the hidden file input element
        fileInput.click();

        // Listen for the change event when the user selects a file
        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const content = e.target.result;
                    var currentID = 0;
                    for (i = 0; i < content.length; i++) {
                        if (content[i] == ',') currentID++;
                        if (content[i] == 'o') {
                            grid[getDistanceFromTop(currentID)][getDistanceFromLeft(currentID)] = 'obstacle';
                            $("#" + currentID).css("background-color", "black");
                            //console.log("saw obstacle at ID: " + currentID)
                        }
                        if ((content[i] + content[i + 1]) == 'em') {
                            grid[getDistanceFromTop(currentID)][getDistanceFromLeft(currentID)] = 'empty';
                            $("#" + currentID).css("background-color", "whiteSmoke");
                            //console.log("saw empty")
                        }
                    }
                    //console.log(content);
                };

                reader.readAsText(file);
            } else {
                console.error('No file selected.');
            }
        });
    });

    //checks which alg to run and does so
    $(".runAlgorithm").click(function () {
        if (isEnd != true || isStart != true) { alert("must have a start and end point"); }
        else {
            if (breadthFirstSearchClicked) {
                breadthFirst();
            }
            if (bestFirstClicked) {
                bestFirst();
            }
        }
    });

    $(".setDelay").click(function () {
        delay = prompt("Set delay in miliseconds (default: 1)");
    });

    //log for debugging
    $(".checklog").click(function () {
        //console.log("grid status at 0,0:" + grid[0][0]);
        //console.log("grid status at 24,49:" + grid[24][49]);
        //console.log("istStart: " + isStart);
        //console.log("isEnd: " + isEnd);
        //console.log("clicked start:" + startButtonClicked);
        //console.log("clicked end:" + endButtonClicked);
        //console.log("start coord: " + startPointCoord[0] + " " + startPointCoord[1]);
        //console.log("end coord: " + endPointCoord[0] + " " + endPointCoord[1]);
        //console.log("grid size:" + gridSize);
        //console.log("ID of 4,2: " + getIDfromCoordinate(4, 2));
        console.log(grid.toString());
        //console.log(breadthFirst());

        /*
        */

    });
});