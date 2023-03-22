import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./Pages/Home";
import Artist from "./Pages/Artist";
import Album from "./Pages/Album";
import Track from "./Pages/Track";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

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
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artist/:id" element={<Artist />} />
              <Route path="/album/:id" element={<Album />} />
              <Route path="/track/:id" element={<Track />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
