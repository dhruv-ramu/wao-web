import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Center,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  VStack,
  Button,
  Heading,
  Text,
  Link,
  Spacer,
  NumberInputField,
  NumberInput,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { MultiSelect } from 'chakra-multiselect';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { API_URL } from '../../constants';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/user';
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [userState, setUserState] = useAtom(userAtom);
  const formState = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      grades: [],
      subjects: [],
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: value =>
        value.length > 9 ? null : 'Password must be at least 8 characters',
      name: value => (value.length > 0 ? null : 'Name is required'),
    },
    validateInputOnBlur: true,
  });
  /**
   * @param {typeof formState.values} values
   */
  const register = values => {
    setLoading(true);
    const { answersPerWeek, grades, email, name, password, subjects } = values;
    axios
      .post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
        teacher: isTeacher,
        grades: isTeacher ? grades : undefined,
        subjects: isTeacher ? subjects : undefined,
        answersPerWeek: isTeacher ? answersPerWeek : undefined,
      })
      .then(d => d.data)
      .then(d => {
        localStorage.setItem('token', d.token);
        setUserState(d.user);
        toast({
          title: 'Successfully registered',
          status: 'success',
        });
      })
      .catch(err => {
        const validationErrorMessage = err?.errors?.[0]?.message;
        toast({
          title:
            validationErrorMessage ||
            err?.response?.data?.message ||
            'An error occured',
          status: 'error',
        });
      });
    setLoading(false);
  };

  if (userState.id) return <Navigate to="/" replace />;

  return (
    <Center align={'center'} justify={'center'} mt={"150px"}>
      {/* <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}> */}
      <Card maxW={"fit-content"}>
        <CardHeader display={"block"} pb={"10px"}>
        <Center>
          <VStack>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} opacity={0.5}>
            to join the WAO community!
          </Text>
          </VStack>
        </Center>
        </CardHeader>
        <CardBody>
        <Box rounded={'lg'} border={"chakra-border-color"} borderWidth={"2px"} p={8}>
          <form onSubmit={formState.onSubmit(d => register(d))}>
            <Stack spacing={4}>
              <Box>
                <FormControl
                  id="Name"
                  isRequired
                  isInvalid={formState.errors?.name}
                >
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={formState.values.name}
                    onChange={e =>
                      formState.setFieldValue('name', e.target.value)
                    }
                  />
                  <FormErrorMessage>{formState.errors?.name}</FormErrorMessage>
                </FormControl>
              </Box>

              <FormControl
                id="email"
                isRequired
                isInvalid={formState.errors?.email}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={formState.values.email}
                  onChange={e =>
                    formState.setFieldValue('email', e.target.value)
                  }
                />
                <FormErrorMessage>{formState.errors?.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={formState.errors?.password}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formState.values.password}
                    onChange={e =>
                      formState.setFieldValue('password', e.target.value)
                    }
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword(showPassword => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formState.errors?.password}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="role" isRequired>
                <FormLabel>Please Select your Role</FormLabel>
                <Flex
                  direction={'row'}
                  gap={11}
                  alignItems="center"
                  justifyContent={'center'}
                  flexWrap="nowrap"
                >
                  <Box
                    w="200px"
                    p="10px"
                    borderWidth={isTeacher ? undefined : '2px'}
                    borderColor={!isTeacher ? 'green.500' : 'gray.300'}
                    borderRadius="10px"
                    onClick={() => setIsTeacher(false)}
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Text fontSize="xl" fontWeight="bold">
                      Student
                    </Text>
                    <Spacer />
                  </Box>
                  <Box
                    w="200px"
                    p="10px"
                    borderWidth={isTeacher ? '2px' : undefined}
                    borderColor={!isTeacher ? 'gray.300' : 'green.500'}
                    cursor={"pointer"}
                    borderRadius="10px"
                    onClick={() => setIsTeacher(true)}
                    alignItems="center"
                  >
                    <Text fontSize="xl" fontWeight="bold">
                      Teacher
                    </Text>
                    <Spacer />
                  </Box>
                </Flex>
              </FormControl>
              {/* TODO: FIX MULTISELECT STYLES; GLITCHING. */}
              {isTeacher === false ? null : (
                <>
                  <FormControl isRequired>
                    <FormLabel>Grade</FormLabel>
                    <MultiSelect
                      options={[
                        {
                          label: 'Grade 1',
                          value: 'Grade 1',
                        },
                        {
                          label: 'Grade 2',
                          value: 'Grade 2',
                        },
                        {
                          label: 'Grade 3',
                          value: 'Grade 3',
                        },
                        {
                          label: 'Grade 4',
                          value: 'Grade 4',
                        },
                        {
                          label: 'Grade 5',
                          value: 'Grade 5',
                        },
                        {
                          label: 'Grade 6',
                          value: 'Grade 6',
                        },
                        {
                          label: 'Grade 7',
                          value: 'Grade 7',
                        },
                        {
                          label: 'Grade 8',
                          value: 'Grade 8',
                        },
                        {
                          label: 'Grade 9',
                          value: 'Grade 9',
                        },
                        {
                          label: 'Grade 10',
                          value: 'Grade 10',
                        },
                        {
                          label: 'Grade 11',
                          value: 'Grade 11',
                        },
                        {
                          label: 'Grade 12',
                          value: 'Grade 12',
                        },
                      ]}
                      multiple
                      // placeholder="Select Grades"
                      bgColor={"brand.700"}
                      required
                      onChange={d => formState.setFieldValue('grades', d)}
                      value={formState.values.grades}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Subject</FormLabel>
                    <MultiSelect
                      options={[
                        {
                          label: 'Maths',
                          value: 'Maths',
                        },

                        {
                          label: 'Physics',
                          value: 'Physics',
                        },
                        {
                          label: 'Chemistry',
                          value: 'Chemistry',
                        },
                        {
                          label: 'Biology',
                          value: 'Biology',
                        },
                        {
                          label: 'English',
                          value: 'English',
                        },
                        {
                          label: 'I&S',
                          value: 'I&S',
                        },
                        {
                          label: 'IDU',
                          value: 'IDU',
                        },
                        {
                          label: 'Design',
                          value: 'Design',
                        },
                        {
                          label: 'Computer Science',
                          value: 'Computer Science',
                        },
                      ]}
                      multiple
                      placeholder="Select Subjects"
                      required
                      onChange={d => formState.setFieldValue('subjects', d)}
                      value={formState.values.subjects}
                    />
                  </FormControl>
                </>
              )}
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  color={'white'}
                  bg={"brand.400"}
                  _hover={{
                    bg: 'brand.500',
                  }}
                  type="submit"
                  isLoading={loading}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link href="/auth/login" color={'blue.400'}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
        </CardBody>
      </Card>
      {/* </Stack> */}
    </Center>
  );
}
