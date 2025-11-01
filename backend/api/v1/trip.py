from fastapi import APIRouter, Depends, Header, HTTPException
from typing import List
from backend.models.trip import TripGenerationRequest, Trip
from backend.services.trip_generation import generate_trip_plan
from backend.config.database import create_supabase_client
import jwt

router = APIRouter()

async def get_current_user_id(authorization: str = Header(...)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        token = authorization.split(" ")[1]
        # In a real application, you should use a more secure way to get the secret key
        payload = jwt.decode(token, options={"verify_signature": False}) 
        return payload.get("sub")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

@router.post("/generate", response_model=Trip)
async def generate_trip(request: TripGenerationRequest, user_id: str = Depends(get_current_user_id)):
    trip_plan = await generate_trip_plan(request.destination)
    
    supabase = create_supabase_client()
    try:
        # Save the trip plan to the database
        data, count = supabase.table('trips').insert({
            "user_id": user_id,
            "destination": request.destination,
            "plan": trip_plan.dict()
        }).execute()
    except Exception as e:
        # In a real application, you should handle this error more gracefully
        print(f"Error saving trip plan: {e}")

    return trip_plan

@router.get("/trips", response_model=List[dict])
async def get_trips(user_id: str = Depends(get_current_user_id)):
    supabase = create_supabase_client()
    try:
        data, count = supabase.table('trips').select("id, destination, created_at").eq('user_id', user_id).execute()
        return data[1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trips: {e}")

@router.get("/trips/{trip_id}", response_model=dict)
async def get_trip(trip_id: str, user_id: str = Depends(get_current_user_id)):
    supabase = create_supabase_client()
    try:
        data, count = supabase.table('trips').select("*").eq('id', trip_id).eq('user_id', user_id).execute()
        if not data[1]:
            raise HTTPException(status_code=404, detail="Trip not found")
        return data[1][0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trip: {e}")