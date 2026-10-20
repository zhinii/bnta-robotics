import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.json':'application/json'};
createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1:4226').pathname);
    if(pathname.split('/').some(part=>part.startsWith('.')))throw Error('path');
    let file=path.resolve(root,'.'+pathname);
    if(!file.startsWith(root))throw Error('path');
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    const type=types[path.extname(file)];if(!type)throw Error('type');
    res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(4226,'127.0.0.1',()=>console.log('Robot Lab: http://127.0.0.1:4226/six-axis-agent/'));
