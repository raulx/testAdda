import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      <h1 className=" text-3xl text-red-700">Hello world.</h1>
      <Button variant="default">Button</Button>
    </div>
  );
}

export default App;
