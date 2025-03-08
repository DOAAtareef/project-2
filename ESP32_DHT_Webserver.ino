#include <WiFi.h>
#include <WiFiClient.h>
#include "DHT.h"

#define DHTPIN 5
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
const char *ssid = "Hussain-Tareef_2.4";
const char* password = "H0797939582";
const char* server = "192.168.1.159";  
const int port = 5000;

WiFiClient client;

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting...");
    }
    Serial.println("Connected to WiFi");
    dht.begin();
}

void sendData(int temp, int hum) {
    if (client.connect(server, port)) {
        Serial.println("Connected to server");

        // Prepare the data as JSON
        String jsonData = "{\"temperature\":" + String(temp) + ", \"humidity\":" + String(hum) + "}";

        // Send the POST request
        client.println("POST /store-data HTTP/1.1");
        client.println("Host: 192.168.1.159");
        client.println("Content-Type: application/json");
        client.print("Content-Length: ");
        client.println(jsonData.length());
        client.println();
        client.println(jsonData);

        delay(500);

        // Read the server response
        while (client.available()) {
            String response = client.readString();
            Serial.println("Server response: " + response);
        }
        client.stop();
    } else {
        Serial.println("Connection to server failed");
    }
}

void loop() {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    if (isnan(temp) || isnan(hum)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    // Convert to integer (multiply by 10)
    int tempInt = temp * 10;
    int humInt = hum * 10;

    sendData(tempInt, humInt);
    delay(5000);  // Wait for 5 seconds before sending the data again
}
