// components/Navbar.js
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Text,
  // Spacer, // Artık justifyContent="space-between" kullanıldığı için gerekmeyebilir
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tag, // Kredi bilgisi için Tag bileşeni
  TagLabel, // Tag içindeki etiket için
  TagLeftIcon, // Tag için ikon (opsiyonel)
} from '@chakra-ui/react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons'; // StarIcon eklendi (kredi için opsiyonel)

const Navbar = () => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isSignupOpen, onOpen: onSignupOpen, onClose: onSignupClose } = useDisclosure();

  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Oturum bilgisini konsola yazdır (hata ayıklama için)
  // console.log("NAVBAR - AKTİF OTURUM:", session);
  // console.log("NAVBAR - OTURUM DURUMU:", status);


  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <Box bg="gray.900" px={{ base: 2, md: 4 }} shadow="md"> {/* Responsive padding */}
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="white">
              Excel Harita
            </Text>
          </Box>

          <Flex alignItems="center">
            {isLoading ? (
              <Text color="gray.400" mr={4}>Yükleniyor...</Text>
            ) : session?.user ? (
              // Kullanıcı giriş yapmışsa
              <>
                {/* Kredi Bilgisi (Navbar'ın sol tarafına daha yakın) */}
                <Tag size="md" colorScheme="yellow" variant="solid" mr={4}>
                  <TagLeftIcon boxSize="12px" as={StarIcon} />
                  <TagLabel>Kredi: {session.user.credits !== undefined ? session.user.credits : 'N/A'}</TagLabel>
                </Tag>

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                    _hover={{ textDecoration: 'none' }}
                    color="white"
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Avatar
                      size={'sm'}
                      name={session.user.name || session.user.email}
                      // src={session.user.image || undefined}
                      mr={2}
                    />
                    {session.user.name || session.user.email?.split('@')[0]}
                  </MenuButton>
                  <MenuList bg="gray.800" borderColor="gray.700" color="white">
                    <MenuItem bg="gray.800" _hover={{ bg: "gray.700" }}>
                      Profil (Yakında)
                    </MenuItem>
                    {/* Kredi bilgisi menüde de gösterilebilir veya sadece yukarıda */}
                    {/* <MenuItem bg="gray.800" _hover={{ bg: "gray.700" }}>
                      Kredilerim: {session.user.credits !== undefined ? session.user.credits : 'N/A'}
                    </MenuItem> */}
                    <MenuItem onClick={handleLogout} bg="gray.800" _hover={{ bg: "gray.700" }} color="red.400">
                      Çıkış Yap
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              // Kullanıcı giriş yapmamışsa
              <>
                <Button
                  id="navbar-login-button" // Ana sayfadaki butonun tıklayabilmesi için ID
                  colorScheme="teal"
                  variant="ghost"
                  mr={2}
                  onClick={onLoginOpen}
                  _hover={{ bg: "gray.700", color: "teal.300" }}
                  color="white"
                >
                  Giriş Yap
                </Button>
                <Button
                  id="navbar-signup-button" // Ana sayfadaki butonun tıklayabilmesi için ID
                  colorScheme="green"
                  onClick={onSignupOpen}
                  _hover={{ bg: "green.600" }}
                >
                  Kayıt Ol
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>

      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignupModal isOpen={isSignupOpen} onClose={onSignupClose} />
    </>
  );
};

export default Navbar;
