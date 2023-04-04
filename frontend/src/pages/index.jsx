import { Box, VStack, Grid, Heading, Spinner } from '@chakra-ui/react';
import { Fragment } from 'react';
import QuestionCard from '../components/QuestionCard';
import useHydrateUserState from '../hooks/useHydrateUserState';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_URL } from '../constants';
import Dashboard from './dashboard';
import { useAtom } from 'jotai';
import { userAtom } from '../state/user';

function App() {
  useHydrateUserState();
  const [user] = useAtom(userAtom);
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['questions'],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(`${API_URL}/questions?take=${pageParam}`);
      const json = await data.json();
      if (data.ok) {
        return json;
      } else {
        throw new Error(json.message || 'Something went wrong');
      }
    },

    getNextPageParam: (lastPage, pages) => lastPage?.next,
  });
  return (
    <Grid p={3}>
      <VStack
        spacing={8}
        mb={'100px'}
        mt={
          user.id ? (user.role.toLowerCase() === 'student' ? '0' : '20') : '20'
        }
      >
        {isLoading === true ? (
          <Spinner thickness="4px" />
        ) : (
          <>
            {user.id && user.role.toLowerCase() === 'student' ? (
              <Dashboard />
            ) : null}
            <Heading>View Recently Asked Questions</Heading>
            {data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.questions.map(question => (
                  <QuestionCard
                    key={question.id}
                    questionTitle={question.title}
                    questionDescription={question.content}
                    subject={question.subject}
                    grade={question.grade}
                    slug={question.url}
                  />
                ))}
              </Fragment>
            ))}
          </>
        )}
      </VStack>
    </Grid>
  );
}

export default App;
