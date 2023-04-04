import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  Badge,
} from '@chakra-ui/react';
import Markdown from './Renderer';
import { Link } from 'react-router-dom';

export default function QuestionCard(props) {
  return (
    <Card
      maxW="80%"
      minW="80%"
      bg={'brand.700'}
      borderWidth={'2px'}
      borderColor={'chakra-border-color'}
      borderRadius={'xl'}
    >
      <CardBody>
        <Stack mt="3" spacing="3">
          <Heading size="md" textAlign={'left'} mb={'3'}>
            <Markdown>{props.questionTitle || props.title}</Markdown>
          </Heading>
          <Flex gap={'5px'}>
            {props.grade?.name ? (
              <Badge colorScheme={'cyan'}>{props.grade.name}</Badge>
            ) : null}
            {props.subject?.name ? (
              <Badge colorScheme={'blue'}>#{props.subject.name}</Badge>
            ) : null}
          </Flex>
          <div className="left">
            <Markdown>{props.questionDescription || props.content}</Markdown>
          </div>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Link to={`/questions/${props.slug || props.url}`}>
            <Button
              variant="solid"
              colorScheme="blue"
              bgGradient={'linear(to-br, blue.300, blue.200, blue.300)'}
              textColor={'brand.700'}
              bgSize={'300% 100%'}
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              _hover={{
                bgPos: '100% 0',
                transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
              }}
            >
              {props.buttonTitle || 'View Question'}
            </Button>
          </Link>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
