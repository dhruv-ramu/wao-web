import styles from './header.module.css';
import MenuLogo from '../MenuLogo';
import MenuItem from '../MenuItem';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem as M,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { userAtom } from '../../state/user';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const ROUTES = [
  {
    name: 'Biology',
    uri: 'https://img.icons8.com/color/48/000000/microscope.png',
  },
  {
    name: 'Chemistry',
    uri: 'https://img.icons8.com/color/48/000000/test-tube.png',
  },
  {
    name: 'Physics',
    uri: 'https://img.icons8.com/color/48/000000/physics.png',
  },
  {
    name: 'Maths',
    uri: 'https://img.icons8.com/color/48/000000/hourglass.png',
  },
];

export default function Header() {
  const [user] = useAtom(userAtom);
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.bgContainer}>
          <div className={styles.bg} />
          <div className={styles.bgOpacityContainer}></div>
        </div>
        <div className={styles.content}>
          <MenuLogo />
          <Flex
            as="nav"
            align="center"
            justify={user.id ? 'center' : 'space-between'}
            wrap="wrap"
            color="white"
            gap="1rem"
            height={'100%'}
            className={styles['menuItemsContainer']}
          >
            <Box
              display={'flex'}
              flexDirection="row"
              gap="1rem"
              alignItems={'center'}
              justifyContent={'space-between'}
              className={styles['menuItems']}
            >
              {ROUTES.map((route, index) => (
                <Link key={index} to={`/subject/${route.name.toLowerCase()}`}>
                  <MenuItem txt={route.name} imgsrc={route.uri} />
                </Link>
              ))}
              <MenuItem
                txt="Topics"
                imgsrc="https://img.icons8.com/color/48/000000/mind-map.png"
              />

              <MenuItem
                txt="About"
                imgsrc="https://img.icons8.com/color/48/000000/bust.png"
              />
            </Box>
            <Menu>
              <MenuButton as={Button} variant="outline" margin={0} p={0}>
                <HamburgerIcon margin={0} p={0} />
              </MenuButton>
              <MenuList>
                <M>
                  <Link to="/">Home</Link>
                </M>
                <M>
                  <Link to="/search">Search</Link>
                </M>
                {user.role.toLowerCase() === 'student' ? (
                  <M>
                    <Link to="/questions/ask">Ask a Question</Link>
                  </M>
                ) : null}
                <MenuDivider />
                {user.id ? (
                  <>
                    <M
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                      }}
                    >
                      Logout
                    </M>
                  </>
                ) : (
                  <>
                    <M>
                      <Link to="/auth/login">Login</Link>
                    </M>
                    <M>
                      <Link to="/auth/signup">Register</Link>
                    </M>
                  </>
                )}
              </MenuList>
            </Menu>
          </Flex>
        </div>
      </div>
    </header>
  );
}
