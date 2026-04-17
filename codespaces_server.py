import argparse
import json
import os
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any, Dict, Optional, Tuple


ROOT_DIR = Path(__file__).resolve().parent
APP_DATA_DIR = ROOT_DIR / ".app-data"
WORKSPACE_FILE = APP_DATA_DIR / "maintenance-workspace.json"
WORKSPACE_API_PATH = "/api/maintenance-workspace"


def validate_workspace_payload(payload: Any) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "Workspace payload must be a JSON object."

    if "hierarchy" not in payload or not isinstance(payload["hierarchy"], list):
        return False, "Workspace payload must include a hierarchy array."

    if "modalVisible" in payload and not isinstance(payload["modalVisible"], bool):
        return False, "modalVisible must be a boolean when provided."

    if "entry" in payload and not isinstance(payload["entry"], dict):
        return False, "entry must be an object when provided."

    if "maintainableItems" in payload and not isinstance(payload["maintainableItems"], list):
        return False, "maintainableItems must be an array when provided."

    if "collapsedNodeIds" in payload and not isinstance(payload["collapsedNodeIds"], list):
        return False, "collapsedNodeIds must be an array when provided."

    if "selectedNodeId" in payload and not isinstance(payload["selectedNodeId"], str):
        return False, "selectedNodeId must be a string when provided."

    if "hierarchyFilter" in payload and not isinstance(payload["hierarchyFilter"], str):
        return False, "hierarchyFilter must be a string when provided."

    if "savedAt" in payload and not isinstance(payload["savedAt"], str):
        return False, "savedAt must be a string when provided."

    return True, ""


def read_workspace() -> Optional[Dict[str, Any]]:
    if not WORKSPACE_FILE.exists():
        return None

    with WORKSPACE_FILE.open("r", encoding="utf-8") as workspace_file:
        return json.load(workspace_file)


def write_workspace(payload: Dict[str, Any]) -> None:
    APP_DATA_DIR.mkdir(parents=True, exist_ok=True)

    with NamedTemporaryFile("w", encoding="utf-8", dir=APP_DATA_DIR, delete=False) as temp_file:
        json.dump(payload, temp_file, indent=2)
        temp_file.write("\n")
        temp_path = Path(temp_file.name)

    os.replace(temp_path, WORKSPACE_FILE)


class CodespacesRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: Optional[str] = None, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR if directory is None else directory), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path == WORKSPACE_API_PATH:
            self.handle_workspace_get()
            return

        super().do_GET()

    def do_PUT(self) -> None:
        if self.path == WORKSPACE_API_PATH:
            self.handle_workspace_put()
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Unknown API path.")

    def handle_workspace_get(self) -> None:
        try:
            workspace = read_workspace()
        except (OSError, json.JSONDecodeError):
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, "Unable to read workspace file.")
            return

        if workspace is None:
            self.send_error(HTTPStatus.NOT_FOUND, "No saved workspace found.")
            return

        self.send_json(HTTPStatus.OK, workspace)

    def handle_workspace_put(self) -> None:
        content_length = self.headers.get("Content-Length")
        if not content_length:
            self.send_error(HTTPStatus.BAD_REQUEST, "Missing Content-Length header.")
            return

        try:
            raw_body = self.rfile.read(int(content_length))
            payload = json.loads(raw_body.decode("utf-8"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(HTTPStatus.BAD_REQUEST, "Request body must be valid JSON.")
            return

        is_valid, error_message = validate_workspace_payload(payload)
        if not is_valid:
            self.send_error(HTTPStatus.BAD_REQUEST, error_message)
            return

        try:
            write_workspace(payload)
        except OSError:
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, "Unable to save workspace file.")
            return

        self.send_json(
            HTTPStatus.OK,
            {
                "status": "saved",
                "path": str(WORKSPACE_FILE.relative_to(ROOT_DIR)),
            },
        )

    def send_json(self, status_code: HTTPStatus, payload: Dict[str, Any]) -> None:
        response = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the demo with durable workspace storage.")
    parser.add_argument("--host", default="0.0.0.0", help="Host interface to bind.")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve on.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    server = ThreadingHTTPServer((args.host, args.port), CodespacesRequestHandler)
    print(f"Serving demo from {ROOT_DIR} on http://{args.host}:{args.port}")
    print(f"Durable maintenance workspace file: {WORKSPACE_FILE}")
    server.serve_forever()


if __name__ == "__main__":
    main()
