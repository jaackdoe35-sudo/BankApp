import { useLanguage } from '../lib/i18n'

const notices: Record<string, string> = {
  en: 'FICTIONAL CYBERSECURITY LAB — This is not a bank. No real banking services or money movement are provided. Use synthetic information only. Never enter real credentials or upload real identity or financial documents. The current simulation and activity ledger store data in this browser only.',
  fr: 'LABORATOIRE DE CYBERSÉCURITÉ FICTIF — Ceci n’est pas une banque. Aucun service bancaire réel ni transfert d’argent n’est fourni. Utilisez uniquement des données synthétiques. Ne saisissez jamais de vrais identifiants et ne téléversez aucun document réel d’identité ou financier. La simulation et le registre stockent les données uniquement dans ce navigateur.',
  es: 'LABORATORIO FICTICIO DE CIBERSEGURIDAD — Esto no es un banco. No ofrece servicios bancarios reales ni movimientos de dinero. Use solo información sintética. Nunca introduzca credenciales reales ni cargue documentos reales de identidad o financieros. La simulación y el registro almacenan datos únicamente en este navegador.',
  pt: 'LABORATÓRIO FICTÍCIO DE CIBERSEGURANÇA — Isto não é um banco. Não são fornecidos serviços bancários reais nem movimentações de dinheiro. Utilize apenas informações sintéticas. Nunca introduza credenciais reais nem carregue documentos reais de identidade ou financeiros. A simulação e o registo armazenam dados apenas neste navegador.',
  ar: 'مختبر أمن سيبراني خيالي — هذا ليس بنكًا. لا تُقدَّم خدمات مصرفية حقيقية أو تحويلات مالية. استخدم معلومات اصطناعية فقط. لا تُدخل بيانات اعتماد حقيقية ولا ترفع مستندات هوية أو مستندات مالية حقيقية. يخزن النظام التجريبي وسجل النشاط البيانات في هذا المتصفح فقط.',
  ha: 'WURIN GWADA TSARON SIBER NA ƘIRƘIRA — Wannan ba banki ba ne. Ba a bayar da ayyukan banki na gaske ko aika kuɗi. Yi amfani da bayanan ƙirƙira kawai. Kada ka shigar da ainihin bayanan shiga ko loda takardun shaida ko kuɗi na gaske. Tsarin gwaji da kundin ayyuka suna adana bayanai a wannan burauzar kawai.',
  yo: 'YÀRÁ ÀDÁNWÒ ÀÀBÒ AYÉLUJÁ — Èyí kì í ṣe báńkì. Kò sí iṣẹ́ báńkì gidi tàbí gbigbe owó. Lo ìwífún àròsọ nìkan. Má ṣe tẹ àwọn ọ̀rọ̀ aṣínà gidi sí i, má sì ṣe gbé ìwé ìdánimọ̀ tàbí ìwé owó gidi sókè. Ìdánwò àti àkọsílẹ̀ ìṣe ń tọ́jú dátà sínú ẹ̀rọ aṣàwákiri yìí nìkan.',
  fil: 'PIKSYONAL NA CYBERSECURITY LAB — Hindi ito bangko. Walang tunay na serbisyong pagbabangko o paglilipat ng pera. Gumamit lamang ng sintetikong impormasyon. Huwag maglagay ng totoong kredensyal o mag-upload ng totoong dokumento ng pagkakakilanlan o pananalapi. Sa browser na ito lamang iniimbak ng simulation at ledger ang data.',
  ms: 'MAKMAL KESELAMATAN SIBER REKAAN — Ini bukan bank. Tiada perkhidmatan perbankan sebenar atau pemindahan wang disediakan. Gunakan maklumat sintetik sahaja. Jangan masukkan kelayakan sebenar atau muat naik dokumen pengenalan atau kewangan sebenar. Simulasi dan lejar aktiviti menyimpan data dalam pelayar ini sahaja.',
  ko: '가상의 사이버 보안 실습실 — 은행이 아닙니다. 실제 은행 서비스나 자금 이동은 제공되지 않습니다. 합성 정보만 사용하세요. 실제 로그인 정보나 신분·금융 서류를 입력하거나 업로드하지 마세요. 시뮬레이션과 활동 원장은 이 브라우저에만 데이터를 저장합니다.',
  'zh-CN': '虚构网络安全实验室 — 这不是银行，不提供真实银行服务或资金转移。仅使用合成信息。请勿输入真实凭据或上传真实身份证明、财务文件。当前模拟系统和活动账本仅在此浏览器中存储数据。',
  'zh-TW': '虛構網路安全實驗室 — 這不是銀行，不提供真實銀行服務或資金轉移。僅使用合成資訊。請勿輸入真實憑證或上傳真實身分證明、財務文件。目前的模擬系統與活動帳本僅在此瀏覽器中儲存資料。',
  id: 'LAB KEAMANAN SIBER FIKTIF — Ini bukan bank. Tidak ada layanan perbankan atau pemindahan uang sungguhan. Gunakan informasi sintetis saja. Jangan masukkan kredensial asli atau mengunggah dokumen identitas maupun keuangan asli. Simulasi dan buku aktivitas hanya menyimpan data di browser ini.',
}

export default function LabDisclosure() {
  const { language } = useLanguage()
  return <aside className="lab-disclosure" role="note" aria-label="Synthetic-data and cybersecurity lab notice">{notices[language] || notices.en}</aside>
}
