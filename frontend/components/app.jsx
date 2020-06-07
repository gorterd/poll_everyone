import React from 'react';
import { Route, Switch, matchPath } from 'react-router-dom';

import Navbar from './nav/navbar/navbar';
import Footer from './nav/footer';
import HomeNavbarContainer from './nav/navbar/home_navbar/home_navbar_container';
import AppNavbarContainer from './nav/navbar/app_navbar/app_navbar_container';

import HomeSplash from './nav/home_splash';

import LoginFormContainer from './session/login/login_container';
import SignupSplash from './session/signup/signup_splash';
import SignupFormContainer from './session/signup/signup_container';

import GroupsIndexContainer from './polls/groups_index/groups_index_container';
import { AuthRoute, ProtectedRoute } from '../util/component/routes_util';
import Modal from './modal';



const App = () => {
  return (
    <>     
      <section className='content'>
        <Modal />

        <Switch>
          <Route exact path='/'><HomeNavbarContainer /></Route>
          <ProtectedRoute path={['/polls', '/account', '/reports']}><AppNavbarContainer /></ProtectedRoute>
          <Navbar relativeRootPath={'/'} additionalClasses='nav-sticky' links={[]} tools={[]}/>
        </Switch>

        <Route path={['/polls', '/polls/new']}>
          <GroupsIndexContainer />
        </Route>

        <Route exact path='/'>
          <HomeSplash />
        </Route>

        <AuthRoute path='/login'>
          <LoginFormContainer/>
        </AuthRoute>

        <AuthRoute path='/signup/splash'>
          <SignupSplash />
        </AuthRoute>

        <AuthRoute path='/signup/create'>
          <SignupFormContainer />
        </AuthRoute>
      </section>

      <Route exact path={['/', '/polls', '/account']}>
        <Footer />
      </Route>
    </>
  )
}

export default App;