import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { Navigate, useNavigate } from 'react-router-dom';
import useHydrateUserState from '../../hooks/useHydrateUserState';
import { userAtom } from '../../state/user';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import Markdown from '../../components/Renderer';
import ResizeTextarea from 'react-textarea-autosize';
import axios from 'axios';
import { API_URL } from '../../constants';

import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';

const AskAQuestion = () => {
  useHydrateUserState();
  const [user] = useAtom(userAtom);
  const formState = useForm({
    initialValues: {
      title: '',
      content: '',
      grade: '',
      subject: '',
    },
  });
  const [loading, setLoading] = useState(false);
  if (!user.id) return <Navigate to="/auth/login" />;
  const [renderingMode, setRenderingMode] = useState('input');
  const [titleRenderingMode, setTitleRenderingMode] = useState('input');
  const toast = useToast();
  const navigate = useNavigate();
  /**
   * @param {typeof formState.values} e
   */
  const handleSubmit = async e => {
    setLoading(true);
    const { content, grade, subject, title } = e;
    const token = localStorage.getItem('token');
    axios
      .post(
        `${API_URL}/questions`,
        {
          content,
          grade,
          subject,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(d => d.data)
      .then(d => navigate(`/questions/${d.url}`))
      .catch(d => {
        toast({
          title:
            d.errors?.[0]?.message ||
            d.response?.data?.message ||
            'Something went wrong',
          status: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Center mt={'130px'} mb={0}>
      <Card maxW={'fit-content'} align={'center'} justify={'center'}>
        <Box rounded={'lg'} p={8}>
          <CardHeader display={'block'}>
            <Center mb="9">
              <Heading>Ask a question</Heading>
            </Center>
          </CardHeader>
          <CardBody>
            <form onSubmit={formState.onSubmit(d => handleSubmit(d))}>
              <Box>
                <FormControl
                  isInvalid={formState.errors?.title}
                  placeholder="Your Question"
                  isRequired
                >
                  <FormLabel>Question</FormLabel>
                  {titleRenderingMode === 'input' ? (
                    <>
                      <Input
                        type={'text'}
                        value={formState.values.title}
                        onChange={e =>
                          formState.setFieldValue('title', e.target.value)
                        }
                        placeholder="Markdown and Latex supported"
                      />
                      <Button
                        mt="5"
                        onClick={() => setTitleRenderingMode('preview')}
                      >
                        Preview
                      </Button>
                    </>
                  ) : (
                    <>
                      <Markdown>
                        {formState.values.title || '**Nothing to Render**'}
                      </Markdown>
                      <Button
                        mt="5"
                        onClick={() => setTitleRenderingMode('input')}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                  <FormErrorMessage>{formState.errors?.title}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={formState.errors?.title}
                  isRequired
                  label="Description"
                >
                  <FormLabel>Description</FormLabel>
                  {renderingMode === 'input' ? (
                    <>
                      <Textarea
                        type={'text'}
                        value={formState.values.content}
                        onChange={e =>
                          formState.setFieldValue('content', e.target.value)
                        }
                        placeholder="Markdown and Latex supported"
                        minH="unset"
                        overflow="hidden"
                        w="100%"
                        minRows={1}
                        as={ResizeTextarea}
                      />
                      <Button
                        mt="5"
                        onClick={() => setRenderingMode('preview')}
                      >
                        Preview
                      </Button>
                    </>
                  ) : (
                    <>
                      <Markdown>
                        {formState.values.content || '**Nothing to Render**'}
                      </Markdown>
                      <Button mt="5" onClick={() => setRenderingMode('input')}>
                        Edit
                      </Button>
                    </>
                  )}
                  <FormErrorMessage>
                    {formState.errors?.content}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Grade</FormLabel>
                  <Select
                    value={formState.values.grade}
                    onChange={e => {
                      formState.setFieldValue('grade', e.target.value);
                    }}
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    value={formState.values.subject}
                    onChange={e => {
                      formState.setFieldValue('subject', e.target.value);
                    }}
                  >
                    <option value="Maths">Maths</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="I&S">I&S</option>
                    <option value="IDU">IDU</option>
                    <option value="Design">Design</option>
                    <option value="Computer Science">Computer Science</option>
                  </Select>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    colorScheme={'brand'}
                    color={'gray.200'}
                    type="submit"
                    isLoading={loading}
                  >
                    Ask Question
                  </Button>
                </Stack>
              </Box>
            </form>
          </CardBody>
        </Box>
      </Card>
    </Center>
  );
};

export default AskAQuestion;
