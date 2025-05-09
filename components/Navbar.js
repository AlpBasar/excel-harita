import {
    Box,
    Flex,
    Button,
    Heading,
    Spacer,
    Link,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import LoginModal from './LoginModal';
  import SignupModal from './SignupModal';
  
  const Navbar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
    const onOpenLoginModal = () => setIsLoginModalOpen(true);
    const onCloseLoginModal = () => setIsLoginModalOpen(false);
  
    const onOpenSignupModal = () => setIsSignupModalOpen(true);
    const onCloseSignupModal = () => setIsSignupModalOpen(false);
  
    return (
      <Box bg="gray.900" color="white" py={4} px={6}>
        <Flex align="center">
          <Heading as="h1" size="lg">
            Excel Harita
          </Heading>
          <Spacer />
          <Flex align="center">
            <Link mr={4} href="#" fontWeight="medium">
              Nasıl Yapılır
            </Link>
            <Link mr={4} href="#" fontWeight="medium">
              Fiyatlandırma
            </Link>
            <Button colorScheme="teal" size="sm" mr={2} onClick={onOpenLoginModal}>
              Giriş Yap
            </Button>
            <Button colorScheme="blue" size="sm" onClick={onOpenSignupModal}>
              Kaydol
            </Button>
          </Flex>
        </Flex>
  
        <LoginModal isOpen={isLoginModalOpen} onClose={onCloseLoginModal} />
        <SignupModal isOpen={isSignupModalOpen} onClose={onCloseSignupModal} />
      </Box>
    );
  };
  
  export default Navbar;