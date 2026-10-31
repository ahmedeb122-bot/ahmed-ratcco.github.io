import asyncio
from playwright.async_api import async_playwright
B='http://localhost:8765/'
XLSX=open('/home/claude/work/xlsxpkg/package/dist/xlsx.full.min.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True)
        await ctx.route('**/cdnjs.cloudflare.com/**',lambda r:r.fulfill(status=200,content_type='application/javascript',body=XLSX))
        await ctx.add_init_script("localStorage.setItem('admin_pass','pass1');window.confirm=()=>true;window.open=()=>{}")
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(B+'t-admin.html'); await pg.wait_for_timeout(1500)
        w=pg.locator('.warn'); print('warn count', await w.count(), (await w.first.inner_text()).replace('\n',' ') if await w.count() else '')
        if await w.count():
            await pg.click('[data-merge] >> nth=0'); await pg.wait_for_timeout(1000); print('after merge warns', await pg.locator('.warn').count())
        # edit pending Kantech: add a category with chips then approve
        await pg.click('[data-edit] >> nth=0'); await pg.wait_for_timeout(400)
        print('chips', await pg.locator('[data-ecat]').count(), 'on', await pg.locator('[data-ecat][aria-pressed=true]').count())
        await pg.click("[data-ecat=\"CCTV\"]"); await pg.wait_for_timeout(200)
        print('on now', await pg.locator('[data-ecat][aria-pressed=true]').count())
        await pg.screenshot(path='/home/claude/work/ad-edit.png',full_page=True)
        btns=await pg.locator('#edit-form button[type=submit], #edit-box button').all_inner_texts(); print('btns', btns)
        await pg.locator('#edit-form button[type=submit]').first.click(); await pg.wait_for_timeout(1200)
        print('pending now:', (await pg.inner_text('#tab-pending'))[:200].replace('\n',' '))
        await pg.click('[data-tab=all]'); await pg.wait_for_timeout(300)
        await pg.fill('#q','kantech'); await pg.wait_for_timeout(300)
        print('all:', (await pg.inner_text('#tab-all'))[:200].replace('\n',' '))
        async with pg.expect_download() as dl: await pg.click('#export-all')
        d=await dl.value; await d.save_as('/home/claude/work/all.xlsx'); print('export', d.suggested_filename)
        print('errors',errs); await b.close()
asyncio.run(main())
