const express = require('express');
const app = express();
const path = require('path');
const mysql = require("mysql2");
const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');

// EJS view engine ayarla
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = mysql.createConnection("this-is-secret");

db.addListener("error", (err) => {
    console.log(err);
});


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public/pages') });
});


app.get('/yeni-form', (req, res) => {
    /*
    console.log(req.rawHeaders);
    // fs kullanılacak
    fs.appendFile('/var/log/access.txt', JSON.stringify(req.rawHeaders), function (err, data) {
    if (err) throw err;
    console.log('Veri başarıyla yazıldı.');
    });
*/
    res.render('yeni-form');
})

// db'den verileri getirme endpointi
app.post('/modelGetir', function (req, res) {
    const markaAdi = req.body.motorunMarkasi;
    const modelAdi = req.body.motorunModeli;
    console.log(markaAdi + '-' + modelAdi);

    db.query("select * from motor_modelleri where marka = '"+markaAdi+"' and model = '"+modelAdi+"' ", 
        (err, result, fiels) => {
            // bu ksımı anlamadım tam olarak Error ?
            if (err instanceof Error) {
                console.log(err);
                return;
            } else {
                // burada res.render yaparsak ne olur?
                res.json(result[0]);
                console.log(result[0]);
            }
    })


    // res.json({ status: "ok", model: model });
})











// E-posta transporter'ı oluştur
//  azadarkan18@gmail.com 'saly ezmr onky wqeo'
// eerayus@gmail.com 'ljxk wwqz ggzb rdqw'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'azadarkan18@gmail.com',  
        pass: 'saly ezmr onky wqeo'   
    }
})

// E-posta gönderme endpoint'i
app.post('/send-user-info', (req, res) => {
    const { name, email, phone, step4Data } = req.body;

        // Generate HTML table for Step 4 data
        const step4Table = `
        <h3>Girdi ve Sonuçlar</h3>
        <table border="1" style="border-collapse: collapse; width: 50%; font-size: 14px; text-align: left">
            <thead>
                <tr>
                    <th>Alan</th>
                    <th>Değer</th>
                    <th>Birim</th>
                </tr>
            </thead>
            <tbody>
                ${step4Data.map(row => `
                    <tr>
                        <td>${row.label}</td>
                        <td>${row.value}</td>
                        <td>${row.unit || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    //  azadarkan18@gmail.com 'saly ezmr onky wqeo'
    // eerayus@gmail.com 'ljxk wwqz ggzb rdqw'
    const mailOptions = {
        from: 'azadarkan18@gmail.com',
        to: 'azadarkan18@gmail.com',
        subject: 'Yeni Kullanıcı Bilgileri - Kojenerasyon Formu',
        html:`
        <h2>Yeni Kullanıcı Bilgileri</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        <hr>
        ${step4Table}
        <p><em>Bu e-posta kojenerasyon formu aracılığıyla gönderilmiştir.</em></p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('E-posta gönderme hatası:', error);
            res.json({ success: false, error: error.message });
        } else {
            console.log('E-posta başarıyla gönderildi:', info.response);
            res.json({ success: true, message: 'E-posta başarıyla gönderildi' });
        }
    });
})


// PDF indirme endpointi
app.post('/download-pdf', async (req, res) => {
    try {
        console.log("=== PDF OLUŞTURMA BAŞLATILDI ===");
        const data = req.body;
        console.log("Gelen data keys:", Object.keys(data));
        
        // Motor markası ve modeli kontrolü
        if (!data.motorMarkasi || data.motorMarkasi === 'Marka Seç') {
            console.log("UYARI: Motor markası seçilmemiş!");
        }
        if (!data.motorModeli || data.motorModeli === '') {
            console.log("UYARI: Motor modeli seçilmemiş!");
        }

        // Template path kontrolü
        const templatePath = path.join(__dirname, 'views', 'report.ejs');
        console.log("Template Path:", templatePath);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template bulunamadı: ${templatePath}`);
        }

        // EJS şablonunu string olarak render et
        console.log("EJS render başlıyor...");
        const ejs = require('ejs');
        const html = await ejs.renderFile(templatePath, {data});

        // Chrome path kontrolü
        console.log("Chrome aranıyor...");
        let executablePath;
        const chromePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium'
        ];

        for (const chromePath of chromePaths) {
            if (fs.existsSync(chromePath)) {
                executablePath = chromePath;
                console.log("Chrome bulundu:", chromePath);
                break;
            }
        }

        // Puppeteer ile PDF üret

        console.log("Puppeteer başlatılıyor...");
        const launchOptions = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        };

        if(executablePath) {
            launchOptions.executablePath = executablePath;
        }

        const browser = await puppeteer.launch(launchOptions);
        console.log("Browser açıldı");

        const page = await browser.newPage();
        await page.setContent(html, {waitUntil: 'networkidle0'});
        console.log("HTML yüklendi");

        const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
        });
        console.log("PDF oluşturuldu, boyut:", pdf.lenght);

        await browser.close();
        console.log("Browser kapatıldı");

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="rapor.pdf"',
        });
        res.send(pdf);
        console.log("=== PDF GÖNDERİLDİ ===");

    } catch (err) {
        console.error("=== PDF HATASI ===");
        console.error("Hata mesajı:", err.message);
        console.error("Hata stack:", err.stack);
        res.status(500).json({
            error: "PDF oluşturulamadı",
            message: err.message
        });
    }
});


// Sunucuyu başlat
app.listen(3001, '127.0.0.1', () => {
    console.log('Sunucu http://localhost:3001 adresinde çalışıyor');
});
