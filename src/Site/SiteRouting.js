import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import EmailVerification from '../Pages/EmailVerification';
import ForgotPassword from '../Pages/ForgotPassword';
import Login from '../Pages/Login';
import PartnerRegistration from '../Pages/PartnerRegistration';
import UserRegistration from '../Pages/UserRegistration';
import SiteBody from '../Site/SiteBody';

// This is temporary to activate Facebook
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import TermsOfUse from '../Pages/TermsOfUse';

const baikkyHomePage = "https://www.baikky.com/";

function SiteRouting() {
  
  
  return (
    <Router basename="/dashboard">
      <Switch>
        <Route exact path='/login/:type'>
          <Login/>
        </Route>
        <Route exact path='/forgotPassword/:type'>
          <ForgotPassword/>
        </Route>
        <Route exact path='/register/partner'>
          <PartnerRegistration/>
        </Route>
        <Route exact path='/register/user'>
          <UserRegistration/>
        </Route>
        <Route
         exact path='/verifyEmail/:type/:id'>
          <EmailVerification/>
        </Route>
        <Route exact path='/privacy-policy'>
          <PrivacyPolicy/>
        </Route>
        <Route exact path='/terms-of-use'>
          <TermsOfUse/>
        </Route>
        <Route exact path='/main/:page?'
          render={() => {
            const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
            return (
              loginDetails ? <SiteBody/> : <Redirect to='/login/user' />
            )
          }}
        />
        <Route render={() => (
          <Redirect to='/login/user' />
        )}/>
      </Switch>
    </Router>
  );
}

export default SiteRouting;
