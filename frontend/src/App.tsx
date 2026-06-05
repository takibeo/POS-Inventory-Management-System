import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  );
}

export default App;
