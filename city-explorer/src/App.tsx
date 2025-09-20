import Router from "./routers/Router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Router />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
          },
        }}
      />
    </>
  );
}

export default App;