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
  SimpleGrid,
  Text,
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
import { NavLink } from "react-router-dom";

const ResultTable = ({ data }) => {
  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          {data?.length > 0 && data[0].map(({ colName }) => <Th>{colName}</Th>)}
        </Thead>
        <Tbody>
          {data?.map((row) => (
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
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const saveQuery = () => {
    localStorage.setItem("query", query);
  };
  const loadQuery = async () => {
    setQuery(localStorage.getItem("query"));
    if (
      !localStorage.getItem("query") ||
      localStorage.getItem("query").length === 0
    )
      return;
    handleSearch(localStorage.getItem("query"));
  };
  useEffect(() => {
    console.log("query", query);
  }, [query]);
  useEffect(() => {
    loadQuery();
  }, []);

  useEffect(() => {
    console.log("artists", artists);
    console.log("albums", albums);
    console.log("tracks", tracks);
  }, [artists, albums, tracks]);

  const handleSearch = async (passedQuery) => {
    if (!passedQuery) saveQuery();
    setLoading(true);
    const seachQuery = passedQuery || query;
    const endpoints = [
      `/search/artist/${seachQuery}`,
      `/search/album/${seachQuery}`,
      `/search/track/${seachQuery}`,
    ];
    try {
      const res = await Promise.all(
        endpoints.map((endpoint) => axiosInstance.get(endpoint))
      );

      setArtists(
        res[0].data?.artists.items.map(
          ({
            id,
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
                  maxWidth={100}
                  fallbackSrc="https://via.placeholder.com/100"
                />
              ),
            },
            {
              colName: "Name",
              colValue: (
                <Link as={NavLink} to={`/artist/${id}`}>
                  {name}
                </Link>
              ),
            },

            {
              colName: "Generes",
              colValue: (
                <Text maxW={200} textOverflow="ellipsis" overflow="hidden">
                  {genres?.length > 0 ? genres.join(", ") : "No generes found"}
                </Text>
              ),
            },
          ]
        )
      );
      setAlbums(
        res[1].data?.albums.items.map(
          ({
            id,
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
                  maxWidth={100}
                  fallbackSrc="https://via.placeholder.com/100"
                />
              ),
            },
            {
              colName: "Name",
              colValue: (
                <Link as={NavLink} to={`/album/${id}`}>
                  {name}
                </Link>
              ),
            },
          ]
        )
      );
      setTracks(
        res[2].data?.tracks.items.map(
          ({
            id,
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
                  maxWidth={100}
                  fallbackSrc="https://via.placeholder.com/100"
                />
              ),
            },
            {
              colName: "Name",
              colValue: (
                <Link as={NavLink} to={`/track/${id}`}>
                  {name}
                </Link>
              ),
            },
            {
              colName: "Artists",
              colValue: (
                <SimpleGrid>
                  {artists?.map(({ name, id }, index) => (
                    <Text>
                      <Link as={NavLink} to={`/artist/${id}`}>
                        {name}
                      </Link>
                      {index !== artists.length - 1 ? ", " : ""}
                    </Text>
                  ))}
                </SimpleGrid>
              ),
            },
          ]
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
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
