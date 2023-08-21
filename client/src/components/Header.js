import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Layout, Menu} from 'antd';
import {
    AppstoreOutlined,
    LoginOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './styles/Header.styles.css'
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../utils/auth";
import Modal from "antd/es/modal/Modal";

const { Header } = Layout;

const AppHeader = () => {
    const { dispatch, state } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uuusername, setUuusername] = useState("")

    console.log(state.user)

    const logout = () => {
        Modal.confirm({
            title: 'Logout?',
            onOk: () => {
                dispatch({
                    type: 'LOGOUT',
                });
                navigate('/');
            },
        });
    };

    const defaultItems = [
        {
            label: "Boards",
            key: 'boards',
            onClick: () => navigate("/"),
            icon: <AppstoreOutlined />,
        },
        {
            label: 'Login',
            key: 'login',
            icon: <LoginOutlined />,
            onClick: () => navigate("/login"),
        },
        {
            label: 'Register',
            key: 'register',
            onClick: () => navigate("/register"),
        },
    ]

    const logedItems = [
        {
            label: "Boards",
            key: 'boards2',
            onClick: () => navigate("/"),
            icon: <AppstoreOutlined />,
        },
        {
            label: <>{state.user && state.user.username.toString()}</>,
            key: 'welcome-user',
            children: [
                {
                    label: 'Logout',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    onClick: logout,
                },
            ],
        }
    ];

    return (
        <Header className="header">
            <div className={"header-container"}>
                <div className="logo">series Pomodoro</div>
                <Menu style={{ minWidth: 0, flex: "auto", justifyContent: "flex-end", backgroundColor: "#111111", borderBottom: 0 }} mode="horizontal" className={"menu"} items={state.isAuthenticated? logedItems : defaultItems} />
            </div>
        </Header>
    );
};

export default AppHeader;
