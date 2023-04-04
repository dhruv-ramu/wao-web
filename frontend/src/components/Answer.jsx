import { Box, Text } from '@chakra-ui/react';
import { r } from '../helpers/date';
import Markdown from './Renderer';

/**
 * @param {{content:string,createdAt:string}} props
 */
export default function AnswerCard(props) {
  return (
    <Box border={'1px'} p="2" borderRadius={'md'} borderColor={'ButtonFace'}>
      <Text fontSize={'2xl'} textAlign="center">
        <Markdown>{props.content}</Markdown>
      </Text>
      <br />
      <Text fontSize={'xs'} textAlign="center">
        {r(props.createdAt)}
      </Text>
    </Box>
  );
}
