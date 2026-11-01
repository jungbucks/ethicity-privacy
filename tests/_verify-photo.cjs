const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const {startServer}=await import('./serve.mjs');const server=await startServer(0);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  for(const mobile of [false,true]) {
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1200,height:900}});
   await page.goto('http://127.0.0.1:'+server.address().port+'/ethicity-privacy/?probe=photo');
   await page.waitForSelector('#probe-out',{timeout:60000});
   console.log(mobile?'MOBILE':'DESKTOP',await page.locator('#probe-out').textContent());
   await page.locator('.photo').screenshot({path:path.join(__dirname,'_photo-'+(mobile?'mobile':'desktop')+'.png')});
   await page.close();
  }
 }finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
