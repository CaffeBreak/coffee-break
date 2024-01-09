import parent
from fastapi import FastAPI, BackgroundTasks


app = FastAPI()

@app.get("/npc/{password}/{NoP}")
async def root(password:str, NoP:int, background_tasks: BackgroundTasks):
  background_tasks.add_task(parent.parent, password, NoP)
  return {"password": password ,"NoP":NoP, "state":"sucess"}
