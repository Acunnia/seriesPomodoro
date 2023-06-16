import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const AppHeader = () => {
    return (
        <Header className="header">
            <div className={"header-container"}>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className={"menu"}>
                    <Menu.Item key="1" icon={<AppstoreOutlined />}>
                        Opción 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<MailOutlined />}>
                        Opción 2
                    </Menu.Item>
                    <Menu.Item key="3" icon={<SettingOutlined />}>
                        Opción 3
                    </Menu.Item>
                </Menu>
            </div>
        </Header>
    );
};

export default AppHeader;
