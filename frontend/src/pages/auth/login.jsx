import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Center,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Link, Navigate, redirect } from 'react-router-dom';
import { API_URL } from '../../constants';
import useHydrateUserState from '../../hooks/useHydrateUserState';
import { userAtom } from '../../state/user';

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";

export default function Login() {
  const [userState, setUserState] = useAtom(userAtom);
  useHydrateUserState();

  useEffect(() => {
    if (userState.id) redirect('/');
  }, [userState.id]);

  const formState = useForm({
    validateInputOnBlur: true,
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: value => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: value =>
        value.length > 9 ? null : 'Password must be at least 8 characters',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * @param {typeof formState.values} values
   */
  const login = async values => {
    const { email, password } = values;
    setLoading(true);
    axios
      .post(`${API_URL}/auth/login`, { email, password })
      .then(res => {
        setUserState(res.data.user);
        localStorage.setItem('token', res.data.token);
        toast({
          title: 'Logged in',
          description: 'You have successfully logged in',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        redirect('/');
      })
      .catch(err => {
        if (err.response) {
          toast({
            title: 'Error',
            description: err.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Something went wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (userState.id) return <Navigate to={'/'} replace />;

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Card maxW={"fit-content"}>
        <CardHeader display={"block"} align={'center'}>
          <VStack>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} opacity={0.5}>
            to access the WAO community!
          </Text>
          <Stack align="center">
            <Text>
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                style={{
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Sign Up
              </Link>
            </Text>
    </Stack>
    </VStack>
        </CardHeader>
        <CardBody rounded={'lg'} boxShadow={'lg'} p={8}>
          <Center>
          <form onSubmit={formState.onSubmit(d => login(d))}>
            <Stack spacing={4} minW={"400px"}>
              <FormControl
                id="email"
                isInvalid={formState.errors?.email}
                isRequired
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
              <Stack spacing={10}>
                <Button
                  bg={'brand.400'}
                  color={'white'}
                  _hover={{
                    bg: 'brand.500',
                  }}
                  isLoading={loading}
                  type="submit"
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
          </form>
    </Center>
        </CardBody>
      </Card>
    </Flex>
  );
}
