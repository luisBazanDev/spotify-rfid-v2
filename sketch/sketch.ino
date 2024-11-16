#include <SPI.h>
#include <MFRC522.h>

// Pines
#define RST_PIN 9
#define SS_PIN 10
// PIN_MOSI = 11;
// PIN_MISO = 12;
// PIN_SCK = 13;

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600); // Iniciamos la comunicacion serial

  while(!Serial); // Si no existe conexión serial no hace nada;

  SPI.begin(); // Iniciamos el bus SPI

  rfid.PCD_Init(); // Iniciamos MFRC522

  delay(8); // [Opcional] un delay agregado

  rfid.PCD_DumpVersionToSerial(); // [Opcional] Imprime los detalles del módulo

  Serial.println("READY");
}

void loop() {
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
	if (!rfid.PICC_IsNewCardPresent()) {
		return;
	}

	// Select one of the cards
	if (!rfid.PICC_ReadCardSerial()) {
		return;
	}

  // Dump debug info about the card; PICC_HaltA() is automatically called
	//rfid.PICC_DumpToSerial(&(rfid.uid));

  // Read uuid
  char uuid[32] = "";
  array_to_string(rfid.uid.uidByte, 4, uuid);

  Serial.print("RFID|");
  Serial.println(uuid);
  
  // Terminamos la lectura de la tarjeta  actual
  rfid.PICC_HaltA();
}


void array_to_string(byte array[], unsigned int len, char buffer[])
{
   for (unsigned int i = 0; i < len; i++)
   {
      byte nib1 = (array[i] >> 4) & 0x0F;
      byte nib2 = (array[i] >> 0) & 0x0F;
      buffer[i*2+0] = nib1  < 0xA ? '0' + nib1  : 'A' + nib1  - 0xA;
      buffer[i*2+1] = nib2  < 0xA ? '0' + nib2  : 'A' + nib2  - 0xA;
   }
   buffer[len*2] = '\0';
}
