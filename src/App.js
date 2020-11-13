import logo from './logo.svg';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Login from './componets/Login'
import Home from './componets/Home'
import InstitutionHome from './componets/InstitutionHome'
import Event from './componets/GlobalComponents/eventComponent'
import CreateEvent from './componets/InstitutionHome/createEvent'
import Settings from './componets/GlobalComponents/settings'
import MyEvents from './componets/InstitutionHome/myEvents'

function App() {
  const userType = 'person'
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/login' component={Login} />
          {userType === 'person' && (
            <>
              <Route exact path='/' component={Home} />
              <Route exact path='/event/:code' component={Event} />
            </>
          )}
          {userType === 'institution' && (
            <>
              <Route exact path='/' component={InstitutionHome} />
              <Route exact path='/event/:code' component={Event} />
              <Route exact path='/create_event' component={CreateEvent} />
              <Route exact path='/my_events' component={MyEvents} />
              <Route exact path='/settings' component={Settings} />
            </>
          )}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
