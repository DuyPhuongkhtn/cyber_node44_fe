import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'

import { ChannelDetail, VideoDetail, SearchFeed, Navbar, Feed } from './components';
import InfoUser from "./components/InfoUser";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ForgotPass from "./components/ForgotPass";

const App = () => (
  <>
    <ToastContainer position="bottom-right" />
    <BrowserRouter>
    <Box sx={{ backgroundColor: '#000' }}>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Feed />} />
        <Route exact path='/videoType/:typeId' element={<Feed />} />

        <Route path='/video/:id' element={<VideoDetail />} />
        <Route path='/channel/:id' element={<ChannelDetail />} />
        <Route path='/info/:id' element={<InfoUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-pass' element={<ForgotPass />} />
        <Route path='/search/:searchTerm' element={<SearchFeed />} />
      </Routes>
      <Footer />
    </Box>
  </BrowserRouter>
  </>
 
);

export default App;
