import React from 'react';
import { Center, Tooltip, Image } from '@chakra-ui/react';
import logo from '../images/g3504.png';
import { Link } from 'react-router-dom';

export default function MenuLogo() {
  return (
    <Center cursor={'pointer'} pr={'10px'}>
      <Tooltip label={'Home | We Are One'} borderRadius={"lg"} bgColor={"brand.300"} color={"white"}>
        <Link to="/">
          <Image src={logo} h={'40px'} />
        </Link>
      </Tooltip>
    </Center>
  );
}
