from fastapi import APIRouter

router = APIRouter()


@router.get("/hello")
def hello_plugin():
    return {"message": "Hello from custom plugin"}
