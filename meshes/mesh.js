function render(id, objpath, shade) {
    const myFov = 45;
    const viewWidth = 100;
    const viewHeight = 50;
    const heightRatio = 4.0;
    const widthRatio = 2.0;

    var rW = window.innerWidth / widthRatio; // renderer width
    var rH = window.innerHeight / heightRatio; // renderer height

    var scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(250,250,250)");

    var camera = new THREE.PerspectiveCamera( myFov, rW / rH, 0.1, 10000 );
    camera.position.z = 50 / 2 / Math.tan(THREE.Math.degToRad(myFov/2))


    var renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setSize( rW, rH);
    

    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;

    
    document.querySelector(id).appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var material = new THREE.MeshPhongMaterial(
    {color: 0xffffff,
     shading: shade});

    // lighting 
    var lightHolder = new THREE.Group();

    var keyLight = new THREE.DirectionalLight(new THREE.Color('rgb(200,200,200)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('rgb(100,100,100)'), 0.75);    
    fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(new THREE.Color('rgb(200,200,200)'), 1.0);
    backLight.position.set(100, 0, -100).normalize();

    lightHolder.add(keyLight);
    lightHolder.add(fillLight);
    lightHolder.add(backLight);
    scene.add(lightHolder);
   
    function callbackOnLoad(object3d) {
        object3d.receiveShadow = true;
        object3d.castShadow = true;
        object3d.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {
            child.material = material;
        }

    } );
        scene.add(object3d);
    }

    window.addEventListener('resize',()=>{
        rW = window.innerWidth / widthRatio; // renderer width
        rH = window.innerHeight / heightRatio; // renderer height
        renderer.setSize(rW,rH );
        camera.aspect = rW / rH;

        const viewAspect = viewWidth / viewHeight 
        const special = camera.aspect > viewAspect
        const uniform = { value : 0 }
        uniform.value = special ? 1 : 0

        if(special){
            const camH = Math.tan(THREE.Math.degToRad(myFov/2))
            const ratio = camera.aspect / viewAspect
            const newH = camH / ratio
            const newFov = THREE.Math.radToDeg(Math.atan(newH)) * 2
            camera.fov = newFov
        } else {
            camera.fov = myFov
        }
        camera.updateProjectionMatrix()
    })

    var loader = new THREE.OBJLoader();
    loader.load(objpath, callbackOnLoad, null, null, null);

    camera.position.z = 2; // TODO: set z properly

    console.log(scene.children);

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        lightHolder.quaternion.copy(camera.quaternion);

        renderer.render(scene, camera);
    };

    animate();
}
