import json
from datetime import datetime
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Material, Recycler, Price

def load_materials():
    """Load materials from JSON file"""
    with open('data/materials.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    session = SessionLocal()
    count = 0
    for item in data['materials']:
        material = Material(
            name=item['name'],
            category=item['category'],
            sub_category=item['sub_category'],
            formal_rate=item['formal_rate'],
            informal_rate=item['informal_rate'],
            unit=item['unit'],
            hazard_level=item['hazard'],
            icon=item['icon'],
            description=item['description']
        )
        session.add(material)
        count += 1
    
    session.commit()
    print(f"✅ Loaded {count} materials")

def load_recyclers():
    """Load recyclers from JSON file"""
    with open('data/authorized_recyclers.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    
    session = SessionLocal()
    count = 0
    for item in data['recyclers']:
        recycler = Recycler(
            recycler_id=item['id'],
            name=item['name'],
            city=item['location']['city'],
            address=item['location']['address'],
            gps_lat=item['location']['gps']['lat'],
            gps_lng=item['location']['gps']['lng'],
            cpcb_number=item['cpcb_authorization']['number'],
            cpcb_valid_until=datetime.strptime(item['cpcb_authorization']['valid_until'], '%Y-%m-%d'),
            cpcb_status=item['cpcb_authorization']['status'],
            materials_accepted=json.dumps(item['materials_accepted']),
            offered_rates=json.dumps(item['offered_rates']),
            pickup_available=item['pickup_available'],
            trust_score=item['trust_score'],
            rating=item['rating'],
            total_reviews=item['total_reviews'],
            contact_phone=item['contact']['phone'],
            contact_email=item['contact']['email']
        )
        session.add(recycler)
        count += 1
    
    session.commit()
    print(f"✅ Loaded {count} recyclers")

def load_prices():
    """Load prices from JSON file"""
    try:
        with open('data/price_indices.json', 'r', encoding='utf-8-sig') as f:
            data = json.load(f)
        
        session = SessionLocal()
        count = 0
        for city, city_data in data['cities'].items():
            for material, price_data in city_data['prices'].items():
                price = Price(
                    city=city,
                    material_name=material,
                    price_today=price_data['today'],
                    price_yesterday=price_data.get('yesterday', price_data['today'] - 5),
                    trend=price_data['trend'],
                    date=datetime.now()
                )
                session.add(price)
                count += 1
        
        session.commit()
        print(f"✅ Loaded {count} prices for {len(data['cities'])} cities")
    except FileNotFoundError:
        print("⚠️ price_indices.json not found, skipping prices")
    except Exception as e:
        print(f"⚠️ Error loading prices: {e}")

def load_all():
    """Load all data"""
    print("🔄 Loading data into database...")
    load_materials()
    load_recyclers()
    load_prices()
    print("✅ All data loaded successfully!")

if __name__ == "__main__":
    load_all()
