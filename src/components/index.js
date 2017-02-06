import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Dashboard from './protected/Dashboard'
import IconSetting from './protected/IconSetting'
import { logout } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AccountMenu from './AccountMenu'
import CircularProgress from 'material-ui/CircularProgress'

function MatchWhenAuthed ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function MatchWhenUnauthed ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true,
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  
  render() {
    return this.state.loading === true ? <MuiThemeProvider><CircularProgress size={80} thickness={5} /></MuiThemeProvider> : (
      <Router>
          <MuiThemeProvider>
          <div>
            <nav className="navbar navbar-default navbar-static-top ">
              <div className="container" style={{marginTop: 10}}>
                <div className="navbar-header">
                  <Link to="/" className="navbar-brand" >My notebook</Link>
                </div>
                <ul className="nav navbar-nav pull-right">
                  <li>
                    {this.state.authed? <Link to="/dashboard" className="navbar-brand">Dashboard</Link> : null}
                  </li>
                  <li>
                    {this.state.authed
                      ? <AccountMenu
                          onClick={() => {
                            logout()
                            this.setState({authed: false})
                            Router.transitionTo('/')
                          }} />
                      : <span>
                          <Link to="/login" className="navbar-brand">Login</Link>
                        </span>}
                  </li>
                </ul>
              </div>
            </nav>
            <div className="container">
              <div className="row">
                <Switch>
                  <Route exact path='/' component={Home} />
                  <MatchWhenUnauthed authed={this.state.authed} path='/login' component={Login} />
                  <MatchWhenUnauthed authed={this.state.authed} path='/register' component={Register} />
                  <MatchWhenAuthed authed={this.state.authed} path='/dashboard' component={Dashboard} />
                  <MatchWhenAuthed authed={this.state.authed} path='/IconSetting' component={IconSetting} />
                  <Route render={() => <h3>No Match</h3>} />
                </Switch>
              </div>
            </div>
          </div>
          </MuiThemeProvider>
      </Router>
    );
  }
}