import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { axiosInstance } from "./backend";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const Layout = ({ children }) => {
  const handleLogin = () => {
    // open http://localhost:8888/login in a new tab
    window.open("http://localhost:8888/login", "_blank");
  };

  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const Location = useLocation();

  const getUserInfo = async () => {
    try {
      setUserInfoLoading(true);
      const { data: res } = await axiosInstance.get("/me");
      if (!res) throw new Error("No user info found");
      setUserInfo(res);
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
    } finally {
      setUserInfoLoading(false);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Box
      width="min(100%, 750px)"
      height="min(100%, 500px)"
      borderWidth={1}
      borderRadius={8}
      p={3}
    >
      <Skeleton isLoaded={!userInfoLoading}>
        {loggedIn ? (
          <Flex direction="column" justifyContent="space-between" mb={3}>
            <Flex direction="row" justifyContent="space-between" mb={3}>
              <Heading>Hi {userInfo?.display_name}</Heading>
              <Image
                src={userInfo?.images[0]?.url}
                alt={userInfo?.display_name}
                fallbackSrc="https://via.placeholder.com/50"
              />
            </Flex>
            {Location.pathname !== "/" && (
              <Flex direction="row" justifyContent="space-between" mb={3}>
                <Link as={NavLink} to="/">
                  <ArrowBackIcon />
                  Go to Home
                </Link>
              </Flex>
            )}
          </Flex>
        ) : (
          <Flex direction="row" justifyContent="space-between" mb={3}>
            <Heading>Spotify Browser</Heading>
            <Button colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
          </Flex>
        )}
      </Skeleton>

      <hr />
      {children}
    </Box>
  );
};

export default Layout;
