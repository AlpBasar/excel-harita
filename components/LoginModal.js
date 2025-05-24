// components/LoginModal.js
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
  useToast, // Toast bildirimi için
} from '@chakra-ui/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // NextAuth.js'den signIn fonksiyonunu import et
import { useRouter } from 'next/router'; // Yönlendirme için (opsiyonel)

// İkon importları (daha önce düzelttiğimiz gibi)
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import { SiLinkedin, SiMessenger } from 'react-icons/si';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter(); // Yönlendirme için (opsiyonel)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // NextAuth.js Credentials provider ile giriş yapmayı dene
    const result = await signIn('credentials', {
      redirect: false, // Sayfanın otomatik yönlenmesini engelle, sonucu kendimiz işleyeceğiz
      email: email,
      password: password,
    });

    setIsLoading(false);

    if (result.error) {
      // Giriş başarısız oldu, NextAuth.js'den gelen hata mesajını göster
      // [...nextauth].js dosyasındaki authorize fonksiyonunda fırlatılan Error'lar buraya gelir
      // veya genel bir hata mesajı (örn: "CredentialsSignin")
      let errorMessage = "E-posta veya şifre hatalı."; // Varsayılan mesaj
      if (result.error === "CredentialsSignin") {
        // Bu, authorize fonksiyonunun null döndürdüğü anlamına gelir
        // veya belirli bir hata mesajı fırlatmadığı anlamına gelir.
        // Kendi authorize fonksiyonumuzda özel hata mesajları fırlatabiliriz.
      } else {
        errorMessage = result.error; // authorize'dan fırlatılan özel hata mesajı
      }

      toast({
        title: 'Giriş Başarısız',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Giriş Hatası:', result.error);
    } else {
      // Giriş başarılı
      toast({
        title: 'Giriş Başarılı!',
        description: 'Hoş geldiniz!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Modalı kapat
      // İsteğe bağlı: Kullanıcıyı bir dashboard sayfasına yönlendir
      // router.push('/dashboard'); // Eğer bir dashboard sayfanız varsa
      // Veya sayfayı yenileyerek Navbar'daki değişikliklerin görünmesini sağla (useSession hook'u güncellenir)
      router.reload(); // Bu, oturum bilgisinin güncellenmesi için basit bir yoldur
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    // Sosyal medya ile giriş (örneğin Google)
    // `provider` string olarak 'google', 'facebook' vs. olmalı
    // ve [...nextauth].js dosyasında ilgili provider yapılandırılmış olmalı.
    const result = await signIn(provider, {
      redirect: false, // Veya callbackUrl: '/' gibi bir yönlendirme belirtebilirsiniz
    });
    setIsLoading(false);

    if (result.error) {
      toast({
        title: `${provider} ile Giriş Başarısız`,
        description: result.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: `${provider} ile Giriş Başarılı!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      router.reload();
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
        <ModalHeader>Giriş Yap</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          {/* Sosyal Medya Giriş Butonları (Şimdilik sadece görsel, işlevsellik için provider eklenmeli) */}
          <VStack spacing={4} mb={6}>
            <HStack spacing={2} flexWrap="wrap" justifyContent="center">
              <Button
                w={{ base: 'full', sm: 'auto' }}
                flexGrow={1}
                bg="#1877F2"
                color="white"
                leftIcon={<FaFacebook color="white" />}
                onClick={() => handleSocialLogin('facebook')} // Provider adı 'facebook' olmalı
                _hover={{ bg: '#1565d8' }}
                mb={2}
                isDisabled // Henüz Facebook provider eklemediğimiz için devre dışı
              >
                <Center><Text color="white">Facebook</Text></Center>
              </Button>
              <Button
                w={{ base: 'full', sm: 'auto' }}
                flexGrow={1}
                variant="outline"
                bg="#fff"
                color="#000"
                leftIcon={<FaGoogle />}
                onClick={() => handleSocialLogin('google')} // Provider adı 'google' olmalı
                _hover={{ bg: '#f8f9fa' }}
                mb={2}
                isDisabled // Henüz Google provider eklemediğimiz için devre dışı
              >
                <Center><Text color="#000">Google</Text></Center>
              </Button>
              <Button
                w={{ base: 'full', sm: 'auto' }}
                flexGrow={1}
                colorScheme="linkedin"
                leftIcon={<SiLinkedin />}
                onClick={() => handleSocialLogin('linkedin')} // Provider adı 'linkedin' olmalı
                mb={2}
                isDisabled // Henüz LinkedIn provider eklemediğimiz için devre dışı
              >
                <Center><Text>LinkedIn</Text></Center>
              </Button>
            </HStack>
            <Divider borderColor="gray.700" />
          </VStack>

          {/* E-posta ve Şifre ile Giriş Formu */}
          <VStack as="form" spacing={4} onSubmit={handleSubmit}>
            <FormControl id="login-email" isRequired>
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
                isRequired
              />
            </FormControl>
            <FormControl id="login-password" isRequired>
              <FormLabel color="white">Şifre</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
                focusBorderColor="teal.500"
                isRequired
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={isLoading}
              loadingText="Giriş Yapılıyor..."
            >
              Giriş Yap
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

export default LoginModal;
