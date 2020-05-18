var camera, scene, renderer;
var geometry, material, mesh;
var controls, time = Date.now();
var pacman
var objects = [];
var ray;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    }

    var pointerlockerror = function(event) {

        instructions.style.display = '';

    }

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function(event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function(event) {

                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);

                    element.requestPointerLock();
                }

            }

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false);

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);


    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xffffff, 0, 750);
    scene.background = new THREE.Color(0xf0f0f0);

    var light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(-1, -0.5, -1);
    scene.add(light);

    controls = new PointerLockControls(camera);
    scene.add(controls.getObject());

    ray = new THREE.Ray();
    ray.direction.set(0, -1, 0);

    var pacmanGeometry = new THREE.SphereGeometry(20, 32, 32);
    var pacmanMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
    pacman.position.y = 20;
    scene.add(pacman);

    camera.position.y = pacman.position.y;
    camera.position.z = pacman.position.z + 50;

    var jsonLoader = new THREE.JSONLoader();
    // jsonLoader.load('../models/xwing.js', object_to_scene);

    jsonLoader.load('../models/xwing.js', object_to_scene);
    // floor
    var earthTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.addEventListener('load', function(event) {
        earthTexture.image = event.content;
        earthTexture.needsUpdate = true;
    });
    loader.load('../textures/lantai.jpg');
    // var controls = new OrbitControls(camera, renderer.domElement);
    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));


    material = new THREE.MeshBasicMaterial({
        map: earthTexture,
        overdraw: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}
document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        pacman.position.z -= 1;
    } else if (keyCode == 83) {
        pacman.position.z += 1;
    } else if (keyCode == 65) {
        pacman.position.x -= 1;
    } else if (keyCode == 68) {
        pacman.position.x += 1;
    } else if (keyCode == 32) {
        pacman.position.set(0, 0, 0);
    }
};

function object_to_scene(geometry) {
    const material = new THREE.MeshFaceMaterial();

    xwing = new THREE.Object3D();

    ship = new THREE.Mesh(geometry, material);

    const scale = 1;
    ship.scale.set(scale, scale, scale);
    xwing.position.set(0, 0, -700);
    ship.rotation.set(0, Math.PI / 2, 0);

    ship.castShadow = true;
    ship.receiveShadow = false;

    xwing.addChild(ship);
    scene.addChild(xwing);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    // pacman.position.z -= 1;
    camera.position.y = pacman.position.y + 20;
    camera.position.x = pacman.position.x;
    camera.position.z = pacman.position.z + 100;

    requestAnimationFrame(animate);

    controls.isOnObject(false);

    ray.origin.copy(controls.getObject().position);
    ray.origin.y -= 10;

    var intersections = ray.intersectObjects(objects);

    if (intersections.length > 0) {

        var distance = intersections[0].distance;

        if (distance > 0 && distance < 10) {

            controls.isOnObject(true);
        }
    }
    // controls.update(Date.now() - time);
    renderer.render(scene, camera);
    time = Date.now();
}

init();
animate();