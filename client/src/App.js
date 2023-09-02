import './App.css';
import { useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, notification, message } from "antd";
import Layout, { Content, Footer } from "antd/es/layout/layout";
import { reducer, AuthContext } from "./utils/auth";
import RegistrationForm from "./pages/register/RegistrationForm";
import CategoryForm from "./pages/categoryForm/CategoryCreate";
import Forum from "./pages/forum/Forum";
import Login from "./pages/login/Login"
import Topic from "./pages/topic/Topic"
import AppHeader from "./components/Header";
import TopicList from "./pages/topicList/TopicList";
import TopicForm from "./pages/topicForm/TopicForm";
import ReadCategories from "./pages/admin/readCategories";
import Profile from "./pages/profile/Profile";
import jwt_decode from "jwt-decode";
import ReadRoles from './pages/admin/readRoles';
import ReadUsers from './pages/admin/readUsers';
import Activity from './pages/activity/Activity';

const authInitialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    admin_level: 0
};

function App() {
    const [state, dispatch] = useReducer(reducer, authInitialState);

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('user')) {
            const token = JSON.parse(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user'));
            if (isTokenExpired(token)) {
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



    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwt_decode(token);
            const tokenExpirationTimestamp = decodedToken.exp * 1000;
            const currentTime = Date.now();
            return tokenExpirationTimestamp < currentTime;
        } catch (error) {
            return false;
        }
    };

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
                algorithm: theme.darkAlgorithm,
            }}
        >
            <AuthContext.Provider value={{ state, dispatch }}>
                <BrowserRouter>
                    <div>
                        <Layout style={{ minHeight: "100vh" }} className={"main"}>
                            <div className={"header-wrap"}>
                                <AppHeader />
                            </div>
                            <Content className={"mainWrapper"}>
                                <span> Info del sistema </span>
                                <Routes>
                                    <Route path="/" exact element={<Forum />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<RegistrationForm />} />
                                    <Route path="/category" element={<TopicList />} />
                                    <Route path="/topic" element={<Topic />} />
                                    <Route path="/newcategory" element={<CategoryForm />} />
                                    <Route path="/newtopic" element={<TopicForm />} />
                                    <Route path="/profile/:name" element={<Profile />} />
                                    <Route path="/activity" element={<Activity />} />
                                    {state.isAuthenticated && state.admin_level === 5 ? (
                                        <>
                                            <Route path="/admin/cat" element={<ReadCategories />} />
                                            <Route path="/admin/role" element={<ReadRoles />} />
                                            <Route path="/admin/user" element={<ReadUsers />} />
                                        </>
                                    ) : null///TODO: añadir 404
                                }
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
