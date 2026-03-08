import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = "7804452625:AAH_Z_4dX-mq1t6Vf-5V_SOW7WeG7bWAh7s"  # твой токен

# ЭТА ФУНКЦИЯ БУДЕТ БРАТЬ URL ИЗ ТВОЕГО GitHub
def get_webapp_url():
    try:
        # ВСТАВЬ СЮДА ССЫЛКУ НА ТВОЙ url.txt В GITHUB
        url_raw = "https://raw.githubusercontent.com/i8629087-art/superchat/refs/heads/main/url.txt"
        return requests.get(url_raw).text.strip()
    except:
        return "https://запасной-вариант.com"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    webapp_url = get_webapp_url()
    
    keyboard = [[
        InlineKeyboardButton(
            "🚀 Открыть Super Chat", 
            web_app=WebAppInfo(url=webapp_url)
        )
    ]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "👇 Нажми кнопку, чтобы открыть!",
        reply_markup=reply_markup
    )

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    
    print("🤖 Бот запущен и готов к работе!")
    app.run_polling()

if __name__ == '__main__':
    main()