const fs = require('fs');
const urls = `
https://www.tiktok.com/@altons_tech_tips/video/7648751871364058388?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7644966365136342292?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7650503841078643989?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7644222007906667797?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7640614127282539783?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7633475185592716565?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7650645270316797204?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7633470425313332501?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7632821046109867285?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7623192067476327700?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7621354630294899989?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7620911628820679957?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7612395340473421076?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7606472545381928213?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7606431954824645908?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7606067832656350485?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7605734557932883221?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7605689079077834004?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7590088062223338763?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7588316100622896440?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7584559887397473592?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7578526327410576696?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7577899003870809400?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7564504769226689804?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7559563651695283512?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7558896345730354443?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7554470215505988875?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7553095993307286840?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7551907399582485771?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7551581456879996172?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7551472566129446200?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7548566802381475078?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7548549416047611141?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7544036185031593221?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7542595757799378181?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7542269350607064326?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7541929507041709317?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7541575069428944184?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7541085704734985478?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7540796399344995640?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7540432766802857272?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7539923125262142726?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7533386468987784504?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7522233444009561400?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7517811990551727365?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7516655955946392838?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7512205933435571512?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7511706347570842936?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7510336737613319430?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7509980417894665528?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7508489996056284421?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7508132992171216133?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7507382453221330232?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7506297692562246918?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7496577908962512134?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7494755566624066871?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7492545986003455237?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7489177748393528582?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7487326103384673591?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7484371429643898167?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7476139836412267781?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7475848623331331334?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7474619204780510470?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7473971748082388230?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7473877352054033670?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7472478737213312311?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7471794394861948165?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7471682081442008325?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7468081823235509510?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7467665722269781254?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7466559364883565830?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7463592481393872133?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7463218077753216262?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7461745232556739845?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7457290681246076165?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7454698934523464965?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7452434489680153861?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7450991598348799238?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7449127299498134790?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7448326851824585990?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7448009544711638277?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7447243619574074630?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7445050764524866872?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7443526047313775928?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7443180722535304504?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7443103952880749880?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7442466576558738744?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7441327391915429175?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7440512786934910263?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7439775539306499383?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7438725401846811960?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7436873241236491575?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7435604942435503415?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7435003836562984248?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7431276818952391941?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7429079941767073029?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7428705686239923461?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7426783498226109702?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7424252620145036550?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7423877781425065222?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7422032393558658309?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7416824171356802310?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7415349978446466310?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7414541790814145797?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7413897283873295621?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7413412057757863174?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7411204119534324997?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7410156104883113221?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7407554304690621702?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7402342822692605189?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7400531509821885701?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7399754220406099206?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7396745796223651077?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/photo/7394485869924715781?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7383045541342612742?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7379341204086869254?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7378237644121246982?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7369691426776517894?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7369329205579959558?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7367841328853568773?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7360780525641927942?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7360041656126655750?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7358557526461385989?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7357453259361078533?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7354133135212285189?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7353743253025410309?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7352663453749824773?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7351874854917852421?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7351135350330297606?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7348528564582665478?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7347055154614504709?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7346247695482375430?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7344796503346515205?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7340007814150032645?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7337407007818910982?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
https://www.tiktok.com/@altons_tech_tips/video/7336003125582531846?is_from_webapp=1&sender_device=pc&web_id=7603853171165496833
`;
const parsed = urls.split('\n').filter(l => l.trim().startsWith('http')).map(l => {
  const match = l.match(/(?:video|photo)\/(\d+)/);
  return match ? match[1] : null;
}).filter(Boolean);

const output = parsed.map(id => ({
    id: id,
    title: "TikTok Tip",
    platform: "tiktok",
    embedUrl: "https://www.tiktok.com/embed/v2/" + id, 
    externalUrl: "https://www.tiktok.com/@altons_tech_tips/video/" + id,
    date: "Recent",
    category: "Tutorial",
    isVertical: true
}));

fs.writeFileSync('tiktok.json', JSON.stringify(output, null, 2));
