const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  // 分析目標網站
  console.log('分析目標網站: https://world.waterballsa.tw/');
  const targetPage = await context.newPage();
  await targetPage.goto('https://world.waterballsa.tw/', { waitUntil: 'networkidle' });

  // 等待頁面完全載入
  await targetPage.waitForTimeout(3000);

  // 擷取截圖
  await targetPage.screenshot({
    path: '/Users/ender/workspace/fullstack-lms-challenge/frontend/target-homepage.png',
    fullPage: true
  });

  // 擷取 DOM 結構
  const targetSnapshot = await targetPage.evaluate(() => {
    function getElementInfo(element, depth = 0) {
      if (depth > 4 || !element) return null;

      const info = {
        tag: element.tagName.toLowerCase(),
        classes: Array.from(element.classList),
        id: element.id || null,
        text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim().substring(0, 50)
          : null,
        styles: {
          backgroundColor: window.getComputedStyle(element).backgroundColor,
          color: window.getComputedStyle(element).color,
          display: window.getComputedStyle(element).display,
          position: window.getComputedStyle(element).position,
        },
        children: []
      };

      // 只分析主要結構元素
      if (depth < 3) {
        Array.from(element.children).forEach(child => {
          const childInfo = getElementInfo(child, depth + 1);
          if (childInfo) info.children.push(childInfo);
        });
      }

      return info;
    }

    return {
      body: getElementInfo(document.body),
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  });

  fs.writeFileSync(
    '/Users/ender/workspace/fullstack-lms-challenge/frontend/target-snapshot.json',
    JSON.stringify(targetSnapshot, null, 2)
  );

  console.log('目標網站分析完成');

  // 分析本地網站
  console.log('\n分析本地網站: http://localhost:3001');
  const localPage = await context.newPage();
  await localPage.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  // 等待頁面完全載入
  await localPage.waitForTimeout(3000);

  // 擷取截圖
  await localPage.screenshot({
    path: '/Users/ender/workspace/fullstack-lms-challenge/frontend/local-homepage.png',
    fullPage: true
  });

  // 擷取 DOM 結構
  const localSnapshot = await localPage.evaluate(() => {
    function getElementInfo(element, depth = 0) {
      if (depth > 4 || !element) return null;

      const info = {
        tag: element.tagName.toLowerCase(),
        classes: Array.from(element.classList),
        id: element.id || null,
        text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
          ? element.textContent.trim().substring(0, 50)
          : null,
        styles: {
          backgroundColor: window.getComputedStyle(element).backgroundColor,
          color: window.getComputedStyle(element).color,
          display: window.getComputedStyle(element).display,
          position: window.getComputedStyle(element).position,
        },
        children: []
      };

      if (depth < 3) {
        Array.from(element.children).forEach(child => {
          const childInfo = getElementInfo(child, depth + 1);
          if (childInfo) info.children.push(childInfo);
        });
      }

      return info;
    }

    return {
      body: getElementInfo(document.body),
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  });

  fs.writeFileSync(
    '/Users/ender/workspace/fullstack-lms-challenge/frontend/local-snapshot.json',
    JSON.stringify(localSnapshot, null, 2)
  );

  console.log('本地網站分析完成');

  await browser.close();
  console.log('\n所有分析完成！');
  console.log('- 目標網站截圖: target-homepage.png');
  console.log('- 本地網站截圖: local-homepage.png');
  console.log('- 目標網站快照: target-snapshot.json');
  console.log('- 本地網站快照: local-snapshot.json');
})();
