// pages/api/process-links.js
import * as XLSX from 'xlsx';
import { getSession } from 'next-auth/react'; // Oturum bilgisini almak için
import { supabaseAdmin } from '../../lib/supabaseClient'; // DOĞRU IMPORT YOLU

const placeIdRegex = /!1s(Ch[A-Za-z0-9_-]+)|!1s(Gh[A-Za-z0-9_-]+)/;
const placeNameRegex = /maps\/place\/([^\/]+)\//;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Oturum bilgisini al (sunucu tarafında)
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Yetkisiz erişim. Lütfen giriş yapın.' });
  }

  const userId = session.user.id;
  const userEmail = session.user.email; // Loglama için
  let userCredits = session.user.credits; // Kredi bilgisini session'dan al

  console.log(`Kullanıcı ${userEmail} (ID: ${userId}) işlemi başlatıyor. Mevcut Kredi (session'dan): ${userCredits}`);

  // API anahtarını al
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('Google Places API anahtarı .env.local dosyasında bulunamadı.');
    return res.status(500).json({ message: 'Sunucu yapılandırma hatası: API anahtarı eksik.' });
  }

  // Kredi kontrolü
  if (userCredits === undefined || userCredits === null || userCredits < 1) {
    console.log(`Kullanıcı ${userEmail} için yetersiz kredi. Kredi: ${userCredits}`);
    return res.status(402).json({ message: 'Yetersiz kredi. Lütfen kredi yükleyin.' }); // 402 Payment Required
  }

  const adminSupabase = supabaseAdmin();

  try {
    const { links } = req.body;
    if (!links || typeof links !== 'string' || links.trim() === '') {
      return res.status(400).json({ message: 'Lütfen bir Google Harita linki girin.' });
    }

    const individualLinks = links.split('\n').map(link => link.trim()).filter(link => link);

    if (individualLinks.length === 0) {
      return res.status(400).json({ message: 'Lütfen geçerli bir Google Harita linki girin.' });
    }
    if (individualLinks.length > 1) {
      return res.status(400).json({ message: 'Lütfen her seferinde sadece bir Google Harita linki girin. Her link 1 kredi değerindedir.' });
    }

    const linkToProcess = individualLinks[0];
    console.log('İşlenecek Link:', linkToProcess);
    let placeData = null;

    let placeIdMatch = linkToProcess.match(placeIdRegex);
    let placeId = null;
    if (placeIdMatch) {
      placeId = placeIdMatch[1] || placeIdMatch[2];
      console.log(`Bulunan Place ID: ${placeId}`);
    }

    let apiResponseData;

    if (placeId) {
      const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=tr&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,business_status,place_id,geometry,url`;
      console.log('Google Place Details API İstek URL:', placeDetailsUrl);
      const response = await fetch(placeDetailsUrl);
      apiResponseData = await response.json();

      if (apiResponseData.status === 'OK' && apiResponseData.result) {
        placeData = apiResponseData.result;
        console.log('Place Details API Yanıtı:', placeData);
      } else if (apiResponseData.status === 'ZERO_RESULTS') {
        console.log('Place Details API ile sonuç bulunamadı (ZERO_RESULTS).');
      } else {
        console.error('Google Place Details API Hatası:', apiResponseData);
        throw new Error(`Google Place Details API'den yanıt alınamadı. Durum: ${apiResponseData.status}. Hata: ${apiResponseData.error_message || 'Bilinmeyen API hatası'}`);
      }
    } else {
      let placeNameMatch = linkToProcess.match(placeNameRegex);
      let searchQuery = "";

      if (placeNameMatch && placeNameMatch[1]) {
        searchQuery = decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' '));
        console.log(`Linkten çıkarılan arama sorgusu: ${searchQuery}`);
      } else {
        searchQuery = linkToProcess;
        console.log(`Linkten işletme adı çıkarılamadı, linkin kendisi sorgu olarak kullanılıyor: ${searchQuery}`);
      }

      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}&language=tr`;
      console.log('Google Text Search API İstek URL:', textSearchUrl);
      const response = await fetch(textSearchUrl);
      apiResponseData = await response.json();

      if (apiResponseData.status === 'OK' && apiResponseData.results && apiResponseData.results.length > 0) {
        placeData = apiResponseData.results[0];
        console.log('Text Search API Yanıtı (ilk sonuç):', placeData);
      } else if (apiResponseData.status === 'ZERO_RESULTS') {
        console.log('Text Search API ile sonuç bulunamadı (ZERO_RESULTS).');
      } else {
        console.error('Google Text Search API Hatası:', apiResponseData);
        throw new Error(`Google Text Search API'den yanıt alınamadı. Durum: ${apiResponseData.status}. Hata: ${apiResponseData.error_message || 'Bilinmeyen API hatası'}`);
      }
    }

    if (placeData) {
      // Krediyi düşür
      const newCredits = userCredits - 1;
      const { error: updateError } = await adminSupabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (updateError) {
        console.error(`Kullanıcı ${userEmail} için kredi güncellenirken hata:`, updateError);
        throw new Error("Kredi güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.");
      } else {
        console.log(`Kullanıcı ${userEmail} için kredi düşürüldü. Eski kredi: ${userCredits}, Yeni kredi: ${newCredits}`);
      }

      const excelData = [
        ["İşletme Adı", "Adres", "Telefon Numarası", "Web Sitesi", "Google Harita URL", "Rating", "Durum"],
        [
          placeData.name || '',
          placeData.formatted_address || '',
          placeData.formatted_phone_number || '',
          placeData.website || '',
          placeData.url || (placeData.place_id ? `https://www.google.com/maps/place/?q=place_id:${placeData.place_id}` : ''),
          placeData.rating || '',
          placeData.business_status || ''
        ]
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      const columnWidths = [
        { wch: 30 }, { wch: 50 }, { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 15 }
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "İşletme Bilgileri");

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      const fileName = `isletme_bilgileri_${placeData.name ? placeData.name.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_') : 'detay'}.xlsx`; // Dosya adında '-' karakterine izin verildi
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      return res.status(200).send(excelBuffer);

    } else {
      return res.status(200).json({
        message: 'Girilen link için Google Haritalar\'da bir işletme detayı bulunamadı.',
        processedData: null,
      });
    }

  } catch (error) {
    console.error('API Rota İşlem Hatası:', error.message, error.stack);
    return res.status(500).json({ message: error.message || 'Sunucu tarafında beklenmeyen bir hata oluştu.' });
  }
}
