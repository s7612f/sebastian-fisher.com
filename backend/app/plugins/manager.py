import importlib
import pkgutil
from fastapi import APIRouter
from typing import List


class PluginManager:
    def __init__(self, package: str):
        self.package = package
        self.router = APIRouter(prefix="/plugins", tags=["plugins"])
        self.loaded: List[str] = []

    def discover(self):
        for _, module_name, _ in pkgutil.iter_modules([self.package.replace(".", "/")]):
            module_path = f"{self.package}.{module_name}"
            module = importlib.import_module(module_path)
            if hasattr(module, "router"):
                self.router.include_router(module.router, prefix=f"/{module_name}")
                self.loaded.append(module_name)


plugin_manager = PluginManager("backend.app.plugins")
