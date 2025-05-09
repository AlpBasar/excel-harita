import {
  Box,
  Heading,
  Button,
  Text,
  Container,
  Stack,
  Image, // Eğer bir görsel kullanmak isterseniz
} from '@chakra-ui/react';
import Navbar from '../components/Navbar'; // Navbar bileşeninin doğru yolda olduğundan emin olun

export default function Home() {
  return (
    <Box bg="gray.800" color="white" minH="100vh">
      <Navbar />
      <Container maxW="container.md" py={20} textAlign="center">
        {/* Reklam Bannerı (Yeni Stil) */}
        <Box
          bgGradient="linear(to-r, purple.600, blue.600)"
          borderRadius="md"
          p={12}
          mb={12}
        >
          <Heading as="h2" size="xl" mb={6}>
            Google Harita Linklerinizi Kolayca Excel&apos;e Dönüştürün!
          </Heading>
          <Text fontSize="lg" mb={8}>
            Zamandan tasarruf edin, verimliliğinizi artırın. Hemen kredi satın alın ve dönüştürmeye başlayın.
          </Text>
          <Button colorScheme="teal" size="lg">
            Hemen Dene!
          </Button>
        </Box>

        {/* Nasıl Yapılır Bölümü (Yeni Stil) */}
        <Box bg="gray.700" borderRadius="md" p={8}>
          <Heading as="h3" size="lg" mb={6}>
            Nasıl Çalışır?
          </Heading>
          <Stack spacing={6}>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                1. Giriş Yapın veya Kaydolun
              </Heading>
              <Text fontSize="md" color="gray.300">
                Hesabınıza giriş yaparak veya yeni bir hesap oluşturarak başlayın.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                2. Bakiye Satın Alın
              </Heading>
              <Text fontSize="md" color="gray.300">
                Dönüştürme işlemleri için yeterli krediniz olduğundan emin olun.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                3. Linkleri Yapıştırın
              </Heading>
              <Text fontSize="md" color="gray.300">
                Dönüştürmek istediğiniz Google Harita linklerini girin.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                4. Excel&apos;e Dönüştürün
              </Heading>
              <Text fontSize="md" color="gray.300">
                Tek bir tıklamayla linklerinizi Excel formatına çevirin.
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="md" mb={2}>
                5. İndirin
              </Heading>
              <Text fontSize="md" color="gray.300">
                Oluşturulan Excel dosyasını kolayca indirin.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
