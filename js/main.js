var pacman = null;

var camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 1, 1000);
var textureSun = new THREE.TextureLoader().load('textures/matahari.jpg');
var textureMerku = new THREE.TextureLoader().load('textures/merkurius.jpg');
var textureVenus = new THREE.TextureLoader().load('textures/venus.jpg');
var textureBumi = new THREE.TextureLoader().load('textures/bumi.jpg');
var textureMars = new THREE.TextureLoader().load('textures/mars.jpg');
var textureJupiter = new THREE.TextureLoader().load('textures/jupiter.jpg');
var textureSatur = new THREE.TextureLoader().load('textures/saturnus.jpg');
var textureCincin = new THREE.TextureLoader().load('textures/cincin.jpg');
var sun = null;
var merku = null;
var venus = null;
var mars = null;
var jupiter = null;
var saturnus = null;
var earth = null;
var FpivotBumi = null;
var FpivotJupiter = null;
var FpivotMars = null;
var FpivotMerku = null;
var FpivotSaturnus = null;
var FpivotVenus = null;

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
    '# . . . . . . # # . . . . # #w . . . . # # . . . . . . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# o . . . . . . . . . . . . . . . . . . . . . . . . o #',
    '# # # # # # # # # # # # # # # # # # # # # # # # # # # #'
];

var listener = new THREE.AudioListener();
camera.add(listener);

var sound = new THREE.Audio(listener);

var audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/pacman_beginning.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
    sound.play();
});

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
                object = createPacman();
                pacman = object;
            } else if (cell === 'G') {
                // map.ghostSpawn = new THREE.Vector3(x, y, 0);
            } else if (cell === 'T') {
                objectT = createTerrain();
            } else if (cell === 'C') {
                objectC = createSun();
                objectC.position.set(x, y, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                sun = objectC;
                objectC = createMerku();
                objectC.position.set(x, y - 3, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                merku = objectC;

                objectC = createVenus();
                objectC.position.set(x, y - 4, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                venus = objectC;

                objectC = createEarth();
                objectC.position.set(x, y - 5, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                earth = objectC;

                objectC = createMars();
                objectC.position.set(x, y - 6, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                mars = objectC;

                objectC = createJupiter();
                objectC.position.set(x, y - 7, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                jupiter = objectC;

                objectC = createSaturnus();
                objectC.position.set(x, y - 9, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                saturnus = objectC;

                var pivotMerku = new THREE.Group();
                var pivotVenus = new THREE.Group();
                var pivotBumi = new THREE.Group();
                var pivotMars = new THREE.Group();
                var pivotJupiter = new THREE.Group();
                var pivotSaturnus = new THREE.Group();
                pivotMerku.position.z = 10
                pivotVenus.position.z = 10
                pivotBumi.position.z = 10
                pivotMars.position.z = 10
                pivotJupiter.position.z = 10
                pivotSaturnus.position.z = 10
                scene.add(pivotMerku);
                scene.add(pivotVenus);
                scene.add(pivotBumi);
                scene.add(pivotMars);
                scene.add(pivotJupiter);
                scene.add(pivotSaturnus);
                pivotMerku.add(merku);
                pivotVenus.add(venus);
                pivotBumi.add(earth);
                pivotMars.add(mars);
                pivotJupiter.add(jupiter);
                pivotSaturnus.add(saturnus);
                FpivotBumi = pivotBumi;
                FpivotJupiter = pivotJupiter;
                FpivotMars = pivotMars;
                FpivotMerku = pivotMerku;
                FpivotSaturnus = pivotSaturnus;
                FpivotVenus = pivotVenus;
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
    var materialWall = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('textures/wall.jpg')

    });
    return function() {
        var wall = new THREE.Mesh(geometryWall, materialWall);
        wall.isWall = true;

        return wall;
    };
}();

var createPacman = function() {
    var geometryPacman = new THREE.SphereGeometry(0.5, 32, 32);
    var materialPacman = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    var pacman = new THREE.Mesh(geometryPacman, materialPacman);
    return pacman;
}
var createDots = function() {
    var geometryDots = new THREE.SphereGeometry(0.1, 32, 32);
    var materialDots = new THREE.MeshBasicMaterial({
        color: 0xffc78f
    });

    return function() {
        var dots = new THREE.Mesh(geometryDots, materialDots);
        dots.isDot = true;

        return dots;
    };
}();

var createCherry = function() {
    var geometryCherry = new THREE.SphereGeometry(0.3, 32, 32);
    var materialCherry = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    var cherry = new THREE.Mesh(geometryCherry, materialCherry);
    return cherry;
}
var createTerrain = function() {
        var geometry = new THREE.PlaneGeometry(100, 50, 50);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/lantai.jpg'),
            side: THREE.DoubleSide
        });
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

var createMerku = function() {
    var merkuGeo = new THREE.SphereGeometry(0.1, 20, 20);
    var merkuMat = new THREE.MeshPhongMaterial({
        map: textureMerku
    });
    var merku = new THREE.Mesh(merkuGeo, merkuMat);
    return merku;
}
var createVenus = function() {
    var venusGeo = new THREE.SphereGeometry(0.2, 20, 20);
    var venusMat = new THREE.MeshPhongMaterial({
        map: textureVenus
    });
    var venus = new THREE.Mesh(venusGeo, venusMat);
    return venus;
}
var createEarth = function() {
    var bumiGeo = new THREE.SphereGeometry(0.4, 20, 20);
    var bumiMat = new THREE.MeshPhongMaterial
    var bumi = new THREE.Mesh(bumiGeo, bumiMat);
    return bumi;
}

var createMars = function() {
    var marsGeo = new THREE.SphereGeometry(0.1, 20, 20);
    var marsMat = new THREE.MeshPhongMaterial({
        map: textureMars
    });
    var mars = new THREE.Mesh(marsGeo, marsMat);
    return mars;
}
var createJupiter = function() {
    var jupiterGeo = new THREE.SphereGeometry(0.8, 50, 50);
    var jupiterMat = new THREE.MeshPhongMaterial({
        map: textureJupiter
    });
    var jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
    return jupiter;
}
var createSaturnus = function() {
    var saturGeo = new THREE.SphereGeometry(0.8, 50, 50);
    var saturMat = new THREE.MeshPhongMaterial({
        map: textureSatur
    });
    var satur = new THREE.Mesh(saturGeo, saturMat);
    var cincinGeo = new THREE.CircleGeometry(1.2, 32);
    var cincinMat = new THREE.MeshPhongMaterial({
        map: textureCincin
    });
    var cincin = new THREE.Mesh(cincinGeo, cincinMat);
    var saturnus = new THREE.Group();
    saturnus.add(satur);
    saturnus.add(cincin);
    return saturnus;
}
var getAt = function(map, position) {
    var x = Math.round(position.x),
        y = Math.round(position.y);
    return map[y] && map[y][x];
}
var isWall = function(map, position) {
    var cell = getAt(map, position);
    return cell && cell.isWall === true;
};
var isDot = function(map, position) {
    var cell = getAt(map, position);
    return cell && cell.isDot === true;
};
var removeAt = function(map, position) {
    var x = Math.round(position.x),
        y = Math.round(position.y);
    if (map[y] && map[y][x]) {
        map[y][x].visible = false;
    }
}
document.body.onkeydown = function(evt) {
    var newPosition = new THREE.Vector3();
    console.log(map.numDots);
    newPosition.getPositionFromMatrix(pacman.matrixWorld);
    if ((evt.key == 'w' || evt.keyCode == '38')) {
        pacman.position.y += 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.y -= 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if ((evt.key == 's' || evt.keyCode == 40)) {
        pacman.position.y -= 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.y += 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if (evt.key == 'd') {
        pacman.position.x += 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.x -= 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if (evt.key == 'a') {
        pacman.position.x -= 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.x += 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    }
    if (isDot(map, pacman.position) == true && map[Math.round(pacman.position.y)][Math.round(pacman.position.x)].visible == true) {
        removeAt(map, pacman.position);
        map.numDots -= 1;
    }
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.PointerLockControls(camera, renderer.domElement);

var scene = createScene();
scene.background = new THREE.TextureLoader().load('textures/bg.jpg');
var map = createMap(scene, MAP_LEVEL1);

camera.position.set(pacman.position.x, pacman.position.y - 2.5, pacman.position.z + 1);

camera.rotation.set(90 * Math.PI / 180, 0, 0);

function main() {
    sun.rotation.x += Math.PI / 500;
    sun.rotation.y += Math.PI / 500;
    earth.rotation.x += Math.PI / 300;
    earth.rotation.y += Math.PI / 300;
    venus.rotation.x += Math.PI / 300;
    venus.rotation.y += Math.PI / 300;
    merku.rotation.x += Math.PI / 300;
    merku.rotation.y += Math.PI / 300;
    mars.rotation.x += Math.PI / 300;
    mars.rotation.y += Math.PI / 300;
    jupiter.rotation.x += Math.PI / 300;
    jupiter.rotation.y += Math.PI / 300;
    saturnus.rotation.x += Math.PI / 300;
    // pivot rotation
    FpivotBumi.rotation.z += Math.PI / 190;
    FpivotMerku.rotation.z += Math.PI / 290;
    FpivotVenus.rotation.z += Math.PI / 400;
    FpivotMars.rotation.z += Math.PI / 250;
    FpivotJupiter.rotation.z += Math.PI / 350;
    FpivotSaturnus.rotation.z += Math.PI / 210;
    camera.position.set(pacman.position.x, pacman.position.y - 2.5, pacman.position.z + 1);
    // camera.rotation.set(camera.rotation.x, pacman.rotation.y, pacman.rotation.z);
    // controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(main);
};


main();