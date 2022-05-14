import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import './App.css';
import LinearEquationsSolver from './components/LinearEquationsSolver/LinearEquationsSolver';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      className='tab-panel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <div className="page-header">
        <h2>Solve Linear Equations</h2>
      </div>
      <Box sx={{ bgcolor: 'background.paper', width: '95%', margin: '0 auto' }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="One Variable" {...a11yProps(0)} />
            <Tab label="Multiple Variables" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0} dir="ltr">
          <LinearEquationsSolver type="OneVariable" />
        </TabPanel>
        <TabPanel value={value} index={1} dir="ltr">
          <LinearEquationsSolver type="MultipleVariables" />
        </TabPanel>

      </Box>

    </div>
  );
}

export default App;
