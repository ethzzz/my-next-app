import Home from "./components/home/home"
import 'antd/dist/reset.css'
import { store } from './store/redux' 
import { Provider } from "react-redux";

export default async function App() {
  return (
    <>
      <Provider store={store}>
        <Home />
      </Provider>
    </>
  );
}
