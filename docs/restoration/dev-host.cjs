// CRA 5 passes an undefined allowed host when binding to loopback.
// Supply an explicit local-only allowlist without editing repository files.
const target=require('path').resolve(__dirname,'../../application/node_modules/react-scripts/config/webpackDevServer.config.js');
const original=require(target);
require.cache[require.resolve(target)].exports=(...args)=>({...original(...args),allowedHosts:['localhost','127.0.0.1']});
