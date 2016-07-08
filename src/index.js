require('styles/global.less');
require('styles/common.less');



import 'core-js/fn/object/assign';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, hashHistory  } from 'react-router';

import routes from './routes.jsx';


const rootEl =document.getElementById('app');

//logger.log("main", "start rendering the app..." );

ReactDom.render( <Router routes={routes} history={hashHistory}/>, rootEl);
