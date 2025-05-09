'use client'
import Home from "~/home"
import { ErrorBoundary} from "react-error-boundary"
import 'antd/dist/reset.css'
import { store } from '@/store/redux' 
import { Provider } from "react-redux";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Home />
        </ErrorBoundary>
      </Provider>
    </>
  );
}
