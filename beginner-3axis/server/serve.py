"""Run the isolated module plus same-origin assessment API. No dependencies, no DB."""
import argparse, json, mimetypes
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote
from assessment_api import configured, respond
ROOT=Path(__file__).resolve().parents[1]
# Never serve server code, reference rubrics, tests, credentials, or node_modules.
def asset(path):
    path=unquote(path)
    documentation={"/LICENSE": ROOT.parent/"LICENSE", "/beginner-3axis/README.md": ROOT/"README.md"}
    if path in documentation:
        file=documentation[path]
        return file if file.is_file() else None
    prefix="/beginner-3axis/"
    if not path.startswith(prefix): return None
    relative=path[len(prefix):] or "index.html"
    if ".." in Path(relative).parts or "\\" in relative: return None
    parts=Path(relative).parts
    if len(parts)>1 and parts[0]!="vendor": return None
    file=(ROOT/relative).resolve()
    if ROOT not in file.parents or file.suffix not in (".html",".mjs",".js",".css",".svg",".png",".woff2") or not file.is_file(): return None
    return file
class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args): pass
    def reply(self,status,data,mime="application/json"):
        if not isinstance(data,bytes): data=json.dumps(data).encode()
        self.send_response(status); self.send_header("Content-Type",mime); self.send_header("Content-Length",str(len(data)))
        self.send_header("Cache-Control","no-store"); self.send_header("X-Content-Type-Options","nosniff"); self.end_headers()
        try: self.wfile.write(data)
        except (BrokenPipeError,ConnectionResetError): pass
    def do_GET(self):
        path=urlsplit(self.path).path
        if path=="/api/assessment/status": return self.reply(200,{"configured":configured(),"source":"qwen"})
        if path=="/health": return self.reply(200,{"ok":True,"module":"beginner-3axis"})
        if path in ("/","/beginner-3axis"):
            self.send_response(302); self.send_header("Location","/beginner-3axis/"); self.end_headers(); return
        file=asset(path)
        if not file: return self.reply(404,{"error":"not_found"})
        mime="text/plain; charset=utf-8" if file.name in ("LICENSE","README.md") else "text/javascript" if file.suffix in (".mjs",".js") else mimetypes.guess_type(file.name)[0] or "application/octet-stream"
        self.reply(200,file.read_bytes(),mime)
    def do_POST(self):
        if urlsplit(self.path).path!="/api/assessment": return self.reply(404,{"error":"not_found"})
        origin=self.headers.get("Origin")
        if origin and urlsplit(origin).netloc!=self.headers.get("Host"): return self.reply(403,{"error":"origin_rejected"})
        if self.headers.get("Sec-Fetch-Site")=="cross-site": return self.reply(403,{"error":"origin_rejected"})
        try:
            size=int(self.headers.get("Content-Length","0"))
            if size<1 or size>48000 or self.headers.get("Content-Type","").split(";")[0]!="application/json": raise ValueError()
            self.connection.settimeout(30); body=json.loads(self.rfile.read(size))
        except (ValueError,OSError): return self.reply(400,{"error":"invalid_request"})
        status,result=respond(body); self.reply(status,result)
if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("--host",default="127.0.0.1");parser.add_argument("--port",type=int,default=4205)
    args=parser.parse_args(); print(f"Robot Lab: http://{args.host}:{args.port}/beginner-3axis/ (AI configured: {configured()})",flush=True)
    ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()
