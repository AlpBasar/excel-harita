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
  Center,
  Text,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaFacebook, FaGoogle, FaTwitter, SiLinkedin, SiMessenger } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Giriş işlemleri burada yapılacak
    console.log('Giriş Yapılıyor:', email, password);
    onClose(); // Giriş yapıldıktan sonra modalı kapat
  };

  const handleSocialLogin = (provider) => {
    // Sosyal medya ile giriş işlemleri burada yapılacak
    console.log(`${provider} ile giriş yapılıyor`);
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
        <ModalHeader>Giriş Yap</ModalHeader>
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
                onClick={() => handleSocialLogin('facebook')}
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
                leftIcon={<FaGoogle />}
                onClick={() => handleSocialLogin('google')}
                _hover={{ bg: '#f8f9fa' }}
              >
                <Center>
                  <Text color="#000">Google</Text>
                </Center>
              </Button>
              {/* LinkedIn */}
              <Button
                w={{ base: 'full', sm: 'auto' }}
                colorScheme="linkedin"
                leftIcon={<SiLinkedin color="white" />}
                onClick={() => handleSocialLogin('linkedin')}
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
            <FormControl id="email">
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
            <FormControl id="password">
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
            <Button type="submit" colorScheme="teal" width="full">
              Giriş Yap
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

export default LoginModal;

