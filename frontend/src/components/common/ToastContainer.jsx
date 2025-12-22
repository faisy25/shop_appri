import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored" // nice styling
      newestOnTop
    />
  );
};

export default ToastComponent;
