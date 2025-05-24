// pages/app.js
import {
  Box,
  Heading,
  Button,
  Text,
  Container,
  Input,
  useToast,
  Spinner, // Yükleme durumu için Spinner
  Center, // Spinner'ı ortalamak için
  VStack, // Genel düzen için
} from '@chakra-ui/react';
import Navbar from '../components/Navbar'; // Navbar'ı import ediyoruz
import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react'; // useSession ve getSession'ı import et
import { useRouter } from 'next/router';

export default function App() {
  const { data: session, status } = useSession(); // Oturum bilgisini al
  const router = useRouter();
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false); // API isteği için yüklenme durumu
  const toast = useToast();

  // === EKLENEN CONSOLE.LOG SATIRLARI ===
  console.log("APP SAYFASI - AKTİF OTURUM:", session);
  console.log("APP SAYFASI - OTURUM DURUMU:", status);
  // ====================================

  // Oturum durumu 'loading' ise veya kullanıcı giriş yapmamışsa yönlendirme yap
  useEffect(() => {
    // status 'loading' değilken ve session yoksa (kullanıcı giriş yapmamışsa)
    if (status !== 'loading' && !session) {
      toast({
        title: 'Erişim Reddedildi',
        description: 'Bu sayfayı görüntülemek için lütfen giriş yapın.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      router.push('/'); // Ana sayfaya yönlendir
    }
  }, [session, status, router, toast]);

  const handleProcessLink = async () => {
    const trimmedLink = link.trim();
    if (!trimmedLink) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir Google Harita linki girin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/process-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ links: trimmedLink }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const disposition = response.headers.get('Content-Disposition');
        let filename = 'isletme_bilgileri.xlsx';
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
            try {
                filename = decodeURIComponent(filename);
            } catch (e) {
                console.warn("Dosya adı decode edilemedi, orijinal ad kullanılıyor:", filename, e);
            }
          }
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast({
          title: 'Başarılı',
          description: `Excel dosyası (${filename}) indirilmeye başlandı.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const data = await response.json();
        if (response.ok) {
          toast({
            title: 'Bilgi',
            description: data.message || 'Link işlendi ancak bir işletme detayı bulunamadı.',
            status: 'info',
            duration: 7000,
            isClosable: true,
          });
          console.log('Backend Yanıtı (Veri Yok):', data);
        } else {
          throw new Error(data.message || 'Link işlenirken bir sunucu hatası oluştu.');
        }
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: error.message || 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('İstek veya İşlem Hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box bg="gray.800" color="white" minH="100vh">
        <Navbar />
        <Center h="calc(100vh - 4rem)">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />
        </Center>
      </Box>
    );
  }

  if (!session) {
    // useEffect zaten yönlendirme yapacağı için burası genellikle kullanıcı tarafından görülmez.
    return null;
  }

  return (
    <Box bg="gray.800" color="white" minH="100vh">
      <Navbar />
      <Container maxW="container.lg" py={10} textAlign="center">
        <VStack spacing={8}>
            <Heading as="h1" size="xl">
                Excel'e Dönüştürme Aracı
            </Heading>
            {/* session.user varlığını kontrol ederek mesajı gösterelim */}
            <Text>Hoş geldiniz, {session.user?.name || session.user?.email}! Buradan Google Harita linklerinizi Excel'e dönüştürebilirsiniz.</Text>

            <Box bg="gray.700" borderRadius="md" p={{ base: 6, md: 8 }} w="full">
            <Heading as="h3" size="lg" mb={6}>
                Google Harita Linkini Yapıştırın
            </Heading>
            <Input
                placeholder="Google Harita linkini buraya yapıştırın..."
                bg="gray.800"
                borderColor="gray.600"
                focusBorderColor="teal.500"
                color="white"
                size="lg"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                mb={6}
            />
            <Button
                colorScheme="teal"
                size="lg"
                onClick={handleProcessLink}
                isLoading={isLoading}
                loadingText="İşleniyor..."
                px={10}
            >
                Excel&apos;e Dönüştür (1 Kredi)
            </Button>
            </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
