import { Home } from "~/home"
import { ErrorBoundary} from "react-error-boundary";

export default function App() {
  return (
    <>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Home />
        </ErrorBoundary>
    </>
  );
}
