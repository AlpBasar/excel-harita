// pages/index.js
import {
  Box,
  Heading,
  Button,
  Text,
  Container,
  Stack,
  Flex, // Flex eklendi
  Icon, // İkonlar için
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react'; // useSession'ı import et
import NextLink from 'next/link'; // Next.js link bileşeni
import { FiLogIn, FiUserPlus, FiTool } from 'react-icons/fi'; // Örnek ikonlar

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <Box bg="gray.800" color="white" minH="100vh">
      <Navbar />
      <Container maxW="container.lg" py={10} textAlign="center">
        {/* Reklam Bannerı (Mevcut Stiliniz) */}
        <Box
          bgGradient="linear(to-r, purple.600, blue.600)"
          borderRadius="md"
          p={{ base: 6, md: 12 }}
          mb={12}
        >
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} mb={6}> {/* Ana başlık h1 oldu */}
            Google Harita Linklerinizi Kolayca Excel&apos;e Dönüştürün!
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} mb={8}>
            Zamandan tasarruf edin, verimliliğinizi artırın. Google Haritalar&apos;daki işletme bilgilerini saniyeler içinde Excel formatına çevirin.
          </Text>
          <Flex justifyContent="center" wrap="wrap">
            {!isLoading && !session?.user && ( // Yüklenmiyorsa ve kullanıcı giriş yapmamışsa
              <>
                <NextLink href="#" passHref>
                  <Button
                    as="a"
                    colorScheme="green"
                    size="lg"
                    mb={{ base: 2, md: 0 }}
                    mr={{ base: 0, md: 4 }}
                    leftIcon={<Icon as={FiUserPlus} />}
                    onClick={() => {
                        // Navbar'daki SignupModal'ı açmak için bir yol bulmamız gerekebilir
                        // Şimdilik Navbar'daki butonu kullanmalarını varsayalım
                        // Veya Navbar'dan onSignupOpen fonksiyonunu prop olarak alabiliriz.
                        // Ya da doğrudan /auth/kayit gibi bir sayfaya yönlendirebiliriz (ileride)
                        const signupButton = document.querySelector('#navbar-signup-button'); // Örnek ID, Navbar'a eklenmeli
                        if (signupButton) signupButton.click();
                        else alert("Kayıt olmak için lütfen Navbar'daki 'Kayıt Ol' butonunu kullanın.");
                    }}
                  >
                    Hemen Kayıt Ol
                  </Button>
                </NextLink>
                <NextLink href="#" passHref>
                  <Button
                    as="a"
                    colorScheme="teal"
                    size="lg"
                    leftIcon={<Icon as={FiLogIn} />}
                    onClick={() => {
                        const loginButton = document.querySelector('#navbar-login-button'); // Örnek ID, Navbar'a eklenmeli
                        if (loginButton) loginButton.click();
                        else alert("Giriş yapmak için lütfen Navbar'daki 'Giriş Yap' butonunu kullanın.");
                    }}
                  >
                    Giriş Yap
                  </Button>
                </NextLink>
              </>
            )}
            {session?.user && ( // Kullanıcı giriş yapmışsa
              <NextLink href="/app" passHref>
                <Button as="a" colorScheme="teal" size="lg" leftIcon={<Icon as={FiTool} />}>
                  Dönüştürme Aracına Git
                </Button>
              </NextLink>
            )}
          </Flex>
        </Box>

        {/* Nasıl Yapılır Bölümü (Mevcut Stiliniz) */}
        <Box bg="gray.700" borderRadius="md" p={8}>
          <Heading as="h3" size="lg" mb={6}>
            Nasıl Çalışır?
          </Heading>
          <Stack spacing={6}>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                1. Kayıt Olun veya Giriş Yapın
              </Heading>
              <Text fontSize="md" color="gray.300">
                Platformumuzu kullanmaya başlamak için ücretsiz bir hesap oluşturun veya mevcut hesabınızla giriş yapın.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                2. Kredi Satın Alın (Yakında)
              </Heading>
              <Text fontSize="md" color="gray.300">
                Dönüştürme işlemleri için ihtiyacınız olan kredi paketini seçin.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                3. Linki Yapıştırın
              </Heading>
              <Text fontSize="md" color="gray.300">
                Giriş yaptıktan sonra, dönüştürmek istediğiniz Google Harita linkini ilgili alana yapıştırın.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                4. Excel&apos;e Dönüştürün
              </Heading>
              <Text fontSize="md" color="gray.300">
                Tek bir tıklamayla linkinizi anında Excel formatına çevirin.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                5. İndirin
              </Heading>
              <Text fontSize="md" color="gray.300">
                Oluşturulan Excel dosyasını kolayca bilgisayarınıza indirin.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
