var pacman = null;

var camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
var textureSun = new THREE.TextureLoader().load('textures/matahari.jpg');
var textureBumi = new THREE.TextureLoader().load('textures/bumi.jpg');
var sun = null;
var earth = null;
var MAP_LEVEL1 = [
    '# # # # # # # # # # # # # # # # # # # # # # # # # # # #',
    '# o . . . . . . . . . . . # # . . . . . . . . . . . o #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
    '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
    '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
    '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
    '# # # # # # . # # # # #   # #   # # # # # . # # # # # #',
    '          # . # # # # #   # #   # # # # # . #          ',
    '          # . # #         G           # # . #          ',
    '          # . # #   # # # # # # # #   # # . #          ',
    '# # # # # # . # #   #             #   # # . # # # # # #',
    '            .       #             #       .            ',
    '# # # # # # . # #   #             #   # # . # # # # # #',
    '          # . # #   # # # # # # # #   # # . #          ',
    '          # . # #           C         # # . #          ',
    '          # . # #   # # # # # # # #   # # . #          ',
    '# # # # # # . # #   # # # # # # # #   # # . # # # # # #',
    '# . . . . . . . . . . . . # # . . . . . . . . . . . . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . . . # # . . . . . . . P T . . . . . . . # # . . . #',
    '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
    '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
    '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# o . . . . . . . . . . . . . . . . . . . . . . . . o #',
    '# # # # # # # # # # # # # # # # # # # # # # # # # # # #'
];

var listener = new THREE.AudioListener();
camera.add(listener);

var sound = new THREE.Audio(listener);

// var audioLoader = new THREE.AudioLoader();
// audioLoader.load('sounds/pacman_beginning.mp3', function(buffer) {
//     sound.setBuffer(buffer);
//     sound.setLoop(true);
//     sound.setVolume(0.5);
//     sound.play();
// });

var createMap = function(scene, levelMap) {
    var map = {};
    map.bottom = -(levelMap.length - 1);
    map.top = 0;
    map.left = 0;
    map.right = 0;
    map.numDots = 0;
    map.pacmanSpawn = null;
    map.ghostSpawn = null;

    var x, y;
    for (var row = 0; row < levelMap.length; row++) {
        y = -row;
        map[y] = {};
        var length = Math.floor(levelMap[row].length / 2);
        map.right = Math.max(map.right, length);

        for (var column = 0; column < levelMap[row].length; column += 2) {
            x = Math.floor(column / 2);

            var cell = levelMap[row][column];
            var object = null;
            var objectT = null;
            var objectC = null;

            if (cell === '#') {
                object = createWall();
            } else if (cell === '.') {
                object = createDots();
                map.numDots += 1;
            } else if (cell === 'o') {
                object = createCherry();
            } else if (cell === 'P') {
                // map.pacmanSpawn = new THREE.Vector3(x, y, 0);
                object = createPacman();
                pacman = object;
            } else if (cell === 'G') {
                // map.ghostSpawn = new THREE.Vector3(x, y, 0);
            } else if (cell === 'T') {
                objectT = createTerrain();
            } else if (cell === 'C') {
                objectC = createSun();
                objectC.position.set(x, y, 5);
                map[y][x] = objectC;
                scene.add(objectC);
                sun = objectC;
                objectC = createEarth();
                objectC.position.set(x, y - 3, 5);
                map[y][x] = objectC;
                scene.add(objectC);
                earth = objectC;
                // sun = objectC;
                // scene.add(createEarth());
                // objectC = createEarth();
            }
            if (object !== null) {
                object.position.set(x, y, 0);
                map[y][x] = object;
                scene.add(object);
            } else if (objectT !== null) {
                objectT.position.set(x, y, -1);
                map[y][x] = objectT;
                scene.add(objectT);

            }
        }
    }

    map.centerX = (map.left + map.right) / 2;
    map.centerY = (map.bottom + map.top) / 2;

    return map;
};
var createWall = function() {
    var geometryWall = new THREE.BoxGeometry(1, 1, 1);
    var materialWall = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('textures/wall.jpg') });
    return function() {
        var wall = new THREE.Mesh(geometryWall, materialWall);
        wall.isWall = true;

        return wall;
    };
}();

var createPacman = function() {
    var geometryPacman = new THREE.SphereGeometry(0.5, 32, 32);
    var materialPacman = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var pacman = new THREE.Mesh(geometryPacman, materialPacman);
    return pacman;
}
var createDots = function() {
    var geometryDots = new THREE.SphereGeometry(0.1, 32, 32);
    var materialDots = new THREE.MeshBasicMaterial({ color: 0xffc78f });
    var dots = new THREE.Mesh(geometryDots, materialDots);
    return dots;
}
var createCherry = function() {
    var geometryCherry = new THREE.SphereGeometry(0.3, 32, 32);
    var materialCherry = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var cherry = new THREE.Mesh(geometryCherry, materialCherry);
    return cherry;
}
var createTerrain = function() {
        var geometry = new THREE.PlaneGeometry(100, 50, 50);
        var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/lantai.jpg'), side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        return plane;
    }
    // var renderer = createRenderer();
var createScene = function() {
    var scene = new THREE.Scene();

    // Add lighting
    scene.add(new THREE.AmbientLight(0x888888));
    var light = new THREE.SpotLight('white', 0.5);
    light.position.set(0, 0, 50);
    scene.add(light);

    return scene;
};
var createSun = function() {
    var sunGeo = new THREE.SphereGeometry(2, 20, 20);
    var sunMat = new THREE.MeshPhongMaterial({
        map: textureSun
    });
    var sun = new THREE.Mesh(sunGeo, sunMat);
    return sun;
}
var createEarth = function() {
    var bumiGeo = new THREE.SphereGeometry(0.4, 20, 20);
    var bumiMat = new THREE.MeshPhongMaterial({
        map: textureBumi
    });
    var bumi = new THREE.Mesh(bumiGeo, bumiMat);
    return bumi;
}

document.body.onkeydown = function(evt) {
    var speed = 0.2;
    if (evt.key == 'w' || evt.keyCode == '38') {
        // console.log("success");
        pacman.position.y += 0.1;
        camera.position.y += 0.1;
        // camera.position.y += 0.1;
        // controls.moveForward(speed);
    } else if (evt.key == 's' || evt.keyCode == 40) {
        pacman.position.y -= 0.1;
        camera.position.y -= 0.1;
        // camera.position.y -= 0.1;
        // controls.moveForward(-speed);
    } else if (evt.key == 'd') {
        pacman.position.x += 0.1;
        // camera.position.x += 0.1;
        // controls.moveRight(speed);
    } else if (evt.key == 'a') {
        pacman.position.x -= 0.1;
        // camera.position.x -= 0.1;
        // controls.moveRight(-speed);
    } else if (evt.keyCode == 39) {
        // pacman.position.x += 0.1;
        pacman.rotation.y -= 0.1;
        // camera.position.x -= 0.1;
        // camera.position.y += 0.1;
        // camera.rotation.y -= 0.1;
        // camera.position.x -= 0.1;
        // pacman.rotation.x += 0.1;
        // camera.rotation.y += 0.1;
        // controls.moveRight(speed);
    } else if (evt.keyCode == 37) {
        // pacman.position.x += 0.1;
        pacman.rotation.y += 0.1;
        // camera.rotation.y += 0.1;
        // pacman.rotation.x += 0.1;
        // camera.rotation.y += 0.1;
        // controls.moveRight(speed);
    }
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// var controls = new THREE.OrbitControls(camera, renderer.domElement);

// camera.rotation.y = 90 * Math.PI / 180;

// controls.minPolarAngle = Math.PI / 2;
// controls.maxPolarAngle = Math.PI / 2;
// controls.minAzimuthAngle = Math.PI / 2;
// controls.maxAzimuthAngle = Math.PI / 2;
var scene = createScene();
scene.background = new THREE.TextureLoader().load('textures/bg.jpg');
var map = createMap(scene, MAP_LEVEL1);

// controls.update();


// camera.position.set(pacman.position.x, pacman.position.y, pacman.position.z + 1);
camera.position.set(pacman.position.x, pacman.position.y - 2.5, pacman.position.z + 1);

camera.rotation.set(90 * Math.PI / 180, 0, 0);

function main() {
    sun.rotation.x += Math.PI / 500;
    sun.rotation.y += Math.PI / 500;
    earth.rotation.x += Math.PI / 300;
    earth.rotation.y += Math.PI / 300;
    // sun.rotation.x += 0.1;
    camera.position.set(pacman.position.x, camera.position.y, pacman.position.z + 1);
    camera.rotation.set(camera.rotation.x, pacman.rotation.y, pacman.rotation.z);
    // controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(main);
};


main();