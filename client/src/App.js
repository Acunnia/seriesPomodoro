import './App.css';
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";
import Login from "./containers/Login"
import Layout, {Content, Footer} from "antd/es/layout/layout";
import AppHeader from "./components/Header";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopicList from "./containers/TopicList";
import {useEffect, useReducer} from "react";
import {reducer, AuthContext} from "./utils/auth";

const authInitialState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

function App() {
    const [state, dispatch] = useReducer(reducer, authInitialState);

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch({
                type: 'LOGIN',
                payload: {
                    user,
                    token,
                },
            });
        }
    }, []);

  return (
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
                              <Route path="/newcategory" element={<CategoryForm/>} />
                          </Routes>
                      </Content>
                      <Footer>Footer</Footer>
                  </Layout>
              </div>
          </BrowserRouter>
      </AuthContext.Provider>
  );
}

export default App;
