import "package:fast_rsa/fast_rsa.dart";
import "package:path_provider/path_provider.dart";
import "dart:io";
import "package:http/http.dart" as http;
import "dart:convert";

class VpnConfig {
  String subnet;
  String ip;
  int port;
  String certificate;
  String ca;
  KeyPair keyPair;

  VpnConfig(
      {required this.subnet,
      required this.ip,
      required this.port,
      required this.certificate,
      required this.ca,
      required this.keyPair});

  String get publicKey => keyPair.publicKey;
  String get privateKey => keyPair.privateKey;

  static Future<VpnConfig> fetch(String accessToken, String apiUrl) async {
    final keyPair = await RSA.generate(2048);
    final response = await http.post(Uri.parse("$apiUrl/client/vpn"),
        headers: {"Authorization": "Bearer $accessToken"},
        body: {"publicKey": keyPair.publicKey});
    final configData = jsonDecode(response.body);
    return VpnConfig(
        subnet: configData["config"]["subnet"] as String,
        ip: configData["config"]["ip"] as String,
        port: configData["config"]["port"] as int,
        ca: configData["ca"] as String,
        certificate: configData["certificate"] as String,
        keyPair: keyPair);
  }

  Future<File> getFile() async {
    final tmp = await getTemporaryDirectory();
    return File("${tmp.path}/config.ovpn");
  }

  String toOpenVpnConfig() {
    List<String> configFile = [];
    configFile.add("client");
    // Use TUN interface
    configFile.add("dev tun");
    // Use UDP mode
    configFile.add("proto udp");
    // Set listening port
    configFile.add("remote $ip $port");
    // Select cryptographic cipher
    configFile.add("cipher AES-256-GCM");
    // Downgrade permission levels
    configFile.addAll(["user nobody", "group nobody"]);
    // Client certificate
    configFile.addAll(["<cert>", certificate.trim(), "</cert>"]);
    // Client private key
    configFile.addAll(["<key>", privateKey.trim(), "</key>"]);
    // CA certificate
    configFile.addAll(["<ca>", ca.trim(), "</ca>"]);
    // Persist config across restarts
    configFile.addAll(["persist-key", "persist-tun"]);
    // Verify that server has the appropriate grants in his certificate
    configFile.add("remote-cert-tls server");
    // Inform the server when exiting
    configFile.add("explicit-exit-notify 1");
    // Keep trying indefinitely to resolve the host name of the OpenVPN server
    configFile.add("resolv-retry infinite");
    // Do not bind to a specific port number
    configFile.add("nobind");
    // configFile.push('route 0.0.0.0 0.0.0.0');
    configFile.add("redirect-gateway def1");
    print(configFile.join("\n"));
    return configFile.join("\n");
  }

  Future<String> saveConfig() async {
    final file = await getFile();
    await file.writeAsString(toOpenVpnConfig());
    return file.path;
  }
}
