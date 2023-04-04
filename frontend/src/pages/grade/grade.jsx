import { useParams } from 'react-router-dom';
import { Box, Button, Container, Spinner, Text } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../constants';
import { Fragment } from 'react';
import QuestionCard from '../../components/QuestionCard';

function QuestionsPerGrade() {
  const params = useParams();
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['questions', params.grade],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await axios.get(
        `${API_URL}/search?grade=${params.grade
          .replace('G', 'Grade ')
          .replace('g', 'Grade ')}&take=${pageParam}`
      );
      return data.data;
    },
    getNextPageParam: (lastPage, all) => lastPage.next,
  });
  return (
    <Box
      alignItems={'center'}
      justifyContent="center"
      display={'flex'}
      flexDirection={'column'}
      mt="40"
      gap="8px"
    >
      {data?.pages?.map((page, index) => (
        <Fragment key={index}>
          {page?.questions?.map(ques => (
            <QuestionCard {...ques} key={ques.id} />
          ))}
        </Fragment>
      ))}
      {isLoading ? <Spinner /> : null}
      {data?.pages?.[0]?.questions?.length === 0 ? (
        <Text fontSize={'2xl'}>No questions found for this subject</Text>
      ) : null}
      {hasNextPage ? (
        <Button
          disabled={hasNextPage === false || isLoading}
          onClick={() => fetchNextPage()}
        >
          Fetch More
        </Button>
      ) : null}
    </Box>
  );
}

export default QuestionsPerGrade;
