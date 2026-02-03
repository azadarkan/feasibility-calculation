function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// console.log('kojen.js başladı');


/*
// sayıyı formatlama 
function fformatTurkishNumber(number) {
  // Geçersiz girdi kontrolü
  if (number == null || number === "" || isNaN(number)) {
    return "0";
  }
  
  const num = parseFloat(number);
  if (isNaN(num)) return "0";
  
  // Intl.NumberFormat ile daha profesyonel çözüm
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);

  console.log(fformatTurkishNumber(-7.876));  // "1.234,56"
  console.log(fformatTurkishNumber(1000000));  // "1.000.000,00"
}

*/

// manuel-otomatik veri girişi radio buton kontrolü
function veriGirisTuruDegisti() {
  const otomatik = document.getElementById("otomatik").checked;
  const manuel = document.getElementById("manuel").checked;

  // marka ve model select'leri
  const motorMarkasi = document.getElementById("motorMarkasi");
  const motorModeli = document.getElementById("motorModeli");

  // 5 tane motor verisi input'ları
  const elektrikCikisGucu = document.getElementById("elektrik_cikis_gucu");
  const termalIsiGucu = document.getElementById("termal_isi_gucu");
  const motorElektrikVerimi = document.getElementById("motor_elektrik_verimi");
  const motorunYagTuketimi = document.getElementById("motorun_yag_tuketimi");
  const termalVerim = document.getElementById("termal_verim");

  if (otomatik) {
    motorMarkasi.disabled = false;
    motorModeli.disabled = false;

    elektrikCikisGucu.disabled = true;
    termalIsiGucu.disabled = true;
    motorElektrikVerimi.disabled = true;
    motorunYagTuketimi.disabled = true;
    termalVerim.disabled = true;
  } else if (manuel) {
    motorMarkasi.disabled = true;
    motorModeli.disabled = true;

    elektrikCikisGucu.disabled = false;
    termalIsiGucu.disabled = false;
    motorElektrikVerimi.disabled = false;
    motorunYagTuketimi.disabled = false;
    termalVerim.disabled = false;

    // Manuel modda değerleri temizle
    elektrikCikisGucu.value = "";
    termalIsiGucu.value = "";
    motorElektrikVerimi.value = "";
    motorunYagTuketimi.value = "";
    termalVerim.value = "";
  }
}

// Türkçe sayı formatı fonksiyonu (ondalıklı)
function formatTurkishNumber(number) {
  if (
    number === null ||
    number === undefined ||
    isNaN(number) ||
    number === ""
  ) {
    return "0";
  }

  let num = parseFloat(number);
  if (isNaN(num)) {
    return "0";
  }

  let formatted = num.toFixed(2);
  let parts = formatted.split(".");
  let integerPart = parts[0];
  let decimalPart = parts[1];

  // Binlik ayıracı için nokta
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Ondalık ayıracı için virgül
  let result = integerPart + "," + decimalPart;
  return result;
}


// Sonuçları formatla
function formatResults() {
  const resultInputs = document.querySelectorAll(".result-input");
  resultInputs.forEach((input) => {
    if (input.value && !isNaN(input.value)) {
      const integerFields = [
        "yakit_tuketimi_kw",
        "net_elektrik_uretimi",
        "net_isi_uretimi",
        "isil_verim",
        "toplam_verim",
        "isi_maliyeti",
        "yakit_tuketimi_m3",
        "senelik_yakit_tuketimi",
        "senelik_elektrik_uretimi",
        "yillik_kul_isi_miktari",
        "elektrik_geliri",
        "isi_geliri",
        "toplam_gelir",
        "dogalgaz_gideri",
        "yaglama_yagi_gideri",
        "bakim_maliyeti",
        "tesis_sigorta_bedeli",
        "toplam_gider",
        "yillik_santral_kari",
        "proje_basit_geri_odeme_suresi",
        "elektrik_birim_maliyeti",
      ];

      if (integerFields.includes(input.id)) {
        input.value = formatTurkishNumber(input.value);
      }
    }
  });
}

function modelVerisiGetir(data) {
  if (data) {

    document.getElementById("elektrik_cikis_gucu").value = data.elektrikcikisgucu;
    document.getElementById("termal_isi_gucu").value = data.termalisigucu;
    document.getElementById("motor_elektrik_verimi").value = data.motorelektrikverimi;
    document.getElementById("motorun_yag_tuketimi").value = data.motoryagtuketimi;
    document.getElementById("termal_verim").value = data.termalverim; 
  }
}

function hesapla() {
  // console.log("Hesaplama fonksiyonu çalıştı");

  // girdiler
  const motorAdedi = document.getElementById("motor_adedi").value;
  const elektrikCikisGucu = parseFloat(
    document.getElementById("elektrik_cikis_gucu").value
  );
  const termalIsiGucu = parseFloat(
    document.getElementById("termal_isi_gucu").value
  );
  const motElektrikVerimi = parseFloat(
    document.getElementById("motor_elektrik_verimi").value
  );
  const motorunYagTuketimi = parseFloat(
    document.getElementById("motorun_yag_tuketimi").value
  );
  const icIhtiyacDahiliKayiplar = document.getElementById(
    "ic_ihtiyac_dahili_kayiplar"
  ).value;
  const motorBasinaBakimFiyati = document.getElementById(
    "motor_basina_bakim_fiyati"
  ).value;
  const elektrik = document.getElementById("elektrik").value;
  const dogalgazSerbestTuk = document.getElementById(
    "dogalgaz_serbest_tuk"
  ).value;
  const dogalgazElektrikUretimi = document.getElementById(
    "dogalgaz_elektrik_uretimi"
  ).value;
  const mevcutKazanVerimi = document.getElementById(
    "mevcut_kazan_verimi"
  ).value;
  const euroKuru = document.getElementById("euro_kuru").value;
  const calismaSuresi = document.getElementById("calisma_suresi").value;
  const yakitAltIsılDegeri = document.getElementById(
    "yakit_alt_isil_degeri"
  ).value;
  const yillikOrtIsiKullanimiOrani = document.getElementById(
    "yillik_ort_isi_kullanimi_orani"
  ).value;
  const personelGideri = document.getElementById("personel_gideri").value;
  const toplamYatirimTutari = document.getElementById(
    "toplam_yatirim_tutari"
  ).value;
  // const formId = document.getElementById("formId").value;

  // çıktılar
  const yakitTuketimikw = document.getElementById("yakit_tuketimi_kw");
  const netElektrikUretimi = document.getElementById("net_elektrik_uretimi");
  const netIsiUretimi = document.getElementById("net_isi_uretimi");
  const isilVerim = document.getElementById("isil_verim");
  const toplamVerim = document.getElementById("toplam_verim");

  const isiMaliyeti = document.getElementById("isi_maliyeti");

  const yakitTuketimim3 = document.getElementById("yakit_tuketimi_m3");
  const senelikYakitTuketimi = document.getElementById(
    "senelik_yakit_tuketimi"
  );
  const senelikElektrikUretimi = document.getElementById(
    "senelik_elektrik_uretimi"
  );
  const yillikKulIsiMiktari = document.getElementById("yillik_kul_isi_miktari");

  const elektrikGeliri = document.getElementById("elektrik_geliri");
  const isiGeliri = document.getElementById("isi_geliri");
  const toplamGelir = document.getElementById("toplam_gelir");

  const dogalgazGideri = document.getElementById("dogalgaz_gideri");
  const yaglamaYagiGideri = document.getElementById("yaglama_yagi_gideri");
  const bakimMaliyeti = document.getElementById("bakim_maliyeti");
  const tesisSigortaBedeli = document.getElementById("tesis_sigorta_bedeli");
  const toplamGider = document.getElementById("toplam_gider");

  const yillikSantralKari = document.getElementById("yillik_santral_kari");
  const projeBasitGeriOdemeSuresi = document.getElementById(
    "proje_basit_geri_odeme_suresi"
  );
  const elektrikBirimMaliyeti = document.getElementById(
    "elektrik_birim_maliyeti"
  );

  // hesaplamalar
  yakitTuketimikw.value = (
    elektrikCikisGucu /
    (motElektrikVerimi / 100)
  ).toFixed(9); // toFixed(9) ile değişti
  netElektrikUretimi.value = (
    motorAdedi *
    elektrikCikisGucu *
    (1 - parseFloat(icIhtiyacDahiliKayiplar / 100))
  ).toFixed(9); // toFixed(9) ile değişti
  netIsiUretimi.value = (motorAdedi * termalIsiGucu).toFixed(9); // toFixed(9) ile değişti 
  isilVerim.value = ((termalIsiGucu / yakitTuketimikw.value) * 100).toFixed(9); // toFixed(9) ile değişti
  toplamVerim.value = (motElektrikVerimi + parseFloat(isilVerim.value)).toFixed(9); // toFixed(9) ile değişti

  isiMaliyeti.value = (
    parseFloat(dogalgazSerbestTuk) /
    parseFloat(8250/860) /
    (parseFloat(mevcutKazanVerimi/100))
  ).toFixed(9);

  yakitTuketimim3.value = (
    (yakitTuketimikw.value * 860) /
    parseFloat(yakitAltIsılDegeri)
  ).toFixed(9); // toFixed(9) ile değişti
  senelikYakitTuketimi.value = (
    calismaSuresi * parseFloat(yakitTuketimim3.value)
  ).toFixed(9); // toFixed(9) ile değişti
  senelikElektrikUretimi.value = (
    calismaSuresi * parseFloat(netElektrikUretimi.value)
  ).toFixed(9); // toFixed(9) ile değişti
  yillikKulIsiMiktari.value = (
    calismaSuresi *
    netIsiUretimi.value *
    parseFloat(yillikOrtIsiKullanimiOrani / 100)
  ).toFixed(9); // toFixed(9) ile değişti

  elektrikGeliri.value = (
    parseFloat(elektrik) * senelikElektrikUretimi.value
  ).toFixed(9); // toFixed(9) ile değişti
  isiGeliri.value = (
    parseFloat(isiMaliyeti.value) * yillikKulIsiMiktari.value
  ).toFixed(9); // toFixed(9) ile değişti
  toplamGelir.value = (
    parseFloat(elektrikGeliri.value) + parseFloat(isiGeliri.value)
  ).toFixed(9); // toFixed(9) ile değişti

  dogalgazGideri.value = (
    parseFloat(dogalgazElektrikUretimi) * parseFloat(senelikYakitTuketimi.value)
  ).toFixed(9); // toFixed(9) ile değişti
  yaglamaYagiGideri.value = (
    (motorunYagTuketimi / 1000) *
    (parseFloat(euroKuru) * 3 * parseFloat(senelikElektrikUretimi.value) * 2)
  ).toFixed(9); // toFixed(9) ile değişti
  bakimMaliyeti.value = (
    parseFloat(motorBasinaBakimFiyati) *
    parseFloat(euroKuru) *
    calismaSuresi
  ).toFixed(9); // toFixed(9) ile değişti
  tesisSigortaBedeli.value = (
    parseFloat(euroKuru) *
    toplamYatirimTutari *
    0.0025
  ).toFixed(9); // toFixed(9) ile değişti
  toplamGider.value = (
    parseFloat(dogalgazGideri.value) +
    parseFloat(yaglamaYagiGideri.value) +
    parseFloat(bakimMaliyeti.value) +
    parseFloat(personelGideri) +
    parseFloat(tesisSigortaBedeli.value)
  ).toFixed(9); // toFixed(9) ile değişti

  yillikSantralKari.value = (
    (toplamGelir.value - toplamGider.value) /
    parseFloat(euroKuru)
  ).toFixed(9); // toFixed(9) ile değişti
  projeBasitGeriOdemeSuresi.value = (
    toplamYatirimTutari / yillikSantralKari.value
  ).toFixed(9); // toFixed(9) ile değişti
  elektrikBirimMaliyeti.value = (
    (toplamGider.value - isiGeliri.value) /
    senelikElektrikUretimi.value
  ).toFixed(9); // toFixed(9) ile değişti


}


// Hesapla fonksiyonunu override et
const originalHesapla = window.hesapla;
window.hesapla = function () {
  originalHesapla();
  setTimeout(formatResults, 100); // Hesaplamalar tamamlandıktan sonra formatla
};

// form1 deki verileri form4 e kopyala
function copyStep1ToStep4() {
  const inputs = document.querySelectorAll("#step1 input, #step1 select");
  const manuelSecili = document.getElementById("manuel").checked;

  inputs.forEach((input) => {
    const targetId = input.id;
    const targetElement = document.querySelector(`#step4 #${targetId}`);

    if (targetElement) {
      if (
        manuelSecili &&
        (targetId === "motorMarkasi" || targetId === "motorModeli")
      ) {
        targetElement.value = "";
        return;
      }
    }

    if (targetElement) {
      if (input.tagName === "SELECT") {
        if (input.selectedIndex > 0) {
          targetElement.value = input.options[input.selectedIndex].text;
        } else {
          targetElement.value = "";
        }
      } else {
        targetElement.value = input.value;
      }
    }
  });
}

// form2 deki verileri form4 e kopyala
function copyStep2ToStep4() {
  const inputs = document.querySelectorAll("#step2 input, #step2 select");
  inputs.forEach((input) => {
    const targetId = input.id;
    const targetElement = document.querySelector(`#step4 #${targetId}`);

    if (targetElement) {
      if (input.tagName === "SELECT" && input.selectedIndex > 0) {
        targetElement.value = input.options[input.selectedIndex].text;
      } else {
        targetElement.value = input.value;
      }
    }
  });
}

function formatStep4Results() {
  const step4Inputs = document.querySelectorAll("#step4 input.result-display");
  step4Inputs.forEach((input) => {
    if (input.value && !isNaN(input.value) && input.value !== "") {
      input.value = formatTurkishNumber(input.value);
    }
  });
}

// formlar arası geçiş butonu
function nextStep(step) {
  // Step 3'ten 4'e geçerken validasyon yap
  if (step === 4) {
    formatStep4Results();
    if (!validateStep3Form()) {
      return; // Validasyon başarısızsa geçme
    }
  }

  document.querySelectorAll(".form-step").forEach((s) => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");

  if (step == 3) {
    copyStep1ToStep4();
    copyStep2ToStep4();
  }

  if (step == 3) {
    // Step3 form alanlarını temizle
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("countryCode").selectedIndex = 0;

    // Hata mesajlarını da temizle
    document.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    document.querySelectorAll(".invalid-feedback").forEach((el) => el.classList.add("d-none"));
    document.getElementById("successMessage").classList.add("d-none");
  }
}

function prevStep(step) {
  document
    .querySelectorAll(".form-step")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");

  if (step == 3) {
    // Step3 form alanlarını temizle
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("countryCode").selectedIndex = 0;

    // Hata mesajlarını da temizle
    document
      .querySelectorAll(".is-invalid")
      .forEach((el) => el.classList.remove("is-invalid"));
    document
      .querySelectorAll(".invalid-feedback")
      .forEach((el) => el.classList.add("d-none"));
    document.getElementById("successMessage").classList.add("d-none");
  }
}

// Formları temizleme
// Step1'i temizle
function resetStep1() {
  document.querySelectorAll("#step1 input, #step1 select").forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      input.checked = false;
    } else if (
      input.type === "text" ||
      input.type === "number" ||
      input.type === "email"
    ) {
      input.value = "";
    } else if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    }
  });

  const modelSelect = document.getElementById("motorModeli");
  modelSelect.innerHTML = '<option value="">Model Seç</option>';
}

// Step2'yi temizle
function resetStep2() {
  document.querySelectorAll("#step2 input, #step2 select").forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
}

// Step4 verileri toplama fonksiyonu
function getStep4Data() {
  const step4Inputs = document.querySelectorAll("#step4 input, #step4 select");
  const step4Data = [];

  step4Inputs.forEach((input) => {
    const label =
      input.closest(".row")?.querySelector("label")?.innerText || "";
    const value = input.value;
    const unit =
      input.closest(".row")?.querySelector(".unit-text, .text-nowrap")
        ?.innerText || "";
    step4Data.push({ label, value, unit });
  });
  return step4Data;
}

// pdf indirme - DOM yüklendikten sonra çalıştır
document.addEventListener("DOMContentLoaded", function () {
  const dowloadBtn = document.getElementById("download");
  if (dowloadBtn) {
    dowloadBtn.addEventListener("click", async () => {

          const pdfLabel = document.getElementById("pdfindiriliyor");
      // PDF indiriliyor yazısını göster
            pdfLabel.style.display = "inline";

            // 3 saniye sonra gizle ve PDF indirmeyi başlat
            setTimeout(() => {
              pdfLabel.style.display = "none";

            }, 2200);

      // formdaki sonuçları topla
      const AllInputs = document.querySelectorAll("input, select");
      const data = {};
      if (AllInputs && AllInputs.length > 0) {
        AllInputs.forEach((input) => {
          // Motor markası ve modeli için özel kontrol
          if (input.id === "motorMarkasi" || input.id === "motorModeli") {
            data[input.id] = input.value || "";
          } else if (
            input.value &&
            !isNaN(input.value) &&
            input.value !== "" &&
            input.value !== "0"
          ) {
            // sayısal değerleri formatla
            data[input.id] = formatTurkishNumber(input.value);
          } else {
            // sayısal olmayan değerleri olduğu gibi al
            data[input.id] = input.value || "";
          }
        });
      }
      // post isteği ile server a gönder
      // const formData = hesapla();
      const response = await fetch("/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rapor.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("PDF İndirilemedi");
      }
    });
  }
});
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------
// ------------------------------------------ FORM İÇİN GEREKLİ BİLGİLER ------------------------------------------

const phoneRules = {
  "+90": { length: 10, format: "XXX XXX XX XX", example: "123 456 78 90" }, // Türkiye
  "+1": { length: 10, format: "XXX XXX XXXX", example: "123 456 7890" }, // ABD/Kanada
  "+44": { length: 10, format: "XXXX XXXXXX", example: "1234 567890" }, // İngiltere
  "+49": { length: 11, format: "XXX XXXXXXXX", example: "123 45678912" }, // Almanya
  "+33": { length: 9, format: "X XX XX XX XX", example: "1 23 45 67 89" }, // Fransa
  "+39": { length: 10, format: "XXX XXX XXXX", example: "123 456 7890" }, // İtalya
  "+34": { length: 9, format: "XXX XXX XXX", example: "123 456 789" }, // İspanya
  "+31": { length: 9, format: "X XXXX XXXX", example: "1 2345 6789" }, // Hollanda
  "+46": { length: 9, format: "XX XXX XX XX", example: "12 345 67 89" }, // İsveç
  "+47": { length: 8, format: "XXX XX XXX", example: "123 45 678" }, // Norveç
  "+45": { length: 8, format: "XX XX XX XX", example: "12 34 56 78" }, // Danimarka
  "+41": { length: 9, format: "XX XXX XX XX", example: "12 345 67 89" }, // İsviçre
  "+43": { length: 10, format: "XXX XXXXXXX", example: "123 4567890" }, // Avusturya
  "+32": { length: 9, format: "XXX XX XX XX", example: "123 45 67 89" }, // Belçika
  "+351": { length: 9, format: "XXX XXX XXX", example: "123 456 789" }, // Portekiz
};

// Tefelon numarası formatlaması
function formatPhoneNumber(value, countryCode) {
  const rule = phoneRules[countryCode];
  if (!rule) return value;

  // Maksimum uzunlukta kes
  if (value.length > rule.length) {
    value = value.slice(0, rule.length);
  }

  let formatted = "";
  switch (countryCode) {
    case "+90": // Türkiye: XXX XXX XX XX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 8);
      if (value.length > 8) formatted += " " + value.slice(8, 10);
      break;
    case "+1": // ABD: XXX XXX XXXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 10);
      break;
    case "+44": // İngiltere: XXXX XXXXXX
      if (value.length > 0) formatted += value.slice(0, 4);
      if (value.length > 4) formatted += " " + value.slice(4, 10);
      break;
    case "+49": // Almanya: XXX XXXXXXXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 11);
      break;
    case "+33": // Fransa: X XX XX XX XX
      if (value.length > 0) formatted += value.slice(0, 1);
      if (value.length > 1) formatted += " " + value.slice(1, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 7);
      if (value.length > 7) formatted += " " + value.slice(7, 9);
      break;
    case "+39": // İtalya: XXX XXX XXXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 10);
      break;
    case "+34": // İspanya: XXX XXX XXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 9);
      break;
    case "+31": // Hollanda: X XXXX XXXX
      if (value.length > 0) formatted += value.slice(0, 1);
      if (value.length > 1) formatted += " " + value.slice(1, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 9);
      break;
    case "+46": // İsveç: XX XXX XX XX
      if (value.length > 0) formatted += value.slice(0, 2);
      if (value.length > 2) formatted += " " + value.slice(2, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 7);
      if (value.length > 7) formatted += " " + value.slice(7, 9);
      break;
    case "+47": // Norveç: XXX XX XXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 8);
      break;
    case "+45": // Danimarka: XX XX XX XX
      if (value.length > 0) formatted += value.slice(0, 2);
      if (value.length > 2) formatted += " " + value.slice(2, 4);
      if (value.length > 4) formatted += " " + value.slice(4, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 8);
      break;
    case "+41": // İsviçre: XX XXX XX XX
      if (value.length > 0) formatted += value.slice(0, 2);
      if (value.length > 2) formatted += " " + value.slice(2, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 7);
      if (value.length > 7) formatted += " " + value.slice(7, 9);
      break;
    case "+43": // Avusturya: XXX XXXXXXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 10);
      break;
    case "+32": // Belçika: XXX XX XX XX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 5);
      if (value.length > 5) formatted += " " + value.slice(5, 7);
      if (value.length > 7) formatted += " " + value.slice(7, 9);
      break;
    case "+351": // Portekiz: XXX XXX XXX
      if (value.length > 0) formatted += value.slice(0, 3);
      if (value.length > 3) formatted += " " + value.slice(3, 6);
      if (value.length > 6) formatted += " " + value.slice(6, 9);
      break;
    default:
      formatted = value;
  }
  return formatted;
}

function validateStep3Form() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const countryCode = document.getElementById('countryCode').value;

  // hata mesajlarını temizle
  document.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  document.querySelectorAll('.invalid-feedback').forEach((el) => el.classList.remove('d-none'));
  let isValid = true;

  // Ad soyad kontrol
  if (!name || name.length < 2) {
    document.getElementById('name').classList.add('is-invalid');
    document.getElementById('nameError').classList.remove('d-none');
    isValid =false;
  }

  // Email kontrol
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById('email').classList.add('is-invalid');
    document.getElementById('emailError').classList.remove('d-none');
    isValid = false;
  }

  // Telefon kontrol
  const phoneRule = phoneRules[countryCode];
  if (phoneRule) {
    const cleanPhone = phoneNumber.replace(/\s/g, ""); // tüm boşluklar siliniyor
    if (!phoneNumber || cleanPhone.length !== phoneRule.length || !/^\d+$/.test(cleanPhone)) { // tüm karakterlerin rakam olduğu kontrol ediliyor son ifadede
      document.getElementById('phoneNumber').classList.add('is-invalid');
      document.getElementById('phoneError').classList.remove('d-none');
      isValid = false;
    }
  } else {
      if (!phoneNumber || phoneNumber.length < 7) {
        document.getElementById('phoneNumber').classList.add('is-invalid');
        document.getElementById('phoneError').classList.remove('d-none');
        isValid = false;
      }
    }

    // eğer form doğru doldurulmuşsa hiç hata almıyorsa axios ile e-posta gönder
    if (isValid) {
      const nextBtn = document.querySelector('button[onclick="nextStep(4)"]');
      if (nextBtn) nextBtn.disabled = true;

      const step4Data = getStep4Data();

    axios.post("/send-user-info", {
      name: name,
      email: email,
      phone: countryCode + " " + phoneNumber,
      step4Data: step4Data,
    }).then((response) => {
      if (response.data.success) {
        document.getElementById('successMessage').classList.remove('d-none');

        setTimeout(() => {
          if (nextBtn) {
            nextBtn.disabled = false;
          }
          document.getElementById('successMessage').classList.add('d-none');


          document.querySelectorAll('.form-step').forEach((s) => s.classList.remove('active'));
          document.getElementById('step4').classList.add('active');
        }, 200);
      }
    }).catch((error) => {
      console.log('Hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin');

      if(nextBtn) nextBtn.disabled = false;
    });
    
    return false; // step geçişini engelle axios başarılı olursa geçecek
  }

  return isValid;
}

document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phoneNumber');
  const countrySelect = document.getElementById('countryCode');

  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, "");
      const countryCode = document.getElementById('countryCode').value;
      e.target.value = formatPhoneNumber(value, countryCode);
    });
  }

  if (countrySelect) {
    countrySelect.addEventListener('change', function() {
      const phoneInput = document.getElementById('phoneNumber');
      const countryCode = this.value;
      const rule = phoneRules[countryCode];
      phoneInput.value = "";
      phoneInput.placeholder = rule.example;
    });

    const countryCode = countrySelect.value;
    const rule = phoneRules[countryCode];
    if (phoneInput && rule) phoneInput.placeholder = rule.example;
  }

})