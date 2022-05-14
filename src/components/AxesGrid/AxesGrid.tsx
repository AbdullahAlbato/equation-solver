
import { Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Point2 } from "../../models/Point2";

type IProps = {
    xPoint: number,
    yPoint: number,
}
type IState = {
    frameId: number
}
class AxesGrid extends React.Component<IProps, IState> {
    mount: any;
    camera!: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    gridXY!: THREE.GridHelper;
    gridXZ!: THREE.GridHelper;
    gridYZ!: THREE.GridHelper;
    axesGridSize: number = 50;
    gridDivisions: number = 10;
    pointStep: number = this.axesGridSize / this.gridDivisions;
    constructor(props: any) {
        super(props);
        this.state = {
            frameId: 0
        };
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    componentDidMount() {
        this.createAxesGrid();

    }
    createAxesGrid() {
        this.gridDivisions = this.props.xPoint > (this.gridDivisions / 2) ? (this.props.xPoint * 2) + 2 : this.gridDivisions
        this.pointStep = this.axesGridSize / this.gridDivisions
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 140;
        this.camera.position.y = 0;
        this.camera.up.set(0, 0, 1);
        this.renderer.setClearColor("#ffffff");
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.mount.appendChild(this.renderer.domElement);
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // var flatMaterial = new THREE.MeshPhongMaterial({
        //     shading: THREE.FlatShading
        // });


        var axes = new THREE.AxesHelper(50);
        // axes.setColors(new THREE.Color('rgb(255, 0, 0)'), new THREE.Color('rgb(0, 0, 255)'), new THREE.Color('rgb(0, 0, 0)'))
        // Add X axes arrow to grid
        this.addArrowHelper(new THREE.Vector3(1, 0, 0), this.axesGridSize + 10, new THREE.Color('rgb(0, 0, 255)'));
        // Add Y axes arrow to grid
        this.addArrowHelper(new THREE.Vector3(0, 1, 0), this.axesGridSize + 10, new THREE.Color('rgb(0, 128, 0)'));
        // Add Z axes arrow to grid
        this.addArrowHelper(new THREE.Vector3(0, 0, 1), this.axesGridSize + 10, new THREE.Color('rgb(0, 0, 0)'));
        this.scene.add(axes);
        this.addGridXY();
        this.addGridXZ();
        this.addGridYZ();

        document.addEventListener("mousemove", this.onDocumentMouseMove, false);
        window.addEventListener("resize", this.onWindowResize, false);
        this.renderScene();
        //start animation
        this.start();
    }
    addArrowHelper(dir: THREE.Vector3, length: number, color: THREE.ColorRepresentation) {
        dir.normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, 4, 3);
        arrowHelper.line.material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2
        });
        this.scene.add(arrowHelper)
    }
    drawingOneVariable(x: number) {
        this.updateGrid(x);
        this.addLineOnXAxes(x, "rgb(255,0,0)");
    }
    drawingMultipleVariables(points: Point2[]) {
        // const xValues = points.map(point => {
        //     return point.x;
        // });
        // const yValues = points.map(point => {
        //     return point.y;
        // });
        this.updateGrid(4);
        this.addPlotLine(points, "rgb(255,0,0)");
    }
    addGridXY() {
        this.gridXY = new THREE.GridHelper(this.axesGridSize, this.gridDivisions);
        console.log(this.gridXY)
        this.gridXY.name = "axisXY";
        this.gridXY.rotation.x = Math.PI / 2;
        this.gridXY.castShadow = true;
        const material = new THREE.LineBasicMaterial({
            color: '#999',
            linewidth: 1,
        });
        this.gridXY.material = material;
        this.gridXY.translateX(this.axesGridSize / 2);
        this.gridXY.translateZ(-this.axesGridSize / 2);
        this.scene.add(this.gridXY);
    }
    addGridXZ() {
        this.gridXZ = new THREE.GridHelper(this.axesGridSize, this.gridDivisions,);
        this.gridXZ.translateX(this.axesGridSize / 2);
        this.gridXZ.translateZ(this.axesGridSize / 2);
        this.scene.add(this.gridXZ);
    }

    addGridYZ() {
        this.gridYZ = new THREE.GridHelper(this.axesGridSize, this.gridDivisions);
        this.gridYZ.name = "axisYZ"
        this.gridYZ.rotation.z = Math.PI / 2;
        this.gridYZ.translateX(this.axesGridSize / 2);
        this.gridYZ.translateZ(this.axesGridSize / 2);
        this.scene.add(this.gridYZ);
    }
    removeSceneChildByName(name: string) {
        this.scene.children.forEach((child) => {
            if (child.name === name) this.scene.remove(child);
        });
    }
    updateGrid(xPoint: number) {
        if (xPoint > 5) {
            this.gridDivisions = (xPoint * 2) + 2;
            this.pointStep = this.axesGridSize / this.gridDivisions;
            this.removeSceneChildByName('axisXY');
            this.removeSceneChildByName('axisXZ');
            this.removeSceneChildByName('axisYZ');
            this.addGridXY();
            this.addGridXZ();
            this.addGridYZ();
            this.renderScene();
        }
        else {
            this.gridDivisions = 10;
            this.pointStep = this.axesGridSize / this.gridDivisions;
            this.removeSceneChildByName('axisXY');
            this.removeSceneChildByName('axisXZ');
            this.removeSceneChildByName('axisYZ');
            this.addGridXY();
            this.addGridXZ();
            this.addGridYZ();
            this.renderScene();
        }

    }
    onWindowResize = () => {
        console.log('reize')
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    // componentWillReceiveProps(nextProps: IProps) {
    //     console.log('nextProps', nextProps);
    //     console.log('this.props', this.props)

    //     // You don't have to do this check first, but it can help prevent an unneeded render
    //     if (nextProps.xPoint !== this.props.xPoint) {
    //         //   this.setState({ showLabel: nextProps.label });
    //     }
    // }
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
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    };
    addPlotLine(points: Point2[], color: THREE.ColorRepresentation) {
        const material = new THREE.LineBasicMaterial(
            {
                color,
                linewidth: 1.5
            }
        );
        const newPoints: any[] = [];
        points.forEach((point) => {
            newPoints.push(new THREE.Vector3(point.x * this.pointStep, point.y * this.pointStep, 0));
        })
        const geometry = new THREE.BufferGeometry().setFromPoints(newPoints);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.renderScene();
    }
    addLineOnXAxes(x: number, color: THREE.ColorRepresentation) {
        const material = new THREE.LineBasicMaterial(
            {
                color,
                linewidth: 1.5
            }
        );
        const points = [];
        // points.push(new THREE.Vector3(x * this.pointStep, 0, 0));
        points.push(new THREE.Vector3(x * this.pointStep, 0, 0));
        points.push(new THREE.Vector3(x * this.pointStep, this.axesGridSize, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        // line.translateX(this.axesGridSize / 2);
        // line.translateZ(-this.axesGridSize / 2);
        this.scene.add(line);
        this.renderScene();
    }
    addLineOnYAxes(y: number, color: THREE.ColorRepresentation) {
        const material = new THREE.LineBasicMaterial({ color });
        const points = [];
        points.push(new THREE.Vector2(-this.axesGridSize / 2, y * this.pointStep));
        points.push(new THREE.Vector2(0, y * this.pointStep));
        points.push(new THREE.Vector2(this.axesGridSize / 2, y * this.pointStep));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.renderScene();

    }
    clearAxesGrid() {
        this.scene.children.forEach((child) => {
            if (child.type === 'Line') this.scene.remove(child);
        });

        this.renderScene();
    }
    render() {
        return (
            <>
                <div>
                    <Chip label="X Axis" sx={{ backgroundColor: 'rgb(0,0,255)', color: '#fff', marginRight: '.3rem' }} />
                    <Chip label="Y Axis" sx={{ backgroundColor: 'rgb(0,128,0)', color: '#fff', marginRight: '.3rem' }} />
                    <Chip label="Z Axis" sx={{ backgroundColor: 'rgb(0,0,0)', color: '#fff' }} />
                </div>
                <div
                    style={{ width: "100%", height: "75vh", padding: 5 }}
                    ref={mount => {
                        this.mount = mount;
                    }}
                />
            </>
        );
    }
}

export default AxesGrid;
