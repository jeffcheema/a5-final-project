import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./Pages/Home";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    // scaffold a react router
    <ChakraProvider>
      <Flex
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        bg="white"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
