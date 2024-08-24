import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Users from './user/pages/Users';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
// import NewPlaces from './places/pages/NewPlaces';
import MainNavigation from './shared/Navigation/MainNavigation';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlaces from './places/pages/UpdatePlaces';
// import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlaces = React.lazy(() => import('./places/pages/NewPlaces'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlaces = React.lazy(() => import('./places/pages/UpdatePlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

let logoutTimer;
const App = () => {
	const storedData = JSON.parse(localStorage.getItem('userData'));
	const [token, setToken] = useState(storedData ? storedData.token : null);
	const [userId, setUserId] = useState(storedData ? storedData.userId : null);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();

	const login = useCallback((uid, token, expirationDate) => {
		setToken(token);
		setUserId(uid);
		const tokenexpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				expiration: tokenexpirationDate.toISOString(),
			})
		);
		setTokenExpirationDate(tokenexpirationDate);
	}, []);

	const logout = useCallback((uid, token, expirationDate) => {
		setToken(null);
		setUserId(null);
		setTokenExpirationDate(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime =
				tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path='/' exact>
					<Users />
				</Route>
				<Route path='/:userId/places' exact>
					<UserPlaces />
				</Route>
				<Route path='/places/new' exact>
					<NewPlaces />
				</Route>
				<Route path='/places/:placeId'>
					<UpdatePlaces />
				</Route>
				<Redirect to='/' />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path='/' exact>
					<Users />
				</Route>
				<Route path='/:userId/places' exact>
					<UserPlaces />
				</Route>
				<Route path='/auth'>
					<Auth />
				</Route>
				<Redirect to='/auth' />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				login: login,
				userId: userId,
				logout: logout,
			}}
		>
			<Router>
				<MainNavigation />
				<main>
					<Suspense
						fallback={
							<div className='center'>
								<LoadingSpinner />
							</div>
						}
					>
						{routes}
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
