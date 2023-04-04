import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Fragment, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import { API_URL } from '../constants';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { refetch, fetchNextPage, hasNextPage, isLoading, data, isFetched } =
    useInfiniteQuery({
      queryKey: ['questions', 'search'],
      queryFn: async ({ pageParam = 10 }) => {
        const data = await fetch(
          `${API_URL}/search?take=${pageParam}&query=${query}`
        );
        const json = await data.json();
        if (data.ok) {
          return json;
        } else {
          throw new Error(json.message || 'Something went wrong');
        }
      },
      enabled: false,
      getNextPageParam: (lastPage, pages) => lastPage?.next,
    });
  return (
    <Box
      alignItems={'center'}
      justifyContent="center"
      display={'flex'}
      flexDirection={'column'}
      mt="40"
      gap="8px"
      p={'10'}
    >
      <form
        className="row"
        onSubmit={e => {
          e.preventDefault();
          setLoading(true);
          refetch().finally(() => setLoading(false));
        }}
      >
        <FormControl id="email">
          <FormLabel>Search</FormLabel>
          <Input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for questions"
            required
          />
        </FormControl>
        <Button mt="10" isLoading={loading} isDisabled={loading} type="submit">
          Search
        </Button>
      </form>
      {data?.pages?.map((page, index) => (
        <Fragment key={index}>
          {page?.questions.map(ques => (
            <QuestionCard {...ques} key={ques.id} />
          ))}
        </Fragment>
      ))}

      {data?.pages?.[0]?.questions?.length === 0 ? (
        <Text fontSize={'2xl'}>No questions found.</Text>
      ) : (
        <>
          {isFetched ? (
            <Button
              isDisabled={!hasNextPage || isLoading}
              isLoading={isLoading}
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          ) : null}
        </>
      )}
    </Box>
  );
}
