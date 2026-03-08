import os
import json
import uvicorn
from fastapi import FastAPI, Form, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import secrets
import time

# ========== НАСТРОЙКИ ПУТЕЙ ==========
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Создаем папки если их нет
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = FastAPI()

# ========== РАЗДАЕМ СТАТИЧЕСКИЕ ФАЙЛЫ ==========
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
def get_db(key: str):
    """Читает JSON-файл из папки data."""
    filepath = os.path.join(DATA_DIR, f"{key}.json")
    if not os.path.exists(filepath):
        # Возвращаем пустой словарь или список в зависимости от типа данных
        if key in ['messages', 'notifications', 'chats']:
            return {}
        return {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {}

def save_db(key: str, data):
    """Сохраняет данные в JSON-файл."""
    filepath = os.path.join(DATA_DIR, f"{key}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_id():
    """Генерирует ID как в PHP (32 символа)"""
    return secrets.token_hex(16)

# ========== ПРОСТЫЕ СЕССИИ ==========
active_sessions = {}

def create_session(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    active_sessions[token] = {
        "user_id": user_id,
        "expires": time.time() + 30*24*3600  # 30 дней
    }
    return token

def get_user_from_request(request: Request):
    token = request.cookies.get("session_token")
    if token and token in active_sessions:
        if active_sessions[token]["expires"] > time.time():
            return active_sessions[token]["user_id"]
    return None

# ========== API РОУТЫ ==========

@app.get("/")
async def root():
    """Просто отдаем index.html"""
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.post("/api/check_username")
async def check_username(username: str = Form(...)):
    """Проверяет, существует ли логин"""
    users = get_db('users')
    exists = False
    
    if isinstance(users, dict):
        for user_data in users.values():
            if isinstance(user_data, dict) and user_data.get('username') == username:
                exists = True
                break
                
    return {"success": True, "exists": exists}

@app.post("/api/register_login")
async def register_login(username: str = Form(...), password: str = Form(...)):
    """Регистрация или вход"""
    users = get_db('users')
    
    # Ищем существующего пользователя
    for uid, user in users.items():
        if isinstance(user, dict) and user.get('username') == username:
            # ВРЕМЕННО: сравниваем пароли без хеша (потом добавим нормальное хеширование)
            if user.get('password') == password:
                session_token = create_session(uid)
                response = JSONResponse(content={
                    "success": True,
                    "status": "login",
                    "name": user.get('name', '')
                })
                response.set_cookie(
                    key="session_token",
                    value=session_token,
                    httponly=True,
                    max_age=30*24*3600
                )
                return response
            else:
                return {"success": False, "error": "Неверный пароль"}
    
    # Регистрируем нового пользователя
    new_id = generate_id()
    users[new_id] = {
        'id': new_id,
        'username': username,
        'password': password,  # ПОТОМ ЗАХЕШИРУЕМ!
        'name': '',
        'avatar': 'default.png',
        'stars': 0,
        'registered_at': int(time.time())
    }
    save_db('users', users)
    
    session_token = create_session(new_id)
    response = JSONResponse(content={
        "success": True,
        "status": "register_new"
    })
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        max_age=30*24*3600
    )
    return response

@app.post("/api/get_current_user")
async def get_current_user(request: Request):
    """Получает данные текущего пользователя"""
    user_id = get_user_from_request(request)
    if not user_id:
        return {"logged_in": False}
    
    users = get_db('users')
    user = users.get(user_id)
    if not user:
        return {"logged_in": False}
    
    return {
        "logged_in": True,
        "user": {
            "id": user.get('id'),
            "name": user.get('name', ''),
            "username": user.get('username', ''),
            "avatar": user.get('avatar', '/default.png'),
            "stars": user.get('stars', 0),
            "is_moderator": user.get('is_moderator', False),
            "setup_needed": not user.get('name')
        }
    }

@app.post("/api/logout")
async def logout(request: Request):
    """Выход из аккаунта"""
    token = request.cookies.get("session_token")
    if token and token in active_sessions:
        del active_sessions[token]
    
    response = JSONResponse(content={"success": True})
    response.delete_cookie("session_token")
    return response

# ========== ЗАПУСК ==========
if __name__ == "__main__":
    print("🚀 Сервер запускается на http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)