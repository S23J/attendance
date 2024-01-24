import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Hrd from './pages/Hrd';
import AbsensiPage from './pages/AbsensiPage';
import DataKaryawan from './pages/DataKaryawan';
import DetailKaryawan from './pages/DetailKaryawan';
import DetailAbsensi from './pages/DetailAbsensi';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Login /> } />
        <Route path='/home/' element={ <Home /> } />
        <Route path='/hrd/' element={ <Hrd /> } />
        <Route path='/data-absensi/' element={ <AbsensiPage /> } />
        <Route path='/data-karyawan/' element={ <DataKaryawan /> } />
        <Route path='/detail-absensi/:absenid/' element={ <DetailAbsensi /> } />
        <Route path='/detail-karyawan/:karyawanid/' element={ <DetailKaryawan /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
