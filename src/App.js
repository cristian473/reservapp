import logo from './logo.svg';
import './App.css';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import Login from './componets/Login'
import Home from './componets/Home'
import InstitutionHome from './componets/InstitutionHome'
import Event from './componets/GlobalComponents/eventComponent'
import CreateEvent from './componets/InstitutionHome/createEvent'
import Settings from './componets/GlobalComponents/settings'
import MyEvents from './componets/GlobalComponents/myEvents'
import ReserveSite from './componets/Home/reserveSite'
import myReservations from './componets/Home/myReservations'
import ReservInfo from './componets/Home/reservInfo'
import ReservasInfo from './componets/InstitutionHome/reservasInfo'
import { getUserByDNI } from './database'
import { useSelector, useDispatch } from 'react-redux'
import MemberForm from './componets/Home/memberForm.js';
import { MemberFormPDF } from './componets/InstitutionHome/memberFormPDF';
import MemberFormList from './componets/InstitutionHome/seeMemberForms';
// import FaceRecognition from './componets/faceRecognition'

function App() {
  const dispatch = useDispatch();
  let type = useSelector((store) => store?.user?.user?.type)
  if (!type && localStorage.getItem('u_data')) {
    let userFromCache = JSON.parse(localStorage.getItem('u_data'))
    dispatch(getUserByDNI(userFromCache))
  }

  Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/pdf'component={MemberFormPDF}/>
          <Route path='/form-list' component={MemberFormList}/>
          {!type &&
            <>
              <Route exact path='/'>
                <Redirect to='/login' />
              </Route>
              <Route exact path={'/login'} component={Login} />
            </>
          }

          {type === 'person' && (
            <>
              <Route exact path='/login'>
                <Redirect to='/' />
              </Route>
              <Route exact path='/' component={Home} />
              <Route exact path='/event/:code' component={Event} />
              <Route exact path='/event/:code/reserve' component={ReserveSite} />
              <Route exact path='/next_events' component={MyEvents} />
              <Route exact path='/settings' component={Settings} />
              <Route exact path='/reservations' component={myReservations} />
              <Route exact path='/reservation/:id' component={ReservInfo} />
              <Route exact path='/form' component={MemberForm} />
            </>
          )}
          {type === 'institution' && (
            <>
              <Route exact path='/login'>
                <Redirect to='/' />
              </Route>
              <Route exact path='/' component={InstitutionHome} />
              <Route exact path='/event/:code' component={Event} />
              <Route exact path='/create_event' component={CreateEvent} />
              <Route exact path='/my_events' component={MyEvents} />
              <Route exact path='/settings' component={Settings} />
              <Route exact path='/event/:code/reservas' component={ReservasInfo} />
            </>
          )}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
