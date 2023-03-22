import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
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
  SimpleGrid,
  Progress,
  Box,
} from "@chakra-ui/react";
import { axiosInstance } from "../backend";
import { msToFormattedInMinutes } from "../utils";

const percentageToRedGreen = (percentage) => {
  const red = Math.round(255 * percentage);
  const green = Math.round(255 * (1 - percentage));
  return `rgb(${red}, ${green}, 0)`;
};

const Track = () => {
  const [trackData, setTrackData] = useState(null);
  const [trackAudioFeatures, setTrackAudioFeatures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percentageKeys, setPercentageKeys] = useState([]);
  const { id } = useParams();

  const grabData = async () => {
    const endpoints = [`/track/${id}`, `/track-audio-features/${id}`];
    try {
      setLoading(true);
      const res = await Promise.all(
        endpoints.map((endpoint) => axiosInstance.get(endpoint))
      );
      setTrackData(res[0].data);
      setTrackAudioFeatures(res[1].data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    grabData();
  }, [id]);
  useEffect(() => {
    if (trackAudioFeatures) {
      const tempPercentageKeys = [];

      for (const key in trackAudioFeatures) {
        if (
          typeof trackAudioFeatures[key] === "number" &&
          trackAudioFeatures[key] >= 0 &&
          trackAudioFeatures[key] <= 1
        ) {
          tempPercentageKeys.push(key);
        }
      }
      console.log({ tempPercentageKeys });
      setPercentageKeys(tempPercentageKeys);
    }
  }, [trackAudioFeatures]);

  return (
    <Skeleton isLoaded={!loading}>
      <VStack align="stretch" width="100%" spacing={5}>
        <Flex
          direction="column"
          // set the background image to the artist's image artistData?.images[0]?.url
          background={`rgba(0, 0, 0, .65) url(${trackData?.album?.images[0]?.url})`}
          minHeight={300}
          backgroundSize="cover"
          // darken the background image slightly
          backgroundBlendMode="darken"
          color="white"
          //center the background image
          backgroundPosition="center"
          p={3}
        >
          <Flex direction="row">
            <Spacer />
            <Flex direction="column">
              <Link
                isExternal
                href={trackData?.external_urls.spotify}
                marginLeft="auto"
                textDecoration={"underline"}
              >
                Open in Spotify
              </Link>
              <Text>
                {/* {trackData?.album?.artists[0]?.name} - {trackData?.album?.name} */}
                <Link
                  as={NavLink}
                  to={`/artist/${trackData?.album?.artists[0]?.id}`}
                >
                  {trackData?.album?.artists[0]?.name}
                </Link>
                -{" "}
                <Link as={NavLink} to={`/album/${trackData?.album?.id}`}>
                  {trackData?.album?.name}
                </Link>
              </Text>
              <Text marginLeft={"auto"}>
                Duration: {msToFormattedInMinutes(trackData?.duration_ms)} min
              </Text>
            </Flex>
          </Flex>
          <Spacer />
          <Flex direction="column" width="100%">
            <Flex direction="row">
              <Heading size="md">{trackData?.name}</Heading>
              <Spacer />
              <Flex direction="column"></Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="row" width="100%" justifyContent="flex-start">
          <Heading>Audio Features</Heading>
        </Flex>
        <SimpleGrid columns={2} spacing={10}>
          {percentageKeys.map((key) => (
            <Flex
              width="100%"
              bg="gray.100"
              borderRadius={5}
              position="relative"
              minHeight={10}
            >
              <Box
                width={trackAudioFeatures[key] * 100 + "%"}
                // make the
                bg={percentageToRedGreen(1 - trackAudioFeatures[key])}
                borderRadius={5}
              />
              <Text
                position="absolute"
                left="50%"
                transform="translate(-50%, 30%)"
                fontWeight="bold"
              >
                {key[0].toUpperCase() + key.slice(1)} -{" "}
                {Math.round(trackAudioFeatures[key] * 100)}%
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </VStack>
    </Skeleton>
  );
};

export default Track;
