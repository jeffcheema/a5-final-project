import React, { useEffect, useState } from "react";
import { axiosInstance } from "../backend";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Link,
  SimpleGrid,
  Skeleton,
  Spacer,
  Tag,
  TagLabel,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

import { msToFormattedInMinutes } from "../utils";

const Artist = () => {
  // get the /:id from the url
  const { id } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [artistRelatedArtists, setArtistRelatedArtists] = useState(null);
  const [artistTopTracks, setArtistTopTracks] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);
  const [loading, setLoading] = useState(false);
  const possibleColorSchemes = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
  ];
  const grabData = async () => {
    if (!id) return;
    const endpoints = [
      `/artist/${id}`,
      `/artist-related-artists/${id}`,
      `/artist-top-tracks/${id}`,
      `/artist-albums/${id}`,
    ];
    try {
      setLoading(true);
      const res = await Promise.all(
        endpoints.map((endpoint) => axiosInstance.get(endpoint))
      );
      setArtistData(res[0].data);
      setArtistRelatedArtists(res[1].data);
      setArtistTopTracks(res[2].data);
      setArtistAlbums(res[3].data);
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
          // set the background image to the artist's image artistData?.images[0]?.url
          background={`rgba(0, 0, 0, .65) url(${artistData?.images[0]?.url})`}
          minHeight={300}
          backgroundSize="cover"
          // darken the background image slightly
          backgroundBlendMode="darken"
          color="white"
          //center the background image
          backgroundPosition="center"
        >
          <Spacer />
          <Flex direction="column" width="100%" p={3}>
            <Flex direction="row">
              <Heading size="2xl">{artistData?.name}</Heading>
              <Spacer />
              <Flex direction="column">
                <Link
                  isExternal
                  href={artistData?.external_urls.spotify}
                  marginLeft="auto"
                  textDecoration={"underline"}
                >
                  Open in Spotify
                </Link>

                <Text>
                  Followers:{" "}
                  {artistData?.followers.total
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </Flex>
            </Flex>
            <Flex direction="row" gap={2}>
              {artistData?.genres.map((genre, index) => (
                <Tag
                  size="sm"
                  variant="subtle"
                  key={genre}
                  colorScheme={
                    possibleColorSchemes[index % possibleColorSchemes.length]
                  }
                >
                  <TagLabel>{genre}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="row" width="100%" justifyContent="flex-start">
          <Heading>Top Tracks</Heading>
        </Flex>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Tbody>
              {artistTopTracks?.tracks.map(
                (
                  {
                    id,
                    duration_ms,
                    album: {
                      images: [{ url: albumCover }],
                    },
                    name: trackName,
                  },
                  index
                ) => (
                  <Tr>
                    <Td maxWidth={10} isNumeric>
                      {index + 1}.
                    </Td>
                    <Td maxWidth={50}>
                      <Image
                        margin={0}
                        src={albumCover}
                        alt="album cover"
                        boxSize={50}
                        fallback="https://via.placeholder.com/150"
                      />
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
        <Flex direction="row" width="100%" justifyContent="flex-start">
          <Heading>Discography</Heading>
        </Flex>
        <SimpleGrid columns={[1, 2, 3, 3]} spacing={5}>
          {artistAlbums?.items.map(({ id, name, images, release_date }) => (
            // <Box>
            //   {" "}
            //   {id} {name} {images[0]?.url}{" "}
            // </Box>
            <LinkBox
              as={Card}
              maxW="sm"
              minWidth={200}
              minHeight={200}
              key={id}
              background={`rgba(0, 0, 0, .35) url(${images[0]?.url})`}
              backgroundSize="cover"
              // darken the background image slightly
              backgroundBlendMode="darken"
              color="white"
              //center the background image
              backgroundPosition="center"
              _hover={{
                boxShadow: "0 0 0 2px #fff, 0 0 0 4px #3182ce",
                cursor: "pointer",
              }}
            >
              <CardBody>
                <Flex
                  direction="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Heading size="sm">
                    <LinkOverlay as={NavLink} to={`/album/${id}`}>
                      {name}
                    </LinkOverlay>
                  </Heading>
                  <Text>
                    Released on {new Date(release_date).toLocaleDateString()}
                  </Text>
                </Flex>
              </CardBody>
            </LinkBox>
          ))}
        </SimpleGrid>
        <Flex direction="row" width="100%" justifyContent="flex-start">
          <Heading>Related Artists</Heading>
        </Flex>
        <SimpleGrid columns={[1, 2, 3, 3]} spacing={5}>
          {artistRelatedArtists?.artists.map(({ id, name, images }) => (
            <LinkBox
              as={Card}
              maxW="sm"
              minWidth={200}
              minHeight={200}
              key={id}
              background={`rgba(0, 0, 0, .35) url(${images[0]?.url})`}
              backgroundSize="cover"
              // darken the background image slightly
              backgroundBlendMode="darken"
              color="white"
              //center the background image
              backgroundPosition="center"
              _hover={{
                boxShadow: "0 0 0 2px #fff, 0 0 0 4px #3182ce",
                cursor: "pointer",
              }}
            >
              <CardBody>
                <Flex
                  direction="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Heading size="sm">
                    <LinkOverlay as={NavLink} to={`/artist/${id}`}>
                      {name}
                    </LinkOverlay>
                  </Heading>
                </Flex>
              </CardBody>
            </LinkBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Skeleton>
  );
};

export default Artist;
