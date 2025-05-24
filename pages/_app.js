// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from "next-auth/react";
import { useRouter } from 'next/router'; // useRouter'ı import et

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter(); // useRouter hook'unu kullan

  // next.config.js dosyanızdaki basePath değerini buraya veriyoruz.
  // NextAuth.js istemcisi, /api/auth yolunu buna kendisi ekleyecektir.
  const nextAuthBasePath = router.basePath;

  return (
    <SessionProvider session={session} basePath={nextAuthBasePath}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
