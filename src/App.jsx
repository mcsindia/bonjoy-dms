import '../src/styles/dms/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DmsRoutes from './Routes/DmsRoutes/DmsRoutes';
import ProtectedRoute from './Routes/ProtectedRoute/ProtectedRoute';
/* Auth */
import { Login } from './layouts/dms/AuthLayout/Login';
import { ForgetPassword } from './layouts/dms/AuthLayout/ForgetPassword';
import { ResetPassword } from './layouts/dms/AuthLayout/ResetPassword';
import { OTP } from './layouts/dms/AuthLayout/OTP';
import { Register } from './layouts/dms/AuthLayout/Register';
import { NewPassword } from './layouts/dms/AuthLayout/NewPassword';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                 <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <DmsRoutes />
                            </ProtectedRoute>
                    }
                />
                 {/* Authentication */}
                <Route path='/dms' element={<Login />} />
                <Route path='/otp' element={<OTP />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/new-password' element={<NewPassword/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
