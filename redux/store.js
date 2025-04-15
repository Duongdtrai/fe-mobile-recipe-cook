import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import rootReducer from './reducers/rootReducer';
import rootSaga from './saga/rootSaga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware]

export const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middlewares)
    )
);

sagaMiddleware.run(rootSaga);

