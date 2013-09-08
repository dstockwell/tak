import SimpleHTTPServer, SocketServer, shutil

class Serve(SimpleHTTPServer.SimpleHTTPRequestHandler):
  def do_GET(self):
    SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
  def do_POST(self):
    path = self.translate_path(self.path)
    length = int(self.headers['Content-Length'])
    try:
      f = open(path, "w")
      f.write(self.rfile.read(length))
      f.close()
    except IOError:
      self.send_error(500)
    self.send_response(200)

SocketServer.TCPServer(("127.0.0.1", 61203), Serve).serve_forever()
