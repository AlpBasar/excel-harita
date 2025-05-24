// components/SignupModal.js
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
  useToast, // Toast bildirimi için
} from '@chakra-ui/react';
import { useState } from 'react';

const SignupModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Şifre tekrarı için
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Hata',
        description: 'Şifreler eşleşmiyor.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', { // Kayıt API rotamıza istek
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Kayıt Başarılı!',
          description: data.message || 'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Kayıt başarılı olduktan sonra modalı kapat
      } else {
        // API'den gelen hata mesajını göster
        throw new Error(data.message || 'Kayıt sırasında bir hata oluştu.');
      }
    } catch (error) {
      toast({
        title: 'Kayıt Hatası',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Kayıt İsteği Hatası:', error);
    } finally {
      setIsLoading(false);
    }
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
        <ModalHeader>Yeni Hesap Oluştur</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack as="form" spacing={4} onSubmit={handleSubmit}>
            <FormControl id="signup-name">
              <FormLabel color="white">İsim (Opsiyonel)</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl id="signup-email" isRequired> {/* isRequired eklendi */}
              <FormLabel color="white">E-posta Adresi</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
                focusBorderColor="teal.500"
                isRequired // HTML5 doğrulaması için
              />
            </FormControl>
            <FormControl id="signup-password" isRequired> {/* isRequired eklendi */}
              <FormLabel color="white">Şifre</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
                focusBorderColor="teal.500"
                isRequired
              />
            </FormControl>
            <FormControl id="signup-confirm-password" isRequired> {/* isRequired eklendi */}
              <FormLabel color="white">Şifreyi Tekrarla</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
                focusBorderColor="teal.500"
                isRequired
              />
            </FormControl>
            <Button type="submit" colorScheme="green" width="full" isLoading={isLoading} loadingText="Kaydediliyor...">
              Kayıt Ol
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} color="white" _hover={{ bg: "gray.700" }}>
            İptal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
