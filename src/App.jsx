import '../src/styles/dms/global.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DmsRoutes from './Routes/DmsRoutes/DmsRoutes';
import ProtectedRoute from './Routes/ProtectedRoute/ProtectedRoute';
/* Auth */
import { Login } from './layouts/dms/AuthLayout/Login';
import { ForgetPassword } from './layouts/dms/AuthLayout/ForgetPassword';
import { NewPassword } from './layouts/dms/AuthLayout/NewPassword';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Authentication */}
                <Route path='/dms' element={<Login />} />
                <Route path='/dms/forget-password' element={<ForgetPassword />} />
                <Route path='/dms/new-password' element={<NewPassword />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <DmsRoutes />
                            </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
