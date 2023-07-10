import Counter from './components/Counter';
import Form from './components/Form';
import './App.css';
import { useState,useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from './actions/themeAction';

function App() {
  const [count, setCount] = useState(0)
  const [formDone, setFormDone] = useState(false);
  const dispatch = useDispatch();
  const darkTheme = useSelector(state => state.darkTheme);

  useEffect(() => {
    if (darkTheme) {
      document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
    } else {
      document.body.style.backgroundColor = "white";
    }
  }, [darkTheme]);

  return (
    <Router>
      <div className="App">
        <p>react router example</p>
        <button onClick={() => dispatch(changeTheme())}>change theme</button>
        <ul>
          <li><Link to="counter">Counter</Link></li>
          <li><Link to="form">Form</Link></li>
        </ul>
        <Routes>
          <Route path='/counter' element={<Counter count={count} setCount={setCount} />} />
          <Route path='/form' element={<Form formDone={formDone} setFormDone={setFormDone} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
