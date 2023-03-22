import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Link,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { axiosInstance } from "../backend";

const ResultTable = ({ data }) => {
  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          {data.length > 0 && data[0].map(({ colName }) => <Th>{colName}</Th>)}
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr>
              {row.map(({ colValue }) => (
                <Td>{colValue}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
const Home = () => {
  const handleLogin = () => {
    // open http://localhost:8888/login in a new tab
    window.open("http://localhost:8888/login", "_blank");
  };
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("artists", artists);
    console.log("albums", albums);
    console.log("tracks", tracks);
  }, [artists, albums, tracks]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoints = [
      `/search/artist/${query}`,
      `/search/album/${query}`,
      `/search/track/${query}`,
    ];
    try {
      const res = await Promise.all(
        endpoints.map((endpoint) => axiosInstance.get(endpoint))
      );

      setArtists(
        res[0].data.artists.items.map(
          ({
            name,
            external_urls: { spotify: externalLink },
            images: [image640, displayImage, image64],
            genres,
          }) => [
            {
              colName: "Image",
              colValue: (
                <Image
                  src={displayImage?.url}
                  alt={name}
                  fallbackSrc="https://via.placeholder.com/150"
                />
              ),
            },
            {
              colName: "Name",
              colValue: (
                <Link isExternal href={externalLink}>
                  {name}
                </Link>
              ),
            },

            {
              colName: "Generes",
              colValue: genres.join(", "),
            },
          ]
        )
      );
      setAlbums(
        res[1].data.albums.items.map(
          ({
            name,
            images: [image640, displayImage, image64],
            external_urls: { spotify: externalLink },
          }) => [
            {
              colName: "Image",
              colValue: (
                <Image
                  src={displayImage?.url}
                  alt={name}
                  fallbackSrc="https://via.placeholder.com/150"
                />
              ),
            },
            {
              colName: "Name",
              colValue: (
                <Link isExternal href={externalLink}>
                  {name}
                </Link>
              ),
            },
          ]
        )
      );
      setTracks(
        res[2].data.tracks.items.map(
          ({
            name,
            artists,
            album: {
              images: [image640, displayImage, image64],
            },
          }) => [
            {
              colName: "Image",
              colValue: (
                <img
                  src={displayImage?.url}
                  alt={name}
                  fallbackSrc="https://via.placeholder.com/150"
                />
              ),
            },
            {
              colName: "Name",
              colValue: name,
            },
            {
              colName: "Artists",
              colValue: artists.map(({ name }) => name).join(", "),
            },
          ]
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      width="min(100%, 750px)"
      height="min(100%, 500px)"
      borderWidth={1}
      borderRadius={8}
      p={3}
    >
      <Flex direction="row" justifyContent="space-between" mb={3}>
        <Heading>Spotify Browser</Heading>
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
      </Flex>

      <hr />
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        px={4}
        py={4}
      >
        <Input
          placeholder="Search for an artist, album, or track"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          Search
        </Button>
      </Flex>
      <Tabs>
        <TabList>
          <Tab>Artist</Tab>
          <Tab>Album</Tab>
          <Tab>Track</Tab>
        </TabList>
        <Skeleton isLoaded={!loading} p={3}>
          <TabPanels>
            <TabPanel>
              <ResultTable data={artists} />
            </TabPanel>
            <TabPanel>
              <ResultTable data={albums} />
            </TabPanel>
            <TabPanel>
              <ResultTable data={tracks} />
            </TabPanel>
          </TabPanels>
        </Skeleton>
      </Tabs>
    </Box>
  );
};

export default Home;
