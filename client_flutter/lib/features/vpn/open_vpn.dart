import "dart:io";
import "package:path_provider/path_provider.dart";
import "package:telnet/telnet.dart";
import "dart:convert";
import "dart:async";

class OpenVpn {
  String configPath;
  Process? process;

  OpenVpn(this.configPath);

  Future<File> _getSocketFile() async {
    final tmp = await getTemporaryDirectory();
    return File("${tmp.path}/telnet.sock");
  }

  Future<void> start() async {
    final documentDirectory = await getApplicationSupportDirectory();
    final socket = await _getSocketFile();
    try {
      process = await Process.start("openvpn", [
        "--config",
        configPath,
        "--management",
        socket.absolute.path,
        "unix",
        "--management-up-down"
      ]);
      stdout.addStream(process!.stdout);
      stderr.addStream(process!.stderr);

      await _connectTelnet(socket.absolute.path);
    } catch (error) {
      if (process != null) {
        process!.kill();
      }
      rethrow;
    }
  }

  Future<void> _connectTelnet(String socketPath) async {
    final socket = await Socket.connect(
        InternetAddress(socketPath, type: InternetAddressType.unix), 0);
    print("Socket connected");

    socket.listen((List<int> event) {
      print(utf8.decode(event));
    });
  }

  void _onTelnetEvent(TelnetClient? client, TLMsgEvent event) {
    print("Event");
    print(client);
    print(event);
    print(event.type);
    print(event.msg);
  }

  void _onTelnetError(TelnetClient? client, dynamic error) {
    print("Error");
    print(client);
    print(error);
  }

  void _onTelnetDone(TelnetClient? client) {
    print("Done");
    print(client);
  }
}
