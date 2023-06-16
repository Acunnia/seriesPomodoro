import logo from './logo.svg';
import './App.css';
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";
import Layout, {Content, Footer} from "antd/es/layout/layout";
import AppHeader from "./components/Header";



function App() {
  return (
      <Layout>
          <AppHeader />
          <Content className={"wrap"}>
                <Forum className={"content"}/>
          </Content>
          <Footer >Footer</Footer>
      </Layout>
  );
}

export default App;
