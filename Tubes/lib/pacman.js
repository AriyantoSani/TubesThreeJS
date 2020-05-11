var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1,100);
var renderer = new THREE.WebGLRenderer({ antialias: true});
scene.background = new THREE.Color('0x0a0a0a');
cam.position.z += 5;

scene.background = new THREE.TextureLoader().load('texture/bg.jpg');

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var texturePlane = new THREE.TextureLoader().load('texture/plane.jpg');

window.addEventListener('resize', function(){
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    cam.aspect = this.window.innerWidth/ this.window.innerHeight;
    cam.updateProjectionMatrix();
})


var plane = new THREE.PlaneGeometry(1000,1000,500,500);
var planeMaterial = new THREE.MeshLambertMaterial({
    map: texturePlane
})
var planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.position.set(0,-1,0);
planeMesh.rotation.x = -Math.PI/2;
scene.add(planeMesh);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

var control = new THREE.OrbitControls(cam,renderer.domElement);


function draw(){  
    renderer.render(scene, cam);
    requestAnimationFrame(draw);
}
draw();

