import logo from './logo.svg';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Login from './componets/Login'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/login' component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
