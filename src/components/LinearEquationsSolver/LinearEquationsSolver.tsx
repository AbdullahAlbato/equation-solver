import React, { useRef, useState } from 'react';
import AxesGrid from '../AxesGrid/AxesGrid';
import './LinearEquationsSolver.css';
import algebra from 'algebra.js';
import EquationEditor from 'equation-editor-react';
import { Button, Card, CardContent } from '@mui/material';
function LinearEquationsSolver() {
  const [x, setX] = useState(0);
  const [gridIsShow, setGridIsShow] = useState(false);
  const [equation, setEquation] = useState("5x + 2 = 3x + 6");

  console.log(equation);
  const solve = (equationValue: string): number => {
    const exp: string[] = equationValue.split('=');
    const exp1: any = algebra.parse(exp[0]);
    const exp2: any = algebra.parse(exp[1]);
    const equation = new algebra.Equation(exp1, exp2);

    console.log(equation.toString());

    const answer: any = equation.solveFor("x");

    console.log("x = " + answer);
    setGridIsShow(true);
    return +answer;
  }
  const onChangeEquationEditor = (value: string) => {
    setEquation(value);
    setGridIsShow(false);
  }
  // solve('1/5x + 2/15 = 1/7x + 4');
  return (
    <div className="linear-equations-solver">
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          <div className="equation-input">
            <EquationEditor
              value={equation}
              onChange={onChangeEquationEditor}
              autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
              autoOperatorNames="sin cos tan"
            />
          </div>
          <Button variant="contained" color="warning" sx={{ marginTop: '1rem' }} onClick={() => setX(solve(equation))}>Solve</Button>
        </CardContent>

      </Card>
      {gridIsShow &&
        <Card className="solving-steps" sx={{ width: '29.2rem', marginTop: '2rem' }}>
          <CardContent>
            <p>{equation}</p>
            <p>x = {x}</p>
          </CardContent>
        </Card>
      }
      {gridIsShow &&
        <Card sx={{ marginTop: '2rem' }}>
          <CardContent>
            <div className="axes-grid">
              <AxesGrid xPoint={x} yPoint={0} />
            </div>

          </CardContent>
        </Card>
      }

    </div>
  );
}

export default LinearEquationsSolver;
