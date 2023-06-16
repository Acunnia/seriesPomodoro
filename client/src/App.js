import logo from './logo.svg';
import './App.css';
import RegistrationForm from "./containers/RegistrationForm";
import CategoryForm from "./containers/CategoryCreate";
import Forum from "./containers/Forum";

function App() {
  return (
    <div className="App">
      <h1>Formulario de Registro</h1>
      <RegistrationForm />
        <h1>Crear Categoría</h1>
        <CategoryForm />

        <Forum />
    </div>
  );
}

export default App;
