from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import json

Base = declarative_base()

# Database engine
engine = create_engine('sqlite:///kabadiwala.db', echo=False)

# ============================================
# 1. USER MODEL
# ============================================
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    phone = Column(String(15), unique=True)
    email = Column(String(100), nullable=True)
    city = Column(String(50))
    role = Column(String(20), default='collector')
    password_hash = Column(String(200), nullable=True)
    language = Column(String(10), default='hi')
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    lots = relationship("Lot", back_populates="collector")
    transactions = relationship("Transaction", back_populates="collector")
    ledger_entries = relationship("Ledger", back_populates="collector")

# ============================================
# 2. MATERIAL MODEL
# ============================================
class Material(Base):
    __tablename__ = 'materials'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    category = Column(String(50))
    sub_category = Column(String(50))
    formal_rate = Column(Float)
    informal_rate = Column(Float)
    unit = Column(String(10), default='kg')
    hazard_level = Column(String(20))
    icon = Column(String(10))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

# ============================================
# 3. PRICE MODEL
# ============================================
class Price(Base):
    __tablename__ = 'prices'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    city = Column(String(50))
    material_name = Column(String(50))
    price_today = Column(Float)
    price_yesterday = Column(Float)
    trend = Column(String(20))
    date = Column(DateTime, default=datetime.now)

# ============================================
# 4. RECYCLER MODEL
# ============================================
class Recycler(Base):
    __tablename__ = 'recyclers'
    
    id = Column(Integer, primary_key=True)
    recycler_id = Column(String(50), unique=True)
    name = Column(String(100))
    city = Column(String(50))
    address = Column(Text)
    gps_lat = Column(Float)
    gps_lng = Column(Float)
    cpcb_number = Column(String(50))
    cpcb_valid_until = Column(DateTime)
    cpcb_status = Column(String(20), default='verified')
    materials_accepted = Column(Text)
    offered_rates = Column(Text)
    pickup_available = Column(Boolean, default=False)
    trust_score = Column(Integer, default=80)
    rating = Column(Float, default=4.0)
    total_reviews = Column(Integer, default=0)
    contact_phone = Column(String(15))
    contact_email = Column(String(100))
    created_at = Column(DateTime, default=datetime.now)
    
    transactions = relationship("Transaction", back_populates="recycler")

# ============================================
# 5. LOT MODEL
# ============================================
class Lot(Base):
    __tablename__ = 'lots'
    
    id = Column(Integer, primary_key=True)
    lot_id = Column(String(50), unique=True)
    collector_id = Column(String(50), ForeignKey('users.user_id'))
    material_name = Column(String(50))
    weight = Column(Float)
    price_per_kg = Column(Float)
    total_amount = Column(Float)
    status = Column(String(20), default='created')
    photo_url = Column(Text, nullable=True)
    gps_lat = Column(Float)
    gps_lng = Column(Float)
    collection_city = Column(String(50))
    collection_area = Column(String(100))
    synced = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    collector = relationship("User", back_populates="lots")
    transaction = relationship("Transaction", back_populates="lot", uselist=False)

# ============================================
# 6. TRANSACTION MODEL
# ============================================
class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True)
    transaction_id = Column(String(50), unique=True)
    collector_id = Column(String(50), ForeignKey('users.user_id'))
    recycler_id = Column(String(50), ForeignKey('recyclers.recycler_id'))
    lot_id = Column(String(50), ForeignKey('lots.lot_id'))
    material_name = Column(String(50))
    weight = Column(Float)
    price_per_kg = Column(Float)
    total_amount = Column(Float)
    informal_price = Column(Float)
    extra_earnings = Column(Float)
    status = Column(String(20), default='pending')
    payment_status = Column(String(20), default='pending')
    payment_method = Column(String(20), default='cash')
    otp = Column(String(10))
    verified = Column(Boolean, default=False)
    receipt_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    transaction_date = Column(DateTime, default=datetime.now)
    created_at = Column(DateTime, default=datetime.now)
    
    collector = relationship("User", back_populates="transactions")
    recycler = relationship("Recycler", back_populates="transactions")
    lot = relationship("Lot", back_populates="transaction")

# ============================================
# 7. LEDGER MODEL
# ============================================
class Ledger(Base):
    __tablename__ = 'ledger'
    
    id = Column(Integer, primary_key=True)
    collector_id = Column(String(50), ForeignKey('users.user_id'))
    transaction_id = Column(String(50), ForeignKey('transactions.transaction_id'))
    amount = Column(Float)
    type = Column(String(20))
    status = Column(String(20), default='pending')
    date = Column(DateTime, default=datetime.now)
    created_at = Column(DateTime, default=datetime.now)
    
    collector = relationship("User", back_populates="ledger_entries")
