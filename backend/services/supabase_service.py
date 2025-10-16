import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

def upload_file(bucket: str, remote_path: str, local_path: str):
    with open(local_path, "rb") as f:
        res = supabase.storage.from_(bucket).upload(remote_path, f)
    return res

def get_table_rows(table: str):
    res = supabase.table(table).select("*").execute()
    return res.data