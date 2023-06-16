import logo from './logo.svg';
import './App.css';
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";
import Layout, {Content, Footer} from "antd/es/layout/layout";
import AppHeader from "./components/Header";



function App() {
  return (
      <Layout className={"main"}>
          <div className={"header-wrap"}>
              <AppHeader/>
          </div>
          <Content className={"mainWrapper"}>
              <span> Info del sistema </span>
              <Forum />
          </Content>
          <Footer >Footer</Footer>
      </Layout>
  );
}

export default App;
