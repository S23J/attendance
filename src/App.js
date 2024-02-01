import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AbsensiPage from './pages/AbsensiPage';
import DataKaryawan from './pages/DataKaryawan';
import DetailKaryawan from './pages/DetailKaryawan';
import DetailAbsensi from './pages/DetailAbsensi';
import PrivateRoutes from './auth/PrivateRoute';
import PrintPageAbsenMasuk from './pages/PrintPage/PrintPageAbsenMasuk';
import PrintPageAbsenKeluar from './pages/PrintPage/PrintPageAbsenKeluar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Login /> } />
        <Route element={ <PrivateRoutes /> }>
          <Route element={ <Home /> } path='/home/' />
          <Route path='/data-absensi/' element={ <AbsensiPage /> } />
          <Route path='/data-karyawan/' element={ <DataKaryawan /> } />
          <Route path='/detail-absensi/:absenid/' element={ <DetailAbsensi /> } />
          <Route path='/detail-karyawan/:karyawanid/' element={ <DetailKaryawan /> } />
          <Route path='/absen-masuk/:karyawanid/' element={ <PrintPageAbsenMasuk /> } />
          <Route path='/absen-keluar/:karyawanid/' element={ <PrintPageAbsenKeluar /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
