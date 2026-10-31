import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2)
        await ctx.add_init_script("localStorage.setItem('admin_pass','pass1');window.confirm=()=>true")
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/t-admin.html'); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab=all]'); await pg.wait_for_timeout(300)
        await pg.click('#dups summary'); await pg.wait_for_timeout(200)
        print((await pg.inner_text('#dups'))[:300].replace('\n',' '))
        await pg.screenshot(path='/home/claude/work/ad-dups.png')
        await pg.click('#dups [data-merge] >> nth=0'); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab=all]'); await pg.wait_for_timeout(300)
        print('after merge:', (await pg.inner_text('#dups summary')))
        await pg.click('#dups summary'); await pg.click('#dups [data-notdup] >> nth=0'); await pg.wait_for_timeout(200)
        print('after notdup:', (await pg.inner_text('#dups summary')))
        print('errors',errs); await b.close()
asyncio.run(main())
