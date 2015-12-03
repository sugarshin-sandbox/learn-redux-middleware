import 'babel-polyfill';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';

function testMiddleware(store) {
  return next => action => {
    console.log(store, 'testMiddleware', 'store'); // => { dispatch, getState }
    console.log(next, 'testMiddleware', 'next'); // => next middleware
    console.log(action, 'testMiddleware', 'action'); // => current action
    next(action);
    // => ascending apply => 4
    console.log(store.getState(), 'testMiddleware', 'after state');
  };
}

function otherMiddleware(store) {
  return next => action => {
    console.log(store, 'otherMiddleware', 'store');
    console.log(next, 'otherMiddleware', 'next');
    console.log(action, 'otherMiddleware', 'action');
    next(action);
    // => ascending apply => 3
    console.log(store.getState(), 'otherMiddleware', 'after state');
  };
}

function moreMiddleware(store) {
  return next => action => {
    console.log(store, 'moreMiddleware', 'store');
    console.log(next, 'moreMiddleware', 'next');
    console.log(action, 'moreMiddleware', 'action');
    next(action);
    // => ascending apply => 1, logger => 2
    console.log(store.getState(), 'moreMiddleware', 'after state');
  };
}

const SOME_ACTION = 'SOME_ACTION';

function someReducer(state = {}, action) {
  switch (action.type) {
  case SOME_ACTION:
    return Object.assign({}, state, action.some);
  default:
    return state;
  }
}

function configureStore(reducer, initialState) {
  const finalCreateStore = compose(
    applyMiddleware(testMiddleware, otherMiddleware, logger(), moreMiddleware)
  )(createStore);
  return finalCreateStore(reducer, initialState);
}

const store = configureStore(someReducer, { some: 1 });

store.subscribe(() => {
  console.log(store.getState(), 'store.subscribe');
});

store.dispatch({
  type: SOME_ACTION,
  some: 33
});
