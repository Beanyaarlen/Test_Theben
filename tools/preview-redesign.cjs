const {chromium}=require('C:/Users/Benaya Arlen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1440,height:1000}});
for(const [f,out] of [['index.html','preview-1440.png'],['Info/cp4.html','preview-cp4.png'],['Info/tentang-theben.html','preview-about.png'],['Info/pb.html','preview-pb.png']]){
 await page.goto('file:///'+path.resolve(f).replace(/\\/g,'/'));
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-image]')].every(s=>s.classList.contains('is-loaded')));
 await page.evaluate(()=>Promise.all([...document.querySelectorAll('.photo-slot img')].map(i=>i.decode().catch(()=>{}))));
 await page.evaluate(()=>{document.querySelectorAll('img[loading]').forEach(i=>i.loading='eager');}); await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))); await page.screenshot({path:out,fullPage:true});
 if(await page.locator('[data-tabs]').count()){
  await page.locator('#specifications-tab').click();
  await page.locator('.product-information').screenshot({path:'preview-'+path.basename(f,'.html')+'-specifications.png'});
 }
}
await page.setViewportSize({width:390,height:844});await page.locator('.product-information').screenshot({path:'preview-pb-mobile-specifications.png'});
await browser.close();})();

