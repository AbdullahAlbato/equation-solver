import React, { FC, useEffect, useRef, useState } from 'react';
import AxesGrid from '../AxesGrid/AxesGrid';
import './LinearEquationsSolver.css';
import algebra from 'algebra.js';
import EquationEditor from 'equation-editor-react';
import { Box, Button, Card, CardContent, styled, Typography } from '@mui/material';
import { Point2 } from '../../models/Point2';
import Slider from '@mui/material/Slider';

type IProps = {
  type: string;
}
function LinearEquationsSolver({ type }: IProps) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [points, setPoints] = useState<Point2[]>([]);


  const [equation, setEquation] = useState("5x + 2 = 3x + 6");
  const axesGridRef = useRef<AxesGrid | null>(null);

  useEffect(() => {
    if (type === 'OneVariable') solveOneVariable(equation)
    else if (type === 'MultipleVariables') solveMultipleVariables(equation);
  }, [equation]);

  useEffect(() => {
    if (type === 'MultipleVariables') setEquation(`y=${a}x+${b}`);
  }, [a, b]);

  const solveOneVariable = (equationValue: string): void => {
    if (axesGridRef.current) {
      axesGridRef.current.clearAxesGrid();
    }
    const exp: string[] = equationValue.split('=');
    try {
      const exp1: any = algebra.parse(exp[0]);
      const exp2: any = algebra.parse(exp[1]);
      const equation = new algebra.Equation(exp1, exp2);

      console.log(equation.toString());

      const answer: any = equation.solveFor("x");

      console.log("x = " + answer);
      setX(+answer);
      axesGridRef.current?.drawingOneVariable(+answer);
    }
    catch (ex) {
    }

  }
  const solveMultipleVariables = (equationValue: string): void => {
    if (axesGridRef.current) {
      axesGridRef.current.clearAxesGrid();
    }
    const exp: string[] = equationValue.split('=');
    try {
      const exp1: any = algebra.parse(exp[0]);
      const exp2: any = algebra.parse(exp[1]);
      const equation = new algebra.Equation(exp1, exp2);

      console.log(equation.toString());

      const xAnswer: any = equation.solveFor("x");
      const yAnswer: any = equation.solveFor("y");


      console.log("x = " + xAnswer);
      console.log("y = " + yAnswer);
      setX(+xAnswer);
      setY(+yAnswer);
      axesGridRef.current?.drawingMultipleVariables(getPointsFromEquation(yAnswer.toString()));
    }
    catch (ex) {
    }

  }
  const getPointsFromEquation = (y: string): Point2[] => {
    const points: Point2[] = [];
    const xPoints = [-2, -1, 0, 1, 2];
    xPoints.forEach((x) => {
      const newY: string = y.replace('x', '*' + x);
      points.push({ x: x, y: eval(newY) });
    })
    setPoints(points);
    return points;
  }
  const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
    height: 2,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      height: 28,
      width: 28,
      backgroundColor: '#fff',
      boxShadow: iOSBoxShadow,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: -6,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&:before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: 'currentColor',
      },
    },
  }));
  const handleASliderChange = (event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => {
    setA(+value);
  };
  const handleBSliderChange = (event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => {
    setB(+value);
  };
  const PointsTable = () => {
    const pointList = points.map((point: Point2, index) =>
      <div className="row" key={index}>
        <div className="cell">
          {point.x}
        </div>
        <div className="cell">
          {point.y}
        </div>
      </div>
    );
    return (
      <div className="table">

        <div className="row header blue">
          <div className="cell">
            x
          </div>
          <div className="cell">
            y = {a}x + {b}
          </div>
        </div>
        {pointList}
      </div >
    )
  }
  return (
    <Box className="linear-equations-solver">
      <Card sx={{ width: '28%', minHeight: '90vh', marginRight: '2%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          {/* {type === 'OneVariable' &&
            <Typography component="div" className="equation-input">
              <EquationEditor
                value={equation}
                onChange={setEquation}
                autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
                autoOperatorNames="sin cos tan"
              />
            </Typography>
          } */}
          {type === 'MultipleVariables' &&
            <Typography component="div" sx={{ width: '100%' }}>
              <p>Y = ax + b</p>
              <p>Y = {a}x + {b}</p>
              <Typography component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography component="div" sx={{ width: '50%' }}>
                  <Typography gutterBottom sx={{ marginBottom: '2rem', color: '#cb0d0d', fontWeight: 'bold' }}>a</Typography>
                  <IOSSlider
                    onChangeCommitted={handleASliderChange}
                    aria-label="ios slider"
                    defaultValue={60}
                    value={a}
                    min={1}
                    max={10}
                    //  marks={marks}
                    valueLabelDisplay="on"
                  />

                </Typography>
                <Typography component="div" sx={{ width: '50%' }}>
                  <Typography gutterBottom sx={{ marginBottom: '2rem', color: '#cb0d0d', fontWeight: 'bold' }}>b</Typography>
                  <IOSSlider
                    onChangeCommitted={handleBSliderChange}
                    aria-label="ios slider"
                    defaultValue={60}
                    value={b}
                    min={1}
                    max={10}
                    //  marks={marks}
                    valueLabelDisplay="on"
                  />
                </Typography>
              </Typography>
              <PointsTable />
            </Typography>
          }
          {/* <Button variant="contained" color="warning" sx={{ marginTop: '1rem' }} onClick={() => solve(equation)}>Solve</Button> */}
        </CardContent>
      </Card>
      {/* {type === 'OneVariable' &&
        <Card className="solving-steps" sx={{ width: '29.2rem', marginTop: '2rem' }}>
          <CardContent>
            <Typography component="p">{equation}</Typography>
            <Typography component="p">x = {x}</Typography>
          </CardContent>
        </Card>
      } */}
      <Card sx={{ width: '70%' }}>
        <CardContent>
          <Typography component="div" className="axes-grid">
            <AxesGrid xPoint={x} yPoint={0} ref={axesGridRef} />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LinearEquationsSolver;
