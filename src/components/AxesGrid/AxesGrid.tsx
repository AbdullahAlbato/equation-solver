
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


var scene: any;
type IProps = {
    xPoint: number,
    yPoint: number
}
type IState = {
    frameId: number
}
class AxesGrid extends React.Component<IProps, IState> {
    mount: any;
    camera: any;
    renderer: any;
    axesGridSize: number = 100;
    gridDivisions: number = 10;
    pointStep: number = this.axesGridSize / this.gridDivisions
    constructor(props: any) {
        super(props);
        this.state = {
            frameId: 0
        };
    }

    componentDidMount() {

        this.gridDivisions = this.props.xPoint > (this.gridDivisions / 2) ? (this.props.xPoint * 2) + 2 : this.gridDivisions
        this.pointStep = this.axesGridSize / this.gridDivisions
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 140;
        this.camera.position.y = 0;
        this.camera.up.set(0, 0, 1);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor("#ffffff");
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // var flatMaterial = new THREE.MeshPhongMaterial({
        //     shading: THREE.FlatShading
        // });

        var axes = new THREE.AxesHelper(50);
        scene.add(axes);

        // var gridXZ = new THREE.GridHelper(100, 10);
        // gridXZ.setColors(new THREE.Color(0x006600), new THREE.Color(0x006600));
        // scene.add(gridXZ);
        var gridXY = new THREE.GridHelper(this.axesGridSize, this.gridDivisions);
        gridXY.rotation.x = Math.PI / 2;
        // gridXY..setColors(new THREE.Color(0x000066), new THREE.Color(0x000066));
        scene.add(gridXY);

        // var gridYZ = new THREE.GridHelper(100, this.gridDivisions);
        // gridYZ.rotation.z = Math.PI / 2;
        // gridYZ.setColors(new THREE.Color(0x660000), new THREE.Color(0x660000));
        // scene.add(gridYZ);

        document.addEventListener("mousemove", this.onDocumentMouseMove, false);
        window.addEventListener("resize", this.onWindowResize, false);
        this.addLineOnXAxes(0, "rgb(0,0,0)");
        this.addLineOnYAxes(0, "rgb(0,0,0)");

        this.addLineOnXAxes(this.props.xPoint, "rgb(255,0,0)");

        this.renderScene();
        //start animation
        this.start();
    }
    onWindowResize = () => {
        console.log('reize')
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }
    start = () => {
        if (!this.state.frameId) {
            this.setState({ frameId: requestAnimationFrame(this.animate) });
        }
    };

    onDocumentMouseMove = (event: any) => {
        event.preventDefault();
    };

    stop = () => {
        cancelAnimationFrame(this.state.frameId);
    };
    animate = () => {
        // this.earthMesh.rotation.z += 0.01;
        this.renderScene();
        this.setState({ frameId: window.requestAnimationFrame(this.animate) });

    };
    renderScene = () => {
        if (this.renderer) this.renderer.render(scene, this.camera);
    };
    addLineOnXAxes(x: number, color: THREE.ColorRepresentation) {
        const material = new THREE.LineBasicMaterial({ color });
        const points = [];
        points.push(new THREE.Vector2(x * this.pointStep, -this.axesGridSize / 2));
        points.push(new THREE.Vector2(x * this.pointStep, 0));
        points.push(new THREE.Vector2(x * this.pointStep, this.axesGridSize / 2));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
    addLineOnYAxes(y: number, color: THREE.ColorRepresentation) {
        const material = new THREE.LineBasicMaterial({ color });
        const points = [];
        points.push(new THREE.Vector2(-this.axesGridSize / 2, y * this.pointStep));
        points.push(new THREE.Vector2(0, y * this.pointStep));
        points.push(new THREE.Vector2(this.axesGridSize / 2, y * this.pointStep));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
    render() {
        return (
            <div
                style={{ width: "85vw", height: "75vh", padding: 5 }}
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}

export default AxesGrid;
