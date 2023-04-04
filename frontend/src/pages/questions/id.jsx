import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Spinner,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from '../../components/Renderer';
import { API_URL } from '../../constants';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import useHydrateUserState from '../../hooks/useHydrateUserState';
import useIntersectionObserver from '../../hooks/useIntersection';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/user';
import { useForm } from '@mantine/form';
import ResizeTextarea from 'react-textarea-autosize ';
import AnswerCard from '../../components/Answer';

export default function Question() {
  const params = useParams();
  const [data, setData] = useState({});
  const toast = useToast();
  useHydrateUserState();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    axios
      .get(`${API_URL}/questions/${params.slug}`, {
        signal,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'An Error Occured',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }, []);

  function upvote() {
    if (!localStorage.getItem('token'))
      return toast({
        description: 'Please Log in to upvote',
        status: 'error',
        title: 'Error',
      });
    axios
      .post(
        `${API_URL}/questions/${params.slug}/upvote`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(_ => {
        if (data.downvoted) {
          setData(d => ({
            ...d,
            upvotes: d.upvotes + 1,
            downvotes: d.downvotes - 1,
          }));
          return;
        } else {
          setData(d => ({
            ...d,
            upvoted: true,
            downvoted: false,
            upvotes: d.upvotes + 1,
          }));
        }
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'An Error Occured',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }
  function downvote() {
    if (!localStorage.getItem('token'))
    return toast({
      description: 'Please Log in to downupvote',
      status: 'error',
      title: 'Error',
    });
    axios
      .post(
        `${API_URL}/questions/${params.slug}/downvote`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(_ => {
        if (data.upvoted) {
          setData(d => ({
            ...d,
            upvotes: d.upvotes - 1,
            downvotes: d.downvotes + 1,
          }));
          return;
        } else {
          setData(d => ({
            ...d,
            upvoted: false,
            downvoted: true,
            downvotes: d.downvotes + 1,
          }));
        }
      })
      .catch(err => {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'An Error Occured',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }
  const [user] = useAtom(userAtom);
  const containerRef = useRef(null);
  const entry = useIntersectionObserver(containerRef, {});
  const {
    data: answers,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['answers', params.slug],
    queryFn: async ({ pageParam = 10 }) =>
      await (
        await fetch(
          `${API_URL}/questions/${params.slug}/answers?take=${pageParam}`
        )
      ).json(),
    getNextPageParam: (lastPage, allPages) => lastPage?.next,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      if (hasNextPage) {
        fetchNextPage();
      } else {
        refetch();
      }
    }
  }, [entry?.isIntersecting]);

  const formState = useForm({
    initialValues: {
      content: '',
    },
  });
  const [renderingMode, setRenderingMode] = useState('input');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Flex minH={'100vh'} align={'center'} mt="40" justify={'center'}>
        <Box rounded={'lg'} boxShadow={'lg'} width="100%" p={8}>
          {!data.content ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <Heading textAlign={'center'} mb="8">
                {data.title}
              </Heading>
              <Flex direction="row" justify="center" gap="10" mb="5">
                <Flex direction="row" align="center">
                  {data.upvoted ? (
                    <ImArrowUp
                      size="1.5em"
                      cursor={'pointer'}
                      onClick={upvote}
                    />
                  ) : (
                    <BiUpvote
                      size="1.5em"
                      cursor={'pointer'}
                      onClick={upvote}
                    />
                  )}
                  <Box ml="2">{data.upvotes}</Box>
                </Flex>
                <Flex direction="row" align="center">
                  {data.downvoted ? (
                    <ImArrowDown
                      size="1.5em"
                      cursor={'pointer'}
                      onClick={downvote}
                    />
                  ) : (
                    <BiDownvote
                      size="1.5em"
                      cursor={'pointer'}
                      onClick={downvote}
                    />
                  )}
                  <Box ml="2">{data.downvotes}</Box>
                </Flex>
              </Flex>
              <Divider />
              <Center>
                <Flex
                  direction="row"
                  gap="4"
                  align="center"
                  my="7"
                  wrap={'wrap'}
                >
                  <Badge colorScheme={'cyan'}>{data.grade.name}</Badge>
                  {data.subject.name ? (
                    <Badge colorScheme={'blue'}>#{data.subject.name}</Badge>
                  ) : null}
                </Flex>
              </Center>
              <Center>
                <Markdown>{data.content}</Markdown>
              </Center>
            </>
          )}
          <Divider my="5" />
          <div ref={containerRef}>
            <Heading textAlign={'center'} my="8">
              Answers
            </Heading>
            <Container mb="6">
              {(user.role.toLowerCase() === 'student' && user.verifiedHelper) ||
              user.role.toLocaleLowerCase() === 'teacher' ? (
                <>
                  <form
                    onSubmit={formState.onSubmit(({ content }) => {
                      setLoading(true);
                      axios
                        .post(
                          `${API_URL}/questions/${params.slug}/answer`,
                          { answer: content },
                          {
                            headers: {
                              authorization: `Bearer ${localStorage.getItem(
                                'token'
                              )}`,
                            },
                          }
                        )
                        .then(() => {
                          setLoading(false);
                          toast({
                            title: 'Success',
                            description: 'Answer Submitted',
                            status: 'success',
                          });
                          refetch();
                        })
                        .catch(err => {
                          setLoading(false);
                          toast({
                            title: 'Error',
                            description:
                              err.response?.data?.message || 'An Error Occured',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                          });
                        });
                    })}
                  >
                    <FormControl
                      id="content"
                      isRequired
                      isInvalid={formState.errors.content}
                    >
                      <FormLabel>Answer</FormLabel>
                      {renderingMode === 'input' ? (
                        <Textarea
                          type={'text'}
                          {...formState.getInputProps('content')}
                          placeholder="Your Answer (Markdown and Latex supported)"
                          minH="unset"
                          overflow="hidden"
                          w="100%"
                          minRows={1}
                          as={ResizeTextarea}
                        />
                      ) : (
                        <Markdown>
                          {formState.values.content || '**Nothing to Render**'}
                        </Markdown>
                      )}

                      <FormErrorMessage>
                        {formState.errors.content?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <Center gap={10}>
                      <Button
                        mt="4"
                        onClick={() =>
                          setRenderingMode(o =>
                            o === 'input' ? 'preview' : 'input'
                          )
                        }
                      >
                        {renderingMode === 'input' ? 'Preview' : 'Edit'}
                      </Button>
                      <Button type="submit" mt="4" loading={loading}>
                        Submit
                      </Button>
                    </Center>
                  </form>
                </>
              ) : null}
            </Container>

            {answers?.pages?.map((page, i) => (
              <Container key={i}>
                {page?.answers?.map(answer => (
                  <AnswerCard key={answer.id} {...answer} />
                ))}
              </Container>
            ))}
            {(answers?.pages?.length === 0 ||
              answers?.pages?.[0]?.answers?.length === 0) && (
              <Center>
                <Text>No Answers Yet</Text>
              </Center>
            )}
          </div>
        </Box>
      </Flex>
    </>
  );
}
