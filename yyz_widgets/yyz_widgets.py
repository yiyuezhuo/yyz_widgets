from traitlets import Unicode, Bool, validate, TraitError
from ipywidgets import DOMWidget, register
from IPython import display

from pathlib import Path

file_path = Path(__file__)

is_setup = False


def ensure_setup_widget():
    global is_setup

    if is_setup:
        return

    with open(file_path.parent / 'yyz_widgets.js', encoding='utf8') as f:
        js = display.Javascript(f.read())
    display.display(js)

    is_setup=True


@register
class _FileBrowser(DOMWidget):
    _view_name = Unicode('FileBrowser').tag(sync=True)
    _view_module = Unicode('yyz_widgets').tag(sync=True)
    _view_module_version = Unicode('0.1.0').tag(sync=True)
    
    path = Unicode('.', help="synced path").tag(sync=True)


def FileBrowser():
    ensure_setup_widget()
    return _FileBrowser()
