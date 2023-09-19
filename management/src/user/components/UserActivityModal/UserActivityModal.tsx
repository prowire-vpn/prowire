import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import {UserDto} from '@prowire-vpn/api';
import * as React from 'react';
import {UserActivityModalContent} from './UserActivityModalContent';

interface UserActivityModalProps {
  user?: UserDto;
  isOpen: boolean;
  onClose: () => void;
}

export function UserActivityModal({user, isOpen, onClose}: UserActivityModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="container.md">
        <ModalHeader>Activity - {user?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{user ? <UserActivityModalContent user={user} /> : 'Loading'}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
