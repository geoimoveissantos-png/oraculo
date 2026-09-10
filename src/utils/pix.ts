import QRCode from 'qrcode';

export const PIX_KEY = '05a80ec0-cb6e-41f0-bae6-2b28f6736b12';
export const PIX_RECIPIENT_NAME = 'Romildo Coelho da Silva';
export const PIX_CITY = 'SAO PAULO';
export const PIX_PRICE = 15.00;

// Código Pix Oficial Copia e Cola fornecido pelo recebedor
export const OFFICIAL_PIX_PAYLOAD = '00020126850014BR.GOV.BCB.PIX013605a80ec0-cb6e-41f0-bae6-2b28f6736b120223pagamento único Oráculo520400005303986540515.005802BR5923Romildo Coelho da Silva6009SAO PAULO62140510265ufqeSpz63042AB9';

// Format EMV TLV (Type-Length-Value)
function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// Calculate CRC16 CCITT
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Generate valid Pix Copia e Cola payload
export function generatePixPayload(
  key: string = PIX_KEY,
  name: string = PIX_RECIPIENT_NAME,
  city: string = PIX_CITY,
  amount: number = PIX_PRICE,
  txid: string = '265ufqeSpz'
): string {
  // If using default configuration, return the exact verified Pix payload
  if (key === PIX_KEY && amount === PIX_PRICE) {
    return OFFICIAL_PIX_PAYLOAD;
  }

  // Merchant Account Information (Tag 26)
  const gui = formatTLV('00', 'br.gov.bcb.pix');
  const pixKeyField = formatTLV('01', key);
  const merchantAccountInfo = formatTLV('26', `${gui}${pixKeyField}`);

  // Additional Data (Tag 62)
  const referenceLabel = formatTLV('05', txid);
  const additionalDataField = formatTLV('62', referenceLabel);

  const formattedAmount = amount.toFixed(2);

  const rawPayload = [
    formatTLV('00', '01'), // Payload Format Indicator
    formatTLV('01', '12'), // Point of Initiation Method: Dynamic / Single
    merchantAccountInfo,
    formatTLV('52', '0000'), // Merchant Category Code
    formatTLV('53', '986'), // Currency: BRL (986)
    formatTLV('54', formattedAmount), // Amount
    formatTLV('58', 'BR'), // Country Code
    formatTLV('59', name.slice(0, 25).toUpperCase()), // Merchant Name
    formatTLV('60', city.slice(0, 15).toUpperCase()), // Merchant City
    additionalDataField,
    '6304' // CRC16 placeholder
  ].join('');

  const crc = calculateCRC16(rawPayload);
  return `${rawPayload}${crc}`;
}

// Generate QR Code data URL (high resolution PNG)
export async function generatePixQRCodeDataURL(payload: string = OFFICIAL_PIX_PAYLOAD): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 360,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating Pix QR code', err);
    return '';
  }
}
