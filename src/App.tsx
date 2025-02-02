import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RenderedRoutes from "./routes";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RenderedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
