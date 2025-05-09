import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Divider,
  Center,
  Text,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { SiLinkedin, SiMessenger } from 'react-icons/si';
import { useState } from 'react';

const SignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Ad için state
  const [lastName, setLastName] = useState(''); // Soyad için state
  const [username, setUsername] = useState(''); // Kullanıcı adı için state

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      return;
    }
    // Kayıt işlemleri burada yapılacak (sosyal medya hariç)
    console.log(
      'Kaydolunuyor:',
      firstName,
      lastName,
      username,
      email,
      password
    );
    onClose();
  };

  const handleSocialSignup = (provider) => {
    // Sosyal medya ile kayıt işlemleri burada yapılacak
    console.log(`${provider} ile kaydolunuyor`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        borderRadius="md"
        bg="gray.800"
        color="white"
        maxW="md"
      >
        <ModalHeader>Kaydol</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={4} mb={6}>
            <HStack spacing={2} flexWrap="wrap">
              {/* Facebook */}
              <Button
                w={{ base: 'full', sm: 'auto' }}
                bg="#1877F2"
                color="white"
                leftIcon={<FaFacebook color="white" />}
                onClick={() => handleSocialSignup('facebook')}
                _hover={{ bg: '#1565d8' }}
              >
                <Center>
                  <Text color="white">Facebook</Text>
                </Center>
              </Button>
              {/* Google */}
              <Button
                w={{ base: 'full', sm: 'auto' }}
                variant="outline"
                bg="#fff"
                color="#000"
                leftIcon={<FcGoogle />}
                onClick={() => handleSocialSignup('google')}
                _hover={{ bg: '#f8f9fa' }}
              >
                <Center>
                  <Text color="#000">Google</Text>
                </Center>
              </Button>
              {/* LinkedIn */}
              <Button
                w={{ base: 'full', sm: 'auto' }}
                bg="#0077B5"
                color="white"
                leftIcon={<SiLinkedin color="white" />}
                onClick={() => handleSocialSignup('linkedin')}
                _hover={{ bg: '#00649e' }}
              >
                <Center>
                  <Text color="white">LinkedIn</Text>
                </Center>
              </Button>
            </HStack>
            <Divider borderColor="gray.700" />
          </VStack>
          <VStack as="form" spacing={4} onSubmit={handleSubmit}>
            <HStack spacing={2}>
              <FormControl id="first-name" isRequired>
                <FormLabel color="white">Ad</FormLabel>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  bg="gray.700"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                  borderColor="gray.600"
                />
              </FormControl>
              <FormControl id="last-name" isRequired>
                <FormLabel color="white">Soyad</FormLabel>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  bg="gray.700"
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                  borderColor="gray.600"
                />
              </FormControl>
            </HStack>
            <FormControl id="username" isRequired>
              <FormLabel color="white">Kullanıcı Adı</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel color="white">E-posta Adresi</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel color="white">Şifre</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
              />
            </FormControl>
            <FormControl id="confirm-password" isRequired>
              <FormLabel color="white">Şifreyi Onayla</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Kaydol
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} color="white">
            İptal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
