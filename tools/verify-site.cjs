const {chromium}=require('C:/Users/Benaya Arlen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage();const errors=[];page.on('pageerror', e=>errors.push(e.message));
 const files=['index.html',...fs.readdirSync('Info').filter(f=>f.endsWith('.html')).map(f=>'Info/'+f)];
 const url=file=>'file:///'+path.resolve(file).replace(/\\/g,'/');
 for(const file of files){
  await page.goto(url(file));
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:1000});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+file+' at '+width);
   if(await page.locator('.finish-cards').count()) {
    const overlap=await page.locator('.finish-cards article').evaluateAll(cards=>cards.some(card=>card.querySelector('.finish-image img').getBoundingClientRect().bottom>card.querySelector('h3').getBoundingClientRect().top));
    if(overlap)throw Error('Finishing image overlaps caption at '+width);
   }
   if(await page.locator('[data-tabs]').count()) {
    await page.locator('#specifications-tab').click();
    if(!await page.locator('#specifications-panel').isVisible())throw Error('Specifications tab '+file);
    if(await page.locator('#features-panel').isVisible())throw Error('Both panels visible '+file);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Specification overflow '+file+' at '+width);
    await page.locator('#specifications-tab').press('ArrowLeft');
    if(await page.locator('#features-tab').getAttribute('aria-selected')!=='true')throw Error('Keyboard tabs '+file);
   }
  }
  if(await page.locator('#nav-menu [aria-current="page"]').count()!==1)throw Error('Active nav '+file);
  const localLinks=await page.locator('a[href],link[href],script[src]').evaluateAll(nodes=>nodes.map(n=>n.href||n.src).filter(u=>u.startsWith('file:')));
  for(const link of localLinks){const diskPath=decodeURIComponent(new URL(link).pathname).replace(/^\/(\w:)/,'$1');if(!fs.existsSync(diskPath))throw Error('Missing file '+link);}
  await page.locator('.menu-toggle').click();
  if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Mobile menu '+file);
  await page.keyboard.press('Escape');
 }
 await page.goto(url('index.html'));await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'preview-1440.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'preview-390.png',fullPage:true});
 await page.locator('#nav-menu').evaluate(el=>el.classList.add('is-open'));
 await page.locator('#nav-menu a[href="Info/produk.html"]').click();
 await page.waitForURL('**/Info/produk.html');
 await page.locator('[data-filter="knx"]').click();
 if(await page.locator('.product-card:visible').count()!==2)throw Error('KNX filter');
 await page.locator('#product-search').fill('CP4');
 if(await page.locator('.product-card:visible').count()!==1)throw Error('Search');
 await page.locator('[data-product="cp4"]').click();
 await page.locator('#dialog-contact').click();await page.waitForURL('**/konsultasi.html?product=*');
 if(await page.locator('[name=interest]').inputValue()!=='iONprime CP4 KNX')throw Error('Preselected product');
 await page.locator('[name=name]').fill('Test User');await page.locator('[name=phone]').fill('+628123456789');await page.locator('[name=project]').fill('KNX project');
 await page.locator('#consultation-form button[type=submit]').click();
 if(!await page.locator('#form-status a').isVisible())throw Error('WhatsApp draft');
 await page.goto(url('Info/smart-home.html'));await page.locator('[data-scene="relax"]').click();
 if(!(await page.locator('#scene-output').innerText()).includes('Redup'))throw Error('Scene');
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: all 13 pages at 5 widths, local links, active navigation, mobile menu, product search/filter, dialog to consultation with selected product, WhatsApp draft and scene; no JavaScript errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});





