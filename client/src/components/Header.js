import React, {useContext, useState} from 'react';
import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    LoginOutlined,
    LogoutOutlined,
    MailOutlined,
    SettingOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import './styles/Header.styles.css'
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../utils/auth";
import Modal from "antd/es/modal/Modal";

const { Header } = Layout;

const AppHeader = () => {
    const { dispatch, state } = useContext(AuthContext);
    const navigate = useNavigate();

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

    return (
        <Header className="header">
            <div className={"header-container"}>
                <div className="logo">series Pomodoro</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className={"menu"}>
                    <Menu.Item key="1" icon={<AppstoreOutlined />}>
                        <NavLink to="/">Boards</NavLink>
                    </Menu.Item>
                    {state.isAuthenticated && (
                        <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
                            Logout
                        </Menu.Item>
                    )}
                    {!state.isAuthenticated && (
                        <Menu.Item key="/login" icon={<LoginOutlined />}>
                            <NavLink to="/login">Login</NavLink>
                        </Menu.Item>
                    )}
                    {!state.isAuthenticated && (
                        <Menu.Item key="/register" icon={<UserAddOutlined />}>
                            <NavLink to="/register">Register</NavLink>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
        </Header>
    );
};

export default AppHeader;
