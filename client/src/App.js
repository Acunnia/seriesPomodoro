import './App.css';
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";
import Layout, {Content, Footer} from "antd/es/layout/layout";
import AppHeader from "./components/Header";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopicList from "./containers/TopicList";

function App() {
  return (
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
                          <Route path="/register" element={<RegistrationForm/>} />
                          <Route path="/category" element={<TopicList/>} />
                          <Route path="/newcategory" element={<CategoryForm/>} />
                      </Routes>
                  </Content>
                  <Footer>Footer</Footer>
              </Layout>
          </div>
      </BrowserRouter>
  );
}

export default App;
