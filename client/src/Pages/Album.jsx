import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Skeleton,
  VStack,
  Flex,
  Spacer,
  Heading,
  Link,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { axiosInstance } from "../backend";
import { NavLink } from "react-router-dom";
import { msToFormattedInMinutes } from "../utils";

const Album = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [albumTracks, setAlbumTracks] = useState(null);
  const [loading, setLoading] = useState(false);
  const grabData = async () => {
    const endpoints = [`/album/${id}`, `/album-tracks/${id}`];
    try {
      setLoading(true);
      const res = await Promise.all(
        endpoints.map((endpoint) => axiosInstance.get(endpoint))
      );
      setAlbumData(res[0].data);
      setAlbumTracks(res[1].data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    grabData();
  }, [id]);
  return (
    <Skeleton isLoaded={!loading}>
      <VStack align="stretch" width="100%" spacing={5}>
        <Flex
          direction="column"
          borderRadius="lg"
          // set the background image to the artist's image artistData?.images[0]?.url
          background={`rgba(0, 0, 0, .65) url(${albumData?.images[0]?.url})`}
          minHeight={300}
          backgroundSize="cover"
          // darken the background image slightly
          backgroundBlendMode="darken"
          color="white"
          //center the background image
          //   backgroundPosition="center"
        >
          <Spacer />
          <Flex direction="column" width="100%" p={3}>
            <Flex direction="row">
              <Heading size="2xl">{albumData?.name}</Heading>
              <Spacer />
              <Flex direction="column">
                <Link
                  isExternal
                  href={albumData?.external_urls.spotify}
                  margin="auto"
                  textDecoration={"underline"}
                >
                  Open in Spotify
                </Link>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="row" width="100%" justifyContent="flex-start">
          <Heading>Tracks</Heading>
        </Flex>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Tbody>
              {albumTracks?.items.map(
                (
                  {
                    id,
                    duration_ms,

                    name: trackName,
                  },
                  index
                ) => (
                  <Tr>
                    <Td maxWidth={10} isNumeric>
                      {index + 1}.
                    </Td>

                    <Td>
                      <Link as={NavLink} to={`/track/${id}`}>
                        {trackName}
                      </Link>
                    </Td>
                    <Td color="gray.500">
                      {msToFormattedInMinutes(duration_ms)}
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Skeleton>
  );
};

export default Album;
