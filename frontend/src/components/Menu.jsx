import React from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Menu,
  MenuButton,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  MenuDivider,
  MenuList,
  Tooltip,
  MenuItem as M,
  ColorModeScript,
} from '@chakra-ui/react';
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import Divider from './Divider';
import equations from '../images/Equations.jpg';
import MenuItem from './MenuItem';
import MenuLogo from './MenuLogo';
import { useAtom } from 'jotai';
import { userAtom } from '../state/user';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import avatar1 from "../assets/img/avatars/avatar1.png";
import avatar2 from "../assets/img/avatars/avatar2.png";
import avatar3 from "../assets/img/avatars/avatar3.png";
// Custom Icons
import { ProfileIcon, SettingsIcon } from "../components/Icons/Icons";

export default function Header() {
  const [user] = useAtom(userAtom);

  return (
    <Box>
      <Container
        minW={'98.8%'}
        h="80px"
        // bgImage={equations}
        // bgPos={'center'}
        position={'fixed'}
        top={"10px"}
        left={"10px"}
        zIndex={700}
        p={0}
        borderRadius={'lg'}
      >
        <Box
          minW={'100%'}
          h="80px"
          // bg={'brand.700'}
          styles={{
            background: "linear-gradient(rgba(255, 255, 255, 0) 0% rgba(255, 255, 255, 0.39) @ 100%)",
          }}
          backdropFilter={"blur(42px)"}
          zIndex={800}
        />
        <Center
          position={'absolute'}
          minW={'100%'}
          h="80px"
          zIndex={900}
          top={0}
          borderWidth={'2px'}
          borderColor={'chakra-border-color'}
          borderRadius={'lg'}
        >
          <Flex gap="12px" fontSize={'18px'} className="menu">
            <MenuLogo />
            <Divider />
            <MenuItem
              imgsrc={'https://img.icons8.com/color/48/000000/microscope.png'}
              txt="Biology"
            />
            <MenuItem
              imgsrc={'https://img.icons8.com/color/48/000000/test-tube.png'}
              txt="Chemistry"
            />
            <MenuItem
              imgsrc={'https://img.icons8.com/color/48/000000/sensor.png'}
              txt="Physics"
            />
            <MenuItem
              imgsrc={'https://img.icons8.com/color/48/000000/hourglass.png'}
              txt="Maths"
            />
            <Divider />
            <Center>
              <InputGroup
                cursor='pointer'
                bg={"rgba(0,0,0,0)"}
                borderRadius='15px'
                borderColor='rgba(226, 232, 240, 0.3)'
                w={{
                  sm: "128px",
                  md: "250px",
                }}
                me={{ sm: "auto", md: "20px" }}>
                <InputLeftElement
                  children={
                    <IconButton
                      bg='inherit'
                      borderRadius='inherit'
                      _hover='none'
                      _active={{
                        bg: "inherit",
                        transform: "none",
                        borderColor: "transparent",
                      }}
                      _focus={{
                        boxShadow: "none",
                      }}
                      icon={
                        <SearchIcon color={"white"} w='15px' h='15px' />
                      }></IconButton>
                  }
                />
                <Input
                  fontSize='sm'
                  py='11px'
                  color={"white"}
                  placeholder='Search here...'
                  borderRadius='inherit'
                  borderWidth={"2px"}
                />
              </InputGroup>
            </Center>
            <Divider />
            <MenuItem
              imgsrc={'https://img.icons8.com/color/48/000000/mind-map.png'}
              txt="Topics"
            />
            <Menu fontSize={"16px"} fontWeight={"600"} bgColor={"brand.700"}>
              <MenuButton>
                {/* <IconButton icon={<HamburgerIcon />} /> */}
                <MenuItem
                  imgsrc={'https://img.icons8.com/color/48/000000/bust.png'}
                  txt="Account"
                />
              </MenuButton>
              <MenuList>
                {user.id ? (
                  <>
                    <M
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                      }}
                      fontSize={"16px"} fontWeight={"600"}
                    >
                      Logout
                    </M>
                  </>
                ) : (
                  <>
                    <M
                      fontSize={"16px"} fontWeight={"600"}
                    >
                      <Link to="/auth/login">
                        <Button minW={"150px"}>
                          Login
                        </Button>
                      </Link>
                    </M>
                    <M
                      fontSize={"16px"} fontWeight={"600"}
                    >
                      <Link to="/auth/signup">
                        <Button minW={"150px"}>
                          Register
                        </Button>
                      </Link>
                    </M>
                  </>
                )}
              </MenuList>
            </Menu>
            {user.id != '' ? (
              <Box>
                {user.role.toLowerCase() === 'student' ? (
                  <Center>
                    <Link to="/questions/ask">
                      <MenuItem
                        imgsrc={
                          'https://img.icons8.com/color/48/000000/plus.png'
                        }
                        txt="Ask a Question"
                      />
                    </Link>
                  </Center>
                ) : null}
              </Box>
            ) : (
              <Flex direction={'row'} gap={2}>
              </Flex>
            )}
          </Flex>
          {/* Hidden for desktop */}
          <Flex
            flexDirection={'row'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            minW={'100%'}
            className="hiddenForDesktop"
          >
            <MenuLogo />
            <Center>
              <Menu>
                <MenuButton>
                  <HamburgerIcon boxSize={30} />
                </MenuButton>
                <MenuList>
                  {user.role.toLowerCase() === 'student' ? (
                    <M>
                      <Link to="/questions/ask">Ask A Question</Link>
                    </M>
                  ) : null}
                  {user.id ? null : (
                    <Box>
                      <MenuDivider />
                      <M>
                        <Link to="/auth/login">Login</Link>
                      </M>
                      <M>
                        <Link to="/auth/signup">Register</Link>
                      </M>
                      {/* <M>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                      </M> */}
                    </Box>
                  )}
                </MenuList>
              </Menu>
            </Center>
          </Flex>
        </Center>
      </Container>
    </Box>
  );
}

