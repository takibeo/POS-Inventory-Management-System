import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#ecfdf5',
              color: '#065f46',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
