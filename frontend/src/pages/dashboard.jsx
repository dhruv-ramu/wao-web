/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Chakra imports
import {
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  Icon,
  Progress,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
// Custom components
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';
import CardHeader from '../components/Card/CardHeader';
import IconBox from '../components/Icons/IconBox';
import { Link, redirect } from 'react-router-dom';
// Icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from '../components/Icons/Icons';
import React, { useEffect, useState } from 'react';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { useAtom } from 'jotai';
import { userAtom } from '../state/user';
import useHydrateUserState from '../hooks/useHydrateUserState';
import axios, { isCancel } from 'axios';
import { API_URL } from '../constants';

export default function Dashboard() {
  const [user] = useAtom(userAtom);
  const [data, setData] = useState({});
  useHydrateUserState();

  useEffect(() => {
    if (!user.id || !user.role.toLowerCase() === 'student')
      return void redirect('/');
  }, [user]);

  const showToast = useToast();

  useEffect(() => {
    if (!localStorage.getItem('token')) return void redirect('/auth/login');
    const controller = new AbortController();
    axios
      .get(`${API_URL}/dashboard`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        signal: controller.signal,
      })
      .then(d => d.data)
      .then(setData)
      .catch(err => {
        if (isCancel(err)) return;
        showToast({
          description: err?.response?.data?.message || 'An Error Occured',
          status: 'error',
        });
      });
    return () => controller.abort();
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }} px={'20px'}>
      <Grid
        templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2fr 1.2fr 1.5fr' }}
        my="26px"
        gap="18px"
      >
        {/* Welcome Card */}
        <Card
          p="0px"
          gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
          bgImage={'/assets/img/cardimgfree.png'}
          bgSize="cover"
          bgPosition="50%"
          borderRadius="xl"
          maxWidth="784px"
          maxHeight="334px"
        >
          <CardBody w="100%" h="100%">
            <Flex
              flexDirection={{ sm: 'column', lg: 'row' }}
              w="100%"
              h="100%"
              borderRadius={'xl'}
            >
              <Flex
                flexDirection="column"
                h="100%"
                p="22px"
                minW="60%"
                lineHeight="1.6"
                textAlign={'left'}
                borderRadius="lg"
              >
                <Text
                  fontSize="sm"
                  color="gray.400"
                  fontWeight="bold"
                  textAlign={'left'}
                >
                  Welcome back,
                </Text>
                <Text fontSize="28px" color="#fff" fontWeight="bold" mb="18px">
                  {user.name}
                  {/* Need to add the variable for username here */}
                </Text>
                <Text
                  fontSize="md"
                  color="gray.400"
                  fontWeight="normal"
                  mb="auto"
                >
                  Glad to see you again! <br />
                  Ask me anything.
                </Text>
                <Spacer />
                <Flex align="center">
                  <Link to="/questions/ask">
                    <Button
                      p="0px"
                      variant="no-hover"
                      bg="transparent"
                      my={{ sm: '1.5rem', lg: '0px' }}
                    >
                      <Text
                        fontSize="sm"
                        color="#fff"
                        fontWeight="bold"
                        cursor="pointer"
                        transition="all .3s ease"
                        my={{ sm: '1.5rem', lg: '0px' }}
                        _hover={{ me: '4px' }}
                      >
                        Ask a question!
                      </Text>
                      <Icon
                        as={BsArrowRight}
                        w="20px"
                        h="20px"
                        color="#fff"
                        fontSize="2xl"
                        transition="all .3s ease"
                        mx=".3rem"
                        cursor="pointer"
                        pt="4px"
                        _hover={{ transform: 'translateX(20%)' }}
                      />
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
        {/* Satisfaction Rate */}
        <Card
          gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }}
          className="gradient"
          p="md"
          borderRadius="xl"
          maxWidth="470px"
          maxHeight="334px"
          minW={{ lg: '470px' }}
        >
          <CardHeader mb="24px" padding="5">
            <Flex direction="column">
              <Text color="#fff" fontSize="lg" fontWeight="bold" mb="4px">
                Upvote Rate
              </Text>
              <Text color="gray.400" fontSize="sm">
                From all questions
              </Text>
            </Flex>
          </CardHeader>
          <Flex direction="column" justify="center" align="center">
            <Box zIndex="-1">
              <CircularProgress
                size={200}
                value={data.upvoteRatio || 0}
                thickness={6}
                color="#582CFF"
                trackColor="gray.900"
                variant="vision"
                capIsRound
                max={100}
                mb="60"
              >
                <CircularProgressLabel>
                  <IconBox
                    mx="auto"
                    bg="brand.200"
                    borderRadius="50%"
                    w="48px"
                    h="48px"
                    mb="20px"
                  >
                    <Icon as={BiHappy} color="#fff" w="30px" h="30px" />
                  </IconBox>
                </CircularProgressLabel>
              </CircularProgress>
            </Box>
            <Stack
              direction="row"
              spacing={{ sm: '42px', md: '68px' }}
              justify="center"
              maxW={{ sm: '270px', md: '300px', lg: '95%' }}
              mx={{ sm: 'auto', md: '0px' }}
              p="18px 22px"
              bg="linear-gradient(126.97deg, rgb(6, 11, 40) 28.26%, rgba(10, 14, 35) 91.2%)"
              borderRadius="20px"
              position="absolute"
              bottom="5%"
            >
              <Text fontSize="xs" color="gray.400">
                0%
              </Text>
              <Flex direction="column" align="center" minW="80px">
                <Text color="#fff" fontSize="28px" fontWeight="bold">
                  {data.upvoteRatio}%
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Based on upvote-downvote ratio
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.400">
                100%
              </Text>
            </Stack>
          </Flex>
        </Card>
        {/* Referral Tracking */}
        <Card
          gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }}
          className="gradient"
          borderRadius="xl"
          maxWidth="588px"
          maxHeight="334px"
        >
          <Flex direction="column">
            <Flex justify="space-between" align="center" mb="40px">
              <Text color="#fff" fontSize="lg" fontWeight="bold">
                Your CP (Curiosity Points)
              </Text>
              <Button
                borderRadius="12px"
                w="38px"
                h="38px"
                bg="#22234B"
                _hover="none"
                _active="none"
              >
                <Icon as={IoEllipsisHorizontal} color="#7551FF" />
              </Button>
            </Flex>
            <Flex direction={{ sm: 'column', md: 'row' }}>
              <Flex
                direction="column"
                me={{ md: '6px', lg: '52px' }}
                mb={{ sm: '16px', md: '0px' }}
              >
                <Flex
                  direction="column"
                  p="22px"
                  pe={{ sm: '22e', md: '8px', lg: '22px' }}
                  minW={{ sm: '220px', md: '140px', lg: '220px' }}
                  bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)"
                  borderRadius="20px"
                  mb="20px"
                >
                  <Text color="gray.400" fontSize="sm" mb="4px">
                    Gain this Month
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    {data.curiosityPoints === undefined ? (
                      <Spinner thickness="4px" />
                    ) : (
                      `${data.curiosityPoints} CP`
                    )}
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  p="22px"
                  pe={{ sm: '22px', md: '8px', lg: '22px' }}
                  minW={{ sm: '170px', md: '140px', lg: '170px' }}
                  bg="linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)"
                  borderRadius="20px"
                >
                  <Text color="gray.400" fontSize="sm" mb="4px">
                    Total Curiosity Points
                  </Text>
                  <Text color="#fff" fontSize="lg" fontWeight="bold">
                    {data.totalCuriosityPoints} CP
                  </Text>
                </Flex>
              </Flex>
              <Box mx={{ sm: 'auto', md: '0px' }}>
                <CircularProgress
                  size={
                    window.innerWidth >= 1024
                      ? 200
                      : window.innerWidth >= 768
                      ? 170
                      : 200
                  }
                  value={data.totalCuriosityPoints || 0}
                  max={data.maxCuriosityPoints || 100}
                  capIsRound
                  trackColor="gray.800"
                  thickness={6}
                  color="#05CD99"
                  variant="vision"
                >
                  <CircularProgressLabel>
                    <Flex direction="column" justify="center" align="center">
                      <Text color="gray.400" fontSize="sm">
                        {Math.floor(
                          100 -
                            (data.maxCuriosityPoints -
                              (data.totalCuriosityPoints || 0)) /
                              100
                        )}
                        % to go!
                      </Text>
                      <Text
                        color="#fff"
                        fontSize={{ md: '36px', lg: '50px' }}
                        fontWeight="bold"
                        mb="4px"
                      >
                        {data.totalCuriosityPoints || 0}
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        Total Score
                      </Text>
                    </Flex>
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
            </Flex>
          </Flex>
        </Card>
      </Grid>
      <Text fontSize="20px" color="#fff" fontWeight="bold" mb="18px">
        Your Information
      </Text>
      {data.totalUpvotes === undefined ? (
        <>
          <Center>
            <Spinner thickness="4px" />
          </Center>
        </>
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
          {/* MiniStatistics Card */}
          <Card className="gradient" borderRadius="xl" padding="5">
            <CardBody>
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="sm"
                    color="gray.400"
                    fontWeight="bold"
                    pb="2px"
                  >
                    Questions Asked
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color="#fff">
                      {data.questionsAskedThisMonth}
                    </StatNumber>
                    {/* <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color="green.400"
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      +55%
                    </StatHelpText> */}
                  </Flex>
                </Stat>
                <IconBox as="Box" h={'45px'} w={'45px'} bg="brand.200">
                  <WalletIcon h={'24px'} w={'24px'} color="#fff" />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
          {/* MiniStatistics Card */}
          <Card minH="83px" className="gradient" borderRadius="xl" padding="5">
            <CardBody>
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="sm"
                    color="gray.400"
                    fontWeight="bold"
                    pb="2px"
                  >
                    Answers Recieved
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color="#fff">
                      {data.answersRecievedThisMonth}
                    </StatNumber>
                    {/* <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color="green.400"
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      +5%
                    </StatHelpText> */}
                  </Flex>
                </Stat>
                <IconBox as="Box" h={'45px'} w={'45px'} bg="brand.200">
                  <GlobeIcon h={'24px'} w={'24px'} color="#fff" />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
          {/* MiniStatistics Card */}
          <Card className="gradient" borderRadius="xl" padding="5">
            <CardBody>
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
              >
                <Stat>
                  <StatLabel
                    fontSize="sm"
                    color="gray.400"
                    fontWeight="bold"
                    pb="2px"
                  >
                    Your Grade Level
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color="#fff">
                      {data.grade}
                    </StatNumber>
                    <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color="brand.100"
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      {data.section}
                    </StatHelpText>
                  </Flex>
                </Stat>
                <Spacer />
                <IconBox as="Box" h={'45px'} w={'45px'} bg="brand.200">
                  <DocumentIcon h={'24px'} w={'24px'} color="#fff" />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
          {/* MiniStatistics Card */}
          <Card className="gradient" borderRadius="xl" padding="5">
            <CardBody>
              <Flex
                flexDirection="row"
                align="center"
                justify="center"
                w="100%"
              >
                <Stat me="auto">
                  <StatLabel
                    fontSize="sm"
                    color="gray.400"
                    fontWeight="bold"
                    pb="2px"
                  >
                    Downvotes Recieved
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize="lg" color="#fff" fontWeight="bold">
                      {data.downvotesRecievedThisMonth}
                    </StatNumber>
                    {/* <StatHelpText
                      alignSelf="flex-end"
                      justifySelf="flex-end"
                      m="0px"
                      color="green.400"
                      fontWeight="bold"
                      ps="3px"
                      fontSize="md"
                    >
                      -8%
                    </StatHelpText> */}
                  </Flex>
                </Stat>
                <IconBox as="Box" h={'45px'} w={'45px'} bg="brand.200">
                  <CartIcon h={'24px'} w={'24px'} color="#fff" />
                </IconBox>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      <Box gap="24px" mt={'15px'}>
        {/* Projects */}
        {/* <Card p='16px' overflowX={{ sm: 'scroll', xl: 'hidden' }}> */}
        {/* 	<CardHeader p='12px 0px 28px 0px'> */}
        {/* 		<Flex direction='column'> */}
        {/* 			<Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px'> */}
        {/* 				Questions Asked */}
        {/* 			</Text> */}
        {/* 			<Flex align='center'> */}
        {/* 				<Icon as={IoCheckmarkDoneCircleSharp} color='teal.300' w={4} h={4} pe='3px' /> */}
        {/* 				<Text fontSize='sm' color='gray.400' fontWeight='normal'> */}
        {/* 					<Text fontWeight='bold' as='span'> */}
        {/* 						74 asked */}
        {/* 					</Text>{' '} */}
        {/* 					this month. */}
        {/* 				</Text> */}
        {/* 			</Flex> */}
        {/* 		</Flex> */}
        {/* 	</CardHeader> */}
        {/* 	<Table variant='simple' color='#fff'> */}
        {/* 		<Thead> */}
        {/* 			<Tr my='.8rem' ps='0px'> */}
        {/* 				<Th */}
        {/* 					ps='0px' */}
        {/* 					color='gray.400' */}
        {/* 					fontFamily='Plus Jakarta Sans' */}
        {/* 					borderBottomColor='#56577A'> */}
        {/* 					Companies */}
        {/* 				</Th> */}
        {/* 				<Th color='gray.400' fontFamily='Plus Jakarta Sans' borderBottomColor='#56577A'> */}
        {/* 					Members */}
        {/* 				</Th> */}
        {/* 				<Th color='gray.400' fontFamily='Plus Jakarta Sans' borderBottomColor='#56577A'> */}
        {/* 					Budget */}
        {/* 				</Th> */}
        {/* 				<Th color='gray.400' fontFamily='Plus Jakarta Sans' borderBottomColor='#56577A'> */}
        {/* 					Completion */}
        {/* 				</Th> */}
        {/* 			</Tr> */}
        {/* 		</Thead> */}
        {/* 		<Tbody> */}
        {/* 			{dashboardTableData.map((row, index, arr) => { */}
        {/* 				return ( */}
        {/* 					<DashboardTableRow */}
        {/* 						name={row.name} */}
        {/* 						logo={row.logo} */}
        {/* 						members={row.members} */}
        {/* 						budget={row.budget} */}
        {/* 						progression={row.progression} */}
        {/* 						lastItem={index === arr.length - 1 ? true : false} */}
        {/* 					/> */}
        {/* 				); */}
        {/* 			})} */}
        {/* 		</Tbody> */}
        {/* 	</Table> */}
        {/* </Card> */}
        {/* <Text fontSize='20px' color='#fff' fontWeight='bold' mb='18px'> */}
        {/*    Questions */}
        {/*  </Text> */}
      </Box>
    </Flex>
  );
}
