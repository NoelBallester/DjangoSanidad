import asyncio
from playwright.async_api import async_playwright
import time

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        page.on("requestfailed", lambda req: print(f"REQUEST FAILED: {req.url} {req.failure}"))
        page.on("response", lambda res: print(f"RESPONSE: {res.url} {res.status}") if res.status >= 400 else None)
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
        
        print("Navigating to Django login...")
        await page.goto("http://localhost:8000/login/")
        await page.wait_for_timeout(1000)
        
        print("Logging in...")
        await page.fill("input[name=tecnico_id]", "1")
        await page.fill("input[name=password]", "Prueba1234?")
        await page.click("button[type=submit]")
        await page.wait_for_timeout(2000)
        
        print("Navigating to citologias.html...")
        await page.goto("http://localhost:8000/citologias.html")
        await page.wait_for_timeout(1000)
            
        print("Opening modal...")
        await page.click("#btnformnuevacitologia")
        await page.wait_for_selector("#modalnuevaCitologia", state="visible")
        
        print("Filling form...")
        # inputFecha
        await page.fill("#inputFecha", "2026-03-05")
        await page.fill("#inputCitologia", "TEST-BROWSER")
        await page.select_option("#inputTipoCitologia", label="PAAF")
        await page.fill("#inputDescripcion", "Test desc")
        await page.select_option("#inputSelect", label="Encéfalo")
        await page.fill("#inputCaracteristicas", "Test char")
        await page.fill("#inputObservaciones", "Test obs")
        
        print("Submitting form...")
        # Since it's a form submit, we can just click the submit button
        # button inside `#nuevaCitologia`
        await page.click("#nuevaCitologia button[type=submit]")
        
        # wait a bit for the api call and js execution
        await page.wait_for_timeout(3000)
        
        print("Done capturing.")
        for e in errors:
            print(e)
            
        await browser.close()

asyncio.run(run())
