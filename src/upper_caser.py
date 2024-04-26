import json

# JSON dosyasını okuma fonksiyonu
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# JSON dosyasına yazma fonksiyonu
def write_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

# Türkçe özel karakterlerin doğru büyük harflerini döndüren fonksiyon
def turkce_buyuk_harfe_cevir(kelime):
    harf_karsiliklari = {
        'i': 'İ',
        'ı': 'I',
        'ü': 'Ü',
        'ş': 'Ş',
        'ö': 'Ö',
        'ç': 'Ç',
        'ğ': 'Ğ',
        'â': 'Â'
    }
    yeni_kelime = ""
    for karakter in kelime:
        yeni_kelime += harf_karsiliklari.get(karakter, karakter.upper())
    return yeni_kelime

# JSON verisindeki tüm stringleri büyük harfe çeviren fonksiyon
def convert_to_uppercase(data):
    if isinstance(data, dict):
        return {key: convert_to_uppercase(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_to_uppercase(item) for item in data]
    elif isinstance(data, str):
        return turkce_buyuk_harfe_cevir(data)
    else:
        return data

# Örnek kullanım
input_file_path = '/Users/yunusemretokdemir/ws/Turkish-word-finder-game-with-react-native-expo/src/wordle_kelime_listesi.json'
output_file_path = '/Users/yunusemretokdemir/ws/Turkish-word-finder-game-with-react-native-expo/src/wordle_kelime_listesi_upper.json'

# Original JSON data'yı okuyoruz
original_data = read_json(input_file_path)

# Tüm stringleri büyük harfe çeviriyoruz
modified_data = convert_to_uppercase(original_data)

# Modifiye edilmiş datayı yeni bir JSON dosyasına kaydediyoruz
write_json(modified_data, output_file_path)

print("Conversion to uppercase completed successfully.")
