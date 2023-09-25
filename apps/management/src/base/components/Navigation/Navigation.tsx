import {Flex, Spacer, Image, Stack, Link, Box} from '@chakra-ui/react';
import * as React from 'react';
import {MdPeople, MdDns} from 'react-icons/md';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import logo from '../../../../assets/logo_color.svg';
import {LogoutButton} from './LogoutButton';
import {ReportIssueButton} from './ReportIssueButton';
import {useAuthenticated} from 'auth/hooks';

const targets = [
  {
    name: 'Servers',
    icon: <MdDns size={24} />,
    path: '/server',
  },
  {
    name: 'User Management',
    icon: <MdPeople size={24} />,
    path: '/user',
  },
];
export function Navigation() {
  useAuthenticated({requireAuthentication: true});
  const location = useLocation();
  return (
    <Flex
      height="100vh"
      justify="center"
      direction="column"
      backgroundColor="#042530"
      borderRightRadius={20}
      padding={4}
    >
      <Image src={logo} marginBottom={4} />
      <Stack direction="column" align="baseline" marginX={-4} spacing={0}>
        {targets.map((target) => {
          const isActive = location.pathname.startsWith(target.path);
          return (
            <Link
              key={target.name}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              as={RouterLink}
              to={target.path}
              color={isActive ? '#FFFFFF' : '#8D979D'}
              paddingX={8}
              paddingY={4}
              backgroundColor={isActive ? '#007DA7' : undefined}
              width="100%"
            >
              <Flex direction="row" align="center">
                {target.icon}
                <Box marginLeft={2}>{target.name}</Box>
              </Flex>
            </Link>
          );
        })}
      </Stack>
      <Spacer />
      <Stack direction="column" spacing="4" align="baseline">
        <ReportIssueButton />
        <LogoutButton />
      </Stack>
    </Flex>
  );
}
