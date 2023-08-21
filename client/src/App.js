import './App.css';
import {useEffect, useReducer} from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {ConfigProvider, theme, notification} from "antd";
import Layout, {Content, Footer} from "antd/es/layout/layout";
import {reducer, AuthContext} from "./utils/auth";
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";
import Login from "./containers/Login"
import Topic from "./containers/Topic"
import AppHeader from "./components/Header";
import TopicList from "./containers/TopicList";
import TopicForm from "./containers/TopicForm";
import ReadCategories from "./containers/admin/readCategories";
import jwt_decode from "jwt-decode";

const authInitialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    admin_level: 0
};

function App() {

    const [state, dispatch ] = useReducer(reducer, authInitialState);

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));
            const decodedToken = jwt_decode(token);
            const tokenExpirationTimestamp = decodedToken.exp * 1000;
            const currentTime = Date.now();
            const isSavedTokenExpired = tokenExpirationTimestamp < currentTime;

            if (isSavedTokenExpired) {
                showNotification('Your session has expired', 'You need to log in again', 'topRight');
                dispatch({ type: 'LOGOUT' });
            } else {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        user,
                        token,
                    },
                });
            }
        }
    }, []);

    const showNotification = (message, desc, place) => {
        notification.info({
            message: message,
            description: desc,
            placement: place,
        });
    };

  return (
      <ConfigProvider
          theme={{
              // 1. Use dark algorithm
              algorithm: theme.darkAlgorithm,

              // 2. Combine dark algorithm and compact algorithm
              // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
          }}
      >
          <AuthContext.Provider value={{ state, dispatch }}>
              <BrowserRouter>
                  <div>
                      <Layout className={"main"}>
                          <div className={"header-wrap"}>
                              <AppHeader/>
                          </div>
                          <Content className={"mainWrapper"}>
                              <span> Info del sistema </span>
                              <Routes>
                                  <Route path="/" exact element={<Forum/>} />
                                  <Route path="/login"  element={<Login/>} />
                                  <Route path="/register" element={<RegistrationForm/>} />
                                  <Route path="/category" element={<TopicList/>} />
                                  <Route path="/topic" element={<Topic/>} />
                                  <Route path="/newcategory" element={<CategoryForm/>} />
                                  <Route path="/newtopic" element={<TopicForm/>} />
                                  <Route path="/admin/cat" element={<ReadCategories/>} />
                              </Routes>
                          </Content>
                          <Footer className={"footer"} style={{
                              textAlign: 'center',
                          }}>Series Pomodoro ©2023

                          </Footer>
                      </Layout>
                  </div>
              </BrowserRouter>
          </AuthContext.Provider>
      </ConfigProvider>
  );
}

export default App;
