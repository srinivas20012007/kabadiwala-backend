from fastapi import FastAPI, HTTPException, Depends, status, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
import json
import uuid
import hashlib
import jwt

from database import get_db, engine
from models import Base, User, Material, Price, Recycler, Lot, Transaction, Ledger

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kabadiwala Connect API",
    description="Backend for Kabadiwala Connect - Bringing informal collectors into formal recycling",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# ============================================
# SECURITY & TOKEN SETUP
# ============================================
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def generate_otp():
    return "123456"

def send_otp(phone, otp):
    print(f"📱 OTP for {phone}: {otp}")

# ============================================
# PYDANTIC MODELS
# ============================================
class Login(BaseModel):
    username: str
    password: str

class RegisterUser(BaseModel):
    name: str
    phone: str
    email: str = ''
    city: str = 'Mumbai'
    language: str = 'hi'
    password: str

class VerifyOTP(BaseModel):
    deviceId: str
    mobileNo: str
    otp: str

# ============================================
# ROOT & HEALTH
# ============================================
@app.get("/")
async def root():
    return {
        "message": "Kabadiwala Connect API is running!",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        material_count = db.query(Material).count()
        return {
            "status": "healthy",
            "version": "1.0.0",
            "database": "connected",
            "materials_count": material_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

# REGISTER USER
@app.post("/api/register")
async def register_user(user_data: RegisterUser, db: Session = Depends(get_db)):
    """Register a new collector with password"""
    
    existing = db.query(User).filter(User.phone == user_data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    user_id = f"COL{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4]}"
    
    # Hash password
    password_hash = get_password_hash(user_data.password)
    
    new_user = User(
        user_id=user_id,
        name=user_data.name,
        phone=user_data.phone,
        email=user_data.email,
        city=user_data.city,
        role='collector',
        language=user_data.language,
        password_hash=password_hash,
        created_at=datetime.now()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate OTP
    otp = generate_otp()
    send_otp(new_user.phone, otp)
    
    return {
        "success": True,
        "user_id": user_id,
        "message": "User registered successfully. OTP sent to your phone.",
        "user": {
            "id": new_user.user_id,
            "name": new_user.name,
            "phone": new_user.phone,
            "city": new_user.city,
            "language": new_user.language
        },
        "otp": otp,
        "source": "database"
    }

# LOGIN
@app.post("/api/login")
async def login(data: Login, db: Session = Depends(get_db)):
    """Login with phone and password"""
    try:
        username = data.username
        password = data.password
        
        # Check if user exists
        user = db.query(User).filter(User.phone == username).first()
        
        if not user:
            return {"success": False, "message": "User not found. Please register."}
        
        # Verify password
        if not user.password_hash or not verify_password(password, user.password_hash):
            return {"success": False, "message": "Incorrect password"}
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.user_id}, expires_delta=access_token_expires
        )
        
        return {
            "success": True,
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.user_id,
                "name": user.name,
                "phone": user.phone,
                "city": user.city,
                "role": user.role
            }
        }
    
    except Exception as e:
        print("ERROR:", e)
        return {"detail": str(e)}

# ============================================
# PROTECTED API: GET CURRENT USER
# ============================================
@app.get("/api/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.user_id,
        "name": current_user.name,
        "phone": current_user.phone,
        "email": current_user.email,
        "city": current_user.city,
        "role": current_user.role,
        "language": current_user.language,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

# ============================================
# PROTECTED API: GET PRICES
# ============================================
@app.get("/api/prices/{city}")
async def get_prices(city: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prices = db.query(Price).filter(Price.city == city).all()
    
    if prices:
        result = {}
        for p in prices:
            result[p.material_name] = {
                "today": p.price_today,
                "yesterday": p.price_yesterday,
                "trend": p.trend
            }
        return {
            "city": city,
            "prices": result,
            "date": datetime.now().date().isoformat(),
            "source": "database"
        }
    
    return {
        "city": city,
        "prices": {
            "PCB_Circuit_Board": {"today": 340, "yesterday": 335, "trend": "↑ 1.5%"},
            "Cables_Wires": {"today": 600, "yesterday": 590, "trend": "↑ 1.7%"},
            "Battery": {"today": 145, "yesterday": 142, "trend": "↑ 2.1%"},
            "CRT_Monitor_TV": {"today": 100, "yesterday": 98, "trend": "↑ 2%"},
            "LCD_LED_Panel": {"today": 155, "yesterday": 152, "trend": "↑ 2%"},
            "Motors_Magnets": {"today": 180, "yesterday": 178, "trend": "↑ 1.1%"},
            "Mixed_Plastics": {"today": 30, "yesterday": 29, "trend": "↑ 3.4%"}
        },
        "date": datetime.now().date().isoformat(),
        "source": "fallback"
    }

# ============================================
# PROTECTED API: GET RECYCLERS
# ============================================
@app.get("/api/recyclers/{city}")
async def get_recyclers(city: str, material: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Recycler).filter(Recycler.city == city)
    recyclers = query.all()
    
    if recyclers:
        result = []
        for r in recyclers:
            materials_accepted = json.loads(r.materials_accepted) if r.materials_accepted else []
            offered_rates = json.loads(r.offered_rates) if r.offered_rates else {}
            
            if material and material not in materials_accepted:
                continue
            
            result.append({
                "id": r.recycler_id,
                "name": r.name,
                "location": {
                    "city": r.city,
                    "address": r.address,
                    "gps": {"lat": r.gps_lat, "lng": r.gps_lng}
                },
                "materials_accepted": materials_accepted,
                "offered_rates": offered_rates,
                "rating": r.rating,
                "verified": r.cpcb_status == "verified",
                "pickup_available": r.pickup_available,
                "trust_score": r.trust_score,
                "contact": {
                    "phone": r.contact_phone,
                    "email": r.contact_email
                }
            })
        
        return {
            "city": city,
            "recyclers": result,
            "count": len(result),
            "source": "database"
        }
    
    return {
        "city": city,
        "recyclers": [],
        "count": 0,
        "source": "fallback"
    }

# ============================================
# PROTECTED API: CREATE LOT
# ============================================
@app.post("/api/lots")
async def create_lot(lot_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    lot_id = f"LOT{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4]}"
    
    weight = lot_data.get('weight', 0)
    material_name = lot_data.get('category', 'PCB_Circuit_Board')
    
    material = db.query(Material).filter(Material.name == material_name).first()
    price_per_kg = material.formal_rate if material else 100
    total_amount = weight * price_per_kg
    
    new_lot = Lot(
        lot_id=lot_id,
        collector_id=current_user.user_id,
        material_name=material_name,
        weight=weight,
        price_per_kg=price_per_kg,
        total_amount=total_amount,
        status='created',
        collection_city=lot_data.get('city', current_user.city or 'Mumbai'),
        collection_area=lot_data.get('area', ''),
        gps_lat=lot_data.get('gps_lat', 0),
        gps_lng=lot_data.get('gps_lng', 0),
        synced=True,
        created_at=datetime.now()
    )
    
    db.add(new_lot)
    db.commit()
    db.refresh(new_lot)
    
    return {
        "success": True,
        "lot_id": lot_id,
        "message": "Lot created successfully",
        "lot": {
            "id": lot_id,
            "category": new_lot.material_name,
            "weight": new_lot.weight,
            "price_per_kg": new_lot.price_per_kg,
            "total_amount": new_lot.total_amount,
            "status": new_lot.status,
            "timestamp": new_lot.created_at.isoformat()
        },
        "source": "database"
    }

# ============================================
# PROTECTED API: HANDOVER
# ============================================
@app.post("/api/handover")
async def handover(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    otp = data.get('otp', '')
    lot_id = data.get('lot_id')
    recycler_id = data.get('recycler_id', 'REC001')
    
    if not lot_id:
        raise HTTPException(status_code=400, detail="Lot ID required")
    
    if not otp or len(otp) != 6 or not otp.isdigit():
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    lot = db.query(Lot).filter(Lot.lot_id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    
    if lot.collector_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to complete this handover")
    
    lot.status = 'completed'
    lot.updated_at = datetime.now()
    
    transaction_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4]}"
    
    material = db.query(Material).filter(Material.name == lot.material_name).first()
    informal_price = material.informal_rate if material else 100
    
    transaction = Transaction(
        transaction_id=transaction_id,
        collector_id=lot.collector_id,
        recycler_id=recycler_id,
        lot_id=lot_id,
        material_name=lot.material_name,
        weight=lot.weight,
        price_per_kg=lot.price_per_kg,
        total_amount=lot.total_amount,
        informal_price=informal_price,
        extra_earnings=lot.total_amount - (lot.weight * informal_price),
        status='completed',
        payment_status='paid',
        payment_method='cash',
        otp=otp,
        verified=True,
        transaction_date=datetime.now()
    )
    
    db.add(transaction)
    
    ledger = Ledger(
        collector_id=lot.collector_id,
        transaction_id=transaction_id,
        amount=lot.total_amount,
        type='earning',
        status='paid',
        date=datetime.now()
    )
    
    db.add(ledger)
    db.commit()
    
    return {
        "success": True,
        "message": "Handover confirmed!",
        "transaction_id": transaction_id,
        "lot_id": lot_id,
        "total_amount": lot.total_amount,
        "extra_earnings": transaction.extra_earnings,
        "timestamp": datetime.now().isoformat(),
        "source": "database"
    }

# ============================================
# PROTECTED API: GET LEDGER
# ============================================
@app.get("/api/ledger/{collector_id}")
async def get_ledger(collector_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if collector_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this ledger")
    
    ledger_entries = db.query(Ledger).filter(Ledger.collector_id == collector_id).all()
    
    if not ledger_entries:
        return {
            "collector_id": collector_id,
            "ledger": {
                "total_earnings": 0,
                "pending": 0,
                "this_month": 0,
                "last_month": 0,
                "transactions": []
            },
            "source": "database"
        }
    
    total = sum(e.amount for e in ledger_entries if e.status == 'paid')
    pending = sum(e.amount for e in ledger_entries if e.status == 'pending')
    
    now = datetime.now()
    this_month_total = 0
    last_month_total = 0
    
    for e in ledger_entries:
        if e.date and e.date.year == now.year and e.date.month == now.month:
            this_month_total += e.amount if e.status == 'paid' else 0
        elif e.date and e.date.year == now.year and e.date.month == now.month - 1:
            last_month_total += e.amount if e.status == 'paid' else 0
    
    transactions = []
    for e in ledger_entries:
        transaction = db.query(Transaction).filter(Transaction.transaction_id == e.transaction_id).first()
        transactions.append({
            "date": e.date.strftime('%Y-%m-%d') if e.date else '',
            "amount": e.amount,
            "material": transaction.material_name if transaction else '',
            "status": e.status
        })
    
    return {
        "collector_id": collector_id,
        "ledger": {
            "total_earnings": total,
            "pending": pending,
            "this_month": this_month_total,
            "last_month": last_month_total,
            "transactions": transactions
        },
        "source": "database"
    }

# ============================================
# PUBLIC API: SYNC DATA (No auth required)
# ============================================
@app.post("/api/sync")
async def sync_data(data: dict, db: Session = Depends(get_db)):
    lots = data.get('lots', [])
    transactions = data.get('transactions', [])
    collector_id = data.get('collector_id', 'COL001')
    
    synced_lots = 0
    synced_transactions = 0
    
    for lot_data in lots:
        existing = db.query(Lot).filter(Lot.lot_id == lot_data.get('id')).first()
        if not existing:
            new_lot = Lot(
                lot_id=lot_data.get('id'),
                collector_id=collector_id,
                material_name=lot_data.get('category', 'PCB_Circuit_Board'),
                weight=lot_data.get('weight', 0),
                total_amount=lot_data.get('price', 0),
                status=lot_data.get('status', 'created'),
                collection_city=lot_data.get('city', 'Mumbai'),
                synced=True,
                created_at=datetime.fromisoformat(lot_data.get('created_at', datetime.now().isoformat())) if lot_data.get('created_at') else datetime.now()
            )
            db.add(new_lot)
            synced_lots += 1
    
    db.commit()
    
    return {
        "success": True,
        "message": f"Synced {synced_lots} lots and {synced_transactions} transactions",
        "sync_summary": {
            "lots_synced": synced_lots,
            "transactions_synced": synced_transactions,
            "timestamp": datetime.now().isoformat()
        },
        "source": "database"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)