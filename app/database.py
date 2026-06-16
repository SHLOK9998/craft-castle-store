from supabase import create_client, Client
from app.config import get_settings
from functools import lru_cache

settings = get_settings()


@lru_cache()
def get_supabase() -> Client:
    """
    Returns a cached Supabase client using the anon/public key.
    Used for general read operations and customer-facing queries.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@lru_cache()
def get_supabase_admin() -> Client:
    """
    Returns a cached Supabase client using the service role key.
    Used for admin operations — bypasses Row Level Security (RLS).
    NEVER expose this client to frontend or public routes.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
