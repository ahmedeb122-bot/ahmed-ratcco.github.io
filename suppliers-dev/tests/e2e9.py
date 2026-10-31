import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2)
        await ctx.add_init_script("localStorage.setItem('admin_pass','pass1');window.confirm=()=>true")
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8765/t-admin.html'); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab=all]'); await pg.click('#add-new'); await pg.wait_for_timeout(300)
        await pg.fill('#e-Name','Admin Added Two'); await pg.fill('#e-Mobiles','0581112299'); await pg.fill('#e-City','Riyadh')
        await pg.click('[data-ecat="@cables"]')
        await pg.screenshot(path='/home/claude/work/ad-add.png')
        await pg.click('#edit-form [type=submit]'); await pg.wait_for_timeout(1500)
        print('toast:', await pg.locator('.toast').all_inner_texts())
        # add an existing one with new info
        await pg.click('[data-tab=all]'); await pg.click('#add-new'); await pg.wait_for_timeout(300)
        await pg.fill('#e-Name','SESCO'); await pg.fill('#e-Mobiles','+966 50 993 9248'); await pg.fill('#e-Emails','new@sesco-me.com')
        await pg.click('#edit-form [type=submit]'); await pg.wait_for_timeout(1500)
        print('toast2:', await pg.locator('.toast').all_inner_texts())
        # edit existing: change city of the new one, then delete it
        await pg.click('[data-tab=all]'); await pg.fill('#q','Admin Added Two'); await pg.wait_for_timeout(300)
        print('found:', (await pg.inner_text('#all-list')).replace('\n',' '))
        await pg.click('[data-edit-all]'); await pg.wait_for_timeout(800)
        await pg.fill('#e-City','Dammam'); await pg.click('#edit-form [type=submit]'); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab=all]'); await pg.fill('#q','Admin Added Two'); await pg.wait_for_timeout(300)
        print('after edit:', (await pg.inner_text('#all-list')).replace('\n',' '))
        await pg.click('#all-list [data-act=delete]'); await pg.wait_for_timeout(1500)
        await pg.click('[data-tab=all]'); await pg.fill('#q','Admin Added Two'); await pg.wait_for_timeout(300)
        print('after delete:', (await pg.inner_text('#all-list')).replace('\n',' '))
        print('errors',errs); await b.close()
asyncio.run(main())
