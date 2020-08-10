import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { WebsiteProvider } from './website.context';
import { websiteRouteConstant } from './website.constant';
import { NotFound, Notice, Privacy, TermNService, Security, Pricing, About, Home } from './views';

const { DEF, NOTICE, NOT_FOUND, PRIVACY, TERMS, SECURITY, PRICING, ABOUT, HOME } = websiteRouteConstant;

function WebsiteRoute() {
  return (
    <WebsiteProvider>
      <Switch>
        <Route exact path={DEF} component={Home} />
        <Route exact path={HOME} component={Home} />
        <Route exact path={ABOUT} component={About} />
        <Route exact path={NOTICE} component={Notice} />
        <Route exact path={PRIVACY} component={Privacy} />
        <Route exact path={PRICING} component={Pricing} />
        <Route exact path={SECURITY} component={Security} />
        <Route exact path={TERMS} component={TermNService} />
        <Route exact path={NOT_FOUND} component={NotFound} />
        <Redirect to={NOT_FOUND} />
      </Switch>
    </WebsiteProvider>
  );
}

export default WebsiteRoute;
