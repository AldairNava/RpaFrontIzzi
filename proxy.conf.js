var HttpsProxyAgent = require("https-proxy-agent");
var proxyConfig = [
  {
    target: "https://localhost:44372/",
    context: "/api",

    secure: false,
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.info("Using corporate proxy server: " + proxyServer);
    proxyConfig.forEach(function (entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
