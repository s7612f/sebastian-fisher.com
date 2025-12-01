from backend.app.plugins.manager import plugin_manager


def test_plugins_discover():
    plugin_manager.discover()
    assert "example" in plugin_manager.loaded
