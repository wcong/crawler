const puppeteer = require('puppeteer');
const fs = require('fs');


(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true,defaultViewport: null, args:['--start-maximized']});
  const pages = await browser.pages();
  const page = pages[0];


  await page.exposeFunction('onCustomEvent', (e) => {
    console.log(e.srcElement);
    page.click('.crawler_page');
    page.waitForResponse(response => response.status() === 200);
    page.evaluate(extracTable);
  });

  await page.exposeFunction('receiveTableData', (data) => {
      console.debug(data);
      page.click('.crawler_page');
      page.waitForResponse(response => response.status() === 200);
      //page.evaluate(()=>(extracTable()));
  });

  await page.goto('http://fund.eastmoney.com/data/fundranking.html#tall;c0;r;s6yzf;pn50;ddesc;qsd20200911;qed20210911;qdii;zq;gg;gzbd;gzfs;bbzt;sfbb', {
    waitUntil: 'networkidle2',
  });

  // TODO change to local file
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

  try {
    const data = fs.readFileSync('./contextmenu.html', 'utf8')
    await page.evaluate(function insertMenu(data){
      $('body').append(data);
    }, data);
  } catch (err) {
    console.error(err)
  }

})();