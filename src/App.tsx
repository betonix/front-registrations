import Router from "~/router";
import { Header } from "./components/Header";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <ToastContainer />
      <Header>
        <h1>Caju Front Teste</h1>
      </Header>
      <Router />
    </>
  );
}

export default App;