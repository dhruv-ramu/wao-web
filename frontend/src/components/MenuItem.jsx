import React from 'react';
import { Center, Text, Image, Tooltip, Flex } from '@chakra-ui/react';

export default function MenuItem(props) {
  return (
    <Center cursor={'pointer'}>
      <Tooltip label={props.txt} zIndex={99999} borderRadius={"lg"} bgColor={"brand.300"} color={"white"}>
        <Flex>
          <Center>
            <Image src={props.imgsrc} w={'36px'} />
            {props.notxt || <Text fontWeight={600}>{props.txt}</Text>}
          </Center>
        </Flex>
      </Tooltip>
    </Center>
  );
}
