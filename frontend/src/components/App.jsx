
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Heading,
} from '@chakra-ui/react';
// import { ColorModeSwitcher } from '../ColorModeSwitcher';
import theme from '../theme/theme';
import QuestionCard from './QuestionCard';

function App() {
  return (
    <ChakraProvider theme={theme} >
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
          <VStack spacing={8}>
            <Heading>View Recently Asked Questions</Heading>
            <QuestionCard
              questionTitle={
                'What is the effect of increased RER surface area on the nucleic acid replication rate?'
              }
              questionDescription={
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nemo illum earum omnis quia, illo quasi dolorum? Accusantium quas, veniam laboriosam enim, quam soluta quisquam, labore natus necessitatibus consectetur suscipit?'
              }
            />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
