<<<<<<< HEAD
import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Booking Hotel Frontend</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </>
  );
}

export default App;
=======
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom"; 
import store from './redux/store';
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500, 
          success: {
            style: { background: "#52c41a", color: "#fff" },
          },
          error: {
            style: { background: "#ff4d4f", color: "#fff" },
          },
        }}
      />
    </Provider>
  );
}

export default App;
>>>>>>> feature/auth
