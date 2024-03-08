import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie9';
import { Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './components/Pages/homePage';
import Chats from './components/Pages/chatPage';


function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<Chats />} />
      </Routes>

    </div>
  );
}

export default App;
