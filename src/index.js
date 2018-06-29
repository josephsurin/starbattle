import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import store from './store'

require('./styles/main.sass')

import Home from './components/Home'

render(
	<Router>
		<div className="wrapper">	
			<Switch>
				<Route exact path="/" component={Home} />
			</Switch>
		</div>
	</Router>,
	document.getElementById('app'))